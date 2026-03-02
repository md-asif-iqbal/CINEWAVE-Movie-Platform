export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import Episode from '@/models/Episode';
import Review from '@/models/Review';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    await dbConnect();
    const content = await Content.findById(params.id).lean();
    if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const data = await request.json();
    const content = await Content.findByIdAndUpdate(params.id, data, { new: true, runValidators: true });

    if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const content = await Content.findByIdAndDelete(params.id);
    if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Cleanup: delete episodes and reviews
    await Promise.all([
      Episode.deleteMany({ contentId: params.id }),
      Review.deleteMany({ contentId: params.id }),
    ]);

    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
