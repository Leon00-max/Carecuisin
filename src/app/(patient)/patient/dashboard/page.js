'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  CalendarClock,
  CheckCircle,
  ChefHat,
  Clock,
  CreditCard,
  GlassWater,
  HeartPulse,
  Search,
  Stethoscope,
  UtensilsCrossed,
  WalletCards,
} from 'lucide-react';
import { getConsultations } from '@/lib/consultationStore';
import { getLatestMealPlanForPatient } from '@/lib/mealPlanStore';
import { searchApprovedDietitians } from '@/lib/professionalSearchStore';
import { getReferralsForPatient } from '@/lib/referralStore';
import { getCurrentUserId, getUserById } from '@/lib/userStore';
import { getWalletSummary } from '@/lib/walletStore';

const WEEK_DAYS = [
  { short: 'Mon', long: 'Monday' },
  { short: 'Tue', long: 'Tuesday' },
  { short: 'Wed', long: 'Wednesday' },
  { short: 'Thu', long: 'Thursday' },
  { short: 'Fri', long: 'Friday' },
  { short: 'Sat', long: 'Saturday' },
  { short: 'Sun', long: 'Sunday' },
];

const FALLBACK_MEAL = {
  type: 'Lunch',
  description: 'Grilled Fish with Plantains & Vegetables',
  time: '12:30 PM',
  kcal: 520,
};

