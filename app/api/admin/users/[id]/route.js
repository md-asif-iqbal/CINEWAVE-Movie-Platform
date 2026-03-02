export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { action } = await request.json();

    let update = {};
    switch (action) {
      case 'ban':
        update = { isBanned: true };
        break;
      case 'unban':
        update = { isBanned: false };
        break;
      case 'makeAdmin':
        update = { role: 'admin' };
        break;
      case 'removeAdmin':
        update = { role: 'user' };
        break;
      case 'extendTrial':
        update = { trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(params.id, update, { new: true }).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user, message: 'User updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
