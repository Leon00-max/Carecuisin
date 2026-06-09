'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import BottomNav from '@/components/BottomNav';
import {
  Activity,
  Bell,
  CheckCircle2,
  ChevronRight,
  Database,
  Menu,
  ShieldAlert,
} from 'lucide-react';

const alerts = [
  { title: 'Cold delivery complaint', detail: 'CMP-2026-0512 requires review', tone: 'alert' },
  { title: 'Verification queue', detail: '13 professional applications pending', tone: 'warning' },
  { title: 'Hospital bridge stable', detail: 'All sync jobs healthy', tone: 'success' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50 text-surface-800 flex flex-col font-sans selection:bg-primary-100 selection:text-primary-900">
      <header className="lg:hidden bg-white/95 backdrop-blur border-b border-surface-100 px-4 h-14 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-10 h-10 -ml-2 text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all flex items-center justify-center"
            aria-label="Open admin menu"
          >
            <Menu size={20} />
          </button>
          <Link href="/admin/dashboard" className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm shadow-primary-200">
              CC
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black text-surface-900 leading-none truncate">CareCuisin</p>
              <p className="text-[10px] font-semibold text-primary-600 leading-none mt-1">Admin Control</p>
            </div>
          </Link>
        </div>

        <Link
          href="/admin/notifications"
          className="relative w-10 h-10 rounded-xl border border-surface-100 text-surface-500 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center"
          aria-label="Admin notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-alert rounded-full ring-2 ring-white" />
        </Link>
      </header>

      <div className="flex-1 flex w-full min-h-0 relative">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="flex-1 min-w-0 w-full max-w-full bg-surface-50 px-3 py-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto overflow-x-hidden">
          <div className="w-full min-w-0 max-w-none">
            {children}
          </div>
        </main>

        <aside className="hidden xl:flex w-80 bg-white border-l border-surface-200 p-6 flex-col gap-6 h-screen sticky top-0 shrink-0 overflow-y-auto">
          <div className="card-medical rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-surface-500">Live Platform Health</p>
                <h3 className="text-lg font-bold text-surface-900 mt-1">Stable</h3>
              </div>
              <span className="w-10 h-10 rounded-2xl bg-success/10 text-success border border-success/20 flex items-center justify-center">
                <CheckCircle2 size={19} />
              </span>
            </div>
            <div className="space-y-4">
              <MetricBar label="Verification SLA" value="82%" width={82} color="bg-primary-500" />
              <MetricBar label="Referral flow" value="76%" width={76} color="bg-success" />
              <MetricBar label="Complaint pressure" value="18%" width={18} color="bg-alert" />
            </div>
          </div>

          <div className="card-medical rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert size={16} className="text-alert" />
              <h3 className="text-sm font-bold text-surface-900">Attention Queue</h3>
            </div>
            <div className="space-y-3">
              {alerts.map(alert => (
                <Link
                  key={alert.title}
                  href={alert.tone === 'alert' ? '/admin/complaints' : alert.tone === 'warning' ? '/admin/verify-users' : pathname}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-surface-100 hover:border-primary-100 hover:bg-primary-50/40 transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    alert.tone === 'alert' ? 'bg-alert' : alert.tone === 'warning' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-surface-900 truncate">{alert.title}</span>
                    <span className="block text-[11px] text-surface-500 truncate">{alert.detail}</span>
                  </span>
                  <ChevronRight size={14} className="text-surface-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="card-medical rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Database size={16} className="text-primary-600" />
              <h3 className="text-sm font-bold text-surface-900">System Feed</h3>
            </div>
            <div className="space-y-3">
              {[
                '[09:12] Referral engine synced',
                '[09:18] Verification vault updated',
                '[09:22] Complaint SLA recalculated',
                '[09:30] Hospital bridge healthy',
              ].map(line => (
                <div key={line} className="flex items-start gap-2 text-[11px] font-medium text-surface-500">
                  <Activity size={12} className="text-primary-500 mt-0.5 shrink-0" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <BottomNav role="admin" />
    </div>
  );
}

function MetricBar({ label, value, width, color }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-semibold text-surface-500 mb-1.5">
        <span>{label}</span>
        <span className="text-surface-800">{value}</span>
      </div>
      <div className="h-2 w-full bg-surface-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
