'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import axios from 'axios';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-cw-text-secondary mb-4">Invalid reset link.</p>
        <Link href="/auth/forgot-password" className="text-cw-red hover:underline text-sm">
          Get a new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/reset-password', { token, password });
      router.push('/auth/login?reset=true');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-cw-red/10 border border-cw-red/30 text-cw-red rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      <Input
        label="New Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 6 characters"
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Enter password again"
        required
      />
      <Button type="submit" loading={loading} className="w-full" size="lg">
        Change Password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-cw-bg-card border-2 border-cw-border rounded-xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <Link href="/" className="text-2xl font-black">
          <span className="text-cw-red">Cine</span>Wave
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold mt-4">Set New Password</h1>
      </div>
      <Suspense fallback={<div className="text-center text-cw-text-muted">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
