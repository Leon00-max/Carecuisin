'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Flame,
  History,
  XCircle,
} from 'lucide-react';
import { CHEF_HISTORY, CHEF_MEAL_IMAGE, orderStatusMeta } from '@/lib/chefPortalData';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'delivered', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function ChefHistoryPage() {
  const [tab, setTab] = useState('all');
  const items = useMemo(() => (
    tab === 'all' ? CHEF_HISTORY : CHEF_HISTORY.filter(item => item.status === tab)
  ), [tab]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2">
          <History size={14} />
          Kitchen archive
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Order History</h1>
        <p className="mt-2 text-sm text-surface-500">Completed and cancelled meal preparation records.</p>
      </header>

      <section className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(item => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`min-w-[112px] rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                active
                  ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                  : 'border-surface-100 bg-white text-surface-500 hover:bg-surface-50'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </section>

      <section className="space-y-3">
        {items.map((item, index) => (
          <HistoryCard key={`${item.meal}-${index}`} item={item} />
        ))}
      </section>
    </div>
  );
}

function HistoryCard({ item }) {
  const meta = orderStatusMeta(item.status);
  const StatusIcon = item.status === 'cancelled' ? XCircle : item.status === 'ready' ? Clock : CheckCircle;

  return (
    <article className="card-medical rounded-2xl border-surface-100 p-4">
      <div className="flex items-center gap-3">
        <div
          className="h-20 w-20 shrink-0 rounded-2xl bg-cover bg-center shadow-sm"
          style={{ backgroundImage: `url("${CHEF_MEAL_IMAGE}")` }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-black text-surface-900">{item.meal}</h2>
          <p className="mt-1 truncate text-xs text-surface-500">{item.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black ${meta.className}`}>
              <StatusIcon size={11} />
              {meta.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-50 px-2 py-1 text-[10px] font-black text-surface-500">
              <CalendarDays size={11} />
              {item.date}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-black text-surface-900">{item.calories}</p>
          <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-surface-400">
            <Flame size={11} />
            kcal
          </p>
        </div>
      </div>
    </article>
  );
}
