'use client';

import {
  CheckCircle,
  Clock,
  CreditCard,
  PackageCheck,
  WalletCards,
} from 'lucide-react';
import { CHEF_TRANSACTIONS } from '@/lib/chefPortalData';

export default function ChefEarningsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2">
          <WalletCards size={14} />
          Earnings
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Chef Earnings</h1>
        <p className="mt-2 text-sm leading-relaxed text-surface-500">
          Payout summaries for completed clinical meal orders.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Summary icon={CreditCard} label="This Week" value="16,000 XAF" detail="Pending payout" tone="primary" />
        <Summary icon={PackageCheck} label="Completed Orders" value="32" detail="Current cycle" tone="success" />
        <Summary icon={Clock} label="Pending Payments" value="4,500 XAF" detail="Awaiting approval" tone="warning" />
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <h2 className="text-sm font-black text-surface-900">Transaction History</h2>
        <div className="mt-4 divide-y divide-surface-100">
          {CHEF_TRANSACTIONS.map(transaction => (
            <div key={`${transaction.label}-${transaction.date}`} className="flex items-center gap-3 py-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                transaction.status === 'Paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}>
                {transaction.status === 'Paid' ? <CheckCircle size={18} /> : <Clock size={18} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-surface-900">{transaction.label}</p>
                <p className="mt-1 text-xs text-surface-500">{transaction.date} - {transaction.status}</p>
              </div>
              <p className="text-sm font-black text-surface-900">{transaction.amount}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Summary({ icon: Icon, label, value, detail, tone }) {
  const toneClass = tone === 'success'
    ? 'border-success/20 bg-success/10 text-success'
    : tone === 'warning'
    ? 'border-warning/20 bg-warning/10 text-warning'
    : 'border-primary-100 bg-primary-50 text-primary-700';

  return (
    <div className="card-medical rounded-2xl border-surface-100 p-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${toneClass}`}>
        <Icon size={21} />
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-wider text-surface-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-surface-900">{value}</p>
      <p className="mt-1 text-xs font-semibold text-surface-500">{detail}</p>
    </div>
  );
}
