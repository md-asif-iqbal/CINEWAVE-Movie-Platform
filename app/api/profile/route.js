export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const profiles = await Profile.find({ userId: session.user.id }).lean();
    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Get profiles error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Max 5 profiles
    const count = await Profile.countDocuments({ userId: session.user.id });
    if (count >= 5) {
      return NextResponse.json({ error: 'Maximum 5 profiles allowed.' }, { status: 400 });
    }

    const { name, avatar, isKidsProfile, language, maturityRating } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Please enter a profile name.' }, { status: 400 });
    }

    const profile = await Profile.create({
      userId: session.user.id,
      name: name.trim(),
      avatar: avatar || '',
      isKidsProfile: isKidsProfile || false,
      language: language || 'English',
      maturityRating: maturityRating || 'ALL',
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'A profile with this name already exists.' }, { status: 409 });
    }
    console.error('Create profile error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
