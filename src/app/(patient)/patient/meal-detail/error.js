'use client';

import { AlertCircle } from 'lucide-react';

export default function Error({ reset }) {
  return (
    <div className="card-medical mx-auto max-w-xl rounded-2xl border-alert/20 p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-alert/10 text-alert">
        <AlertCircle size={24} />
      </div>
      <h2 className="mt-4 text-lg font-black text-surface-900">Meal details could not load</h2>
      <p className="mt-2 text-sm text-surface-500">Please retry the page.</p>
      <button type="button" onClick={reset} className="btn-primary mt-5">Try again</button>
    </div>
  );
}
