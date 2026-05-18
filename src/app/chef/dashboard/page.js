'use client';

import { useEffect, useState } from 'react';
import { ChefHat, Clock, CheckCircle, Utensils, MapPin } from 'lucide-react';

/* ── Mock referrals (will be replaced by API) ── */
const MOCK_REFERRALS = [
  {
    id: 'REF-001',
    patient: 'Patient A',
    plan: 'Low‑sodium diabetic diet',
    dietitian: 'Dr. Ambe Florence',
    time: 'Today, 12:30 PM',
    status: 'pending',
  },
  {
    id: 'REF-002',
    patient: 'Patient B',
    plan: 'Renal‑friendly meal plan',
    dietitian: 'Dr. Ambe Florence',
    time: 'Today, 6:30 PM',
    status: 'pending',
  },
];

export default function ChefDashboard() {
  const [chefName, setChefName] = useState('Chef');
  const [chefLocation, setChefLocation] = useState('Buea');
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    try {
      const step1 = JSON.parse(localStorage.getItem('cc_onboarding_chef_step1') || '{}');
      if (step1.fullName) {
        setChefName(step1.fullName);
        setChefLocation(step1.serviceArea || 'Buea');
      }
    } catch (_) {}
    setReferrals(MOCK_REFERRALS);
  }, []);

  const pending = referrals.filter(r => r.status === 'pending');
  const completed = referrals.filter(r => r.status === 'prepared');

  const markPrepared = (id) => {
    setReferrals(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'prepared' } : r))
    );
    console.log(`Referral ${id} marked prepared`);
    // TODO: PATCH /api/referrals/{id}
  };

  return (
    <div className="space-y-7">
      {/* Welcome header */}
      <div>
        <span className="badge-clinical mb-2 inline-block">Chef Portal</span>
        <h1 className="text-2xl font-bold text-surface-900">
          Welcome, {chefName.split(' ')[0]}
        </h1>
        <div className="flex items-center gap-1 mt-1 text-sm text-surface-500">
          <MapPin size={14} />
          {chefLocation}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-medical !p-4">
          <Utensils size={20} className="text-emerald-600 mb-2" />
          <p className="text-xs text-surface-500 uppercase tracking-widest">Active Referrals</p>
          <p className="text-2xl font-bold text-surface-900">{pending.length}</p>
        </div>
        <div className="card-medical !p-4">
          <CheckCircle size={20} className="text-primary-600 mb-2" />
          <p className="text-xs text-surface-500 uppercase tracking-widest">Completed Today</p>
          <p className="text-2xl font-bold text-surface-900">{completed.length}</p>
        </div>
        <div className="card-medical !p-4">
          <ChefHat size={20} className="text-amber-600 mb-2" />
          <p className="text-xs text-surface-500 uppercase tracking-widest">Your Rating</p>
          <p className="text-2xl font-bold text-surface-900">4.8 ★</p>
        </div>
      </div>

      {/* Referrals list */}
      <div className="card-medical">
        <div className="flex items-center gap-2 mb-4">
          <Utensils size={18} className="text-emerald-500" />
          <h2 className="text-lg font-semibold text-surface-800">Meal Orders</h2>
        </div>

        {referrals.length === 0 ? (
          <div className="text-center py-10 text-sm text-surface-500">
            No active referrals. Orders from dietitians will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map(ref => (
              <div
                key={ref.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border ${
                  ref.status === 'prepared'
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'bg-surface-50 border-surface-100'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-surface-800">{ref.patient}</span>
                    <span className="text-xs text-surface-400">{ref.id}</span>
                  </div>
                  <p className="text-sm text-surface-600">{ref.plan}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-surface-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {ref.time}
                    </span>
                    <span>Dietitian: {ref.dietitian}</span>
                  </div>
                </div>
                {ref.status === 'prepared' ? (
                  <span className="flex items-center gap-1 text-sm font-semibold text-emerald-700 shrink-0">
                    <CheckCircle size={16} /> Prepared
                  </span>
                ) : (
                  <button
                    onClick={() => markPrepared(ref.id)}
                    className="btn-primary text-xs py-2 px-4 shrink-0"
                  >
                    Mark as Prepared
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}