'use client';

import { AlertTriangle, Download, FileText } from 'lucide-react';
import { exportReports } from '@/lib/adminPortalData';
import { PageHeader, SectionCard, StatusBadge } from '@/components/admin/AdminUI';

export default function DataExportPage() {
  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Secure Reporting"
        title="Data Export"
        subtitle="Export operational reports while protecting sensitive patient information."
        icon={Download}
      />

      <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4">
        <p className="text-sm font-bold text-warning flex items-center gap-2">
          <AlertTriangle size={16} />
          Sensitive patient data must be handled carefully.
        </p>
        <p className="text-xs text-surface-700 mt-2">
          Share exports only with authorized administrators and clinical partners. Remove private clinical fields before external reporting.
        </p>
      </div>

      <SectionCard title="Available Reports" icon={FileText}>
        <div className="space-y-3">
          {exportReports.map(report => (
            <div key={report.name} className="rounded-2xl border border-surface-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-surface-900">{report.name}</p>
                  <p className="text-xs text-surface-500 mt-1">{report.detail}</p>
                </div>
                <StatusBadge tone="primary">{report.format}</StatusBadge>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button type="button" className="btn-outline text-sm flex items-center justify-center gap-2">
                  <Download size={15} />
                  CSV
                </button>
                <button type="button" className="btn-primary text-sm flex items-center justify-center gap-2">
                  <Download size={15} />
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
