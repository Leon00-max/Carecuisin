'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Plus, Trash2, ChevronRight } from 'lucide-react';
import { saveMealPlan } from '@/lib/mealPlanStore';
import { getCurrentUser } from '@/lib/userStore';

/* ─── Mock patients (replace with API when Supabase wired) ── */
const PATIENTS = [
  { id:'PAT-001', name:'Fru Emmanuel',  condition:'Type 2 Diabetes', location:'Molyko',     allergies:['Shellfish']         },
  { id:'PAT-002', name:'Ngo Beatrice',  condition:'Hypertension',    location:'Mile 17',    allergies:[]                    },
  { id:'PAT-003', name:'Epie Roland',   condition:'Renal Disease',   location:'Checkpoint', allergies:['Peanuts','Shellfish']},
  { id:'PAT-004', name:'Anchang Mary',  condition:'Type 2 Diabetes', location:'Buea Town',  allergies:['Dairy']             },
  { id:'PAT-005', name:'Tambe Julius',  condition:'Hypertension',    location:'Bonduma',    allergies:[]                    },
];

const DAYS        = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const MEAL_TYPES  = ['Breakfast','Lunch','Dinner','Snack'];

const CONDITION_TARGETS = {
  'Type 2 Diabetes': { carbs_g:180, sodium_mg:2300, calories:1800, protein_g:80,  note:'Low glycaemic index. Avoid refined sugars.' },
  'Hypertension':    { carbs_g:250, sodium_mg:1500, calories:2000, protein_g:75,  note:'DASH diet. Strictly limit sodium.'           },
  'Renal Disease':   { carbs_g:200, sodium_mg:1200, calories:1900, protein_g:50,  note:'Low protein and potassium. No phosphate additives.' },
  'General Nutrition':{ carbs_g:300,sodium_mg:2300, calories:2200, protein_g:85,  note:'Balanced macronutrient distribution.'        },
};

const STEPS = ['Select Patient','Build Meals','Clinical Notes','Review & Save'];

