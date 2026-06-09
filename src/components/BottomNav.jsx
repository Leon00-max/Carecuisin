'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  UtensilsCrossed,
  TrendingUp,
  MessageSquare,
  User,
  Users,
  ClipboardList,
  Send,
  PackageCheck,
  History,
  LayoutDashboard,
  ShieldCheck,
  Settings,
  ListChecks,
} from 'lucide-react';

const TAB_MAP = {
  patient: [
    { href: '/patient/dashboard', label: 'Today', icon: Home },
    { href: '/patient/meal-plan', label: 'Meals', icon: UtensilsCrossed },
    { href: '/patient/progress', label: 'Progress', icon: TrendingUp },
    { href: '/patient/messages', label: 'Messages', icon: MessageSquare },
    { href: '/patient/profile', label: 'Profile', icon: User },
  ],
  dietitian: [
    { href: '/dietitian/dashboard', label: 'Patients', icon: Users },
    { href: '/dietitian/plans', label: 'Plans', icon: ClipboardList },
    { href: '/dietitian/refer', label: 'Refer', icon: Send },
    { href: '/dietitian/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dietitian/profile', label: 'Profile', icon: User },
  ],
  chef: [
    { href: '/chef/dashboard', label: 'Orders', icon: PackageCheck },
    { href: '/chef/queue', label: 'Queue', icon: ListChecks },
    { href: '/chef/patients', label: 'Patients', icon: Users },
    { href: '/chef/history', label: 'History', icon: History },
    { href: '/chef/profile', label: 'Profile', icon: User },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/verify-users', label: 'Verify', icon: ShieldCheck },
    { href: '/admin/operations', label: 'Operations', icon: ListChecks },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ],
};

function pathnameFromHref(href) {
  return href.split('?')[0];
}

export default function BottomNav({ role = 'patient' }) {
  const pathname = usePathname();
  const tabs = TAB_MAP[role] || TAB_MAP.patient;
  const chefActiveMap = {
    '/chef/order-details': '/chef/dashboard',
    '/chef/delivery-confirmation': '/chef/queue',
    '/chef/patient-assignment': '/chef/patients',
    '/chef/performance': '/chef/profile',
    '/chef/notifications': '/chef/profile',
    '/chef/earnings': '/chef/profile',
  };
  const patientActiveMap = {
    '/patient/consultations': '/patient/profile',
    '/patient/book-chef': '/patient/profile',
    '/patient/payments': '/patient/profile',
    '/patient/payments/receipt': '/patient/profile',
    '/patient/complaints': '/patient/profile',
    '/patient/reports': '/patient/profile',
    '/patient/ratings': '/patient/profile',
    '/patient/chef': '/patient/meal-plan',
    '/patient/dietitian': '/patient/messages',
    '/patient/notifications': '/patient/profile',
    '/patient/meal-detail': '/patient/meal-plan',
    '/patient/plan-review': '/patient/progress',
  };
  const dietitianActiveMap = {
    '/dietitian/patients': '/dietitian/dashboard',
    '/dietitian/consultations': '/dietitian/dashboard',
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
  const adminActiveMap = {
    '/admin/complaints': '/admin/operations',
    '/admin/systemst-status': '/admin/settings',
    '/admin/referral-trends': '/admin/operations',
    '/admin/top-areas': '/admin/operations',
    '/admin/audit-logs': '/admin/settings',
    '/admin/data-export': '/admin/settings',
    '/admin/payments': '/admin/settings',
    '/admin/notifications': '/admin/settings',
    '/admin/roles': '/admin/settings',
  };

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-surface-100 rounded-t-2xl shadow-lg shadow-surface-200/80 pb-[env(safe-area-inset-bottom)]">
      <div className="h-[68px] flex items-center justify-around px-1">
        {tabs.map(({ href, label, icon: Icon }) => {
          const tabPath = pathnameFromHref(href);
          const isFallback = href.includes('?');
          const patientMappedPath = role === 'patient' ? patientActiveMap[pathname] : null;
          const mappedPath = role === 'chef' ? chefActiveMap[pathname] : null;
          const dietitianMappedPath = role === 'dietitian' ? dietitianActiveMap[pathname] : null;
          const adminMappedPath = role === 'admin' ? adminActiveMap[pathname] : null;
          const isActive = !isFallback && (pathname === tabPath || patientMappedPath === tabPath || mappedPath === tabPath || dietitianMappedPath === tabPath || adminMappedPath === tabPath);

          return (
            <Link
              key={`${role}-${label}`}
              href={href}
              className={`min-w-0 flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-primary-600' : 'text-surface-400 hover:text-surface-600'
              }`}
            >
              <span className={`w-9 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                isActive ? 'bg-primary-50 shadow-sm shadow-primary-100' : 'bg-transparent'
              }`}>
                <Icon size={18} />
              </span>
              <span className="w-full max-w-[64px] truncate text-center text-[9px] font-bold leading-none tracking-tight">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
