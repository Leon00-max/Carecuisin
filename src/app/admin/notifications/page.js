'use client';

import { Bell, Clock } from 'lucide-react';
import { adminNotifications } from '@/lib/adminPortalData';
import { PageHeader, SectionCard, StatusBadge } from '@/components/admin/AdminUI';

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Alerts"
        title="Admin Notifications"
        subtitle="Grouped alerts for applications, complaints, referrals, document updates, and system warnings."
        icon={Bell}
      />

      <SectionCard title="Important Alerts" icon={Bell}>
        <div className="space-y-3">
          {adminNotifications.map(note => (
            <div key={note.title} className="rounded-2xl border border-surface-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-surface-900">{note.title}</p>
                  <p className="text-xs text-surface-500 mt-1">{note.detail}</p>
                </div>
                <StatusBadge tone={note.tone}>{note.tone}</StatusBadge>
              </div>
              <p className="text-[11px] font-semibold text-surface-400 mt-3 flex items-center gap-1.5">
                <Clock size={12} />
                {note.time}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
