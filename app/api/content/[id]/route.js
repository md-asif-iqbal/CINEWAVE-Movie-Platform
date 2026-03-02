export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import Episode from '@/models/Episode';
import Review from '@/models/Review';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const content = await Content.findById(id).lean();
    if (!content) {
      return NextResponse.json({ error: 'Content not found.' }, { status: 404 });
    }

    // Increment views
    await Content.findByIdAndUpdate(id, { $inc: { views: 1 } });

    // Get episodes if series
    let episodes = [];
    if (content.type === 'series') {
      episodes = await Episode.find({ contentId: id }).sort({ season: 1, episode: 1 }).lean();
    }

    // Get reviews
    const reviews = await Review.find({ contentId: id })
      .populate('userId', 'name image')
      .sort('-createdAt')
      .limit(20)
      .lean();

    // Get similar content
    const similar = await Content.find({
      _id: { $ne: id },
      genre: { $in: content.genre || [] },
      status: 'active',
    })
      .limit(12)
      .select('title thumbnailUrl type year rating genre')
      .lean();

    return NextResponse.json({
      content,
      episodes,
      reviews,
      similar,
    });
  } catch (error) {
    console.error('Get content detail error:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
