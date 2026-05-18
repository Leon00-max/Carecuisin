'use client';

import Link from 'next/link';

export default function ForgotPassword() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="card-medical max-w-md w-full text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary-700">Password Reset</h2>
        <p className="text-surface-500 text-sm">This feature is coming soon. For now, please contact your dietitian or admin for assistance.</p>
        <Link href="./login" className="btn-primary inline-block">Back to Login</Link>
      </div>
    </main>
  );
}