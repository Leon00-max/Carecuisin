import Link from 'next/link';

export default function ReviewLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Top bar with back arrow */}
      <header className="bg-white border-b border-surface-100 py-3 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
            <span className="text-lg">←</span>
            <span className="text-sm font-semibold text-surface-800">
              Back to Home
            </span>
          </Link>
          <div className="text-right">
            <span className="text-xs text-surface-400 block">
              Account Review
            </span>
            <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">
              Verification in Progress
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
