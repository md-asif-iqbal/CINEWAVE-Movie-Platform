'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadForm from '@/components/admin/UploadForm';
import Spinner from '@/components/ui/Spinner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function EditContentPage({ params }) {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [params.id]);

  const fetchContent = async () => {
    try {
      const { data } = await axios.get(`/api/admin/content/${params.id}`);
      setContent(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push('/admin/content');
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-cw-text-muted mb-4">Content not found</p>
        <Link href="/admin/content" className="text-cw-red hover:underline">
          Back to Content
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/content" className="flex items-center gap-2 text-cw-text-muted hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Content</span>
        </Link>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold">Edit: {content.title}</h1>
      <UploadForm initialData={content} onSuccess={handleSuccess} />
    </div>
  );
}
