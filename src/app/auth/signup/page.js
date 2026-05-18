'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserRound, Stethoscope, ChefHat } from 'lucide-react';
import { createUser, setSession } from '@/lib/userStore'; // ★ NEW import

/* 
   CONSTANTS
 */
const ROLES = [
  {
    value: 'patient',
    icon:  UserRound,
    label: 'Patient',
    note:  null,
  },
  {
    value: 'dietitian',
    icon:  Stethoscope,
    label: 'Dietitian',
    note:  'Your account will be reviewed by an admin before you can access the platform.',
  },
  {
    value: 'chef',
    icon:  ChefHat,
    label: 'Chef',
    note:  'Your account will be reviewed before you can receive referrals.',
  },
];

/* 
   VALIDATION  (pure function — easy to unit-test later)
 */
function validate(values) {
  const errors = {};
  const { fullName, email, phone, password, confirmPassword } = values;

  if (!fullName.trim()) errors.fullName = 'Full name is required.';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) errors.email = 'Enter a valid email address.';

  // Cameroon: starting with 6 (mobile) or 2 (landline)
  if (!/^[26][0-9]{8}$/.test(phone.trim())) {
    errors.phone = 'Enter a 9-digit number starting with 6 or 2.';
  }

  if (password.length < 8) errors.password = 'Security requires at least 8 characters.';
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

  return errors;
}

/* 
   INNER FORM  (needs Suspense because of useSearchParams)
 */
function SignupForm() {
  const searchParams    = useSearchParams();
  const router          = useRouter();
  const preselectedRole = searchParams.get('role') || 'patient';

  const [role,    setRole]    = useState(preselectedRole);
  const [errors,  setErrors]  = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const activeNote = ROLES.find(r => r.value === role)?.note;

  /* ── Submit handler (★ REWRITTEN) ── */
  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    const form = new FormData(e.target);
    const raw  = Object.fromEntries(form.entries());

    // client-side validation (unchanged)
    const fieldErrors = validate(raw);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      // ★ Extract only what we need – no localStorage manipulation here
      const fullName = raw.fullName?.toString().trim() || '';
      const email    = raw.email?.toString().toLowerCase() || '';
      const phone    = raw.phone?.toString() || '';
      const password = raw.password?.toString() || '';

      // ★ Use the central user store to create the account
      const user = createUser({ fullName, email, password, phone, role });

      // ★ Write the proper cookies so middleware can authenticate
      setSession(user);

      // ★ Correct redirect paths (no more typos)
      const destination =
        role === 'patient'   ? '/onboarding/patient/step1'   :
        role === 'dietitian' ? '/onboarding/dietitiant/step1' :
        role === 'chef'      ? '/onboarding/chief/step1'     : '/';
      router.push(destination);
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  /* ── Render (unchanged, except a relative link fix) ── */
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ── LEFT PANEL: Brand authority (desktop only) ── */}
      <div className="hidden lg:flex flex-col justify-between bg-primary-700 p-12 text-white">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-700 font-bold text-sm">
            CC
          </div>
          <span className="text-2xl font-bold tracking-tight">CareCuisin</span>
        </Link>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Healthy meals,<br />
            built on clinical trust.
          </h2>
          <p className="text-primary-200 text-sm leading-relaxed max-w-sm">
            The only platform in Buea where every meal is prescribed by a
            registered dietitian and prepared by a verified chef.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              ' Clinical notes never leave the dietitian',
              ' Every professional is admin-verified',
              ' Built for Buea — chefs near you',
            ].map(point => (
              <li key={point} className="text-sm text-primary-100 flex items-center gap-2">
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-primary-400">
          Group 6 · UB Computer Science · {new Date().getFullYear()}
        </p>
      </div>

      {/* ── RIGHT PANEL: Form ── */}
      <main className="flex items-center justify-center p-6 sm:p-10 bg-surface-50">
        <div className="w-full max-w-md">

          <div className="flex lg:hidden justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                CC
              </div>
              <span className="text-xl font-bold text-surface-900">CareCuisin</span>
            </Link>
          </div>

          <div className="bg-white border border-surface-100 rounded-2xl shadow-sm p-7 sm:p-9">

            <h1 className="text-2xl font-extrabold text-surface-900 mb-1">
              Create your account
            </h1>
            <p className="text-sm text-surface-500 mb-7">
              Already a member?{' '}
              {/* ★ Fixed relative link */}
              <Link href="./login" className="text-primary-600 font-semibold hover:text-primary-500 transition-colors">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* ── Role Picker ── */}
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-3 text-center">
                  I am signing up as a…
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {ROLES.map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRole(value)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                        role === value
                          ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                          : 'border-surface-100 bg-white hover:border-surface-300'
                      }`}
                    >
                      <span className="mb-1"><Icon size={24} /></span>
                      <span className={`text-xs font-bold capitalize ${
                        role === value ? 'text-primary-700' : 'text-surface-500'
                      }`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>

                {activeNote && (
                  <p className="mt-3 text-xs text-center text-surface-500 bg-surface-50 border border-surface-100 rounded-lg px-3 py-2">
                    ℹ️ {activeNote}
                  </p>
                )}
              </div>

              <hr className="border-surface-100" />

              {apiError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {apiError}
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className={`input-medical ${errors.fullName ? 'border-red-400 focus:border-red-400' : ''}`}
                  placeholder="e.g. Amara Nkeng"
                />
                {errors.fullName && <p className="form-error">⚠ {errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`input-medical ${errors.email ? 'border-red-400 focus:border-red-400' : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="form-error">⚠ {errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="form-label">
                  Phone Number
                  <span className="text-surface-400 font-normal"> (MTN / Orange)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pr-3 text-sm font-bold text-surface-400 border-r border-surface-100 group-focus-within:text-primary-500 transition-colors">
                    +237
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    pattern="[0-9]{9}"
                    aria-invalid={errors.phone ? "true" : "false"}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={ `input-medical !pl-24 !text-left` + (errors.phone ? 'border-red-400 focus:border-red-400' : '')}
                    placeholder="6XX XXX XXX"
                  />
                </div>
                {errors.phone
                  ? <p className="form-error">⚠ {errors.phone}</p>
                  : <p className="mt-1 text-xs text-surface-400">Used for SMS meal alerts and Mobile Money coordination.</p>
                }
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className={`input-medical ${errors.password ? 'border-red-400 focus:border-red-400' : ''}`}
                    placeholder="Min. 8 chars"
                  />
                  {errors.password && <p className="form-error">⚠ {errors.password}</p>}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="form-label">Confirm</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className={`input-medical ${errors.confirmPassword ? 'border-red-400 focus:border-red-400' : ''}`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="form-error">⚠ {errors.confirmPassword}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 mt-2 shadow-sm"
              >
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Creating account…
                    </span>
                  : 'Continue to Onboarding →'
                }
              </button>

              <p className="text-xs text-center text-surface-400 leading-relaxed">
                By signing up you agree to CareCuisin&apos;s{' '}
                <span className="underline cursor-pointer hover:text-primary-500 transition-colors">
                  Data Privacy Standards
                </span>
              </p>

            </form>
          </div>
        </div>
      </main>

    </div>
  );
}

/* PAGE EXPORT  –  Suspense required for useSearchParams */
export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <p className="text-surface-400 text-sm">Loading…</p>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}