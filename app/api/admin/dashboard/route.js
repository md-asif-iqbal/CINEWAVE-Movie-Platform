export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import Payment from '@/models/Payment';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const [
      totalUsers,
      totalContent,
      totalMovies,
      totalSeries,
      activeSubscriptions,
      totalRevenue,
      recentUsers,
      recentPayments,
    ] = await Promise.all([
      User.countDocuments(),
      Content.countDocuments(),
      Content.countDocuments({ type: 'movie' }),
      Content.countDocuments({ type: 'series' }),
      Subscription.countDocuments({ status: 'active', endDate: { $gt: new Date() } }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      User.find().sort('-createdAt').limit(5).select('name email createdAt').lean(),
      Payment.find({ status: 'completed' }).sort('-createdAt').limit(5).populate('userId', 'name email').lean(),
    ]);

    // Monthly stats for chart
    const monthlyStats = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalContent,
        totalMovies,
        totalSeries,
        activeSubscriptions,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      recentUsers,
      recentPayments,
      monthlyStats,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
