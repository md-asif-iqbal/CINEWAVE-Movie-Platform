export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';

// Record watch progress
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { contentId, episodeId, progress, duration } = await request.json();

    const profile = await Profile.findOne({ _id: params.id, userId: session.user.id });
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const existingIdx = profile.watchHistory.findIndex(
      (h) => h.content.toString() === contentId && (!episodeId || h.episode?.toString() === episodeId)
    );

    if (existingIdx >= 0) {
      profile.watchHistory[existingIdx].progress = progress;
      profile.watchHistory[existingIdx].duration = duration;
      profile.watchHistory[existingIdx].watchedAt = new Date();
      profile.watchHistory[existingIdx].completed = duration > 0 && progress / duration > 0.9;
    } else {
      profile.watchHistory.unshift({
        content: contentId,
        episode: episodeId || undefined,
        progress,
        duration,
        watchedAt: new Date(),
        completed: duration > 0 && progress / duration > 0.9,
      });

      // Keep only last 100 items
      if (profile.watchHistory.length > 100) {
        profile.watchHistory = profile.watchHistory.slice(0, 100);
      }
    }

    await profile.save();
    return NextResponse.json({ message: 'Progress saved' });
  } catch (error) {
    console.error('Watch history error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Get watch history
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const profile = await Profile.findOne({ _id: params.id, userId: session.user.id })
      .populate('watchHistory.content', 'title thumbnailUrl type year duration')
      .populate('watchHistory.episode', 'title episodeNumber seasonNumber')
      .lean();

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    return NextResponse.json({ watchHistory: profile.watchHistory });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
