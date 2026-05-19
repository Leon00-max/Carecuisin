'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, MapPin, Star, CheckCircle, ChefHat, Clock, Send, ArrowLeft, Info } from 'lucide-react';
import { createReferral } from '@/lib/referralStore';
import { getMealPlansForDietitian, updateMealPlanStatus } from '@/lib/mealPlanStore';
import { getCurrentUser } from '@/lib/userStore';

/* ─── Mock data ─── */
const PATIENTS = [
  { id:'PAT-001', name:'Fru Emmanuel',  condition:'Type 2 Diabetes', location:'Molyko'     },
  { id:'PAT-002', name:'Ngo Beatrice',  condition:'Hypertension',    location:'Mile 17'    },
  { id:'PAT-003', name:'Epie Roland',   condition:'Renal Disease',   location:'Checkpoint' },
  { id:'PAT-004', name:'Anchang Mary',  condition:'Type 2 Diabetes', location:'Buea Town'  },
  { id:'PAT-005', name:'Tambe Julius',  condition:'Hypertension',    location:'Bonduma'    },
];

const CHEFS = [
  { id:'CHF-001', name:'Chef Nkemdirim Grace', area:'Molyko',     serviceRadius:['Molyko','Checkpoint','Bonduma'],  experience:5, canFollowMedicalPlans:true,  specializations:['Type 2 Diabetes','Hypertension','Renal Disease'], referralsCompleted:24, rating:4.9, available:true,  phone:'677 234 567', bio:'Specialised in low-sodium and diabetic-friendly cooking. Trained at Buea Regional Hospital nutrition workshops.' },
  { id:'CHF-002', name:'Chef Mbah Collins',     area:'Mile 17',    serviceRadius:['Mile 17','Buea Town','Checkpoint'], experience:7, canFollowMedicalPlans:true,  specializations:['Hypertension','General Nutrition'],              referralsCompleted:19, rating:4.8, available:true,  phone:'699 345 678', bio:'Restaurant-trained. DASH diet certified. Handles 4–6 patients per week.' },
  { id:'CHF-003', name:'Chef Bih Sandra',       area:'Checkpoint', serviceRadius:['Checkpoint','Molyko','Great Soppo'],experience:4, canFollowMedicalPlans:true,  specializations:['Renal Disease','Type 2 Diabetes'],               referralsCompleted:16, rating:4.7, available:true,  phone:'654 456 789', bio:'Home chef focused on renal and diabetic patients. Very consistent with prescribed ingredient limits.' },
  { id:'CHF-004', name:'Chef Ayuk Peter',       area:'Buea Town',  serviceRadius:['Buea Town','Bonduma','Great Soppo'],experience:6, canFollowMedicalPlans:true,  specializations:['Hypertension','General Nutrition'],              referralsCompleted:14, rating:4.6, available:true,  phone:'677 567 890', bio:'Catering background. Handles bulk meal prep. One complaint on record (resolved).' },
  { id:'CHF-005', name:'Chef Tabi Ernest',      area:'Bonduma',    serviceRadius:['Bonduma','Mile 17'],               experience:3, canFollowMedicalPlans:true,  specializations:['General Nutrition'],                             referralsCompleted:11, rating:4.3, available:false, phone:'699 678 901', bio:'Newer chef building track record. Good basic nutrition knowledge.' },
];

/* ─── Compatibility score ─── */
function computeCompatibility(chef, patient) {
  if (!patient) return 0;
  let score = 0;
  if (chef.area === patient.location)                      score += 40;
  else if (chef.serviceRadius.includes(patient.location)) score += 25;
  if (chef.canFollowMedicalPlans)                          score += 30;
  if (chef.specializations.includes(patient.condition))   score += 20;
  else if (chef.specializations.includes('General Nutrition')) score += 8;
  if (chef.rating >= 4.8)      score += 10;
  else if (chef.rating >= 4.5) score += 7;
  else if (chef.rating >= 4.0) score += 4;
  else if (chef.rating > 0)    score += 2;
  return Math.min(score, 100);
}

