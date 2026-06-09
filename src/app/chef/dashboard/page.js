'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle,
  ChefHat,
  Clock,
  ClipboardCheck,
  Flame,
  PackageCheck,
  ShieldCheck,
  Stethoscope,
  Timer,
  UserRound,
} from 'lucide-react';
import { CHEF_MEAL_IMAGE, CHEF_ORDERS, CHEF_OVERVIEW } from '@/lib/chefPortalData';
import { getReferralsForChef } from '@/lib/referralStore';
import { getMealPlanForChef } from '@/lib/mealPlanStore';
import { getCurrentUser } from '@/lib/userStore';

function initials(name) {
  return String(name || 'Patient')
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function metricTone(tone) {
  if (tone === 'success') return 'border-success/20 bg-success/10 text-success';
  if (tone === 'warning') return 'border-warning/20 bg-warning/10 text-warning';
  if (tone === 'surface') return 'border-surface-100 bg-surface-50 text-surface-600';
  return 'border-primary-100 bg-primary-50 text-primary-700';
}

function mealFromPlan(plan) {
  const firstDay = plan?.details?.find(day => day.items?.length);
  const firstMeal = firstDay?.items?.[0];
  return {
    name: firstMeal?.description || plan?.title || 'Dietitian-prescribed meal',
    calories: Number(firstMeal?.kcal || 520),
    time: firstMeal?.time || '12:30 PM',
  };
}

function orderFromReferral(referral) {
  const plan = referral.mealPlanId ? getMealPlanForChef(referral.mealPlanId) : null;
  const meal = mealFromPlan(plan);

  return {
    id: referral.id,
    patientName: referral.patientName || `Patient ${referral.patientId || ''}`.trim(),
    patientRef: referral.patientId || 'Protected',
    sex: 'Protected',
    age: 'Protected',
    condition: referral.condition || 'Dietitian-approved plan',
    meal: meal.name,
    description: referral.notesForChef || 'Follow approved preparation instructions.',
    calories: meal.calories,
    due: meal.time,
    dueLabel: referral.status === 'prepared' ? 'Ready for pickup' : 'Due today',
    status: referral.status === 'prepared' ? 'ready' : 'preparing',
    stage: referral.status === 'prepared' ? 4 : 2,
    totalStages: 4,
  };
}

export default function ChefDashboard() {
  const [orders, setOrders] = useState(CHEF_ORDERS);
  const [chefName, setChefName] = useState('Chef Kwame');

  useEffect(() => {
    queueMicrotask(() => {
      const chef = getCurrentUser();
      const referrals = chef?.id ? getReferralsForChef(chef.id) : [];
      setChefName(chef?.fullName || 'Chef Kwame');
      setOrders(referrals.length ? referrals.map(orderFromReferral) : CHEF_ORDERS);
    });
  }, []);

  const firstName = chefName.split(' ')[0] || 'Chef';
  const overview = useMemo(() => {
    const active = orders.length;
    const preparing = orders.filter(order => order.status === 'preparing').length;
    const ready = orders.filter(order => order.status === 'ready').length;
    return [
      { ...CHEF_OVERVIEW[0], value: active },
      { ...CHEF_OVERVIEW[1], value: preparing },
      { ...CHEF_OVERVIEW[2], value: ready },
      CHEF_OVERVIEW[3],
    ];
  }, [orders]);
  const nextOrder = orders.find(order => order.status === 'preparing') || orders[0] || CHEF_ORDERS[0];

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-sm font-black text-white shadow-sm shadow-primary-200">
            CC
          </div>
          <div>
            <p className="text-sm font-black leading-none text-surface-900">CareCuisin</p>
            <p className="mt-1 text-xs font-semibold text-primary-600">Clinical kitchen command</p>
          </div>
        </div>
        <Link
          href="/chef/notifications"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm transition-colors hover:text-primary-600"
          aria-label="Open notifications"
        >
          <Bell size={19} />
        </Link>
      </header>

      <section>
        <p className="text-2xl font-black tracking-tight text-surface-900">Hello, {firstName}</p>
        <p className="mt-1 text-sm text-surface-500">Here&apos;s your kitchen overview.</p>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-black text-surface-900">Today&apos;s Overview</h1>
            <p className="mt-1 text-xs text-surface-500">Clinical meal preparation activity.</p>
          </div>
          <span className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">
            Today
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {overview.map(item => (
            <div key={item.label} className={`rounded-2xl border p-4 ${metricTone(item.tone)}`}>
              <p className="text-2xl font-black">{item.value}</p>
              <p className="mt-1 text-xs font-bold text-surface-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-medical overflow-hidden rounded-2xl border-primary-100 p-0 shadow-sm shadow-primary-100">
        <div className="border-b border-surface-100 bg-primary-50 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Timer size={17} className="text-primary-600" />
              <h2 className="text-sm font-black text-surface-900">Next Order to Prepare</h2>
            </div>
            <span className="rounded-full border border-warning/20 bg-warning/10 px-3 py-1 text-xs font-black text-warning">
              {nextOrder.dueLabel}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-black text-primary-700">
              {initials(nextOrder.patientName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-surface-900">{nextOrder.patientName}</p>
              <p className="mt-1 text-xs text-surface-500">
                {nextOrder.sex} {nextOrder.age !== 'Protected' ? `- ${nextOrder.age} years` : '- Protected profile'}
              </p>
            </div>
            <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-black text-success">
              Active Plan
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center">
            <div
              className="h-36 rounded-2xl bg-cover bg-center shadow-sm sm:h-28"
              style={{ backgroundImage: `url("${CHEF_MEAL_IMAGE}")` }}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <h3 className="text-lg font-black leading-tight text-surface-900">{nextOrder.meal}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-surface-500">{nextOrder.description}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-surface-500">
                <span className="inline-flex items-center gap-1">
                  <Flame size={13} className="text-primary-500" />
                  {nextOrder.calories} kcal
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={13} className="text-primary-500" />
                  Due {nextOrder.due}
                </span>
              </div>
            </div>
          </div>

          <Link href={`/chef/order-details?order=${encodeURIComponent(nextOrder.id)}`} className="btn-primary mt-5 flex w-full items-center justify-center gap-2 rounded-2xl">
            <ClipboardCheck size={17} />
            View Order Details
          </Link>
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-black text-surface-900">Recent Activity</h2>
          <Link href="/chef/history" className="text-xs font-bold text-primary-600">View All</Link>
        </div>
        <div className="space-y-3">
          <ActivityRow icon={CheckCircle} title="Grilled Fish" detail="Marked as Delivered" time="10:30 AM" tone="success" />
          <ActivityRow icon={ChefHat} title="Achu Soup" detail="Marked as Ready" time="9:15 AM" tone="warning" />
          <ActivityRow icon={ShieldCheck} title="Dietitian update" detail="Instructions reviewed" time="8:40 AM" tone="primary" />
        </div>
      </section>

      <section className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
        <div className="flex items-start gap-3">
          <Stethoscope size={18} className="mt-0.5 shrink-0 text-primary-600" />
          <p className="text-xs leading-relaxed text-primary-700">
            You are part of a clinical care workflow. Prepare only from approved dietitian instructions and protect patient privacy.
          </p>
        </div>
      </section>
    </div>
  );
}

function ActivityRow({ icon: Icon, title, detail, time, tone }) {
  const toneClass = tone === 'success'
    ? 'bg-success/10 text-success'
    : tone === 'warning'
    ? 'bg-warning/10 text-warning'
    : 'bg-primary-50 text-primary-600';

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${toneClass}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-surface-900">{title}</p>
        <p className="mt-0.5 text-xs text-surface-500">{detail}</p>
      </div>
      <span className="text-xs font-semibold text-surface-400">{time}</span>
    </div>
  );
}
