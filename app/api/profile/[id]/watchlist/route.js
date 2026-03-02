export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';

// Add to watchlist
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { contentId } = await request.json();

    const profile = await Profile.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { $addToSet: { watchlist: contentId } },
      { new: true }
    );

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    return NextResponse.json({ watchlist: profile.watchlist });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Remove from watchlist
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');

    const profile = await Profile.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { $pull: { watchlist: contentId } },
      { new: true }
    );

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    return NextResponse.json({ watchlist: profile.watchlist });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
