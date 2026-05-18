'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  UserPlus,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dietitian/dashboard',   label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/dietitian/create-plan', label: 'Create Plan',   icon: ClipboardList },
  { href: '/dietitian/refer',       label: 'Refer to Chef', icon: UserPlus },
];

export default function DietitianLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    localStorage.clear();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* White sidebar – exactly like admin's */}
      <aside
        className={`bg-white border-r border-surface-100 flex flex-col transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-surface-100 shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">CC</span>
            {!collapsed && <span className="text-sm font-bold text-surface-900">Dietitian</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-surface-400 hover:text-primary-600 transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || (item.href !== '/dietitian/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-50'
                }`}
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4 border-t border-surface-100 pt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}