'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ChefHat, MapPin, Send, ShieldCheck, Star, UtensilsCrossed } from 'lucide-react';
import { DIETITIAN_CHEFS } from '@/lib/dietitianPortalData';

export default function DietitianChefProfilePage() {
  const [chefId, setChefId] = useState(DIETITIAN_CHEFS[0].id);

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      setChefId(params.get('chef') || DIETITIAN_CHEFS[0].id);
    });
  }, []);

  const chef = useMemo(() => DIETITIAN_CHEFS.find(item => item.id === chefId) || DIETITIAN_CHEFS[0], [chefId]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header>
        <Link href="/dietitian/refer" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm">
          <ArrowLeft size={19} />
        </Link>
      </header>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary-50 text-2xl font-black text-primary-700 ring-4 ring-primary-100">
            {chef.name.split(' ').map(part => part[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-2xl font-black text-surface-900">{chef.name}</h1>
              <CheckCircle size={18} className="text-success" />
            </div>
            <p className="mt-1 text-sm font-semibold text-surface-500">{chef.kitchen}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-surface-500">
              <MapPin size={14} className="text-primary-500" />
              {chef.location}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Fact icon={Star} label="Rating" value={`${chef.rating} (${chef.reviews})`} />
          <Fact icon={UtensilsCrossed} label="Meals Delivered" value={chef.delivered} />
          <Fact icon={ShieldCheck} label="Status" value={chef.status} />
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <ChefHat size={22} className="text-primary-600" />
        <h2 className="mt-4 text-sm font-black text-surface-900">Suitability</h2>
        <p className="mt-2 text-sm leading-relaxed text-surface-500">
          {chef.specialty}. Suitable for patients requiring careful portions, safe preparation, and verified kitchen handling.
        </p>
      </section>

      <Link href="/dietitian/refer" className="btn-primary flex items-center justify-center gap-2 rounded-2xl">
        <Send size={17} />
        Select for Referral
      </Link>
    </div>
  );
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-surface-100 bg-surface-50 p-4">
      <Icon size={18} className="text-primary-600" />
      <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-surface-400">{label}</p>
      <p className="mt-1 text-sm font-black text-surface-900">{value}</p>
    </div>
  );
}
