'use client';
import { useRouter } from 'next/navigation';
import UploadForm from '@/components/admin/UploadForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewContentPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/content');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/content" className="flex items-center gap-2 text-cw-text-muted hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Content</span>
        </Link>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold">Add New Content</h1>
      <UploadForm onSuccess={handleSuccess} />
    </div>
  );
}
