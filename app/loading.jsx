import Spinner from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-cw-bg flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-cw-text-muted text-sm">Loading...</p>
      </div>
    </div>
  );
}
