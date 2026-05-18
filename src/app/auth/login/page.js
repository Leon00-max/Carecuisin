'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserByEmail, setSession } from '@/lib/userStore';
import { UserRound, Stethoscope, ChefHat } from 'lucide-react';

/* ── Icon mapping for the left‑panel trust points (already good) ── */
const TRUST_POINTS = [
  { icon: UserRound, text: 'Your data is always role‑protected' },
  { icon: Stethoscope, text: 'Dietitian clinical notes remain private' },
  { icon: ChefHat, text: 'Built for Buea — fast even on 3G' },
];

function validate({ email, password }) {
  const errors = {};
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Enter a valid email address.';
  if (!password || password.length < 6)
    errors.password = 'Password must be at least 6 characters.';
  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    const form = new FormData(e.target);
    const email = form.get('email')?.toString().trim();
    const password = form.get('password')?.toString().trim();

    const fieldErrors = validate({ email, password });
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      // Use the central user store instead of localStorage directly
      const user = getUserByEmail(email);

      if (!user || user.password !== password) {
        setApiError('Invalid email or password.');
        setLoading(false);
        return;
      }

      // Write the three cookies that middleware reads
      setSession(user);

      // Redirect based on role and verification status
      if (user.role === 'patient') {
        router.push('/patient/dashboard');
      } else if (user.role === 'dietitian' || user.role === 'chef') {
        if (user.verification_status === 'approved') {
          router.push(`/${user.role}/dashboard`);
        } else if (user.verification_status === 'rejected') {
          router.push('/onboarding/rejected');
        } else {
          router.push('/onboarding/review');
        }
      }
    } catch (err) {
      setApiError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between bg-primary-700 p-12 text-white">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-700 font-bold text-sm">CC</div>
          <span className="text-2xl font-bold tracking-tight">CareCuisin</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">Welcome back.</h2>
          <p className="text-primary-200 text-sm leading-relaxed max-w-sm">
            Continue managing your health, patients, or kitchen. Your clinical trust line is always active.
          </p>
          <ul className="mt-8 space-y-3">
            {TRUST_POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="text-sm text-primary-100 flex items-center gap-2">
                <Icon size={18} /> {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary-400">Group 6 · UB Computer Science · {new Date().getFullYear()}</p>
      </div>

      {/* RIGHT PANEL */}
      <main className="flex items-center justify-center p-6 sm:p-10 bg-surface-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">CC</div>
              <span className="text-xl font-bold text-surface-900">CareCuisin</span>
            </Link>
          </div>

          <div className="bg-white border border-surface-100 rounded-2xl shadow-sm p-7 sm:p-9">
            <h1 className="text-2xl font-extrabold text-surface-900 mb-1">Sign in</h1>
            <p className="text-sm text-surface-500 mb-7">
              Don&apos;t have an account?{' '}
              <Link href="./signup" className="text-primary-600 font-semibold hover:text-primary-500 transition-colors">Create one</Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {apiError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {apiError}
                </div>
              )}

              <div>
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`input-medical ${errors.email ? 'border-red-400 focus:border-red-400' : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && <p id="email-error" className="form-error">⚠ {errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Link href="./forgot-password" className="text-xs text-primary-600 font-medium hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`input-medical mt-1 ${errors.password ? 'border-red-400 focus:border-red-400' : ''}`}
                  placeholder="••••••••"
                />
                {errors.password && <p id="password-error" className="form-error">⚠ {errors.password}</p>}
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-surface-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-surface-600">
                  Remember this device
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 mt-2 shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}