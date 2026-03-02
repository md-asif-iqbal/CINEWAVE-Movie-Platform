'use client';
import { useEffect, useState } from 'react';
import AnalyticsCard from '@/components/admin/AnalyticsCard';
import { Users, Film, CreditCard, TrendingUp } from 'lucide-react';
import axios from 'axios';
import Spinner from '@/components/ui/Spinner';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
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
    return <p className="text-cw-text-muted">Failed to load data.</p>;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnalyticsCard
          title="Total Users"
          value={data.stats.totalUsers}
          icon={Users}
        />
        <AnalyticsCard
          title="Total Content"
          value={data.stats.totalContent}
          icon={Film}
        />
        <AnalyticsCard
          title="Active Subscriptions"
          value={data.stats.activeSubscriptions}
          icon={CreditCard}
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`৳${data.stats.totalRevenue}`}
          icon={TrendingUp}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
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

        {/* Recent Payments */}
        <div className="bg-cw-bg-card border border-cw-border rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {data.recentPayments?.map((payment) => (
              <div key={payment._id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{payment.userId?.name || 'Unknown'}</p>
                  <p className="text-xs text-cw-text-muted">{payment.plan}</p>
                </div>
                <span className="text-sm font-semibold text-green-400">
                  ৳{payment.amount}
                </span>
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
