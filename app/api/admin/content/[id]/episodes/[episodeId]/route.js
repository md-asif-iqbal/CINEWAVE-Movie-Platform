export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Episode from '@/models/Episode';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    await dbConnect();
    const data = await request.json();
    const episode = await Episode.findByIdAndUpdate(params.episodeId, data, {
      new: true,
      runValidators: true,
    });
    if (!episode) return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    return NextResponse.json({ episode });
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
    const episode = await Episode.findByIdAndDelete(params.episodeId);
    if (!episode) return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    return NextResponse.json({ message: 'Episode deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
