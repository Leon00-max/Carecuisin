'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  CalendarDays,
  ClipboardList,
  CreditCard,
  LogOut,
  MessageSquare,
  Send,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { clearSession, getCurrentUser } from '@/lib/userStore';

const MAIN_NAV = [
  { href: '/dietitian/dashboard', label: 'Patients', icon: Users },
  { href: '/dietitian/plans', label: 'Plans', icon: ClipboardList },
  { href: '/dietitian/refer', label: 'Refer', icon: Send },
  { href: '/dietitian/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dietitian/profile', label: 'Profile', icon: User },
];

const SUPPORT_NAV = [
  { href: '/dietitian/notifications', label: 'Notifications', icon: Bell },
  { href: '/dietitian/availability', label: 'Availability', icon: CalendarDays },
  { href: '/dietitian/progress', label: 'Progress Overview', icon: Stethoscope },
  { href: '/dietitian/referrals', label: 'My Referrals', icon: Send },
  { href: '/dietitian/profile', label: 'Earnings', icon: CreditCard },
];

const ACTIVE_MAP = {
  '/dietitian/patients': '/dietitian/dashboard',
  '/dietitian/patient-overview': '/dietitian/dashboard',
  '/dietitian/medical-summary': '/dietitian/dashboard',
  '/dietitian/plan-review-history': '/dietitian/plans',
  '/dietitian/create-plan': '/dietitian/plans',
  '/dietitian/chef-profile': '/dietitian/refer',
  '/dietitian/referral-details': '/dietitian/refer',
  '/dietitian/referrals': '/dietitian/refer',
  '/dietitian/progress': '/dietitian/profile',
  '/dietitian/availability': '/dietitian/profile',
  '/dietitian/notifications': '/dietitian/profile',
};

export default function DietitianLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dietitian, setDietitian] = useState(null);

  useEffect(() => {
    queueMicrotask(() => {
      setDietitian(getCurrentUser());
    });
  }, []);

  const name = dietitian?.fullName || 'Dr. Ambe Florence';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AF';

  const handleLogout = () => {
    clearSession();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-surface-50 text-surface-800">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-surface-100 bg-white/90 p-6 md:flex">
          <div className="space-y-8">
            <Link href="/dietitian/dashboard" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-sm font-black text-white shadow-sm shadow-primary-200">
                CC
              </span>
              <div>
                <p className="text-sm font-black leading-none text-surface-900">CareCuisin</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-primary-600">
                  Dietitian OS
                </p>
              </div>
            </Link>

            <div className="card-medical rounded-2xl border-surface-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-sm font-black text-primary-700">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-surface-900">{name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success ring-4 ring-success/10" />
                    Verified dietitian
                  </p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {MAIN_NAV.map(item => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>

            <div className="border-t border-surface-100 pt-5">
              <p className="px-4 text-[10px] font-black uppercase tracking-wider text-surface-400">
                Practice tools
              </p>
              <nav className="mt-3 space-y-1">
                {SUPPORT_NAV.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-surface-500 transition-colors hover:bg-surface-50 hover:text-surface-900"
                    >
                      <Icon size={18} className="text-surface-400" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="space-y-4 border-t border-surface-100 pt-5">
            <div className="rounded-2xl border border-success/20 bg-success/10 p-4">
              <div className="flex items-center gap-2 text-xs font-black text-success">
                <ShieldCheck size={15} />
                Clinical authority
              </div>
              <p className="mt-2 text-xs leading-relaxed text-surface-500">
                Patients see public nutrition guidance. Chefs receive preparation-safe instructions.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-surface-500 transition-colors hover:bg-alert/10 hover:text-alert"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto p-4 pb-24 md:p-8">
          {children}
        </main>
      </div>

      <BottomNav role="dietitian" />
    </div>
  );
}

function NavLink({ item, pathname }) {
  const activePath = ACTIVE_MAP[pathname] || pathname;
  const active = activePath === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
        active
          ? 'bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
          : 'text-surface-500 hover:bg-surface-50 hover:text-surface-900'
      }`}
    >
      <Icon size={18} className={active ? 'text-primary-600' : 'text-surface-400'} />
      <span>{item.label}</span>
      {active && <span className="ml-auto h-2 w-2 rounded-full bg-primary-500 ring-4 ring-primary-100" />}
    </Link>
  );
}
