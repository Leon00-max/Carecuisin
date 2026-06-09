'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileCheck2, QrCode, ShieldCheck } from 'lucide-react';
import { getReports } from '@/lib/reportStore';
import { getCurrentUserId, getUserById } from '@/lib/userStore';

export default function PatientReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    queueMicrotask(() => {
      const patientId = getCurrentUserId();
      setReports(patientId ? getReports({ patientId }) : []);
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <span className="badge-clinical mb-2">Verified reports</span>
        <h1 className="text-2xl font-black text-surface-900">Care reports</h1>
        <p className="mt-1 text-sm text-surface-500">
          Reports expose only safe verification details publicly. Private clinical notes stay private.
        </p>
      </header>

      <section className="card-medical rounded-2xl">
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="rounded-2xl border border-surface-100 bg-surface-50 p-8 text-center">
              <FileCheck2 className="mx-auto text-surface-400" size={30} />
              <p className="mt-3 text-sm font-bold text-surface-900">No reports yet</p>
              <p className="mt-1 text-xs text-surface-500">Your dietitian can generate a verified CareCuisin report after consultation.</p>
            </div>
          ) : (
            reports.map(report => {
              const dietitian = getUserById(report.dietitianId);
              return (
                <article key={report.id} className="rounded-2xl border border-surface-100 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                        <QrCode size={22} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-surface-900">{report.title}</p>
                        <p className="mt-1 text-xs text-surface-500">Issued by {dietitian?.fullName || 'Verified dietitian'}</p>
                        <p className="mt-2 inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-1 text-[11px] font-bold text-success">
                          <ShieldCheck size={13} />
                          {report.status}
                        </p>
                      </div>
                    </div>
                    <Link href={report.qrPayload} className="btn-outline inline-flex justify-center">
                      Verify
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
