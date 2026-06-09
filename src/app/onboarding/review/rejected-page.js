'use client';

/**
 * app/(onboarding)/rejected/page.js
 *
 * Shown when admin rejects a dietitian or chef application.
 * Reads rejection_reason from cc_users via userStore.
 * Offers re-application by clearing session and going to signup.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clearSession, getCurrentUserId, getUserById } from '@/lib/userStore';

export default function RejectedPage() {
  const [reason, setReason] = useState('');
  const [role,   setRole]   = useState('professional');

  useEffect(() => {
    queueMicrotask(() => {
      const uid  = getCurrentUserId();
      const user = uid ? getUserById(uid) : null;
      if (user?.rejection_reason) setReason(user.rejection_reason);
      if (user?.role) setRole(user.role);
    });
  }, []);

  function handleReapply() {
    clearSession();
    window.location.href = '/signup';
  }

  return (
    <main className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-red-100 border-4 border-red-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-9 h-9 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-surface-100 rounded-2xl shadow-sm p-8 text-center">

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Application Not Approved
          </div>

          <h1 className="text-2xl font-bold text-surface-900 mb-3">
            We could not verify your application
          </h1>
          <p className="text-sm text-surface-500 leading-relaxed mb-5">
            After reviewing your documents, our admin team was unable to
            approve your {role} account at this time.
          </p>

          {/* Rejection reason — only shown if admin provided one */}
          {reason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left mb-5">
              <p className="text-xs font-semibold text-red-700 uppercase tracking-widest mb-2">
                Reason provided by admin
              </p>
              <p className="text-sm text-red-700 leading-relaxed">{reason}</p>
            </div>
          )}

          {/* What to do next */}
          <div className="bg-surface-50 border border-surface-100 rounded-xl p-5 text-left mb-7">
            <p className="text-xs font-semibold text-surface-600 uppercase tracking-widest mb-3">
              What you can do
            </p>
            <ul className="space-y-3">
              {[
                'Contact support to understand what was missing from your application.',
                'Gather the correct documents — degree certificate, valid license, and a hospital or establishment letter.',
                'Re-apply with a new account once your documents are ready.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-surface-600">
                  <span className="text-primary-500 mt-0.5 font-bold shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:support@carecuisin.cm"
              className="btn-outline flex-1 justify-center"
            >
              Contact Support
            </a>
            <button
              onClick={handleReapply}
              className="btn-primary flex-1"
            >
              Re-apply
            </button>
          </div>

          {/* Back to home */}
          <div className="mt-4">
            <Link
              href="/"
              className="text-xs text-surface-400 hover:text-surface-600 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>

        </div>

        <p className="text-center text-xs text-surface-400 mt-5">
          If you believe this decision was made in error, please contact us at{' '}
          <a href="mailto:support@carecuisin.cm" className="text-primary-500 hover:underline">
            support@carecuisin.cm
          </a>
        </p>

      </div>
    </main>
  );
}
