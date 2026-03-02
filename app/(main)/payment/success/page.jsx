'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function Redirect() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get('status') || 'success';
  useEffect(() => {
    router.replace(`/subscription?status=${status}`);
  }, [router, status]);
  return <div className="flex justify-center items-center min-h-screen text-cw-text-muted">Redirecting...</div>;
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-cw-text-muted">Loading...</div>}>
      <Redirect />
    </Suspense>
  );
}
