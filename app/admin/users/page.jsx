'use client';
import { useEffect, useState } from 'react';
import UserTable from '@/components/admin/UserTable';
import Spinner from '@/components/ui/Spinner';
import axios from 'axios';
import { useToast } from '@/components/ui/Toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      const { data } = await axios.get(`/api/admin/users?${params}`);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      await axios.put(`/api/admin/users/${userId}`, { action });
      addToast('User updated', 'success');
      fetchUsers();
    } catch (err) {
      addToast('Something went wrong', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Users</h1>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="w-full sm:max-w-sm bg-cw-bg border-2 border-cw-border rounded-lg px-4 py-3 text-white min-h-[44px] focus:outline-none focus:border-cw-red placeholder:text-cw-text-secondary"
      />

      {loading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : (
        <>
          <UserTable users={users} onAction={handleAction} />
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
