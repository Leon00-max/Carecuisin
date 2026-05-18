'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Star, ChefHat, MapPin, ShieldCheck, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createReferral } from '@/lib/referralStore';
import { getCurrentUserId } from '@/lib/userStore';
import { getLatestMealPlanForPatient } from '@/lib/mealPlanStore';

function getChefs() {
  try {
    const step1 = JSON.parse(localStorage.getItem('cc_onboarding_chef_step1') || '{}');
    if (step1.fullName) {
      return [{
        id: 'chef-1',
        name: step1.fullName,
        specialty: step1.specialDiets?.[0] || 'General',
        location: step1.serviceArea || 'Buea',
        rating: 4.5,
        experience: step1.experienceYears || 3,
        tags: step1.specialDiets || [],
      }];
    }
  } catch (_) {}
  return [
    { id: 'chef-demo', name: 'Chef Amadou', specialty: 'Low‑Sodium', location: 'Buea Town', rating: 4.9, experience: 6, tags: ['Clinical', 'Keto'] },
    { id: 'chef-demo2', name: 'Chef Clara', specialty: 'Diabetes', location: 'Molyko', rating: 4.8, experience: 5, tags: ['Organic', 'Halal'] },
    { id: 'chef-demo3', name: 'Chef Samuel', specialty: 'Renal Diet', location: 'Mile 17', rating: 5.0, experience: 8, tags: ['Clinical', 'Vegan'] },
  ];
}

export default function ReferChef() {
  const router = useRouter();
  const [chefs, setChefs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedChef, setSelectedChef] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setChefs(getChefs());
  }, []);

  const filteredChefs = useMemo(() => {
    const q = search.toLowerCase();
    return chefs.filter(c => {
      const inName = c.name.toLowerCase().includes(q);
      const inSpecialty = c.specialty.toLowerCase().includes(q);
      const inTags = c.tags.some(tag => tag.toLowerCase().includes(q));
      return inName || inSpecialty || inTags;
    });
  }, [chefs, search]);

 const handleRefer = (chefId) => {
  const dietitianId = getCurrentUserId();
  if (!dietitianId) return;

  // For now, use the first patient's active plan.
  // Later, you can let the dietitian choose which plan to refer.
  const patientId = selectedPatient; // from state (or hardcoded for demo)
  const plan = getLatestMealPlanForPatient(patientId);
  const mealPlanId = plan?.id || 'plan-001';

  const referral = createReferral({
    dietitianId,
    chefId,
    patientId,
    mealPlanId,
    notes: '',
  });

  console.log('Referral created:', referral);
  setSent(true); // your existing success state
};

  function confirmReferral() {
    setSending(true);
    const referral = {
      chefId: selectedChef.id,
      mealPlanId: 'plan-001',
      createdAt: new Date().toISOString(),
    };
    console.log('Referral created:', referral);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 800);
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Chef Discovery</h1>
        <p className="text-sm text-surface-500 mt-1">
          Search and refer certified culinary professionals.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
        <input
          type="text"
          placeholder="Search by specialty (e.g., 'Diabetes') or name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-medical pl-14"
        />
      </div>

      {/* Chef cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChefs.map(chef => (
          <div
            key={chef.id}
            className={`card-medical cursor-pointer transition-all hover:shadow-md ${
              selectedChef?.id === chef.id ? 'border-primary-500 ring-1 ring-primary-500' : ''
            }`}
            onClick={() => handleRefer(chef)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <ChefHat size={24} className="text-emerald-600" />
              </div>
              <div className="flex items-center gap-1 text-amber-600">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-bold">{chef.rating}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-surface-900">{chef.name}</h3>
            <p className="text-sm text-primary-600 font-medium mt-1">{chef.specialty}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-surface-400">
              <MapPin size={12} />
              {chef.location}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {chef.tags.map(tag => (
                <span key={tag} className="text-xs bg-surface-50 border border-surface-100 rounded-full px-3 py-0.5 text-surface-600">
                  {tag}
                </span>
              ))}
            </div>
            <button
              className={`mt-4 w-full btn-primary py-2 text-sm ${
                selectedChef?.id === chef.id ? 'opacity-100' : 'opacity-80'
              }`}
            >
              {selectedChef?.id === chef.id ? 'Selected' : 'Select Chef'}
            </button>
          </div>
        ))}
      </div>

      {/* Referral confirmation panel */}
      {selectedChef && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="card-medical shadow-lg max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} className="text-primary-500" />
              <h4 className="font-semibold text-surface-800">Confirm Referral</h4>
            </div>
            <p className="text-xs text-surface-500 mb-4">
              Refer <strong>{selectedChef.name}</strong> to prepare the current meal plan for your patient.
            </p>
            {sent ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center text-sm text-emerald-700 font-semibold">
                ✓ Referral sent!
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={confirmReferral}
                  disabled={sending}
                  className="btn-primary flex-1 py-2 text-sm flex items-center justify-center gap-1"
                >
                  {sending ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <Send size={14} />
                  )}
                  {sending ? 'Sending…' : 'Confirm'}
                </button>
                <button
                  onClick={() => { setSelectedChef(null); setSent(false); }}
                  className="btn-outline py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}