function CreatePlanForm() {
  const searchParams    = useSearchParams();
  const router          = useRouter();
  const preselectedId   = searchParams.get('patient') || '';

  const [step,             setStep]             = useState(preselectedId ? 1 : 0);
  const [selectedPatient,  setSelectedPatient]  = useState(
    PATIENTS.find(p => p.id === preselectedId) || null
  );
  const [showClinical, setShowClinical] = useState(true);
  const [loading,      setLoading]      = useState(false);
  const [savedPlanId,  setSavedPlanId]  = useState(null);

  // Public meal plan fields
  const [planTitle, setPlanTitle] = useState('');
  const [planDesc,  setPlanDesc]  = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate,   setEndDate]   = useState('');
  const [meals, setMeals] = useState(
    DAYS.map(day => ({
      day,
      items: [{ type:'Breakfast', description:'', time:'7:00 AM' }]
    }))
  );

  // Clinical notes (private)
  const defaults = selectedPatient
    ? CONDITION_TARGETS[selectedPatient.condition] || CONDITION_TARGETS['General Nutrition']
    : { carbs_g:'', sodium_mg:'', calories:'', protein_g:'', note:'' };

  const [clinicalNote,   setClinicalNote]   = useState(defaults.note || '');
  const [sodiumTarget,   setSodiumTarget]   = useState(String(defaults.sodium_mg || ''));
  const [carbsTarget,    setCarbsTarget]    = useState(String(defaults.carbs_g   || ''));
  const [caloriesTarget, setCaloriesTarget] = useState(String(defaults.calories  || ''));
  const [proteinTarget,  setProteinTarget]  = useState(String(defaults.protein_g || ''));
  const [allergyFlags,   setAllergyFlags]   = useState(selectedPatient?.allergies || []);

  /* ── Meal helpers ── */
  function addMealItem(di) {
    setMeals(prev => {
      const u = [...prev];
      u[di] = { ...u[di], items:[...u[di].items,{type:'Lunch',description:'',time:'12:30 PM'}]};
      return u;
    });
  }

  function updateMealItem(di, ii, field, value) {
    setMeals(prev => {
      const u = JSON.parse(JSON.stringify(prev));
      u[di].items[ii][field] = value;
      return u;
    });
  }

  function removeMealItem(di, ii) {
    setMeals(prev => {
      const u = [...prev];
      u[di] = { ...u[di], items: u[di].items.filter((_,i)=>i!==ii) };
      return u;
    });
  }

  /* ── Save plan ── */
  async function handleSave(andRefer = false) {
    setLoading(true);

    const currentUser = getCurrentUser();
    const dietitianId = currentUser?.id || 'DIETITIAN-DEMO';

    const plan = saveMealPlan({
      patientId:   selectedPatient.id,
      dietitianId,
      title:       planTitle || `${selectedPatient.condition} Plan — ${new Date().toLocaleDateString('en-GB')}`,
      description: planDesc,
      startDate,
      endDate,
      details:     meals,
      status:      'active',
      // _clinical is NEVER sent to chef — stored separately in production
      _clinical: {
        medicalRationale: clinicalNote,
        clinicalTargets: {
          sodium_mg: parseInt(sodiumTarget) || 0,
          carbs_g:   parseInt(carbsTarget)  || 0,
          calories:  parseInt(caloriesTarget) || 0,
          protein_g: parseInt(proteinTarget)  || 0,
        },
        allergyFlags,
      },
    });

    setSavedPlanId(plan.id);
    console.log('Meal plan saved:', plan.id);

    setTimeout(() => {
      setLoading(false);
      if (andRefer) {
        router.push(`/dietitian/refer?patient=${selectedPatient.id}&plan=${plan.id}`);
      }
    }, 600);
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-surface-900">Create Meal Plan</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Public meal instructions for the chef · Private clinical notes for you only
        </p>
      </div>

      {/* Step progress */}
      <div className="bg-white border border-surface-100 rounded-2xl p-5">
        <div className="flex justify-between text-xs font-semibold mb-3">
          <span className="text-primary-600">Step {step+1} of {STEPS.length}</span>
          <span className="text-surface-400">{STEPS[step]}</span>
        </div>
        <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{width:`${progress}%`}}/>
        </div>
        <div className="flex justify-between mt-3">
          {STEPS.map((s,i) => (
            <button key={s} onClick={()=>i<step&&setStep(i)}
              className={`text-xs font-medium transition-colors ${
                i===step?'text-primary-600':i<step?'text-emerald-600 cursor-pointer hover:text-primary-600':'text-surface-300'
              }`}>
              {i<step?'✓ ':''}{s}
            </button>
          ))}
        </div>
      </div>

      {/* ── STEP 0: Select patient ── */}
      {step===0 && (
        <div className="bg-white border border-surface-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-surface-900">Select a Patient</h2>
          <div className="space-y-2">
            {PATIENTS.map(patient=>(
              <button key={patient.id} onClick={()=>setSelectedPatient(patient)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  selectedPatient?.id===patient.id
                    ?'border-primary-500 bg-primary-50'
                    :'border-surface-100 bg-white hover:border-surface-300'
                }`}>
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {patient.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-800">{patient.name}</p>
                  <p className="text-xs text-surface-500">{patient.condition} · {patient.location}</p>
                  {patient.allergies.length>0&&(
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {patient.allergies.map(a=>(
                        <span key={a} className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">⚠ {a}</span>
                      ))}
                    </div>
                  )}
                </div>
                {selectedPatient?.id===patient.id&&<CheckCircle size={18} className="text-primary-500 shrink-0"/>}
              </button>
            ))}
          </div>
          <button onClick={()=>selectedPatient&&setStep(1)} disabled={!selectedPatient}
            className="btn-primary w-full py-3 disabled:opacity-40">
            Continue →
          </button>
        </div>
      )}

      {/* ── STEP 1: Build meals (public) ── */}
      {step===1&&selectedPatient&&(
        <div className="space-y-5">
          {selectedPatient.allergies.length>0&&(
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0"/>
              <p className="text-xs text-red-700 leading-relaxed">
                <strong>Allergy Alert:</strong> {selectedPatient.name} is allergic to{' '}
                <strong>{selectedPatient.allergies.join(', ')}</strong>. Do not include these in any meal.
              </p>
            </div>
          )}

          <div className="bg-white border border-surface-100 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-surface-900">Plan Details</h2>
            <div>
              <label className="form-label">Plan Title</label>
              <input value={planTitle} onChange={e=>setPlanTitle(e.target.value)}
                className="input-medical"
                placeholder={`${selectedPatient.condition} Meal Plan — ${new Date().toLocaleDateString('en-GB')}`}/>
            </div>
            <div>
              <label className="form-label">Brief Description (public)</label>
              <textarea value={planDesc} onChange={e=>setPlanDesc(e.target.value)}
                rows={2} className="input-medical resize-none"
                placeholder="Weekly meal plan designed to support…"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Start Date</label>
                <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="input-medical"/>
              </div>
              <div>
                <label className="form-label">End Date</label>
                <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="input-medical"/>
              </div>
            </div>
          </div>

          {/* Day-by-day meal builder */}
          <div className="space-y-3">
            {meals.map((dayPlan,di)=>(
              <div key={dayPlan.day} className="bg-white border border-surface-100 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-surface-50 border-b border-surface-100">
                  <p className="text-sm font-semibold text-surface-800">{dayPlan.day}</p>
                  <button onClick={()=>addMealItem(di)}
                    className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700">
                    <Plus size={13}/> Add meal
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  {dayPlan.items.map((item,ii)=>(
                    <div key={ii} className="grid grid-cols-12 gap-2 items-start">
                      <select value={item.type} onChange={e=>updateMealItem(di,ii,'type',e.target.value)}
                        className="input-medical col-span-3 text-xs py-2">
                        {MEAL_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                      <input value={item.description} onChange={e=>updateMealItem(di,ii,'description',e.target.value)}
                        className="input-medical col-span-6 text-xs py-2"
                        placeholder="Describe the meal (chef will read this)"/>
                      <input value={item.time} onChange={e=>updateMealItem(di,ii,'time',e.target.value)}
                        className="input-medical col-span-2 text-xs py-2"
                        placeholder="7:00 AM"/>
                      <button onClick={()=>removeMealItem(di,ii)}
                        className="col-span-1 flex items-center justify-center h-10 rounded-lg hover:bg-red-50 text-surface-300 hover:text-red-500 transition-colors">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={()=>setStep(0)} className="btn-outline">← Back</button>
            <button onClick={()=>setStep(2)} className="btn-primary flex-1">Continue to Clinical Notes →</button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Clinical Notes (PRIVATE) ── */}
      {step===2&&(
        <div className="space-y-5">
          <div className="bg-surface-800 rounded-2xl p-5 border border-surface-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center">
                  <Lock size={15} className="text-primary-400"/>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Private Clinical Notes</p>
                  <p className="text-xs text-surface-400">Only you can see this. Never shared with chef or patient.</p>
                </div>
              </div>
              <button onClick={()=>setShowClinical(!showClinical)}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300">
                {showClinical?<EyeOff size={14}/>:<Eye size={14}/>}
                {showClinical?'Hide':'Show'}
              </button>
            </div>

            {showClinical&&(
              <div className="space-y-4 mt-4 pt-4 border-t border-surface-700">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {label:'Sodium limit (mg/day)',key:'sodium',value:sodiumTarget,setter:setSodiumTarget,hint:`Recommended: ${defaults.sodium_mg}mg`},
                    {label:'Carbohydrates (g/day)',key:'carbs', value:carbsTarget, setter:setCarbsTarget, hint:`Recommended: ${defaults.carbs_g}g`},
                    {label:'Calories (kcal/day)',  key:'cal',   value:caloriesTarget,setter:setCaloriesTarget,hint:'Total daily intake'},
                    {label:'Protein (g/day)',      key:'prot',  value:proteinTarget, setter:setProteinTarget, hint:'Based on patient weight'},
                  ].map(({label,key,value,setter,hint})=>(
                    <div key={key}>
                      <label className="block text-xs font-medium text-surface-300 mb-1.5">{label}</label>
                      <input type="number" value={value} onChange={e=>setter(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:border-primary-500"/>
                      <p className="text-xs text-surface-500 mt-1">{hint}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1.5">Allergy Flags</label>
                  <div className="flex flex-wrap gap-2">
                    {['Peanuts','Dairy','Shellfish','Gluten','Eggs','Soy','Tree Nuts'].map(a=>(
                      <button key={a} type="button"
                        onClick={()=>setAllergyFlags(prev=>prev.includes(a)?prev.filter(x=>x!==a):[...prev,a])}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                          allergyFlags.includes(a)
                            ?'border-red-500 bg-red-900/30 text-red-400'
                            :'border-surface-600 bg-surface-700 text-surface-400 hover:border-surface-500'
                        }`}>
                        {allergyFlags.includes(a)?'⚠ ':''}{a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1.5">Medical Rationale</label>
                  <textarea value={clinicalNote} onChange={e=>setClinicalNote(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:border-primary-500 resize-none leading-relaxed"
                    placeholder="e.g. Patient has Stage 2 CKD. Sodium restricted to 1200mg due to elevated creatinine..."/>
                  <p className="text-xs text-surface-500 mt-1">This note is never printed or shared.</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={()=>setStep(1)} className="btn-outline">← Back</button>
            <button onClick={()=>setStep(3)} className="btn-primary flex-1">Review Plan →</button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review + Save ── */}
      {step===3&&selectedPatient&&(
        <div className="space-y-5">
          <div className="bg-white border border-surface-100 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-surface-900">Plan Summary</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-surface-50 rounded-xl p-4">
                <p className="text-xs text-surface-400 mb-1">Patient</p>
                <p className="font-semibold text-surface-800">{selectedPatient.name}</p>
                <p className="text-xs text-surface-500">{selectedPatient.condition}</p>
              </div>
              <div className="bg-surface-50 rounded-xl p-4">
                <p className="text-xs text-surface-400 mb-1">Plan</p>
                <p className="font-semibold text-surface-800 truncate">{planTitle||'Untitled Plan'}</p>
                <p className="text-xs text-surface-500">{startDate} → {endDate}</p>
              </div>
            </div>
            <div className="space-y-2">
              {meals.map(day=>(
                <div key={day.day} className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-50">
                  <span className="text-xs font-medium text-surface-700">{day.day}</span>
                  <span className="text-xs text-surface-400">{day.items.length} meal{day.items.length!==1?'s':''}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-surface-800 rounded-xl px-4 py-3">
              <Lock size={13} className="text-primary-400 shrink-0"/>
              <p className="text-xs text-surface-400">
                Clinical notes saved privately · Na: {sodiumTarget}mg · Carbs: {carbsTarget}g · Kcal: {caloriesTarget}
              </p>
            </div>
            {savedPlanId&&(
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <CheckCircle size={14} className="text-emerald-500"/>
                <p className="text-xs text-emerald-700 font-semibold">Plan saved! ID: {savedPlanId}</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={()=>setStep(2)} className="btn-outline">← Edit</button>
            <button onClick={()=>handleSave(false)} disabled={loading} className="btn-outline">
              {loading?'Saving…':'Save Draft'}
            </button>
            <button onClick={()=>handleSave(true)} disabled={loading}
              className="btn-primary flex items-center gap-1.5 justify-center">
              {loading?'Saving…':<>Save & Refer to Chef <ChevronRight size={14}/></>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreatePlanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-50 flex items-center justify-center"><p className="text-surface-400 text-sm">Loading…</p></div>}>
      <CreatePlanForm/>
    </Suspense>
  );
}