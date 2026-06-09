'use client';

import Link from 'next/link';
import { AlertTriangle, LogOut, Mail } from 'lucide-react';
import { clearSession } from '@/lib/userStore';

export default function RejectedAccountPage() {
  return (
    <main className="min-h-screen bg-surface-50 px-6 py-10 flex items-center justify-center">
      <section className="card-medical max-w-lg rounded-2xl text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-alert/10 text-alert">
          <AlertTriangle size={30} />
        </span>
        <span className="mt-6 inline-flex rounded-full border border-alert/20 bg-alert/10 px-3 py-1 text-xs font-bold text-alert">
          Verification not approved
        </span>
        <h1 className="mt-3 text-2xl font-black text-surface-900">Application needs attention</h1>
        <p className="mt-3 text-sm leading-relaxed text-surface-500">
          Admin could not approve this professional account with the current information. Contact support for the reason and next steps.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="mailto:support@carecuisin.cm" className="btn-primary inline-flex items-center justify-center gap-2">
            <Mail size={17} />
            Contact Support
          </Link>
          <button
            type="button"
            onClick={() => {
              clearSession();
              window.location.href = '/auth/login';
            }}
            className="btn-outline inline-flex items-center justify-center gap-2 text-alert hover:bg-alert/10"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </section>
    </main>
  );
}
