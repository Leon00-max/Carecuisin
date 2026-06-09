'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Stethoscope,
  ChefHat,
  AlertTriangle,
  BarChart3,
  Activity,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

function getLiveCounts() {
  if (typeof window === 'undefined') return { pendingVerifications: 0, openComplaints: 0 };

  let pendingDietitians = 0;
  let pendingChefs = 0;

  try {
    if (localStorage.getItem('cc_onboarding_dietitian_step1')) pendingDietitians = 1;
    if (localStorage.getItem('cc_onboarding_chef_step1')) pendingChefs = 1;

    const approved = JSON.parse(localStorage.getItem('cc_approved_users') || '[]');
    const rejected = JSON.parse(localStorage.getItem('cc_rejected_users') || '[]');

    pendingDietitians -= approved.concat(rejected).filter(u => u.role === 'dietitian').length;
    pendingChefs -= approved.concat(rejected).filter(u => u.role === 'chef').length;
  } catch (_) {}

  return {
    pendingVerifications: Math.max(pendingDietitians, 0) + Math.max(pendingChefs, 0),
    openComplaints: 1,
  };
}

const NAV_GROUPS = [
  {
    title: 'Command Center',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, badgeKey: null },
      { href: '/admin/verify-users', label: 'Verification Vault', icon: ShieldCheck, badgeKey: 'pendingVerifications' },
      { href: '/admin/operations', label: 'Operations Center', icon: Activity, badgeKey: null },
    ],
  },
  {
    title: 'Ecosystem Directory',
    items: [
      { href: '/admin/users?role=patients', label: 'Patients', icon: Users, badgeKey: null },
      { href: '/admin/users?role=dietitians', label: 'Dietitians', icon: Stethoscope, badgeKey: null },
      { href: '/admin/users?role=chefs', label: 'Chefs', icon: ChefHat, badgeKey: null },
    ],
  },
  {
    title: 'Platform Health',
    items: [
      { href: '/admin/complaints', label: 'Complaints & Safety', icon: AlertTriangle, badgeKey: 'openComplaints' },
      { href: '/admin/systemst-status', label: 'Telemetry Charts', icon: BarChart3, badgeKey: null },
      { href: '/admin/settings', label: 'Control Console', icon: Settings, badgeKey: null },
    ],
  },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [liveCounts, setLiveCounts] = useState({ pendingVerifications: 0, openComplaints: 0 });

  useEffect(() => {
    queueMicrotask(() => {
      setLiveCounts(getLiveCounts());
    });

    const handler = e => {
      if (e.key === 'cc_users' || e.key === 'cc_approved_users' || e.key === 'cc_rejected_users') {
        setLiveCounts(getLiveCounts());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cc_current_user');
    router.push('/auth/login');
  };

  const showFullText = !collapsed || mobileOpen;

  return (
    <aside
      className={`bg-white border-r border-surface-200 flex flex-col transition-all duration-300 z-50 text-surface-700 shadow-sm
        fixed inset-y-0 left-0 w-64 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:flex h-screen sticky top-0 shrink-0
        ${collapsed ? 'lg:w-20' : 'lg:w-64'}
      `}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-surface-200 shrink-0">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2.5 min-w-0"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        >
          <span className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm shadow-primary-200">
            CC
          </span>
          {showFullText && (
            <div className="min-w-0">
              <p className="text-xs font-black tracking-widest text-surface-900 uppercase leading-none">CareCuisin</p>
              <p className="text-[9px] font-bold text-primary-600 tracking-wider uppercase mt-1">Admin Operations</p>
            </div>
          )}
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-all shrink-0"
            title="Close sidebar"
          >
            <X size={15} />
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-all shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 select-none">
        {NAV_GROUPS.map(group => (
          <div key={group.title} className="space-y-1.5">
            {showFullText && (
              <p className="text-[9px] font-black text-surface-400 uppercase tracking-widest px-3 mb-1">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const basePath = item.href.split('?')[0];
                const isActive = basePath === '/admin' ? pathname === '/admin' : pathname.startsWith(basePath);
                const Icon = item.icon;
                const badgeCount = item.badgeKey ? liveCounts[item.badgeKey] : null;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative border ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-primary-100 shadow-sm'
                        : 'text-surface-500 border-transparent hover:bg-surface-50 hover:text-surface-900'
                    }`}
                  >
                    <Icon size={16} className={`shrink-0 ${isActive ? 'text-primary-600' : 'text-surface-400'}`} />

                    {showFullText && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {badgeCount !== null && badgeCount > 0 && (
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                            item.badgeKey === 'pendingVerifications'
                              ? 'bg-warning/10 text-amber-700 border-amber-200'
                              : 'bg-red-50 text-alert border-red-100'
                          }`}>
                            {badgeCount}
                          </span>
                        )}
                      </>
                    )}

                    {!showFullText && badgeCount !== null && badgeCount > 0 && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-alert animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-4 pt-3 border-t border-surface-200 space-y-1.5 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-surface-500 hover:bg-red-50 hover:text-alert transition-colors group"
          title="Logout"
        >
          <LogOut size={16} className="shrink-0 text-surface-400 group-hover:text-alert" />
          {showFullText && <span>Sign Out</span>}
        </button>

        {showFullText ? (
          <div className="flex items-center gap-3 px-3 py-3 mt-2 bg-surface-50 border border-surface-200 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center font-black text-xs shrink-0 border border-primary-100 shadow-sm">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-surface-900 truncate">Super Admin</p>
              <p className="text-[10px] text-surface-500 truncate mt-0.5">Buea Command</p>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0" title="System Online" />
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center font-black text-xs border border-primary-100 shadow-sm">
              AD
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
