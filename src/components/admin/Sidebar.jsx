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
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Helper – read live pending counts from localStorage
───────────────────────────────────────────────────────────── */
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

    // Ensure non‑negative
    pendingDietitians = Math.max(pendingDietitians, 0);
    pendingChefs = Math.max(pendingChefs, 0);
  } catch (_) {}

  // For complaints, we can read from localStorage if we had a complaints table, but for now use 0
  const openComplaints = 0; // placeholder

  return {
    pendingVerifications: pendingDietitians + pendingChefs,
    openComplaints,
  };
}

/* ─────────────────────────────────────────────────────────────
   NAV STRUCTURE – static, numbers injected from state
───────────────────────────────────────────────────────────── */
const NAV_GROUPS = [
  {
    title: 'Command Center',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, badgeKey: null },
      { href: '/admin/verify-users', label: 'Verification Vault', icon: ShieldCheck, badgeKey: 'pendingVerifications' },
    ],
  },
  {
    title: 'Ecosystem',
    items: [
      { href: '/admin/users?role=patients', label: 'Patients', icon: Users, badgeKey: null },
      { href: '/admin/users?role=dietitians', label: 'Dietitians', icon: Stethoscope, badgeKey: null },
      { href: '/admin/users?role=chefs', label: 'Chefs', icon: ChefHat, badgeKey: null },
    ],
  },
  {
    title: 'Platform Health',
    items: [
      { href: '/admin/complaints', label: 'Safety & Complaints', icon: AlertTriangle, badgeKey: 'openComplaints' },
      { href: '/admin/systemst-status', label: 'Analytics', icon: BarChart3, badgeKey: null },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [liveCounts, setLiveCounts] = useState({ pendingVerifications: 0, openComplaints: 0 });

  // Refresh counts on mount and whenever localStorage might change
  useEffect(() => {
    setLiveCounts(getLiveCounts());
  }, []);

  function handleLogout() {
    localStorage.clear();
    router.push('/login');
  }

  return (
    <aside
      className={`relative bg-white border-r border-surface-100 flex flex-col h-screen sticky top-0 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-surface-100 shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">CC</span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-surface-900 leading-none">CareCuisin</p>
              <p className="text-xs text-surface-400 mt-0.5">Admin Console</p>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_GROUPS.map(group => (
          <div key={group.title}>
            {!collapsed && (
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-2 px-2">{group.title}</p>
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
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={`shrink-0 ${isActive ? 'text-primary-600' : 'text-surface-400 group-hover:text-surface-600'}`} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {badgeCount !== null && badgeCount > 0 && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            item.badgeKey === 'pendingVerifications' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {badgeCount}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && badgeCount !== null && badgeCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: notifications, logout, profile */}
      <div className="px-3 pb-4 pt-3 border-t border-surface-100 space-y-1 shrink-0">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors relative" title="Notifications">
          <Bell size={18} className="shrink-0 text-surface-400" />
          {!collapsed && <span className="flex-1 text-left">Notifications</span>}
          {/* notification badge – keep static for now, later can be dynamic */}
          {!collapsed && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">4</span>}
          {collapsed && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />}
        </button>

        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 hover:bg-red-50 hover:text-red-600 transition-colors group" title="Logout">
          <LogOut size={18} className="shrink-0 text-surface-400 group-hover:text-red-500" />
          {!collapsed && <span>Log out</span>}
        </button>

        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3 mt-1 bg-surface-50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">AD</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-surface-800 truncate">Super Admin</p>
              <p className="text-xs text-surface-400 truncate">Buea HQ</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" title="Online" />
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-2">
            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">AD</div>
          </div>
        )}
      </div>
    </aside>
  );
}