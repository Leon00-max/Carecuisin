import Sidebar from '@/components/admin/Sidebar';
import { Search } from 'lucide-react';

// Inside the header:
<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-surface-100 px-6 py-3 flex items-center justify-between">
          {/* Search (basic, non‑functional) */}
          <div className="relative w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm"><Search /></span>
            <input
              type="text"
              placeholder="Search patients, chefs, referrals…"
              className="w-full bg-surface-50 border border-surface-200 rounded-lg py-2 pl-10 pr-4 text-sm text-surface-700 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Right side tools */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-surface-500 hover:text-primary-600 hover:bg-surface-50 rounded-lg transition-colors">
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="px-4 py-2 bg-primary-500 text-white text-sm font-semibold rounded-lg hover:bg-primary-600 transition-colors">
              Support
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}