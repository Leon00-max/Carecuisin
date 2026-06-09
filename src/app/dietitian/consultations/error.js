'use client';

import { AlertTriangle } from 'lucide-react';

export default function Error({ reset }) {
  return (
    <div className="card-medical mx-auto max-w-xl rounded-2xl text-center">
      <AlertTriangle className="mx-auto text-alert" size={28} />
      <h2 className="mt-3 text-lg font-bold text-surface-900">Consultations could not load</h2>
      <button type="button" onClick={reset} className="btn-primary mt-5">Try again</button>
    </div>
  );
}
