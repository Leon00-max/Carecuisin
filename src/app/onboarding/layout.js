'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

/* ────────────────────────────────────────────────────────────
   STEP LABELS PER ROLE
   Used only when the URL is /onboarding/{role}/step{x}
─────────────────────────────────────────────────────────── */
const STEP_LABELS = {
  patient:    ['Personal Identity', 'Health Profile', 'Lifestyle & Budget'],
  dietitian:  ['Professional Identity', 'Clinical Expertise', 'Operations'],
  chef:       ['Identity & Trust', 'Cooking Expertise', 'Operations & Schedule'],
};

/* ────────────────────────────────────────────────────────────
   HELPER – checks whether we are on a step page
─────────────────────────────────────────────────────────── */
function isStepPage(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  return (
    parts.length === 4 &&
    parts[0] === 'onboarding' &&
    parts[2] === 'step'
  );
}

/* ────────────────────────────────────────────────────────────
   LAYOUT COMPONENT
─────────────────────────────────────────────────────────── */
export default function OnboardingLayout({ children }) {
  const pathname = usePathname();
  const showProgress = isStepPage(pathname);

  // Only parse progress info if we are on a step page
  let currentRole = 'patient';
  let currentStep = 1;

  if (showProgress) {
    const parts = pathname.split('/').filter(Boolean);
    currentRole = parts[1] || 'patient';
    currentStep = parseInt(parts[2].replace('step', ''), 10) || 1;
  }

  const roleLabels = STEP_LABELS[currentRole] || STEP_LABELS.patient;

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* ── Header (always visible) ── */}
      <header className="bg-white border-b border-surface-100 py-3 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              CC
            </span>
            <span className="text-sm font-semibold text-surface-800">
              CareCuisin
            </span>
          </Link>

          {/* On non‑step pages (pending‑review etc.) show a simple home link */}
          {!showProgress && (
            <Link
              href="/"
              className="text-xs text-surface-400 hover:text-primary-600 transition-colors"
            >
              ← Home
            </Link>
          )}
        </div>
      </header>

      {/* ── Progress bar + labels (only on step pages) ── */}
      {showProgress && (
        <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i + 1 <= currentStep
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-100 text-surface-400'
                  }`}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded ${
                      i + 1 < currentStep ? 'bg-primary-500' : 'bg-surface-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-surface-400">
            {roleLabels.map((label, i) => (
              <span
                key={i}
                className={
                  i + 1 <= currentStep ? 'text-primary-600 font-medium' : ''
                }
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Main content area ── */}
      <main className="flex-1">{children}</main>
    </div>
  );
}