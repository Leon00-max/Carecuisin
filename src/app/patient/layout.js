import Link from 'next/link';
import { HomeIcon, UtensilsCrossed, AlertCircle, LogOut } from 'lucide-react';

const NAV = [
  { href: '/patient/dashboard', label: 'Home',  icon: HomeIcon },
  { href: '/patient/meal-plan', label: 'Meal Plan',  icon: UtensilsCrossed },
  { href: '/patient/complaints',label: 'Complaints', icon: AlertCircle     },
];

export default function PatientLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">

      {/* Top nav bar */}
      <header className="bg-white border-b border-surface-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/patient/dashboard" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              CC
            </span>
            <span className="text-sm font-bold text-surface-900">
              Care<span className="text-primary-600">Cuisin</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Profile + logout */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
              P
            </div>
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-surface-500 hover:text-surface-700 transition-colors"
            >
              <LogOut size={13} />
              Log out
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-surface-100 flex z-40">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-surface-500 hover:text-primary-600 transition-colors"
          >
            <Icon size={18} />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </nav>

    </div>
  );
}