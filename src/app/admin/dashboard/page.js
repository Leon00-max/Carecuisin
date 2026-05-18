'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Stethoscope,
  ChefHat,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Clock,
  CheckCircle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────
   HELPERS – real pending counts from localStorage
─────────────────────────────────────────────────────────── */
function getLiveStats() {
  let pendingDietitians = 0;
  let pendingChefs = 0;
  let totalPatients = 0;
  let totalDietitians = 0;
  let totalChefs = 0;

  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cc_onboarding_patient_step1')) totalPatients = 1;
    if (localStorage.getItem('cc_onboarding_dietitian_step1')) {
      totalDietitians = 1;
      pendingDietitians = 1;
    }
    if (localStorage.getItem('cc_onboarding_chef_step1')) {
      totalChefs = 1;
      pendingChefs = 1;
    }
    const approved = JSON.parse(localStorage.getItem('cc_approved_users') || '[]');
    const rejected = JSON.parse(localStorage.getItem('cc_rejected_users') || '[]');
    pendingDietitians -= approved.concat(rejected).filter(u => u.role === 'dietitian').length;
    pendingChefs -= approved.concat(rejected).filter(u => u.role === 'chef').length;
  }

  return {
    totalPatients: Math.max(totalPatients, 0),
    totalDietitians: Math.max(totalDietitians, 0),
    totalChefs: Math.max(totalChefs, 0),
    pendingDietitians: Math.max(pendingDietitians, 0),
    pendingChefs: Math.max(pendingChefs, 0),
    openComplaints: 0,        // placeholder
    activeReferrals: 0,       // placeholder
  };
}

/* ────────────────────────────────────────────────────────────
   MOCK COMPLAINTS & ACTIVITY (keep as placeholders)
─────────────────────────────────────────────────────────── */
const MOCK_COMPLAINTS = [
  {
    id: 'CMP-001',
    description: 'Patient reported allergic reaction after chef substituted ingredient.',
    priority: 'high',
    filed: '2 hours ago',
    patient: 'Patient #CC-492',
  },
];

const RECENT_ACTIVITY = [
  { event: 'New patient registration', actor: 'System', time: '1 hour ago', type: 'info' },
  { event: 'Dietitian application submitted', actor: 'Dr. Ambe Florence', time: '3 hours ago', type: 'warn' },
  { event: 'Chef verification submitted', actor: 'Chef Tabi Ernest', time: '5 hours ago', type: 'warn' },
];

/* ────────────────────────────────────────────────────────────
   PAGE COMPONENT
─────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDietitians: 0,
    totalChefs: 0,
    pendingDietitians: 0,
    pendingChefs: 0,
    openComplaints: 0,
    activeReferrals: 0,
  });

  useEffect(() => {
    setStats(getLiveStats());
  }, []);

  const statCards = [
    {
      label: 'Total Patients',
      value: stats.totalPatients.toString(),
      change: 'Active profiles',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/admin/users?role=patients',
    },
    {
      label: 'Dietitians',
      value: stats.totalDietitians.toString(),
      change: stats.pendingDietitians > 0 ? `${stats.pendingDietitians} pending` : 'All verified',
      icon: Stethoscope,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      href: '/admin/verify-users',
    },
    {
      label: 'Chefs',
      value: stats.totalChefs.toString(),
      change: stats.pendingChefs > 0 ? `${stats.pendingChefs} pending` : 'All verified',
      icon: ChefHat,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/admin/verify-users',
    },
    {
      label: 'Open Complaints',
      value: stats.openComplaints.toString(),
      change: 'Safety alerts',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      href: '/admin/complaints',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="badge-clinical mb-2 inline-block">Command Center</span>
        <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
        <p className="text-sm text-surface-500 mt-1">Operational overview of CareCuisin in Buea.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card-medical !p-4 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} strokeWidth={2} />
              </div>
              <ArrowUpRight
                size={16}
                className="text-surface-300 group-hover:text-primary-500 transition-colors"
              />
            </div>
            <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
            <p className="text-xs font-medium text-surface-500 mt-1">{stat.label}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={11} className="text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600">{stat.change}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pending Verifications Summary + Open Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Verifications */}
        <div className="card-medical">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-surface-800 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary-500" />
              Pending Verifications
            </h3>
            <Link
              href="/admin/verify-users"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              Review all <ArrowUpRight size={12} />
            </Link>
          </div>
          {stats.pendingDietitians === 0 && stats.pendingChefs === 0 ? (
            <div className="text-center py-6 text-sm text-surface-500">
              <CheckCircle size={24} className="text-emerald-400 mx-auto mb-2" />
              All clear — no pending verifications.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.pendingDietitians > 0 && (
                <div className="flex items-center justify-between p-3 bg-surface-50 border border-surface-100 rounded-xl">
                  <span className="text-sm font-medium text-surface-700">
                    {stats.pendingDietitians} pending dietitian{stats.pendingDietitians > 1 ? 's' : ''}
                  </span>
                  <Link
                    href="/admin/verify-users"
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-primary-600 hover:bg-primary-100"
                  >
                    Review
                  </Link>
                </div>
              )}
              {stats.pendingChefs > 0 && (
                <div className="flex items-center justify-between p-3 bg-surface-50 border border-surface-100 rounded-xl">
                  <span className="text-sm font-medium text-surface-700">
                    {stats.pendingChefs} pending chef{stats.pendingChefs > 1 ? 's' : ''}
                  </span>
                  <Link
                    href="/admin/verify-users"
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-primary-600 hover:bg-primary-100"
                  >
                    Review
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Open Complaints */}
        <div className="card-medical">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-surface-800 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" />
              Open Complaints
            </h3>
            <Link
              href="/admin/complaints"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {MOCK_COMPLAINTS.length === 0 ? (
            <div className="text-center py-6 text-sm text-surface-500">No open complaints.</div>
          ) : (
            <div className="space-y-3">
              {MOCK_COMPLAINTS.map((c) => (
                <div key={c.id} className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-red-700">{c.id}</span>
                    <span className="text-xs text-red-600">{c.patient}</span>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-semibold capitalize">
                      {c.priority}
                    </span>
                  </div>
                  <p className="text-xs text-red-700 leading-relaxed">{c.description}</p>
                  <p className="text-xs text-red-400 mt-1">{c.filed}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Vitals (light theme) + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-medical">
          <h3 className="font-semibold text-surface-800 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-primary-500" />
            System Vitals
          </h3>
          <div className="space-y-5">
            {[
              { label: 'Uptime (Buea cloud)', value: '99.9%', pct: 99, color: 'bg-emerald-500' },
              { label: 'Referral completion', value: '82%', pct: 82, color: 'bg-primary-500' },
              { label: 'Complaints resolved', value: '91%', pct: 91, color: 'bg-blue-500' },
            ].map(({ label, value, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-semibold text-surface-500 mb-1">
                  <span>{label}</span>
                  <span className="text-surface-800">{value}</span>
                </div>
                <div className="h-2 w-full bg-surface-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-medical">
          <h3 className="font-semibold text-surface-800 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-surface-400" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  item.type === 'info' ? 'bg-blue-400' :
                  item.type === 'warn' ? 'bg-amber-400' : 'bg-red-400'
                }`} />
                <div className="flex-1">
                  <p className="text-surface-700 font-medium">{item.event}</p>
                  <p className="text-xs text-surface-400">{item.actor}</p>
                </div>
                <span className="text-xs text-surface-300 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}