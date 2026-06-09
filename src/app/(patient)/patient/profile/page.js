'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Bell,
  CalendarClock,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  CreditCard,
  ChefHat,
  FileCheck2,
  HeartPulse,
  HelpCircle,
  Languages,
  LogOut,
  MapPin,
  MessageSquare,
  Settings,
  ShieldCheck,
  Star,
  Stethoscope,
  UtensilsCrossed,
  User,
} from 'lucide-react';
import { getLatestMealPlanForPatient } from '@/lib/mealPlanStore';
import { getReferralsForPatient } from '@/lib/referralStore';
import { clearSession, getCurrentUserId, getUserById } from '@/lib/userStore';

function readJson(key) {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
}

function loadOnboarding(userId) {
  const step1 = readJson(`cc_onboarding_patient_step1_${userId}`);
  const step2 = readJson(`cc_onboarding_patient_step2_${userId}`);
  const step3 = readJson(`cc_onboarding_patient_step3_${userId}`);

  return {
    step1: Object.keys(step1).length ? step1 : readJson('cc_onboarding_patient_step1'),
    step2: Object.keys(step2).length ? step2 : readJson('cc_onboarding_patient_step2'),
    step3: Object.keys(step3).length ? step3 : readJson('cc_onboarding_patient_step3'),
  };
}

function latestReferral(referrals, planId) {
  const sorted = [...referrals].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return sorted.find(ref => ref.mealPlanId === planId) || sorted[0] || null;
}

function initials(name) {
  return String(name || 'Amara Nkeng')
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const userId = getCurrentUserId();
    const user = userId ? getUserById(userId) : null;
    const plan = userId ? getLatestMealPlanForPatient(userId) : null;
    const referral = userId ? latestReferral(getReferralsForPatient(userId), plan?.id) : null;
    const dietitian = plan?.dietitianId || referral?.dietitianId
      ? getUserById(plan?.dietitianId || referral?.dietitianId)
      : null;

    queueMicrotask(() => {
      setData({
        user,
        plan,
        referral,
        dietitian,
        ...loadOnboarding(userId),
      });
    });
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push('/auth/login');
  };

  if (!data) {
    return <ProfileSkeleton />;
  }

  const { user, plan, step1, step2, step3, dietitian } = data;
  const fullName = step1.fullName || user?.fullName || 'Amara Nkeng';
  const location = step1.location || user?.location || 'Buea, Cameroon';
  const email = user?.email || step1.email || 'amara@carecuisin.local';
  const phone = step1.phone || user?.phone || 'Not provided';
  const conditions = Array.isArray(step2.conditions) && step2.conditions.length
    ? step2.conditions
    : ['General wellness'];
  const allergies = Array.isArray(step2.allergies)
    ? step2.allergies.filter(item => item && item !== 'None')
    : [];
  const preference = step3.dietaryPreference || 'Clinical balanced meals';
  const language = step1.language || step3.language || 'English';
  const dietitianName = dietitian?.fullName || 'Dr. Ambe Florence';

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-50 text-2xl font-black text-primary-700 ring-4 ring-primary-100">
              {initials(fullName)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wider text-surface-400">Patient</p>
              <h1 className="mt-1 truncate text-2xl font-black text-surface-900">{fullName}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-surface-500">
                <MapPin size={14} className="text-primary-500" />
                {location}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-black text-success">
                <CheckCircle size={13} />
                {plan ? 'Active Plan' : 'Plan Pending'}
              </span>
            </div>
          </div>

          <Link
            href="/patient/notifications"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-surface-100 bg-surface-50 text-surface-500 transition-colors hover:text-primary-600"
            aria-label="Profile settings"
          >
            <Settings size={19} />
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard icon={ShieldCheck} label="Primary condition" value={conditions[0]} />
        <SummaryCard icon={UtensilsCrossed} label="Preference" value={preference} />
        <SummaryCard icon={Languages} label="Language" value={language} />
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-4">
        <div className="flex items-center justify-between gap-3 border-b border-surface-100 pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <Stethoscope size={21} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wider text-surface-400">Assigned dietitian</p>
              <p className="truncate text-sm font-black text-surface-900">{dietitianName}</p>
            </div>
          </div>
          <Link href="/patient/messages" className="btn-outline flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-4">
            <MessageSquare size={16} />
            Message
          </Link>
        </div>

        <div className="mt-3 divide-y divide-surface-100">
          <MenuRow icon={User} label="Personal Information" detail={email} />
          <MenuRow icon={HeartPulse} label="Health Profile" detail={conditions.join(', ')} />
          <MenuRow icon={CalendarClock} label="Consultations" detail="Book and track dietitian visits" href="/patient/consultations" />
          <MenuRow icon={ClipboardList} label="Medical History" detail="Care records and reviews" />
          <MenuRow icon={UtensilsCrossed} label="Dietary Preferences" detail={preference} />
          <MenuRow
            icon={AlertTriangle}
            label="Allergies & Restrictions"
            detail={allergies.length ? allergies.join(', ') : 'No allergies recorded'}
          />
          <MenuRow icon={ChefHat} label="Referred Chef Booking" detail="Book a dietitian-referred chef" href="/patient/book-chef" />
          <MenuRow icon={CreditCard} label="Payments and Receipts" detail="MoMo, Orange, and card records" href="/patient/payments" />
          <MenuRow icon={FileCheck2} label="Reports" detail="Verified care reports and QR checks" href="/patient/reports" />
          <MenuRow icon={Star} label="Ratings and Feedback" detail="Rate dietitians and chefs" href="/patient/ratings" />
          <MenuRow icon={MapPin} label="Addresses" detail={location} />
          <MenuRow icon={Bell} label="Notifications" detail="Meal, delivery, and care alerts" href="/patient/notifications" />
          <MenuRow icon={HelpCircle} label="Help & Support" detail={phone} href="/patient/complaints" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-2 py-4 text-left text-alert transition-colors hover:bg-alert/10"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-alert/20 bg-alert/10">
              <LogOut size={17} />
            </span>
            <span className="flex-1 text-sm font-black">Log Out</span>
            <LogOut size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="card-medical rounded-2xl border-surface-100 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        <Icon size={19} />
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-surface-400">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-surface-900">{value}</p>
    </div>
  );
}

function MenuRow({ icon: Icon, label, detail, href }) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-50 text-primary-600">
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-black text-surface-900">{label}</span>
        <span className="block truncate text-xs text-surface-500">{detail}</span>
      </span>
      <ChevronRight size={17} className="text-surface-400" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center gap-3 px-2 py-4 transition-colors hover:bg-surface-50">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className="flex w-full items-center gap-3 px-2 py-4 text-left transition-colors hover:bg-surface-50">
      {content}
    </button>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-32 rounded-2xl border border-surface-100 bg-white" />
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map(item => (
          <div key={item} className="h-28 rounded-2xl border border-surface-100 bg-white" />
        ))}
      </div>
      <div className="h-96 rounded-2xl border border-surface-100 bg-white" />
    </div>
  );
}
