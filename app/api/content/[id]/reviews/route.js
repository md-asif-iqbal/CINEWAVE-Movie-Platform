export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import Content from '@/models/Content';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const reviews = await Review.find({ contentId: params.id })
      .populate('userId', 'name image')
      .sort('-createdAt')
      .lean();
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
    }

    await dbConnect();
    const { rating, comment, hasSpoiler } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1-5.' }, { status: 400 });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({
      userId: session.user.id,
      contentId: params.id,
    });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment || '';
      existing.hasSpoiler = hasSpoiler || false;
      await existing.save();
      return NextResponse.json({ review: existing, message: 'Review updated!' });
    }

    const review = await Review.create({
      userId: session.user.id,
      contentId: params.id,
      rating,
      comment: comment || '',
      hasSpoiler: hasSpoiler || false,
    });

    // Update content average rating
    const stats = await Review.aggregate([
      { $match: { contentId: review.contentId } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await Content.findByIdAndUpdate(params.id, {
        'rating.average': Math.round(stats[0].avg * 10) / 10,
        'rating.count': stats[0].count,
      });
    }

    return NextResponse.json({ review, message: 'Review added!' }, { status: 201 });
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
