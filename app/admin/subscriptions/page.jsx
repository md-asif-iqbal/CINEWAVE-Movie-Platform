'use client';
import { useEffect, useState } from 'react';
import SubscriptionTable from '@/components/admin/SubscriptionTable';
import Spinner from '@/components/ui/Spinner';
import axios from 'axios';

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchSubscriptions();
  }, [page, statusFilter]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await axios.get(`/api/admin/subscriptions?${params}`);
      setSubscriptions(data.subscriptions);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Subscriptions</h1>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {['', 'active', 'expired', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap min-h-[40px] transition-colors ${
              statusFilter === s
                ? 'bg-cw-red text-white'
                : 'bg-cw-bg-card text-cw-text-muted hover:text-white'
            }`}
          >
            {s === '' ? 'All' : s === 'active' ? 'Active' : s === 'expired' ? 'Expired' : 'Cancelled'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : (
        <>
          <SubscriptionTable subscriptions={subscriptions} />
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`min-w-[40px] min-h-[40px] rounded text-sm ${
                    page === i + 1 ? 'bg-cw-red text-white' : 'bg-cw-bg-card text-cw-text-muted hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