function compatLabel(score) {
  if (score >= 85) return { label:'Excellent Match', color:'text-emerald-700', bg:'bg-emerald-50',  border:'border-emerald-200' };
  if (score >= 65) return { label:'Good Match',      color:'text-primary-700', bg:'bg-primary-50',  border:'border-primary-100' };
  if (score >= 40) return { label:'Partial Match',   color:'text-amber-700',   bg:'bg-amber-50',    border:'border-amber-200'   };
  return               { label:'Low Match',       color:'text-surface-500', bg:'bg-surface-50',  border:'border-surface-200' };
}

/* ─── Referral modal ─── */
function ReferralModal({ chef, patient, planId, onClose, onConfirm }) {
  const [note,    setNote]    = useState('');
  const [sending, setSending] = useState(false);
  const compat = computeCompatibility(chef, patient);
  const label  = compatLabel(compat);

  async function handleSend() {
    setSending(true);
    const currentUser   = getCurrentUser();
    const dietitianId   = currentUser?.id || 'DIETITIAN-DEMO';

    const referral = createReferral({
      dietitianId,
      chefId:      chef.id,
      patientId:   patient.id,
      mealPlanId:  planId,
      notesForChef: note.trim(),
      chefName:    chef.name,
      patientName: patient.name,
      patientLocation: patient.location,
      condition:   patient.condition,
    });

    // Mark meal plan as referred
    if (planId) updateMealPlanStatus(planId, 'referred');

    console.log('Referral created:', referral.id);
    setTimeout(() => { onConfirm(referral); setSending(false); }, 700);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-surface-100">
          <h2 className="text-base font-bold text-surface-900">Confirm Referral</h2>
          <p className="text-xs text-surface-500 mt-0.5">Clinical notes are NOT included — chef receives meal instructions only</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-50 rounded-xl p-3">
              <p className="text-xs text-surface-400 mb-1">Patient</p>
              <p className="text-sm font-semibold text-surface-800">{patient.name}</p>
              <p className="text-xs text-surface-500">{patient.condition}</p>
            </div>
            <div className="bg-surface-50 rounded-xl p-3">
              <p className="text-xs text-surface-400 mb-1">Chef</p>
              <p className="text-sm font-semibold text-surface-800">{chef.name}</p>
              <p className="text-xs text-surface-500">{chef.area}</p>
            </div>
          </div>
          <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${label.bg} ${label.border}`}>
            <span className={`text-sm font-semibold ${label.color}`}>{label.label}</span>
            <span className={`text-lg font-bold ${label.color}`}>{compat}%</span>
          </div>
          <div>
            <label className="form-label">
              Notes for Chef
              <span className="ml-2 text-surface-400 font-normal text-xs">(non-clinical — chef will read this)</span>
            </label>
            <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3}
              className="input-medical resize-none"
              placeholder="e.g. Patient prefers smaller portions. Mild spice only. Deliver at 12:30 PM."/>
            <p className="text-xs text-surface-400 mt-1">Do not include clinical targets or medical rationale here.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button onClick={handleSend} disabled={sending}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              {sending
                ? <><svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Sending…</>
                : <><Send size={14}/> Send Referral</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */
function ReferForm() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const prePatientId  = searchParams.get('patient') || '';
  const prePlanId     = searchParams.get('plan')    || '';

  const [selectedPatient, setSelectedPatient] = useState(PATIENTS.find(p=>p.id===prePatientId)||null);
  const [selectedPlanId,  setSelectedPlanId]  = useState(prePlanId);
  const [search,          setSearch]          = useState('');
  const [medicalOnly,     setMedicalOnly]     = useState(true);
  const [selectedChef,    setSelectedChef]    = useState(null);
  const [expandedChef,    setExpandedChef]    = useState(null);
  const [referralSent,    setReferralSent]    = useState(null);

  // Load saved plans for this patient
  const savedPlans = useMemo(() => {
    if (!selectedPatient) return [];
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    return getMealPlansForDietitian(currentUser.id)
      .filter(p => p.patientId === selectedPatient.id);
  }, [selectedPatient]);

  const scoredChefs = useMemo(() =>
    CHEFS.map(c=>({...c, compatibilityScore:computeCompatibility(c,selectedPatient)}))
         .sort((a,b)=>b.compatibilityScore-a.compatibilityScore),
    [selectedPatient]
  );

  const filteredChefs = useMemo(() =>
    scoredChefs.filter(c => {
      const matchSearch  = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.area.toLowerCase().includes(search.toLowerCase());
      const matchMedical = !medicalOnly || c.canFollowMedicalPlans;
      return matchSearch && matchMedical;
    }),
    [scoredChefs, search, medicalOnly]
  );

  if (referralSent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-500"/>
          </div>
          <h2 className="text-xl font-bold text-surface-900 mb-2">Referral Sent Successfully</h2>
          <p className="text-sm text-surface-500 mb-2 leading-relaxed">
            <strong>{selectedPatient?.name}</strong>'s meal plan has been sent to{' '}
            <strong>{referralSent.chefName || 'the chef'}</strong>.
          </p>
          <p className="text-xs text-surface-400 mb-6">
            Referral ID: <span className="font-mono font-bold text-surface-600">{referralSent.id}</span>
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={()=>router.push('/dietitian/dashboard')} className="btn-outline">Dashboard</button>
            <button onClick={()=>{setReferralSent(null);setSelectedChef(null);}} className="btn-primary">New Referral</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={()=>router.back()} className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
          <ArrowLeft size={18} className="text-surface-500"/>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Refer to Chef</h1>
          <p className="text-sm text-surface-500 mt-0.5">Smart chef matching by patient location and condition</p>
        </div>
      </div>

      {/* Patient selector */}
      <div className="bg-white border border-surface-100 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-surface-900 mb-3">Select Patient</h2>
        <div className="flex flex-wrap gap-2">
          {PATIENTS.map(p=>(
            <button key={p.id} onClick={()=>{setSelectedPatient(p);setSelectedPlanId('');}}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                selectedPatient?.id===p.id
                  ?'border-primary-500 bg-primary-50 text-primary-700'
                  :'border-surface-100 text-surface-600 hover:border-surface-300'
              }`}>
              <div className="w-6 h-6 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                {p.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div className="text-left">
                <p className="leading-none text-xs font-semibold">{p.name.split(' ')[0]}</p>
                <p className="text-xs opacity-70">{p.location}</p>
              </div>
            </button>
          ))}
        </div>
        {selectedPatient && (
          <div className="mt-4 pt-4 border-t border-surface-100 flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-surface-600"><MapPin size={11} className="text-primary-500"/><strong>Location:</strong> {selectedPatient.location}</span>
            <span className="flex items-center gap-1.5 text-surface-600"><Info size={11} className="text-primary-500"/><strong>Condition:</strong> {selectedPatient.condition}</span>
          </div>
        )}
      </div>

      {/* Meal plan selector */}
      {selectedPatient && (
        <div className="bg-white border border-surface-100 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-surface-900 mb-3">Select Meal Plan to Refer</h2>
          {savedPlans.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-amber-500 text-xl">⚠</span>
              <div>
                <p className="text-sm font-semibold text-amber-700">No saved plans for this patient</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  <button onClick={()=>router.push(`/dietitian/create-plan?patient=${selectedPatient.id}`)}
                    className="underline hover:no-underline">Create a meal plan first →</button>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {savedPlans.map(plan=>(
                <button key={plan.id} onClick={()=>setSelectedPlanId(plan.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    selectedPlanId===plan.id
                      ?'border-primary-500 bg-primary-50'
                      :'border-surface-100 hover:border-surface-300'
                  }`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-800">{plan.title}</p>
                    <p className="text-xs text-surface-400 mt-0.5">{plan.id} · {plan.startDate} → {plan.endDate}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                    plan.status==='active'?'bg-emerald-100 text-emerald-700':
                    plan.status==='referred'?'bg-primary-100 text-primary-700':
                    'bg-surface-100 text-surface-500'
                  }`}>{plan.status}</span>
                  {selectedPlanId===plan.id&&<CheckCircle size={16} className="text-primary-500 shrink-0"/>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search + filter */}
      {selectedPatient && (
        <div className="bg-white border border-surface-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search chef name or area…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-surface-200 rounded-xl bg-white focus:outline-none focus:border-primary-400 placeholder:text-surface-300"/>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={()=>setMedicalOnly(!medicalOnly)}
              className={`relative w-10 h-5 rounded-full transition-colors ${medicalOnly?'bg-primary-600':'bg-surface-200'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${medicalOnly?'left-5':'left-0.5'}`}/>
            </div>
            <span className="text-xs font-medium text-surface-600">Medical-capable only</span>
          </label>
        </div>
      )}

      {/* Chef cards */}
      {!selectedPatient && (
        <div className="text-center py-12 bg-white border border-surface-100 rounded-2xl">
          <ChefHat size={36} className="text-surface-200 mx-auto mb-3"/>
          <p className="text-sm text-surface-500 font-medium">Select a patient to see ranked chef matches</p>
        </div>
      )}

      {selectedPatient && (
        <div className="space-y-3">
          {filteredChefs.map((chef,i)=>{
            const compat = chef.compatibilityScore;
            const label  = compatLabel(compat);
            const isOpen = expandedChef===chef.id;
            const isBest = i===0 && compat>=65;
            return (
              <div key={chef.id} className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                !chef.available?'opacity-60':''
              } ${isBest?'border-emerald-200 shadow-md':'border-surface-100'}`}>
                {isBest&&(
                  <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-2">
                    <Star size={11} fill="white"/> Best Match for {selectedPatient.name}
                  </div>
                )}
                <div className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shrink-0">
                    {chef.name.split(' ').slice(1).map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold text-surface-900">{chef.name}</p>
                      {!chef.available&&<span className="text-xs bg-surface-100 text-surface-500 px-2 py-0.5 rounded-full">Busy</span>}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-surface-500 mb-2">
                      <span className="flex items-center gap-1"><MapPin size={11} className="text-primary-400"/>{chef.area}</span>
                      {chef.rating>0&&<span className="flex items-center gap-1"><Star size={11} className="text-amber-400" fill="#fbbf24"/>{chef.rating} · {chef.referralsCompleted} referrals</span>}
                      <span><Clock size={11} className="inline mr-1"/>{chef.experience}y · {chef.area}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {chef.specializations.map(s=>(
                        <span key={s} className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                          s===selectedPatient?.condition
                            ?'bg-primary-50 text-primary-700 border-primary-200'
                            :'bg-surface-50 text-surface-500 border-surface-100'
                        }`}>
                          {s===selectedPatient?.condition?'✓ ':''}{s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className={`text-right px-3 py-2 rounded-xl border ${label.bg} ${label.border}`}>
                      <p className={`text-lg font-bold ${label.color}`}>{compat}%</p>
                      <p className={`text-xs font-medium ${label.color}`}>{label.label}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>setExpandedChef(isOpen?null:chef.id)}
                        className="px-3 py-1.5 rounded-lg bg-surface-50 border border-surface-200 text-xs font-semibold text-surface-600 hover:bg-surface-100 transition-colors">
                        {isOpen?'Less':'Profile'}
                      </button>
                      <button
                        onClick={()=>chef.available&&chef.canFollowMedicalPlans&&selectedPlanId&&setSelectedChef(chef)}
                        disabled={!chef.available||!chef.canFollowMedicalPlans||!selectedPlanId}
                        className="px-4 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5">
                        <Send size={12}/> Refer
                      </button>
                    </div>
                    {!selectedPlanId&&chef.available&&(
                      <p className="text-xs text-amber-500 font-medium">Select a plan first</p>
                    )}
                  </div>
                </div>
                {isOpen&&(
                  <div className="px-5 pb-5 border-t border-surface-50 pt-4 space-y-3">
                    <p className="text-sm text-surface-600 leading-relaxed">{chef.bio}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-surface-500">
                      <span>📍 Serves: {chef.serviceRadius.join(', ')}</span>
                      <span>📞 {chef.phone}</span>
                      {chef.canFollowMedicalPlans
                        ?<span className="text-emerald-600 font-semibold">✓ Medical plan certified</span>
                        :<span className="text-red-500 font-semibold">✗ Not medical certified</span>
                      }
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedChef&&selectedPatient&&(
        <ReferralModal
          chef={selectedChef}
          patient={selectedPatient}
          planId={selectedPlanId}
          onClose={()=>setSelectedChef(null)}
          onConfirm={referral=>{setReferralSent(referral);setSelectedChef(null);}}
        />
      )}
    </div>
  );
}

export default function ReferPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-50 flex items-center justify-center"><p className="text-surface-400 text-sm">Loading…</p></div>}>
      <ReferForm/>
    </Suspense>
  );
}