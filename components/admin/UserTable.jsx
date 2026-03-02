'use client';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Ban, Shield, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function UserTable({ users = [], onBan, onMakeAdmin, onExtendTrial }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cw-border text-left">
            <th className="p-3 text-cw-text-secondary font-medium">User</th>
            <th className="p-3 text-cw-text-secondary font-medium hidden md:table-cell">Role</th>
            <th className="p-3 text-cw-text-secondary font-medium hidden lg:table-cell">Trial Status</th>
            <th className="p-3 text-cw-text-secondary font-medium hidden sm:table-cell">Joined</th>
            <th className="p-3 text-cw-text-secondary font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const trialActive = new Date() < new Date(user.trialEndDate);
            const trialDays = Math.max(0, Math.ceil((new Date(user.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24)));
            return (
              <tr key={user._id} className="border-b border-cw-border/50 hover:bg-cw-bg-card/30">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.image} name={user.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{user.name}</p>
                      <p className="text-xs text-cw-text-secondary truncate">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <Badge variant={user.role === 'admin' ? 'red' : 'outline'}>{user.role}</Badge>
                  {user.isBanned && <Badge variant="danger" className="ml-1">Banned</Badge>}
                </td>
                <td className="p-3 hidden lg:table-cell">
                  {trialActive ? (
                    <span className="text-green-400 text-xs">{trialDays} days left</span>
                  ) : (
                    <span className="text-cw-text-secondary text-xs">Expired</span>
                  )}
                </td>
                <td className="p-3 hidden sm:table-cell text-cw-text-muted text-xs">{formatDate(user.createdAt)}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="min-w-[36px] min-h-[36px]" onClick={() => onExtendTrial?.(user)}>
                      <Clock size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="min-w-[36px] min-h-[36px]" onClick={() => onMakeAdmin?.(user)}>
                      <Shield size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="min-w-[36px] min-h-[36px] text-red-400" onClick={() => onBan?.(user)}>
                      <Ban size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {users.length === 0 && <p className="text-center py-8 text-cw-text-secondary">No users found</p>}
    </div>
  );
}
