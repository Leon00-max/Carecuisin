'use client';

import { Activity, TrendingUp } from 'lucide-react';
import { analyticsStats, referralTrendPoints, topDietitians } from '@/lib/adminPortalData';
import { PageHeader, SectionCard, StatusBadge } from '@/components/admin/AdminUI';

export default function ReferralTrendsPage() {
  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Referral Analytics"
        title="Referral Trends"
        subtitle="Accepted, declined, completed, and pending referrals over time."
        icon={Activity}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {analyticsStats.map(stat => (
          <div key={stat.label} className="card-medical rounded-2xl !p-4">
            <StatusBadge tone={stat.tone}>{stat.change}</StatusBadge>
            <p className="text-2xl font-bold text-surface-900 mt-3">{stat.value}</p>
            <p className="text-xs text-surface-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <SectionCard title="Referral Movement" icon={TrendingUp}>
        <div className="h-40 flex items-end gap-2">
          {referralTrendPoints.map((point, index) => (
            <div key={`${point}-${index}`} className="flex-1 rounded-t-xl bg-primary-500" style={{ height: `${point * 1.6}px` }} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Top Dietitians by Referrals" icon={Activity}>
        <div className="space-y-3">
          {topDietitians.map(item => (
            <div key={item.name} className="flex items-center justify-between gap-3 rounded-2xl border border-surface-100 p-3">
              <div>
                <p className="text-sm font-bold text-surface-900">{item.name}</p>
                <p className="text-xs text-surface-500">{item.referrals} referrals</p>
              </div>
              <StatusBadge tone="success">{item.growth}</StatusBadge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
