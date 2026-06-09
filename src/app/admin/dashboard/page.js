'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle2,
  ChefHat,
  ClipboardCheck,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { ActionTile, Avatar, PageHeader, SectionCard, StatusBadge } from '@/components/admin/AdminUI';
import { platformMetrics, quickActions, recentActivity } from '@/lib/adminPortalData';

const iconMap = {
  'Verify Professionals': ShieldCheck,
  'Manage Users': Users,
  'View Complaints': AlertTriangle,
  'System Stats': BarChart3,
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm shadow-primary-200">
              CC
            </span>
            <div>
              <p className="text-sm font-black text-surface-900 leading-none">CareCuisin</p>
              <p className="text-[11px] font-semibold text-primary-600 mt-1">Clinical nutrition operations</p>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-surface-900 tracking-tight leading-tight">Good morning, Admin</h1>
          <p className="text-sm text-surface-500 mt-1">Here is what is happening today across Buea.</p>
        </div>
        <Link
          href="/admin/notifications"
          className="relative w-11 h-11 rounded-2xl bg-white border border-surface-100 text-surface-500 hover:text-primary-600 hover:bg-primary-50 transition-colors shadow-sm flex items-center justify-center shrink-0"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-alert ring-2 ring-white" />
        </Link>
      </div>

      <section className="rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-600 to-primary-500 p-5 text-white shadow-sm shadow-primary-200">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-sm font-bold">Platform Overview</p>
            <p className="text-xs text-primary-100 mt-0.5">Today, May 25, 2026</p>
          </div>
          <StatusBadge tone="success" icon={CheckCircle2}>Stable</StatusBadge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {platformMetrics.map(metric => (
            <div key={metric.label} className="rounded-2xl bg-white/12 border border-white/15 p-4">
              <p className="text-2xl font-bold tracking-tight">{metric.value}</p>
              <p className="text-[11px] text-primary-50 mt-0.5">{metric.label}</p>
              <p className={`text-[11px] font-bold mt-2 ${metric.tone === 'alert' ? 'text-alert bg-white rounded-full inline-flex px-2 py-0.5' : 'text-white'}`}>
                {metric.change}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <PageHeader title="Quick Actions" subtitle="One tap access to the platform controls that matter most." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {quickActions.map(action => {
            const Icon = iconMap[action.label] || ClipboardCheck;
            return (
              <ActionTile key={action.label} href={action.href} icon={Icon} label={action.label} tone={action.tone} />
            );
          })}
        </div>
      </section>

      <SectionCard title="Recent Activity" subtitle="Live trust, verification, and safety events." icon={ClipboardCheck}>
        <div className="space-y-3">
          {recentActivity.map(item => (
            <div key={`${item.title}-${item.time}`} className="flex items-center gap-3 p-3 rounded-2xl border border-surface-100 bg-surface-50/60">
              <Avatar name={item.initials} tone={item.tone} className="w-10 h-10 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-surface-900 truncate">{item.title}</p>
                <p className="text-xs text-surface-500 truncate">{item.detail}</p>
              </div>
              <span className="text-[11px] font-semibold text-surface-400 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Verification Pressure" subtitle="Professionals waiting for manual review." icon={ShieldCheck}>
          <div className="grid grid-cols-2 gap-3">
            <MiniMetric icon={ShieldCheck} label="Dietitians" value="5" tone="warning" />
            <MiniMetric icon={ChefHat} label="Chefs" value="8" tone="warning" />
          </div>
          <Link href="/admin/verify-users" className="btn-primary mt-4 w-full flex items-center justify-center text-sm">
            Open Verification Vault
          </Link>
        </SectionCard>

        <SectionCard title="Complaint Safety" subtitle="Cases are triaged by priority and SLA." icon={AlertTriangle}>
          <div className="grid grid-cols-3 gap-3">
            <MiniMetric icon={AlertTriangle} label="High" value="3" tone="alert" />
            <MiniMetric icon={ClipboardCheck} label="Open" value="12" tone="warning" />
            <MiniMetric icon={CheckCircle2} label="Resolved" value="17" tone="success" />
          </div>
          <Link href="/admin/complaints" className="btn-outline mt-4 w-full flex items-center justify-center text-sm">
            Review Complaints
          </Link>
        </SectionCard>
      </div>
    </div>
  );
}

function MiniMetric({ icon: Icon, label, value, tone }) {
  const toneMap = {
    primary: 'bg-primary-50 text-primary-700 border-primary-100',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    alert: 'bg-alert/10 text-alert border-alert/20',
  };

  return (
    <div className={`rounded-2xl border p-3 ${toneMap[tone] || toneMap.primary}`}>
      <Icon size={16} />
      <p className="text-xl font-bold mt-2">{value}</p>
      <p className="text-[11px] font-semibold">{label}</p>
    </div>
  );
}
