'use client';
import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cw-bg-card border-2 border-cw-border rounded-xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <Link href="/" className="text-2xl font-black">
          <span className="text-cw-red">Cine</span>Wave
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold mt-4">Reset Password</h1>
        <p className="text-cw-text-muted text-sm mt-1">A reset link will be sent to your email</p>
      </div>

      {sent ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-green-500 text-2xl">✓</span>
          </div>
          <p className="text-cw-text-secondary text-sm">
            If an account exists with this email, a reset link has been sent. Check your inbox.
          </p>
          <Link href="/auth/login" className="text-cw-red hover:underline text-sm block">
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-cw-red/10 border border-cw-red/30 text-cw-red rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Send Reset Link
          </Button>
          <Link href="/auth/login" className="text-cw-text-muted hover:text-white text-sm block text-center transition-colors">
            Back to Login
          </Link>
        </form>
      )}
    </div>
  );
}
