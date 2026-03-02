export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import { getTrialStatus, getSubscriptionStatus, getAllPlans } from '@/lib/subscription';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const user = await User.findById(session.user.id).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const trialStatus = getTrialStatus(user);

    const activeSubscription = await Subscription.findOne({
      userId: session.user.id,
      status: 'active',
      endDate: { $gt: new Date() },
    }).lean();

    const subscriptionStatus = activeSubscription
      ? getSubscriptionStatus(activeSubscription)
      : null;

    const plans = getAllPlans();

    return NextResponse.json({
      trial: trialStatus,
      subscription: subscriptionStatus,
      activeSubscription,
      plans,
      hasAccess: trialStatus.isActive || !!activeSubscription,
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
