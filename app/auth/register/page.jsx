import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';
import FirebaseGoogleButton from '@/components/auth/FirebaseGoogleButton';
import PhoneAuthForm from '@/components/auth/PhoneAuthForm';
import AuthTabs from '@/components/auth/AuthTabs';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Register - CineWave',
};

export default function RegisterPage() {
  return (
    <div className="bg-cw-bg-card border-2 border-cw-border rounded-xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <Link href="/" className="text-2xl font-black">
          <span className="text-cw-red">Cine</span>Wave
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold mt-4">Create Account</h1>
        <p className="text-cw-text-muted text-sm mt-1">Get 2 months free trial!</p>
      </div>

      <AuthTabs
        emailForm={<RegisterForm />}
        phoneForm={<PhoneAuthForm mode="register" />}
      />

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-cw-border" />
        <span className="text-xs text-cw-text-muted">or</span>
        <div className="flex-1 h-px bg-cw-border" />
      </div>

      <FirebaseGoogleButton />

      <p className="mt-6 text-center text-sm text-cw-text-muted">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-cw-red hover:underline font-medium">
          Log In
        </Link>
      </p>
    </div>
  );
}
