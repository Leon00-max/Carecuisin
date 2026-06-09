'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, CheckCircle2, FileCheck2, ShieldCheck, XCircle } from 'lucide-react';
import { getMealPlanById } from '@/lib/mealPlanStore';
import { getReportByVerificationCode } from '@/lib/reportStore';
import { getUserById } from '@/lib/userStore';

function safeDate(value) {
  if (!value) return 'Recorded by CareCuisin';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function VerificationPage() {
  const params = useParams();
  const code = params?.id;
  const [state, setState] = useState({ loading: true, report: null, plan: null });

  useEffect(() => {
    if (!code) return;
    queueMicrotask(() => {
      const report = getReportByVerificationCode(code);
      const plan = report ? null : getMealPlanById(code);
      setState({ loading: false, report, plan });
    });
  }, [code]);

  if (state.loading) {
    return (
      <main className="min-h-screen bg-surface-50 px-6 py-10 flex items-center justify-center">
        <div className="card-medical max-w-md rounded-2xl text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-surface-200 border-t-primary-600" />
          <p className="mt-4 text-sm font-semibold text-surface-500">Verifying CareCuisin record...</p>
        </div>
      </main>
    );
  }

  const report = state.report;
  const plan = state.plan;
  const dietitian = report ? getUserById(report.dietitianId) : plan ? getUserById(plan.dietitianId) : null;
  const valid = Boolean(report && report.status === 'valid') || Boolean(plan);

  return (
    <main className="min-h-screen bg-surface-50 px-6 py-10 flex items-center justify-center">
      <section className="card-medical max-w-xl rounded-2xl">
        <div className="flex items-start gap-4">
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
            valid ? 'bg-success/10 text-success' : 'bg-alert/10 text-alert'
          }`}>
            {valid ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
          </span>
          <div>
            <span className="badge-clinical">Public verification</span>
            <h1 className="mt-3 text-2xl font-black text-surface-900">
              {valid ? 'CareCuisin record is valid' : 'Record not found'}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-surface-500">
              This page only confirms safe public verification details. It does not expose private medical notes.
            </p>
          </div>
        </div>

        {valid ? (
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-success/20 bg-success/10 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-success">
                <ShieldCheck size={17} />
                Verified by CareCuisin
              </div>
              <p className="mt-2 text-xs text-surface-600">
                {report?.publicSummary || 'This meal plan was issued by a verified CareCuisin dietitian.'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-surface-100 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-surface-500">
                  <FileCheck2 size={15} />
                  Record ID
                </div>
                <p className="mt-2 break-all text-sm font-bold text-surface-900">{report?.id || plan?.id}</p>
              </div>
              <div className="rounded-2xl border border-surface-100 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-surface-500">
                  <Calendar size={15} />
                  Issue date
                </div>
                <p className="mt-2 text-sm font-bold text-surface-900">{safeDate(report?.issuedAt || plan?.createdAt)}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-surface-100 bg-white p-4">
              <p className="text-xs font-semibold text-surface-500">Dietitian confirmation</p>
              <p className="mt-2 text-sm font-bold text-surface-900">{dietitian?.fullName || 'Verified CareCuisin dietitian'}</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-alert/20 bg-alert/10 p-4 text-sm text-surface-700">
            The verification code is invalid, expired, or was revoked by CareCuisin.
          </div>
        )}

        <Link href="/" className="btn-primary mt-6 inline-flex w-full justify-center">
          Back to CareCuisin
        </Link>
      </section>
    </main>
  );
}
