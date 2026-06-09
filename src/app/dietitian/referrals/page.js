'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChefHat, Send } from 'lucide-react';
import { DIETITIAN_REFERRALS, statusTone } from '@/lib/dietitianPortalData';

const TABS = ['All', 'Accepted', 'Pending', 'Declined'];

export default function MyReferralsPage() {
  const [tab, setTab] = useState('All');
  const referrals = DIETITIAN_REFERRALS.filter(item => tab === 'All' || item.status === tab);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2"><Send size={14} /> My Referrals</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Chef Referrals</h1>
        <p className="mt-2 text-sm text-surface-500">Track referral status from sent to delivered.</p>
      </header>

      <section className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(item => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`min-w-[104px] rounded-full border px-4 py-2 text-xs font-black ${
              tab === item ? 'border-primary-200 bg-primary-50 text-primary-700' : 'border-surface-100 bg-white text-surface-500'
            }`}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="space-y-3">
        {referrals.map(item => (
          <Link key={item.id} href={`/dietitian/referral-details?referral=${item.id}`} className="block card-medical rounded-2xl border-surface-100 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <ChefHat size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-surface-900">{item.patient}</p>
                <p className="mt-1 truncate text-xs text-surface-500">{item.meal} - {item.chef}</p>
                <p className="mt-1 text-xs text-surface-400">{item.date}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusTone(item.status)}`}>
                {item.status}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
