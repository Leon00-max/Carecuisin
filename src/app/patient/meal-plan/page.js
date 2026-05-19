'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, Lock, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { getMealPlansForPatient } from '@/lib/mealPlanStore';
import { getCurrentUser } from '@/lib/userStore';

const MEAL_COLORS = {
  Breakfast: { bg:'bg-amber-50',   border:'border-amber-100',   text:'text-amber-700'   },
  Lunch:     { bg:'bg-emerald-50', border:'border-emerald-100', text:'text-emerald-700' },
  Dinner:    { bg:'bg-primary-50', border:'border-primary-100', text:'text-primary-700' },
  Snack:     { bg:'bg-surface-50', border:'border-surface-100', text:'text-surface-500' },
};

const TODAY = new Date().toLocaleDateString('en-US',{weekday:'long'});

/* ── Fallback mock plan when no real plan exists ── */
const MOCK_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((day,i) => ({
  day,
  items: [
    { type:'Breakfast', description: i%2===0?'Oatmeal with sliced bananas and low-fat milk':'Boiled eggs with whole-grain toast', time:'7:00 AM', kcal:310 },
    { type:'Lunch',     description: i%2===0?'Grilled fish, boiled plantains, steamed vegetables':'Brown rice with grilled chicken and garden salad', time:'12:30 PM', kcal:490 },
    { type:'Dinner',    description: i%2===0?'Fish pepper soup with whole-grain crackers':'Vegetable soup with boiled cocoyam', time:'6:30 PM', kcal:380 },
  ],
}));

