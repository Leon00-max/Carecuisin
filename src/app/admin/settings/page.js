'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  ChevronRight,
  Database,
  Download,
  FileClock,
  Globe2,
  KeyRound,
  Lock,
  LogOut,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  UserCog,
  WalletCards,
} from 'lucide-react';
import { Avatar, PageHeader, SectionCard, StatusBadge } from '@/components/admin/AdminUI';

const preferenceRows = [
  { label: 'Notifications', value: 'Critical alerts on', href: '/admin/notifications', icon: Bell },
  { label: 'Language', value: 'English', href: '/admin/settings', icon: Globe2 },
  { label: 'App Theme', value: 'Platform colors', href: '/admin/settings', icon: Settings },
  { label: 'Change Password', value: 'Security', href: '/admin/settings', icon: KeyRound },
];

const systemRows = [
  { label: 'Audit Logs', value: 'Accountability trail', href: '/admin/audit-logs', icon: FileClock },
  { label: 'Data Export', value: 'CSV and PDF reports', href: '/admin/data-export', icon: Download },
  { label: 'Payment Management', value: 'MoMo, Orange, Stripe-ready', href: '/admin/payments', icon: WalletCards },
  { label: 'Backup and Restore', value: 'Last backup today', href: '/admin/settings', icon: Database },
  { label: 'Security Settings', value: '2FA recommended', href: '/admin/settings', icon: Lock },
  { label: 'Admin Roles', value: '4 active admins', href: '/admin/roles', icon: UserCog },
];

export default function AdminSettingsPage() {
  const [latency, setLatency] = useState(14);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reviewSla, setReviewSla] = useState(24);
  const [kitchenLimit, setKitchenLimit] = useState(45);

  function testGateway() {
    setTesting(true);
    window.setTimeout(() => {
      setLatency(Math.floor(Math.random() * 6) + 10);
      setTesting(false);
    }, 900);
  }

  function saveSettings(event) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="System Control"
        title="Settings"
        subtitle="Manage admin profile, preferences, security, exports, and operational thresholds."
        icon={Settings}
      />

      {saved && (
        <div className="rounded-2xl border border-success/20 bg-success/10 text-success px-4 py-3 text-sm font-semibold">
          Settings saved successfully.
        </div>
      )}

      <SectionCard title="Admin Profile" icon={ShieldCheck}>
        <div className="flex items-center gap-3">
          <Avatar name="Admin User" tone="primary" className="w-14 h-14" />
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-surface-900">Admin User</p>
            <p className="text-xs text-surface-500">Super Administrator</p>
            <p className="text-xs text-surface-400 mt-1">admin@carecuisin.com</p>
          </div>
          <StatusBadge tone="success">Active</StatusBadge>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title="Preferences" subtitle="Personal admin controls." icon={Settings}>
          <div className="space-y-2">
            {preferenceRows.map(row => <SettingsRow key={row.label} row={row} />)}
          </div>
        </SectionCard>

        <SectionCard title="System" subtitle="Security and accountability controls." icon={Database}>
          <div className="space-y-2">
            {systemRows.map(row => <SettingsRow key={row.label} row={row} />)}
          </div>
        </SectionCard>
      </div>

      <form onSubmit={saveSettings} className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title="Operational Safeguards" subtitle="Thresholds for review, kitchen load, and escalations." icon={ShieldCheck}>
          <div className="space-y-5">
            <SliderField label="Professional review SLA" value={reviewSla} min={6} max={48} suffix="hours" onChange={setReviewSla} />
            <SliderField label="Maximum active kitchen load" value={kitchenLimit} min={20} max={80} suffix="orders" onChange={setKitchenLimit} />
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Save size={16} />
              Save System Controls
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Hospital Database Bridge" subtitle="Clinical coordination gateway status." icon={Database}>
          <div className="space-y-4">
            <div className="rounded-2xl border border-surface-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-surface-400">Gateway Host</p>
                  <p className="text-sm font-bold text-surface-900 mt-1">buea-hospital-core.supabase.co</p>
                </div>
                <StatusBadge tone={testing ? 'warning' : 'success'}>{testing ? 'Testing' : 'Stable'}</StatusBadge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-surface-100 p-3">
                <p className="text-[11px] text-surface-400 font-semibold">Latency</p>
                <p className="text-xl font-bold text-surface-900 mt-1">{latency} ms</p>
              </div>
              <div className="rounded-2xl border border-surface-100 p-3">
                <p className="text-[11px] text-surface-400 font-semibold">Health Grade</p>
                <p className="text-xl font-bold text-success mt-1">A+</p>
              </div>
            </div>
            <button type="button" onClick={testGateway} className="btn-outline w-full flex items-center justify-center gap-2">
              <RefreshCw size={16} className={testing ? 'animate-spin' : ''} />
              Test Gateway Connection
            </button>
          </div>
        </SectionCard>
      </form>

      <button type="button" className="w-full rounded-2xl border border-alert/20 bg-alert/10 px-5 py-3 text-alert font-semibold flex items-center justify-center gap-2 hover:bg-alert/15 transition-colors">
        <LogOut size={17} />
        Log Out
      </button>
    </div>
  );
}

function SettingsRow({ row }) {
  const Icon = row.icon;
  return (
    <Link href={row.href} className="flex items-center gap-3 rounded-2xl border border-surface-100 p-3 hover:bg-primary-50/40 hover:border-primary-100 transition-colors">
      <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center shrink-0">
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-surface-900">{row.label}</span>
        <span className="block text-xs text-surface-500">{row.value}</span>
      </span>
      <ChevronRight size={16} className="text-surface-400" />
    </Link>
  );
}

function SliderField({ label, value, min, max, suffix, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <label className="text-sm font-semibold text-surface-800">{label}</label>
        <span className="text-xs font-bold text-primary-700">{value} {suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={event => onChange(Number(event.target.value))}
        className="w-full accent-primary-600"
      />
    </div>
  );
}
