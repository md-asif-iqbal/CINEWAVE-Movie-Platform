import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import FirebaseGoogleButton from '@/components/auth/FirebaseGoogleButton';
import PhoneAuthForm from '@/components/auth/PhoneAuthForm';
import AuthTabs from '@/components/auth/AuthTabs';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Login - CineWave',
};

export default function LoginPage() {
  return (
    <div className="bg-cw-bg-card border-2 border-cw-border rounded-xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <Link href="/" className="text-2xl font-black">
          <span className="text-cw-red">Cine</span>Wave
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold mt-4">Log In</h1>
        <p className="text-cw-text-muted text-sm mt-1">Sign in to your account</p>
      </div>

      <AuthTabs
        emailForm={<LoginForm />}
        phoneForm={<PhoneAuthForm mode="login" />}
      />

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-cw-border" />
        <span className="text-xs text-cw-text-muted">or</span>
        <div className="flex-1 h-px bg-cw-border" />
      </div>

      <FirebaseGoogleButton />

      <div className="mt-6 text-center text-sm space-y-2">
        <Link href="/auth/forgot-password" className="text-cw-text-muted hover:text-white transition-colors block">
          Forgot password?
        </Link>
        <p className="text-cw-text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-cw-red hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
