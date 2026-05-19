'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stethoscope, ChefHat, MapPin, ShieldCheck, AlertCircle, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { getActivePlanForPatient } from '@/lib/mealPlanStore';
import { getActiveReferralForPatient } from '@/lib/referralStore';
import { getCurrentUser } from '@/lib/userStore';

/* ── Circular progress ring ── */
function ProgressRing({ pct=0, size=140, stroke=10, color='#2563eb', label, sublabel }) {
  const r    = (size/2) - stroke;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct/100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{width:size,height:size}}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{transition:'stroke-dashoffset 1s ease-out'}}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-surface-900">{pct}%</span>
        {label    && <span className="text-xs font-semibold text-surface-600 mt-0.5 text-center leading-tight">{label}</span>}
        {sublabel && <span className="text-xs text-surface-400 text-center leading-tight">{sublabel}</span>}
      </div>
    </div>
  );
}

/* ── 7-day week row ── */
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
function WeekRow({ completedDays=[] }) {
  const today = new Date().getDay();
  const todayIndex = today===0?6:today-1;
  return (
    <div className="flex items-center justify-between gap-2">
      {DAYS.map((day,i) => {
        const done   = completedDays.includes(i);
        const isToday = i===todayIndex;
        const future  = i>todayIndex;
        return (
          <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              done?'bg-primary-600 text-white shadow-sm':isToday?'bg-primary-50 border-2 border-primary-500 text-primary-700':future?'bg-surface-50 border border-surface-200 text-surface-300':'bg-surface-100 text-surface-400'
            }`}>
              {done?<CheckCircle size={14}/>:isToday?'•':day[0]}
            </div>
            <span className={`text-xs font-medium ${isToday?'text-primary-600':'text-surface-400'}`}>{day}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Load patient data from onboarding ── */
function loadPatientData(userId) {
  if (typeof window==='undefined') return null;
  try {
    const s1 = JSON.parse(localStorage.getItem(`cc_onboarding_patient_step1_${userId}`)
            || localStorage.getItem('cc_onboarding_patient_step1') || '{}');
    const s2 = JSON.parse(localStorage.getItem(`cc_onboarding_patient_step2_${userId}`)
            || localStorage.getItem('cc_onboarding_patient_step2') || '{}');
    return {
      name:       s1.fullName    || 'Patient',
      location:   s1.location    || 'Buea',
      condition:  s2.conditions?.[0] || 'General Nutrition',
      conditions: s2.conditions  || [],
      allergies:  s2.allergies   || [],
    };
  } catch (_) { return null; }
}

export default function PatientDashboard() {
  const [patient,   setPatient]   = useState(null);
  const [plan,      setPlan]      = useState(null);
  const [referral,  setReferral]  = useState(null);
  const [mealsDone, setMealsDone] = useState(0);

  const completedDays = [0,1,2,3,4]; // Mon–Fri done this week (mock)

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    const info = loadPatientData(user.id);
    setPatient(info);

    // Load real meal plan if one exists
    const activePlan = getActivePlanForPatient(user.id);
    // Fallback: try demo patient IDs for testing
    const demoIds = ['PAT-001','PAT-002','PAT-003','PAT-004','PAT-005'];
    let foundPlan = activePlan;
    if (!foundPlan) {
      for (const id of demoIds) {
        foundPlan = getActivePlanForPatient(id);
        if (foundPlan) break;
      }
    }
    setPlan(foundPlan);

    // Load referral
    const activeRef = getActiveReferralForPatient(user.id)
      || (['PAT-001','PAT-002','PAT-003'].map(getActiveReferralForPatient).find(Boolean));
    setReferral(activeRef);

  }, []);

  if (!patient) return null;

  const firstName        = patient.name.split(' ')[0];
  const mealCompletionPct = plan ? Math.round((completedDays.length/7)*100) : 0;
  const planAdherencePct  = plan ? 85 : 0;
  const hydrationPct      = 60;

  // Get today's meals from real plan
  const today    = new Date().toLocaleDateString('en-US',{weekday:'long'});
  const todayMeals = plan?.details?.find(d => d.day === today)?.items || [];

  const referralStatus = referral?.status || 'none';
  const statusLabels = {
    none:     { label:'Not yet referred',  color:'text-surface-400',  bg:'bg-surface-50',   icon: Clock        },
    pending:  { label:'Referral pending',  color:'text-amber-600',    bg:'bg-amber-50',     icon: Clock        },
    accepted: { label:'Chef assigned',     color:'text-emerald-600',  bg:'bg-emerald-50',   icon: CheckCircle  },
    prepared: { label:'Meal prepared ✓',   color:'text-primary-600',  bg:'bg-primary-50',   icon: CheckCircle  },
    declined: { label:'Chef declined',     color:'text-red-500',      bg:'bg-red-50',       icon: AlertCircle  },
  };
  const refCfg = statusLabels[referralStatus] || statusLabels.none;
  const RefIcon = refCfg.icon;

  return (
    <div className="space-y-7 pb-16 sm:pb-0">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <span className="badge-clinical mb-3 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"/>
            Patient Portal
          </span>
          <h1 className="text-2xl font-bold text-surface-900">
            Welcome back, <span className="text-primary-600">{firstName}</span>
          </h1>
          <p className="text-sm text-surface-500 mt-1 flex items-center gap-1.5">
            <MapPin size={12}/>{patient.location} · {patient.condition}
          </p>
        </div>
        <Link href="/patient/meal-plan" className="btn-primary text-sm">
          View Meal Plan
        </Link>
      </div>

      {/* Progress rings + clinical info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        {/* Progress rings */}
        <div className="bg-white border border-surface-100 rounded-2xl p-6 flex flex-col items-center gap-5">
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-widest self-start">Weekly Progress</p>
          <ProgressRing pct={mealCompletionPct} size={140} stroke={10} color="#2563eb"
            label="Meals Done" sublabel="this week"/>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <ProgressRing pct={planAdherencePct} size={72} stroke={7} color="#10b981"/>
              <span className="text-xs text-surface-500 font-medium">Adherence</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ProgressRing pct={hydrationPct} size={72} stroke={7} color="#f59e0b"/>
              <span className="text-xs text-surface-500 font-medium">Hydration</span>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">

          <div className="card-medical !p-5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center mb-3">
              <ShieldCheck size={15} className="text-primary-600"/>
            </div>
            <p className="text-xs text-surface-400 font-medium uppercase tracking-widest mb-1">Condition</p>
            <p className="text-sm font-bold text-surface-900 leading-snug">{patient.condition}</p>
            {patient.conditions.length>1&&<p className="text-xs text-surface-400 mt-1">+{patient.conditions.length-1} more</p>}
          </div>

          <div className="card-medical !p-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
              <Stethoscope size={15} className="text-emerald-600"/>
            </div>
            <p className="text-xs text-surface-400 font-medium uppercase tracking-widest mb-1">Meal Plan</p>
            <p className="text-sm font-bold text-surface-900 leading-snug">
              {plan ? plan.title : 'No plan yet'}
            </p>
            {plan && (
              <span className="mt-1 inline-block text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium capitalize">
                {plan.status}
              </span>
            )}
          </div>

          <div className={`card-medical !p-5 ${referralStatus==='accepted'||referralStatus==='prepared'?'border-emerald-200 bg-emerald-50/30':''}`}>
            <div className={`w-8 h-8 rounded-lg ${refCfg.bg} flex items-center justify-center mb-3`}>
              <ChefHat size={15} className={refCfg.color}/>
            </div>
            <p className="text-xs text-surface-400 font-medium uppercase tracking-widest mb-1">Chef</p>
            <p className="text-sm font-bold text-surface-900 leading-snug">
              {referral?.chefName || 'Not yet assigned'}
            </p>
            <span className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${refCfg.bg} ${refCfg.color}`}>
              <RefIcon size={10}/>{refCfg.label}
            </span>
          </div>

          <div className="card-medical !p-5">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mb-3">
              <AlertCircle size={15} className="text-red-500"/>
            </div>
            <p className="text-xs text-surface-400 font-medium uppercase tracking-widest mb-1">Allergies</p>
            {patient.allergies.length>0?(
              <div className="flex flex-wrap gap-1 mt-1">
                {patient.allergies.slice(0,2).map(a=>(
                  <span key={a} className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-medium">{a}</span>
                ))}
              </div>
            ):(
              <p className="text-sm font-semibold text-emerald-600">None recorded</p>
            )}
          </div>

        </div>
      </div>

      {/* 7-day tracker */}
      <div className="bg-white border border-surface-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-surface-900">This Week's Compliance</h2>
            <p className="text-xs text-surface-400 mt-0.5">{completedDays.length} of 7 days completed</p>
          </div>
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            {Math.round((completedDays.length/7)*100)}% on track
          </span>
        </div>
        <WeekRow completedDays={completedDays}/>
      </div>

      {/* Today's meals */}
      <div className="bg-white border border-surface-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-surface-900">Today's Meals</h2>
            <p className="text-xs text-surface-400 mt-0.5">
              {plan ? `From: ${plan.title}` : 'No meal plan assigned yet'}
            </p>
          </div>
          <Link href="/patient/meal-plan"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            Full week <ChevronRight size={12}/>
          </Link>
        </div>

        {todayMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {todayMeals.map(({ type, description, time }, i) => (
              <div key={i} className={`rounded-xl p-4 border ${
                type==='Breakfast'?'bg-amber-50 border-amber-100':
                type==='Lunch'    ?'bg-emerald-50 border-emerald-100':
                'bg-primary-50 border-primary-100'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    type==='Breakfast'?'text-amber-700':type==='Lunch'?'text-emerald-700':'text-primary-700'
                  }`}>{type}</span>
                  <Clock size={13} className="text-surface-300"/>
                </div>
                <p className="text-sm text-surface-700 leading-relaxed mb-1">{description || 'No description'}</p>
                <p className="text-xs text-surface-400">{time}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-surface-50 rounded-xl border border-surface-100">
            {plan
              ? <p className="text-sm text-surface-500">No meals scheduled for today ({today})</p>
              : (
                <>
                  <p className="text-sm font-semibold text-surface-700 mb-1">No meal plan yet</p>
                  <p className="text-xs text-surface-400">Your dietitian will create a personalised plan for you.</p>
                </>
              )
            }
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/patient/meal-plan" className="btn-primary">Full Weekly Schedule</Link>
        <button onClick={()=>alert('Complaint feature coming soon.')} className="btn-outline">Report a Problem</button>
      </div>

    </div>
  );
}