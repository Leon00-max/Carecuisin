'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ChefLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    localStorage.clear();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <aside className={`bg-white border-r border-surface-100 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-surface-100 shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">CC</span>
            {!collapsed && <span className="text-sm font-bold text-surface-900">Chef</span>}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)} className="text-surface-400 hover:text-emerald-600">
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/chef/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname === '/chef/dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-surface-600 hover:bg-surface-50'
            }`}
          >
            <LayoutDashboard size={18} />
            {!collapsed && <span>Dashboard</span>}
          </Link>
        </nav>
        <div className="px-3 pb-4 border-t border-surface-100 pt-3">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 hover:bg-red-50 hover:text-red-600">
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