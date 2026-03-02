'use client';
import { useState, useRef, useCallback } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PhoneAuthForm({ mode = 'login' }) {
  const router = useRouter();
  const [step, setStep] = useState('phone'); // phone | otp | name
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmResult, setConfirmResult] = useState(null);
  const otpRefs = useRef([]);
  const recaptchaRef = useRef(null);

  // Validate phone: +880XXXXXXXXXX or 01XXXXXXXXX
  const formatPhone = (raw) => {
    let cleaned = raw.replace(/[^0-9+]/g, '');
    if (cleaned.startsWith('01') && cleaned.length === 11) {
      cleaned = '+880' + cleaned.slice(1);
    }
    if (!cleaned.startsWith('+')) {
      cleaned = '+880' + cleaned;
    }
    return cleaned;
  };

  const setupRecaptcha = useCallback(() => {
    if (recaptchaRef.current) return;
    try {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          recaptchaRef.current = null;
        },
      });
    } catch {
      // Already initialized
    }
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      setupRecaptcha();
      const formattedPhone = formatPhone(phone);
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaRef.current);
      setConfirmResult(result);
      setStep('otp');
    } catch (err) {
      console.error('OTP send error:', err);
      if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Use format: 01XXXXXXXXX');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      const newOtp = paste.split('');
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await confirmResult.confirm(code);
      const firebaseUser = result.user;

      if (mode === 'register' && !name) {
        setStep('name');
        setLoading(false);
        return;
      }

      // Sign in via NextAuth phone provider
      const res = await signIn('phone', {
        redirect: false,
        phone: formatPhone(phone),
        firebaseUid: firebaseUser.uid,
        name: name || undefined,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/browse');
        router.refresh();
      }
    } catch (err) {
      console.error('OTP verify error:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP code. Please try again.');
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await signIn('phone', {
        redirect: false,
        phone: formatPhone(phone),
        firebaseUid: confirmResult?.verificationId || auth.currentUser?.uid,
        name: name.trim(),
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/browse');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div id="recaptcha-container" />

      {error && (
        <div className="bg-cw-red/10 border border-cw-red/30 text-cw-red rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {step === 'phone' && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="01XXXXXXXXX"
            icon={Phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p className="text-xs text-cw-text-muted">
            We&apos;ll send a 6-digit OTP to verify your number
          </p>
          <Button type="submit" loading={loading} className="w-full gap-2" size="lg">
            Send OTP <ArrowRight size={16} />
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="text-center mb-2">
            <ShieldCheck size={28} className="mx-auto text-green-400 mb-2" />
            <p className="text-sm text-cw-text-muted">
              Enter the 6-digit code sent to <span className="text-white font-medium">{formatPhone(phone)}</span>
            </p>
          </div>

          <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="w-11 h-12 text-center text-lg font-bold bg-cw-bg border-2 border-cw-border rounded-lg text-white focus:outline-none focus:border-cw-red focus:ring-1 focus:ring-cw-red/50 transition-colors"
              />
            ))}
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Verify OTP
          </Button>

          <button
            type="button"
            onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); recaptchaRef.current = null; }}
            className="w-full text-sm text-cw-text-muted hover:text-white transition-colors text-center py-2"
          >
            Change phone number
          </button>
        </form>
      )}

      {step === 'name' && (
        <form onSubmit={handleNameSubmit} className="space-y-4">
          <p className="text-sm text-cw-text-muted text-center">
            Almost done! Enter your name to complete registration.
          </p>
          <Input
            label="Your Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Complete Registration
          </Button>
        </form>
      )}
    </div>
  );
}
