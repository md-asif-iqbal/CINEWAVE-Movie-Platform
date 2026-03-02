export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Profile from '@/models/Profile';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';

// Server-side sanitization
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export async function POST(request) {
  try {
    // Check content-type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type.' }, { status: 400 });
    }

    await dbConnect();
    const body = await request.json();
    const name = sanitize(body.name);
    const email = sanitize(body.email);
    const password = body.password;

    // Validation
    if (!name || name.length < 2 || name.length > 50) {
      return NextResponse.json({ error: 'Name must be 2-50 characters.' }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return NextResponse.json({ error: 'Password must be 6-128 characters.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      trialStartDate: now,
      trialEndDate: trialEnd,
    });

    // Create default profile
    await Profile.create({
      userId: user._id,
      name: user.name,
      avatar: '/avatars/default.png',
    });

    // Send welcome email (don't await to avoid blocking)
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    return NextResponse.json(
      { message: 'Registration successful!', userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
