'use client';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({ error, reset }) {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
      <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-2xl font-black text-surface-900 uppercase italic">Clinical System Error</h2>
      <p className="text-surface-500 font-bold max-w-md text-center">The requested data could not be retrieved safely. Please re-authenticate the session.</p>
      <button onClick={() => reset()} className="btn-primary flex items-center gap-2">
        <RefreshCcw size={16} /> Reconnect System
      </button>
    </div>
  );
}