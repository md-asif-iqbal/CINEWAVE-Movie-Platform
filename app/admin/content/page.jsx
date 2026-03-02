'use client';
import { useEffect, useState } from 'react';
import ContentTable from '@/components/admin/ContentTable';
import UploadForm from '@/components/admin/UploadForm';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Plus, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function AdminContentPage() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // list | create | edit
  const [editContent, setEditContent] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchContents();
  }, [page, search]);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      const { data } = await axios.get(`/api/admin/content?${params}`);
      setContents(data.contents);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      await axios.delete(`/api/admin/content/${id}`);
      fetchContents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (content) => {
    setEditContent(content);
    setView('edit');
  };

  if (view === 'create' || view === 'edit') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { setView('list'); setEditContent(null); }}>
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">
            {view === 'edit' ? 'Edit Content' : 'New Content'}
          </h1>
        </div>
        <UploadForm
          initialData={editContent}
          onSuccess={() => { setView('list'); setEditContent(null); fetchContents(); }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Content</h1>
        <Button onClick={() => setView('create')} className="gap-2 w-full sm:w-auto">
          <Plus size={18} /> Add New
        </Button>
      </div>

      <input
        type="text"
        placeholder="Search content..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="w-full sm:max-w-sm bg-cw-bg border-2 border-cw-border rounded-lg px-4 py-3 text-white min-h-[44px] focus:outline-none focus:border-cw-red placeholder:text-cw-text-secondary"
      />

      {loading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : (
        <>
          <ContentTable
            contents={contents}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
