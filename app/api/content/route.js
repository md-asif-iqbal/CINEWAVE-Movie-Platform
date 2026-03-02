export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const genre = searchParams.get('genre');
    const featured = searchParams.get('featured');
    const trending = searchParams.get('trending');
    const newRelease = searchParams.get('newRelease');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || '-createdAt';

    const query = { status: 'active' };
    if (type) query.type = type;
    if (genre) query.genre = { $in: genre.split(',') };
    if (featured === 'true') query.featured = true;
    if (trending === 'true') query.trending = true;
    if (newRelease === 'true') query.newRelease = true;
    if (search) {
      // Use regex for partial matching (more flexible than $text)
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { genre: searchRegex },
        { 'cast.name': searchRegex },
        { director: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;
    const [contents, total] = await Promise.all([
      Content.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      Content.countDocuments(query),
    ]);

    return NextResponse.json({
      contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
