'use client';

import { Activity, MapPin } from 'lucide-react';
import { platformHealth, topAreas } from '@/lib/adminPortalData';
import { PageHeader, ProgressBar, SectionCard, StatusBadge } from '@/components/admin/AdminUI';

export default function TopAreasPage() {
  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Buea Coverage"
        title="Top Areas in Buea"
        subtitle="User concentration and platform health by neighborhood."
        icon={MapPin}
      />

      <SectionCard title="User Concentration" icon={MapPin}>
        <div className="space-y-4">
          {topAreas.map(area => (
            <div key={area.name}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-semibold text-surface-800">{area.name}</span>
                <span className="font-bold text-surface-900">{area.users}</span>
              </div>
              <ProgressBar value={area.pct} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Platform Health" icon={Activity}>
        <div className="grid grid-cols-2 gap-3">
          {platformHealth.map(item => (
            <div key={item.label} className="rounded-2xl border border-surface-100 p-3">
              <StatusBadge tone={item.tone}>{item.change}</StatusBadge>
              <p className="text-2xl font-bold text-surface-900 mt-3">{item.value}</p>
              <p className="text-xs text-surface-500">{item.label}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
