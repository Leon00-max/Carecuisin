'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function PatientError({ error, reset }) {
  useEffect(() => {
    console.error('Patient portal error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-alert/20 bg-alert/10 text-alert">
          <AlertTriangle size={28} />
        </div>
        <h2 className="mt-5 text-lg font-black text-surface-900">Something went wrong</h2>
        <p className="mt-2 text-sm leading-relaxed text-surface-500">
          We could not load this part of your patient portal. Your meal plan and care data are safe.
        </p>
        <button type="button" onClick={reset} className="btn-primary mt-6 rounded-2xl">
          Try again
        </button>
      </div>
    </div>
  );
}
