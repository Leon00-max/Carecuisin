import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {getCurrentUserId, getUserById, refreshStatusCookie} from '@/lib/userStore';
import Link from 'next/link';
import { Clock } from 'lucide-react';


export default function PendingReview() {
  const router = useRouter();

useEffect(() => {
  const checkStatus = () => {
  const userId = getCurrentUserId();
  if (!userId){ 
    router.push('/auth/login');

    return;
  }

    const user = getUserById(userId);

      if (!user) return;

      if (user.verification_status === 'approved') {
        refreshStatusCookie('approved');
        router.push(`/${user.role}/dashboard`);
      } else if (user.verification_status === 'rejected') {
        refreshStatusCookie('rejected');
        router.push('/onboarding/rejected');
      }
  
};
checkStatus(); // Initial check on mount
const interval = setInterval(checkStatus, 3000);
const handleStorage =(e) => {
  if (e.key === 'cc_users') checkStatus();
}; // Check every 3 seconds
window.addEventListener('storage', handleStorage);
return () => {
  clearInterval(interval);
  window.removeEventListener('storage', handleStorage);
};

}, [router]);

  return (
    <main className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">

        {/* ── Animated pending signal ── */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer pulse ring — slow */}
            <span className="absolute inset-0 rounded-full bg-primary-100 animate-ping opacity-40" />
            {/* Middle ring */}
            <span
              className="absolute inset-2 rounded-full bg-primary-100 animate-ping opacity-30"
              style={{ animationDelay: '0.4s' }}
            />
            {/* Inner solid circle with clock icon */}
            <div className="relative w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="bg-white border border-surface-100 rounded-2xl shadow-sm p-8 text-center">

          {/* Live status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Under Review
          </div>

          <h1 className="text-2xl font-bold text-surface-900 mb-3">
            Your application is being reviewed
          </h1>
          <p className="text-sm text-surface-500 leading-relaxed mb-7">
            Thank you for completing your professional profile. Our admin team
            is now verifying your credentials and documents before granting
            you access to the platform.
          </p>

          {/* What happens next */}
          <div className="bg-surface-50 border border-surface-100 rounded-xl p-5 text-left mb-7">
            <p className="text-xs font-semibold text-surface-700 uppercase tracking-widest mb-4">
              What happens next
            </p>
            <div className="space-y-4">
              {[
                {
                  step: '01',
                  title: 'Admin reviews your documents',
                  body: 'Your certificates, ID, and license are checked against Buea\'s registered institutions.',
                },
                {
                  step: '02',
                  title: 'Verification call (if needed)',
                  body: 'We may contact your supervisor or workplace via the number you provided.',
                },
                {
                  step: '03',
                  title: 'You receive a notification',
                  body: 'Approval or feedback is sent to your phone and email within 24–48 hours.',
                },
              ].map(({ step, title, body }) => (
                <div key={step} className="flex gap-4">
                  <span className="w-7 h-7 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-surface-800">{title}</p>
                    <p className="text-xs text-surface-500 mt-0.5 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review time estimate */}
          <div className="flex items-center justify-center gap-2 text-xs text-surface-400 mb-7">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            Typical review time: 24–48 hours
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="btn-outline flex-1 justify-center">
              Back to Home
            </Link>
            <a href="mailto:support@carecuisin.cm" className="btn-primary flex-1 justify-center">
              Contact Support
            </a>
          </div>

        </div>

        {/* Back arrow to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-surface-400 hover:text-primary-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Return to CareCuisin
          </Link>
        </div>

      </div>
    </main>
  );
}