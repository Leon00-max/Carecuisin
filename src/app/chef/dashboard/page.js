'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, ChefHat, MapPin, Star, AlertCircle, Activity } from 'lucide-react';
import {getReferralsForChef, acceptReferral, markPrepared, declineReferral,} from '@/lib/referralStore';
import { getMealPlanForChef } from '@/lib/mealPlanStore';
import { getCurrentUser } from '@/lib/userStore';

/* ─────────────────────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  pending:  { label:'Awaiting Acceptance', bg:'bg-amber-50',   text:'text-amber-700',   border:'border-amber-200',   icon:Clock        },
  accepted: { label:'Accepted — Cook now', bg:'bg-primary-50', text:'text-primary-700', border:'border-primary-100', icon:Activity     },
  prepared: { label:'Meal Prepared ✓',     bg:'bg-emerald-50', text:'text-emerald-700', border:'border-emerald-100', icon:CheckCircle  },
  declined: { label:'Declined',            bg:'bg-surface-50', text:'text-surface-500', border:'border-surface-200', icon:AlertCircle  },
  delivered:{ label:'Delivered ✓',         bg:'bg-emerald-50', text:'text-emerald-700', border:'border-emerald-100', icon:CheckCircle  },
};

/* ─────────────────────────────────────────────────────────────
   MEAL PLAN DETAIL DRAWER
───────────────────────────────────────────────────────────── */
function MealPlanDrawer({ planId, onClose }) {
  const plan = planId ? getMealPlanForChef(planId) : null;

  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-surface-100 px-6 py-4 flex items-start justify-between rounded-t-3xl sm:rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-surface-900">{plan.title}</h2>
            <p className="text-xs text-surface-400 mt-0.5">
              {plan.startDate} → {plan.endDate}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-surface-100 transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Privacy notice */}
          <div className="flex items-start gap-2 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <p className="text-xs text-primary-700 leading-relaxed">
              You are seeing the <strong>cooking instructions only</strong>.
              Clinical targets and medical diagnosis are private to the dietitian.
            </p>
          </div>

          {/* Description */}
          {plan.description && (
            <div>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-widest mb-2">Plan Overview</p>
              <p className="text-sm text-surface-600 leading-relaxed">{plan.description}</p>
            </div>
          )}

          {/* Day-by-day meals */}
          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-widest mb-3">Weekly Schedule</p>
            <div className="space-y-3">
              {(plan.details || []).map(dayPlan => (
                <div key={dayPlan.day} className="rounded-xl border border-surface-100 overflow-hidden">
                  <div className="bg-surface-50 px-4 py-2 border-b border-surface-100">
                    <p className="text-sm font-semibold text-surface-800">{dayPlan.day}</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {(dayPlan.items || []).map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${
                          item.type === 'Breakfast' ? 'bg-amber-50 text-amber-700' :
                          item.type === 'Lunch'     ? 'bg-emerald-50 text-emerald-700' :
                          item.type === 'Dinner'    ? 'bg-primary-50 text-primary-700' :
                          'bg-surface-50 text-surface-600'
                        }`}>
                          {item.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-surface-700 leading-snug">
                            {item.description || <span className="text-surface-300 italic">No description</span>}
                          </p>
                          <p className="text-xs text-surface-400 mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    ))}
                    {(!dayPlan.items || dayPlan.items.length === 0) && (
                      <p className="text-xs text-surface-400 italic px-1">No meals specified for this day.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DECLINE MODAL
───────────────────────────────────────────────────────────── */
function DeclineModal({ referralId, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-surface-900">Decline this referral?</h2>
        <p className="text-sm text-surface-500">
          The dietitian will be notified. Please provide a reason so they can find another chef.
        </p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          placeholder="e.g. Fully booked this week…"
          className="input-medical resize-none"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
          <button
            onClick={() => onConfirm(referralId, reason)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function ChefDashboard() {
  const [referrals,      setReferrals]      = useState([]);
  const [viewingPlanId,  setViewingPlanId]  = useState(null);
  const [decliningId,    setDecliningId]    = useState(null);
  const [toast,          setToast]          = useState(null);

  /* ── Load referrals ── */
  function load() {
    const user        = getCurrentUser();
    const chefId      = user?.id || 'CHF-001'; // fallback for demo
    const allReferrals = getReferralsForChef(chefId);

    // For demo: if no real referrals, show mock referrals so chef dashboard isn't empty
    if (allReferrals.length === 0) {
      setReferrals([
        {
          id:           'REF-DEMO-1',
          patientName:  'Fru Emmanuel',
          patientId:    'PAT-001',
          condition:    'Type 2 Diabetes',
          patientLocation:'Molyko',
          mealPlanId:   null,
          notesForChef: 'Patient prefers smaller portions. No extra salt.',
          status:       'pending',
          createdAt:    new Date(Date.now() - 2 * 3600000).toISOString(),
          _demo:        true,
        },
        {
          id:           'REF-DEMO-2',
          patientName:  'Ngo Beatrice',
          patientId:    'PAT-002',
          condition:    'Hypertension',
          patientLocation:'Mile 17',
          mealPlanId:   null,
          notesForChef: 'Deliver at 12:30 PM. Mild spice only.',
          status:       'accepted',
          createdAt:    new Date(Date.now() - 24 * 3600000).toISOString(),
          _demo:        true,
        },
      ]);
    } else {
      setReferrals(allReferrals);
    }
  }

  useEffect(() => {
    load();
    const handler = e => {
      if (e.key === 'cc_referrals') load();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  /* ── Toast ── */
  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  /* ── Actions ── */
  function handleAccept(id, isDemo) {
    if (!isDemo) {
      acceptReferral(id);
      setReferrals(prev => prev.map(r =>
        r.id === id ? { ...r, status:'accepted', acceptedAt: new Date().toISOString() } : r
      ));
    } else {
      setReferrals(prev => prev.map(r => r.id === id ? { ...r, status:'accepted' } : r));
    }
    showToast('Referral accepted! Start preparing the meal.');
  }

  function handleMarkPrepared(id, isDemo) {
    if (!isDemo) {
      markPrepared(id);
      setReferrals(prev => prev.map(r =>
        r.id === id ? { ...r, status:'prepared', preparedAt: new Date().toISOString() } : r
      ));
    } else {
      setReferrals(prev => prev.map(r => r.id === id ? { ...r, status:'prepared' } : r));
    }
    showToast('Meal marked as prepared! Patient and dietitian have been notified.');
  }

  function handleDeclineConfirm(id, reason) {
    const ref = referrals.find(r => r.id === id);
    if (!ref?._demo) {
      declineReferral(id, reason);
    }
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status:'declined', declineReason: reason } : r));
    setDecliningId(null);
    showToast('Referral declined. Dietitian notified.', 'warn');
  }

  /* ── Stats ── */
  const stats = {
    pending:  referrals.filter(r => r.status === 'pending').length,
    active:   referrals.filter(r => r.status === 'accepted').length,
    prepared: referrals.filter(r => r.status === 'prepared').length,
    total:    referrals.length,
  };

  function timeAgo(iso) {
    if (!iso) return '';
    const diff  = Date.now() - new Date(iso).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (days  > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${mins}m ago`;
  }

  return (
    <div className="space-y-7">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 ${
          toast.type === 'warn'
            ? 'bg-amber-600 text-white'
            : 'bg-emerald-600 text-white'
        }`}>
          <CheckCircle size={16}/>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <span className="badge-clinical mb-2 inline-block">Chef Portal</span>
          <h1 className="text-2xl font-bold text-surface-900">My Referrals</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Meals prescribed by verified dietitians. Cook exactly as instructed.
          </p>
        </div>
        {stats.pending > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"/>
            {stats.pending} new {stats.pending === 1 ? 'referral' : 'referrals'} awaiting acceptance
          </div>
        )}
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Pending',  value:stats.pending,  color:'text-amber-600',   bg:'bg-amber-50'   },
          { label:'Cooking',  value:stats.active,   color:'text-primary-600', bg:'bg-primary-50' },
          { label:'Prepared', value:stats.prepared, color:'text-emerald-600', bg:'bg-emerald-50' },
          { label:'Total',    value:stats.total,    color:'text-surface-700', bg:'bg-white'      },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} border border-surface-100 rounded-2xl px-5 py-4`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs font-medium text-surface-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Referral cards ── */}
      {referrals.length === 0 ? (
        <div className="bg-white border border-surface-100 rounded-2xl py-16 text-center">
          <ChefHat size={36} className="text-surface-200 mx-auto mb-3"/>
          <p className="text-sm font-semibold text-surface-700">No referrals yet</p>
          <p className="text-xs text-surface-400 mt-1">
            Referrals will appear here when a dietitian assigns you a patient.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {referrals.map(referral => {
            const cfg     = STATUS_CONFIG[referral.status] || STATUS_CONFIG.pending;
            const StatusIcon = cfg.icon;

            return (
              <div key={referral.id}
                className={`bg-white border rounded-2xl overflow-hidden transition-all hover:shadow-md ${
                  referral.status === 'pending' ? 'border-amber-200' : 'border-surface-100'
                }`}>

                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-3 bg-surface-50 border-b border-surface-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-surface-400">{referral.id}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <StatusIcon size={11}/>
                      {cfg.label}
                    </span>
                    {referral._demo && (
                      <span className="text-xs bg-surface-100 text-surface-500 px-2 py-0.5 rounded-full">Demo</span>
                    )}
                  </div>
                  <span className="text-xs text-surface-400">{timeAgo(referral.createdAt)}</span>
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-4">

                    {/* Patient avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold shrink-0">
                      {(referral.patientName || 'P').split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">

                      {/* Patient info (anonymised — no medical data) */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-bold text-surface-900">
                          Patient {referral.patientId}
                        </p>
                        <span className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-2 py-0.5 rounded-full font-medium">
                          {referral.condition}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-surface-500 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} className="text-primary-400"/>
                          {referral.patientLocation || 'Location not set'}
                        </span>
                      </div>

                      {/* Notes for chef */}
                      {referral.notesForChef && (
                        <div className="bg-surface-50 border border-surface-100 rounded-xl px-3 py-2.5 mb-4">
                          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">
                            Dietitian notes for you
                          </p>
                          <p className="text-sm text-surface-700 leading-relaxed">
                            {referral.notesForChef}
                          </p>
                        </div>
                      )}

                      {/* Prepared timestamp */}
                      {referral.preparedAt && (
                        <p className="text-xs text-emerald-600 font-semibold mb-3">
                          ✓ Prepared at {new Date(referral.preparedAt).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })}
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">

                        {/* View meal plan */}
                        {referral.mealPlanId && (
                          <button
                            onClick={() => setViewingPlanId(referral.mealPlanId)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-50 text-primary-700 text-xs font-semibold hover:bg-primary-100 transition-colors border border-primary-100"
                          >
                            View Meal Plan
                          </button>
                        )}

                        {/* Accept */}
                        {referral.status === 'pending' && (
                          <button
                            onClick={() => handleAccept(referral.id, referral._demo)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                          >
                            <CheckCircle size={13}/> Accept Referral
                          </button>
                        )}

                        {/* Mark prepared */}
                        {referral.status === 'accepted' && (
                          <button
                            onClick={() => handleMarkPrepared(referral.id, referral._demo)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                          >
                            <ChefHat size={13}/> Mark as Prepared
                          </button>
                        )}

                        {/* Decline */}
                        {(referral.status === 'pending' || referral.status === 'accepted') && (
                          <button
                            onClick={() => setDecliningId(referral.id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-50 text-surface-600 text-xs font-semibold hover:bg-red-50 hover:text-red-600 transition-colors border border-surface-200"
                          >
                            Decline
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ── Clinical privacy reminder ── */}
      <div className="flex items-start gap-3 bg-surface-800 rounded-2xl px-5 py-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        <div>
          <p className="text-sm font-semibold text-white">Privacy reminder</p>
          <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">
            Patient names shown are anonymised for you. You see cooking instructions only —
            never diagnosis, clinical targets, or medical history. Follow the meal plan exactly as written.
          </p>
        </div>
      </div>

      {/* Meal plan drawer */}
      {viewingPlanId && (
        <MealPlanDrawer
          planId={viewingPlanId}
          onClose={() => setViewingPlanId(null)}
        />
      )}

      {/* Decline modal */}
      {decliningId && (
        <DeclineModal
          referralId={decliningId}
          onClose={() => setDecliningId(null)}
          onConfirm={handleDeclineConfirm}
        />
      )}

    </div>
  );
}