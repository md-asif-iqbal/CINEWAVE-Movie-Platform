'use client';
import { useEffect, useState } from 'react';
import AnalyticsCard from '@/components/admin/AnalyticsCard';
import { Users, Film, CreditCard, TrendingUp, Tv, Clapperboard } from 'lucide-react';
import axios from 'axios';
import Spinner from '@/components/ui/Spinner';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard');
      setData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!data) {
    return <p className="text-cw-text-muted">Failed to load analytics data.</p>;
  }

  const sortedMonthly = [...(data.monthlyStats || [])].reverse();

  const maxRevenue = Math.max(...sortedMonthly.map((m) => m.revenue), 1);

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <AnalyticsCard title="Total Users" value={data.stats.totalUsers} icon={Users} />
        <AnalyticsCard title="Total Content" value={data.stats.totalContent} icon={Film} />
        <AnalyticsCard title="Movies" value={data.stats.totalMovies} icon={Clapperboard} />
        <AnalyticsCard title="Series" value={data.stats.totalSeries} icon={Tv} />
        <AnalyticsCard title="Active Subs" value={data.stats.activeSubscriptions} icon={CreditCard} />
        <AnalyticsCard title="Revenue (৳)" value={`৳${data.stats.totalRevenue}`} icon={TrendingUp} />
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-cw-bg-card border border-cw-border rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-6">Monthly Revenue</h3>
        {sortedMonthly.length === 0 ? (
          <p className="text-sm text-cw-text-muted text-center py-8">No payment data yet</p>
        ) : (
          <div className="space-y-3">
            {sortedMonthly.map((stat, idx) => {
              const barWidth = (stat.revenue / maxRevenue) * 100;
              const month = MONTH_NAMES[(stat._id.month - 1)];
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs text-cw-text-muted w-14 shrink-0">
                    {month} {stat._id.year}
                  </span>
                  <div className="flex-1 bg-cw-bg-secondary rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-cw-red rounded-full flex items-center px-2 transition-all"
                      style={{ width: `${Math.max(barWidth, 4)}%` }}
                    >
                      <span className="text-[10px] text-white font-medium whitespace-nowrap">
                        ৳{stat.revenue}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-cw-text-muted w-12 text-right shrink-0">
                    {stat.count} txn
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Users + Payments side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-cw-bg-card border border-cw-border rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <div className="space-y-3">
            {data.recentUsers?.map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-cw-text-muted">{user.email}</p>
                </div>
                <span className="text-xs text-cw-text-muted">
                  {new Date(user.createdAt).toLocaleDateString('en-US')}
                </span>
              </div>
            ))}
            {(!data.recentUsers || data.recentUsers.length === 0) && (
              <p className="text-sm text-cw-text-muted">No users found</p>
            )}
          </div>
        </div>

        <div className="bg-cw-bg-card border border-cw-border rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {data.recentPayments?.map((payment) => (
              <div key={payment._id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{payment.userId?.name || 'Unknown'}</p>
                  <p className="text-xs text-cw-text-muted capitalize">{payment.plan}</p>
                </div>
                <span className="text-sm font-semibold text-green-400">৳{payment.amount}</span>
              </div>
            ))}
            {(!data.recentPayments || data.recentPayments.length === 0) && (
              <p className="text-sm text-cw-text-muted">No payments found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