export default function MealPlanPage() {
  const [plans,       setPlans]       = useState([]);
  const [activePlan,  setActivePlan]  = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    let userPlans = getMealPlansForPatient(user.id);

    // Fallback: check demo patient IDs
    if (userPlans.length === 0) {
      const demoIds = ['PAT-001','PAT-002','PAT-003','PAT-004','PAT-005'];
      for (const id of demoIds) {
        const found = getMealPlansForPatient(id);
        if (found.length > 0) { userPlans = found; break; }
      }
    }

    setPlans(userPlans);

    // Set active plan (most recent active one)
    const active = userPlans.find(p => p.status==='active'||p.status==='referred') || userPlans[0] || null;
    setActivePlan(active);

    // Auto-expand today
    if (active) {
      const todayIndex = (active.details||[]).findIndex(d=>d.day===TODAY);
      setExpandedDay(todayIndex>=0?todayIndex:0);
    } else {
      // Fallback mock — expand today
      const todayIndex = MOCK_DAYS.findIndex(d=>d.day===TODAY);
      setExpandedDay(todayIndex>=0?todayIndex:0);
    }
  }, []);

  const days      = activePlan?.details || MOCK_DAYS;
  const isMock    = !activePlan;
  const todayIdx  = days.findIndex(d=>d.day===TODAY);

  const totalKcalToday = days[todayIdx>=0?todayIdx:0]?.items?.reduce((s,m)=>s+(m.kcal||0),0) || 0;

  return (
    <div className="space-y-7 pb-16 sm:pb-0">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Weekly Meal Plan</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {activePlan
              ? `${activePlan.title} · ${activePlan.startDate||''} – ${activePlan.endDate||''}`
              : 'Demo plan — your dietitian will assign a real plan soon'
            }
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-surface-200 bg-white text-xs font-semibold text-surface-600 hover:bg-surface-50 transition-colors">
          <Download size={13}/> Download PDF
        </button>
      </div>

      {/* No real plan notice */}
      {isMock && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <span className="text-amber-500 text-lg shrink-0">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">Showing demo meal plan</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Your dietitian hasn't created your personalised plan yet. This is a sample of what to expect.
            </p>
          </div>
        </div>
      )}

      {/* Privacy notice */}
      <div className="flex items-start gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
        <Lock size={14} className="text-primary-500 mt-0.5 shrink-0"/>
        <p className="text-xs text-primary-700 leading-relaxed">
          <strong>Your meal plan is clinically prescribed.</strong> Nutritional targets and
          medical rationale are managed privately by your dietitian and are not displayed here.
          Do not modify meals without consulting your dietitian.
        </p>
      </div>

      {/* Today's calorie progress */}
      {totalKcalToday > 0 && (
        <div className="bg-white border border-surface-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-surface-900">Today's Nutrition</h2>
              <p className="text-xs text-surface-400 mt-0.5">{TODAY}</p>
            </div>
            <span className="text-sm font-bold text-primary-600">{totalKcalToday} kcal</span>
          </div>
          <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all duration-700" style={{width:'33%'}}/>
          </div>
          <p className="text-xs text-surface-400 mt-2">Prescribed daily intake for your condition</p>
        </div>
      )}

      {/* Plan selector (if multiple plans) */}
      {plans.length > 1 && (
        <div className="bg-white border border-surface-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-widest mb-3">Your Plans</p>
          <div className="flex flex-wrap gap-2">
            {plans.map(p=>(
              <button key={p.id} onClick={()=>setActivePlan(p)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  activePlan?.id===p.id
                    ?'border-primary-500 bg-primary-50 text-primary-700'
                    :'border-surface-200 text-surface-600 hover:border-surface-300'
                }`}>
                {p.title}
                <span className={`ml-2 capitalize ${p.status==='active'?'text-emerald-500':'text-surface-400'}`}>
                  · {p.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Day accordion */}
      <div className="space-y-3">
        {days.map((dayPlan, i) => {
          const isOpen   = expandedDay === i;
          const isToday  = i === todayIdx;
          const isPast   = i < todayIdx;
          const isFuture = i > todayIdx;
          const totalKcal = (dayPlan.items||[]).reduce((s,m)=>s+(m.kcal||0),0);

          return (
            <div key={dayPlan.day}
              className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                isToday?'border-primary-200 shadow-sm':isPast?'border-emerald-100':'border-surface-100'
              }`}>

              {/* Day header */}
              <button
                onClick={() => setExpandedDay(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isPast?'bg-primary-600 text-white':isToday?'bg-primary-50 border-2 border-primary-500 text-primary-600':isFuture?'bg-surface-50 border border-surface-200 text-surface-300':'bg-surface-100 text-surface-400'
                  }`}>
                    {isPast?<CheckCircle size={14}/>:isToday?<Clock size={13}/>:<span className="text-xs font-bold">{i+1}</span>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-surface-900">{dayPlan.day}</span>
                      {isToday&&<span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full font-medium">Today</span>}
                      {isPast&&<span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Done</span>}
                    </div>
                    <span className="text-xs text-surface-400">
                      {(dayPlan.items||[]).length} meals{totalKcal>0?` · ${totalKcal} kcal`:''}
                    </span>
                  </div>
                </div>
                {isOpen?<ChevronUp size={16} className="text-surface-400 shrink-0"/>:<ChevronDown size={16} className="text-surface-400 shrink-0"/>}
              </button>

              {/* Expanded meals */}
              {isOpen && (
                <div className="px-5 pb-5 space-y-3 border-t border-surface-50">
                  <div className="pt-3"/>
                  {(dayPlan.items||[]).length === 0 ? (
                    <p className="text-sm text-surface-400 italic">No meals scheduled for this day.</p>
                  ) : (
                    (dayPlan.items||[]).map(({ type, description, time, kcal }, j) => {
                      const style = MEAL_COLORS[type] || MEAL_COLORS.Snack;
                      return (
                        <div key={j} className={`flex items-start gap-4 p-4 rounded-xl border ${style.bg} ${style.border}`}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>{type}</span>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                {kcal>0&&<span className="text-xs text-surface-400">{kcal} kcal</span>}
                                <span className="text-xs text-surface-400">{time}</span>
                              </div>
                            </div>
                            <p className="text-sm text-surface-700 leading-relaxed">
                              {description || <span className="italic text-surface-400">No description provided</span>}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="bg-surface-50 border border-surface-100 rounded-xl px-5 py-4 text-xs text-surface-500 leading-relaxed">
        {activePlan
          ? <>Plan <strong>{activePlan.title}</strong> is active. Your dietitian will review and update at your next consultation. If you experience any adverse reaction, report it immediately using the <strong>Report a Problem</strong> button on your dashboard.</>
          : <>This is a sample plan. Once your dietitian creates your personalised plan, it will appear here automatically.</>
        }
      </div>

    </div>
  );
}