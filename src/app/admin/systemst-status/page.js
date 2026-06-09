'use client';

import Link from 'next/link';
import {
  Activity,
  BarChart3,
  Download,
  LineChart,
  MapPin,
  PieChart,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  analyticsStats,
  platformHealth,
  topAreas,
  topDietitians,
} from '@/lib/adminPortalData';
import { PageHeader, ProgressBar, SectionCard, StatusBadge } from '@/components/admin/AdminUI';

export default function SystemStatsPage() {
  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Platform Intelligence"
        title="System Stats"
        subtitle="Analytics for user growth, referrals, role mix, Buea coverage, and platform health."
        icon={BarChart3}
        action={(
          <Link href="/admin/data-export" className="hidden sm:flex btn-outline items-center gap-2 text-sm">
            <Download size={15} />
            Export
          </Link>
        )}
      />

      <SectionCard title="User Growth" subtitle="Total users and growth from the previous period." icon={TrendingUp}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-3xl font-bold text-surface-900">1,248</p>
            <p className="text-sm text-surface-500 mt-1">Total Users</p>
          </div>
          <StatusBadge tone="success">+18.5% vs last month</StatusBadge>
        </div>
        <LineGraph values={[18, 32, 48, 66, 64, 82, 91]} />
      </SectionCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title="Users by Role" subtitle="Patients, professionals, and admins." icon={PieChart}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 min-w-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full shrink-0" style={{ background: 'conic-gradient(var(--color-primary-500) 0 71%, var(--color-success) 71% 85%, var(--color-primary-300) 85% 96%, var(--color-surface-400) 96% 100%)' }}>
              <div className="w-full h-full rounded-full border-[22px] border-white" />
            </div>
            <div className="space-y-3 flex-1">
              {[
                ['Patients', '71%', '1,003', 'bg-primary-500'],
                ['Dietitians', '14%', '196', 'bg-success'],
                ['Chefs', '11%', '78', 'bg-primary-300'],
                ['Admins', '4%', '12', 'bg-surface-400'],
              ].map(([label, pct, value, color]) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="font-semibold text-surface-800 flex-1">{label}</span>
                  <span className="text-surface-500">{pct}</span>
                  <span className="font-bold text-surface-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Referrals Overview" subtitle="Dietitian to chef coordination health." icon={Activity}>
          <div className="grid grid-cols-2 gap-3">
            {analyticsStats.map(stat => (
              <div key={stat.label} className="rounded-2xl border border-surface-100 p-3">
                <StatusBadge tone={stat.tone}>{stat.change}</StatusBadge>
                <p className="text-2xl font-bold text-surface-900 mt-3">{stat.value}</p>
                <p className="text-xs text-surface-500">{stat.label}</p>
              </div>
            ))}
          </div>
          <Link href="/admin/referral-trends" className="btn-outline mt-4 w-full flex items-center justify-center text-sm">
            Open Referral Trends
          </Link>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title="Top Areas in Buea" subtitle="Where CareCuisin is growing geographically." icon={MapPin}>
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
          <Link href="/admin/top-areas" className="text-sm font-semibold text-primary-600 mt-4 inline-flex">
            View area detail
          </Link>
        </SectionCard>

        <SectionCard title="Top Dietitians by Referrals" subtitle="Professional activity signal." icon={Users}>
          <div className="space-y-3">
            {topDietitians.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3 rounded-2xl border border-surface-100 p-3">
                <span className="w-8 h-8 rounded-xl bg-primary-50 text-primary-700 border border-primary-100 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-surface-900">{item.name}</p>
                  <p className="text-xs text-surface-500">{item.referrals} referrals</p>
                </div>
                <StatusBadge tone="success">{item.growth}</StatusBadge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Platform Health" subtitle="Operational indicators across the ecosystem." icon={LineChart}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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

function LineGraph({ values }) {
  const max = Math.max(...values);
  return (
    <div className="mt-5 h-36 flex items-end gap-2 border-b border-l border-surface-100 px-2 pt-4">
      {values.map((value, index) => (
        <div key={`${value}-${index}`} className="flex-1 flex items-end">
          <div
            className="w-full rounded-t-xl bg-primary-500/90 shadow-sm shadow-primary-100"
            style={{ height: `${(value / max) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}