function initials(name) {
  return String(name || 'Care Team')
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function readJson(key) {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
}

function loadPatientConditions(userId) {
  const keyed = readJson(`cc_onboarding_patient_step2_${userId}`);
  const shared = readJson('cc_onboarding_patient_step2');
  const step2 = Object.keys(keyed).length ? keyed : shared;
  return Array.isArray(step2.conditions) ? step2.conditions : [];
}

function normalizeMeal(value, fallbackType = 'Meal') {
  if (!value) return null;
  if (typeof value === 'string') {
    return { type: fallbackType, description: value };
  }

  return {
    type: value.type || fallbackType,
    description: value.description || value.name || value.meal || '',
    time: value.time || value.deliveryTime || value.scheduledFor || '',
    kcal: value.kcal || value.calories || value.energy || null,
    status: value.status || '',
    publicNote: value.publicNote || value.note || '',
  };
}

function mealsFromDay(dayValue) {
  if (!dayValue) return [];
  if (Array.isArray(dayValue)) return dayValue.map(item => normalizeMeal(item)).filter(Boolean);
  if (Array.isArray(dayValue.items)) return dayValue.items.map(item => normalizeMeal(item)).filter(Boolean);
  if (Array.isArray(dayValue.meals)) return dayValue.meals.map(item => normalizeMeal(item)).filter(Boolean);

  if (typeof dayValue === 'object') {
    return Object.entries(dayValue)
      .filter(([, value]) => value && typeof value !== 'boolean')
      .map(([type, value]) => normalizeMeal(value, type.charAt(0).toUpperCase() + type.slice(1)))
      .filter(Boolean);
  }

  return [];
}

function getMealsForDay(plan, dayName) {
  if (!plan) return [];

  if (plan.meals && typeof plan.meals === 'object') {
    const direct = plan.meals[dayName]
      || plan.meals[dayName.toLowerCase()]
      || plan.meals[dayName.slice(0, 3)]
      || plan.meals[dayName.slice(0, 3).toLowerCase()];
    return mealsFromDay(direct);
  }

  const dayEntry = plan.details?.find(day => day.day === dayName);
  return mealsFromDay(dayEntry);
}

function pickHeroMeal(meals, plan) {
  return meals.find(meal => meal.type?.toLowerCase() === 'lunch')
    || meals[0]
    || normalizeMeal(plan?.title, 'Meal')
    || FALLBACK_MEAL;
}

function getLatestReferral(referrals, planId) {
  const sorted = [...referrals].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return sorted.find(ref => ref.mealPlanId === planId) || sorted[0] || null;
}

function purposeFor(condition) {
  const value = String(condition || '').toLowerCase();
  if (value.includes('diabetes') || value.includes('sugar')) return 'Prepared for blood sugar stability.';
  if (value.includes('hypertension') || value.includes('pressure')) return 'Prepared to support steady blood pressure.';
  if (value.includes('kidney') || value.includes('renal')) return 'Prepared with kidney-conscious nutrition in mind.';
  if (value.includes('obesity') || value.includes('weight')) return 'Prepared to support sustainable weight goals.';
  return 'Prescribed by your dietitian for today\'s nutrition.';
}

function nextMealAfter(meals, heroMeal) {
  if (!meals.length) return null;
  const index = meals.findIndex(meal => meal === heroMeal);
  return meals[index + 1] || meals[0];
}

export default function PatientDashboard() {
  const [state, setState] = useState({
    ready: false,
    patient: null,
    plan: null,
    referral: null,
    referrals: [],
    wallet: null,
    consultations: [],
    recommendedDietitians: [],
    conditions: [],
  });

  useEffect(() => {
    const patientId = getCurrentUserId();
    if (!patientId) {
      queueMicrotask(() => {
        setState(prev => ({ ...prev, ready: true }));
      });
      return;
    }

    const patient = getUserById(patientId);
    const plan = getLatestMealPlanForPatient(patientId);
    const referrals = getReferralsForPatient(patientId);
    const patientConditions = loadPatientConditions(patientId);
    const referral = getLatestReferral(referrals, plan?.id);
    const wallet = getWalletSummary(patientId);
    const consultations = getConsultations({ patientId });
    const recommendedDietitians = searchApprovedDietitians({
      condition: patientConditions[0] || '',
    }).slice(0, 3);

    queueMicrotask(() => {
      setState({
        ready: true,
        patient,
        plan,
        referral,
        referrals,
        wallet,
        consultations,
        recommendedDietitians,
        conditions: patientConditions,
      });
    });
  }, []);

  const todayName = useMemo(
    () => new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    []
  );

  const { ready, patient, plan, referral, referrals, wallet, consultations, recommendedDietitians, conditions } = state;
  const todayMeals = useMemo(() => getMealsForDay(plan, todayName), [plan, todayName]);
  const heroMeal = useMemo(() => pickHeroMeal(todayMeals, plan), [todayMeals, plan]);
  const nextMeal = useMemo(() => nextMealAfter(todayMeals, heroMeal), [todayMeals, heroMeal]);

  const hasPlan = Boolean(plan);
  const patientName = patient?.fullName || 'Amara Nkeng';
  const firstName = patientName.split(' ')[0] || 'Amara';
  const dietitian = plan?.dietitianId || referral?.dietitianId
    ? getUserById(plan?.dietitianId || referral?.dietitianId)
    : null;
  const chef = plan?.chefId || referral?.chefId
    ? getUserById(plan?.chefId || referral?.chefId)
    : null;
  const dietitianName = dietitian?.fullName || 'Dr. Ambe Florence';
  const chefName = chef?.fullName || referral?.chefName || 'Chef Amadou';
  const activeCondition = referral?.condition || conditions[0] || '';
  const mealName = hasPlan
    ? (heroMeal.description || plan.title || 'Today\'s prescribed meal')
    : FALLBACK_MEAL.description;
  const calories = Number(heroMeal.kcal) || (hasPlan ? 480 : 520);
  const deliveryText = hasPlan
    ? `Arrives by ${heroMeal.time || nextMeal?.time || '12:30 PM'}`
    : 'Scheduled for today';
  const nextMealText = hasPlan && nextMeal
    ? `${nextMeal.type || 'Meal'} ${nextMeal.time || ''}`.trim()
    : 'Lunch 12:30 PM';
  const purpose = hasPlan
    ? heroMeal.publicNote || purposeFor(activeCondition)
    : 'Your dietitian is preparing your personalized plan. Check back soon.';
  const progress = hasPlan ? 71 : 0;
  const latestConsultation = consultations?.[0] || null;
  const activeReferrals = referrals?.filter(item => !['cancelled', 'expired'].includes(item.status)) || [];

  if (!ready) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-16 rounded-2xl bg-white" />
        <div className="h-96 rounded-2xl border border-surface-100 bg-white" />
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map(item => (
            <div key={item} className="h-20 rounded-2xl border border-surface-100 bg-white" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-sm font-black text-white shadow-sm shadow-primary-200">
            CC
          </div>
          <div>
            <p className="text-sm font-black leading-none text-surface-900">CareCuisin</p>
            <p className="mt-1 text-xs font-semibold text-primary-600">Clinical meals. Real results.</p>
          </div>
        </div>
        <Link
          href="/patient/notifications"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm transition-colors hover:text-primary-600"
          aria-label="Open notifications"
        >
          <Bell size={19} />
        </Link>
      </header>

      <section>
        <p className="text-2xl font-black tracking-tight text-surface-900">Hello, {firstName}</p>
        <p className="mt-1 text-sm text-surface-500">Your health journey is on track.</p>
      </section>

      <section className="card-medical overflow-hidden rounded-2xl border-surface-100 p-0">
        <div
          className="relative h-[210px] bg-cover bg-center sm:h-[280px]"
          style={{ backgroundImage: 'url("/hero-meal-placeholder.jpg")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900/25 to-transparent" />
          <div className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-bold shadow-sm ${
            hasPlan
              ? 'border-success/20 bg-white/95 text-success'
              : 'border-primary-100 bg-white/95 text-primary-700'
          }`}>
            <span className="inline-flex items-center gap-1.5">
              {hasPlan ? 'Prepared' : 'Prescribed'}
              {hasPlan && <CheckCircle size={13} />}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-600">Today&apos;s prescribed meal</p>
              <h1 className="mt-2 text-2xl font-black leading-tight text-surface-900">{mealName}</h1>
              <p className="mt-2 text-sm italic leading-relaxed text-primary-600">{purpose}</p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-surface-100 bg-surface-50 px-3 py-2 text-xs font-semibold text-surface-500">
              <Clock size={14} />
              <span>{deliveryText}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <CarePerson href="/patient/dietitian" icon={Stethoscope} name={dietitianName} label="Verified dietitian" />
            <CarePerson href="/patient/chef" icon={ChefHat} name={chefName} label="Verified chef" />
          </div>
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-surface-900">Meal Plan Progress</h2>
            <p className="mt-1 text-sm text-surface-500">{hasPlan ? 'Week 3 of 8' : 'Plan setup pending'}</p>
          </div>
          <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-bold text-success">
            {progress}%
          </span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-surface-100">
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-surface-500">
          {hasPlan
            ? `Great job, ${firstName}. You are staying consistent.`
            : 'Your dietitian will activate progress tracking when your first plan is ready.'}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MiniCard icon={HeartPulse} label="Calories today" value={`${calories} kcal`} />
        <MiniCard icon={GlassWater} label="Water intake" value="6/8 glasses" />
        <MiniCard icon={UtensilsCrossed} label="Next meal" value={nextMealText} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card-medical rounded-2xl border-surface-100 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <WalletCards size={20} />
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-wider text-surface-400">Your wallet</p>
              <p className="mt-1 text-2xl font-black text-surface-900">
                {Number(wallet?.balance || 0).toLocaleString()} XAF
              </p>
              <p className="mt-2 text-xs text-surface-500">
                Top up, pay dietitians, pay chefs, and track receipts.
              </p>
            </div>
            <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-bold text-success">
              Active
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link href="/patient/payments?type=wallet_topup" className="btn-primary flex items-center justify-center gap-2 rounded-2xl px-3">
              <CreditCard size={16} />
              Top Up
            </Link>
            <Link href="/patient/payments" className="btn-outline flex items-center justify-center rounded-2xl bg-white px-3">
              History
            </Link>
          </div>
        </div>

        <div className="card-medical rounded-2xl border-surface-100 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <CalendarClock size={20} />
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-wider text-surface-400">Consultation</p>
              <p className="mt-1 text-lg font-black text-surface-900">
                {latestConsultation ? latestConsultation.reason : 'Book your dietitian'}
              </p>
              <p className="mt-2 text-xs text-surface-500">
                {latestConsultation
                  ? `${latestConsultation.status} - ${latestConsultation.requestedDateTime || 'time pending'}`
                  : 'Find a verified dietitian and pay for your first review.'}
              </p>
            </div>
            {latestConsultation && (
              <span className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-bold capitalize text-primary-700">
                {latestConsultation.paymentStatus}
              </span>
            )}
          </div>
          <Link href="/patient/consultations" className="btn-outline mt-5 flex items-center justify-center gap-2 rounded-2xl bg-white">
            <Search size={16} />
            Find Dietitian
          </Link>
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-surface-900">Recommended Dietitians</h2>
            <p className="mt-1 text-xs text-surface-500">Approved professionals matched to your condition and booking availability.</p>
          </div>
          <Link href="/patient/consultations" className="text-xs font-black text-primary-600">View all</Link>
        </div>

        {recommendedDietitians.length === 0 ? (
          <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm text-surface-700">
            No approved dietitians are available yet. Ask Admin to approve professional accounts for booking.
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-3">
            {recommendedDietitians.map(dietitianItem => (
              <article key={dietitianItem.id} className="rounded-2xl border border-surface-100 bg-surface-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-primary-700 shadow-sm">
                    {initials(dietitianItem.fullName)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-surface-900">{dietitianItem.fullName}</p>
                    <p className="mt-1 text-xs text-surface-500">{dietitianItem.specialties[0]}</p>
                    <p className="mt-2 text-xs font-bold text-success">
                      {dietitianItem.nextSlot ? `Next: ${dietitianItem.nextSlot.time}` : 'Availability pending'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="font-bold text-surface-500">{dietitianItem.rating} rating</span>
                  <span className="font-black text-surface-900">{dietitianItem.fee.toLocaleString()} XAF</span>
                </div>
                <Link
                  href={`/patient/consultations?dietitian=${encodeURIComponent(dietitianItem.id)}`}
                  className="btn-primary mt-4 flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs"
                >
                  Book
                  <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-surface-900">Chefs Recommended by Your Dietitian</h2>
            <p className="mt-1 text-xs text-surface-500">Book only chefs referred for your care plan.</p>
          </div>
          <Link href="/patient/book-chef" className="text-xs font-black text-primary-600">Book chef</Link>
        </div>

        {activeReferrals.length === 0 ? (
          <div className="rounded-2xl border border-surface-100 bg-surface-50 p-4 text-sm text-surface-500">
            Chef referrals will appear here after your dietitian creates a meal plan and selects suitable chefs.
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {activeReferrals.slice(0, 2).map(item => {
              const referredChef = getUserById(item.chefId);
              return (
                <article key={item.id} className="rounded-2xl border border-surface-100 bg-surface-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-sm">
                      <ChefHat size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-surface-900">{referredChef?.fullName || item.chefName || 'Verified chef'}</p>
                      <p className="mt-1 text-xs text-surface-500">{item.notesForChef || 'Safe preparation instructions shared.'}</p>
                      <span className="mt-3 inline-flex rounded-full border border-success/20 bg-success/10 px-2 py-1 text-[11px] font-bold text-success">
                        Dietitian referred
                      </span>
                    </div>
                  </div>
                  <Link href="/patient/book-chef" className="btn-outline mt-4 flex items-center justify-center rounded-2xl bg-white px-3 py-2 text-xs">
                    View Referral
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-xs leading-relaxed text-primary-700">
        Your dietitian manages your condition. Clinical notes are kept private.
      </section>

      <section>
        <h2 className="mb-2 text-sm font-black text-surface-800">This Week</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {WEEK_DAYS.map((day, index) => {
            const meals = hasPlan ? getMealsForDay(plan, day.long) : [];
            const isToday = day.long === todayName;
            const hasMeals = meals.length > 0;
            const statusClass = !hasMeals
              ? 'bg-surface-200'
              : index < WEEK_DAYS.findIndex(item => item.long === todayName)
              ? 'bg-success'
              : isToday
              ? 'bg-primary-500 ring-4 ring-primary-100'
              : 'bg-primary-200';

            return (
              <Link
                key={day.long}
                href="/patient/meal-plan"
                className={`min-w-[68px] rounded-2xl border bg-white p-3 text-center shadow-sm transition-colors hover:bg-surface-50 ${
                  isToday ? 'border-primary-200' : 'border-surface-100'
                }`}
              >
                <span className="block text-[11px] font-black uppercase tracking-wider text-surface-500">{day.short}</span>
                <span className={`mx-auto mt-3 block h-2.5 w-2.5 rounded-full ${statusClass}`} />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href="/patient/meal-plan" className="btn-primary flex items-center justify-center rounded-2xl">
          View Full Plan
        </Link>
        <Link href="/patient/messages" className="btn-outline flex items-center justify-center rounded-2xl bg-white">
          Message Dietitian
        </Link>
      </section>

      <p className="py-4 text-center text-xs italic text-surface-400">
        Good food is the foundation of good health.
      </p>
    </div>
  );
}

function CarePerson({ href, icon: Icon, name, label }) {
  return (
    <Link
      href={href}
      className="flex min-w-0 items-center gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-3 transition-colors hover:bg-primary-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-black text-primary-700">
        {initials(name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-surface-900">{name}</p>
        <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-success">
          <CheckCircle size={12} />
          {label}
        </div>
      </div>
      <Icon size={17} className="shrink-0 text-primary-500" />
    </Link>
  );
}

function MiniCard({ icon: Icon, label, value }) {
  return (
    <div className="card-medical flex items-center gap-3 rounded-2xl border-surface-100 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-wider text-surface-400">{label}</p>
        <p className="mt-1 truncate text-sm font-black text-surface-900">{value}</p>
      </div>
    </div>
  );
}
