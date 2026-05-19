'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ClipboardList, LogOut, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { clearSession } from '@/lib/userStore';

const NAV = [
  { href:'/chef/dashboard', label:'Dashboard',      icon:Home },
  { href:'/chef/history',   label:'Past Referrals', icon:ClipboardList   },
];

export default function ChefLayout({ children }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const [col, setCol] = useState(false);

  function handleLogout() { clearSession(); router.push('/login'); }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <aside className={`bg-white border-r border-surface-100 flex-col h-screen sticky top-0 transition-all duration-300 hidden sm:flex ${col?'w-20':'w-64'}`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-surface-100 shrink-0">
          <Link href="/chef/dashboard" className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">CC</span>
            {!col&&<div className="min-w-0"><p className="text-sm font-bold text-surface-900 leading-none">CareCuisin</p><p className="text-xs text-emerald-500 mt-0.5">Chef Portal</p></div>}
          </Link>
          <button onClick={()=>setCol(!col)} className="w-6 h-6 rounded-md flex items-center justify-center text-surface-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shrink-0">
            {col?<ChevronRight size={14}/>:<ChevronLeft size={14}/>}
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({href,label,icon:Icon})=>{
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} title={col?label:undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active?'bg-emerald-50 text-emerald-700':'text-surface-600 hover:bg-surface-50 hover:text-surface-900'}`}>
                <Icon size={18} strokeWidth={active?2.5:2} className={`shrink-0 ${active?'text-emerald-600':'text-surface-400'}`}/>
                {!col&&<span className="flex-1 truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-4 pt-3 border-t border-surface-100 space-y-1 shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 hover:bg-surface-50 transition-colors">
            <Bell size={18} className="text-surface-400 shrink-0"/>{!col&&<span>Notifications</span>}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 hover:bg-red-50 hover:text-red-600 transition-colors group">
            <LogOut size={18} className="text-surface-400 group-hover:text-red-500 shrink-0"/>{!col&&<span>Log out</span>}
          </button>
          {!col&&(
            <div className="flex items-center gap-3 px-3 py-3 mt-1 bg-surface-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">CH</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-surface-800 truncate">Chef</p>
                <p className="text-xs text-surface-400 truncate">Buea</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0"/>
            </div>
          )}
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sm:hidden bg-white border-b border-surface-100 px-4 h-14 flex items-center justify-between sticky top-0 z-40">
          <Link href="/chef/dashboard" className="flex items-center gap-2">
            <span className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">CC</span>
            <span className="text-sm font-bold text-surface-900">Chef</span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map(({href,icon:Icon})=>(
              <Link key={href} href={href} className={`p-2 rounded-lg ${pathname.startsWith(href)?'text-emerald-600 bg-emerald-50':'text-surface-400'}`}><Icon size={18}/></Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}