'use client';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function SubscriptionTable({ subscriptions = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cw-border text-left">
            <th className="p-3 text-cw-text-secondary font-medium">User</th>
            <th className="p-3 text-cw-text-secondary font-medium">Plan</th>
            <th className="p-3 text-cw-text-secondary font-medium hidden md:table-cell">Amount</th>
            <th className="p-3 text-cw-text-secondary font-medium hidden lg:table-cell">Start</th>
            <th className="p-3 text-cw-text-secondary font-medium hidden md:table-cell">End</th>
            <th className="p-3 text-cw-text-secondary font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => {
            const daysLeft = Math.max(0, Math.ceil((new Date(sub.endDate) - new Date()) / (1000 * 60 * 60 * 24)));
            return (
              <tr key={sub._id} className="border-b border-cw-border/50 hover:bg-cw-bg-card/30">
                <td className="p-3">
                  <p className="text-white text-sm truncate">{sub.userId?.name || 'N/A'}</p>
                  <p className="text-xs text-cw-text-secondary truncate">{sub.userId?.email}</p>
                </td>
                <td className="p-3">
                  <Badge variant="outline">{sub.plan}</Badge>
                </td>
                <td className="p-3 hidden md:table-cell text-cw-text-muted">৳{sub.amount}</td>
                <td className="p-3 hidden lg:table-cell text-xs text-cw-text-muted">{formatDate(sub.startDate)}</td>
                <td className="p-3 hidden md:table-cell text-xs text-cw-text-muted">{formatDate(sub.endDate)}</td>
                <td className="p-3">
                  <Badge variant={sub.status === 'active' ? 'green' : sub.status === 'expired' ? 'default' : 'yellow'}>
                    {sub.status} {sub.status === 'active' && `(${daysLeft}d)`}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {subscriptions.length === 0 && <p className="text-center py-8 text-cw-text-secondary">No subscriptions found</p>}
    </div>
  );
}
