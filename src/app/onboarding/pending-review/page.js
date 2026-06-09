import Link from 'next/link';
import { Clock, Mail, ShieldCheck } from 'lucide-react';

export default function PendingReviewPage() {
  return (
    <main className="min-h-screen bg-surface-50 px-6 py-10 flex items-center justify-center">
      <section className="card-medical max-w-lg rounded-2xl text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
          <Clock size={30} />
        </span>
        <span className="badge-clinical mt-6">Professional verification</span>
        <h1 className="mt-3 text-2xl font-black text-surface-900">Account under review</h1>
        <p className="mt-3 text-sm leading-relaxed text-surface-500">
          Your professional profile has been submitted. Admin must verify your credentials before full CareCuisin access is unlocked.
        </p>

        <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-4 text-left">
          <div className="flex items-center gap-2 text-sm font-bold text-primary-700">
            <ShieldCheck size={17} />
            Trust check in progress
          </div>
          <p className="mt-2 text-xs leading-relaxed text-surface-600">
            Dietitians and chefs are reviewed manually because they are responsible for clinical meal safety.
          </p>
        </div>

        <Link href="mailto:support@carecuisin.cm" className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2">
          <Mail size={17} />
          Contact Support
        </Link>
      </section>
    </main>
  );
}
