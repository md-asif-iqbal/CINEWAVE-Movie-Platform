'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

function Redirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/subscription?status=cancelled');
  }, [router]);
  return <div className="flex justify-center items-center min-h-screen text-cw-text-muted">Redirecting...</div>;
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <Redirect />
    </Suspense>
  );
}
