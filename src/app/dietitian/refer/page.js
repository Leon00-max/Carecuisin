'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle,
  ChefHat,
  Filter,
  MapPin,
  Search,
  Send,
  ShieldCheck,
  Star,
  UtensilsCrossed,
} from 'lucide-react';
import { createReferral } from '@/lib/referralStore';
import { getConsultations } from '@/lib/consultationStore';
import { getMealPlansForDietitian } from '@/lib/mealPlanStore';
import { searchApprovedChefs } from '@/lib/professionalSearchStore';
import { getCurrentUserId, getUsers } from '@/lib/userStore';

const FILTERS = ['All', 'Nearby', 'Specialty', 'Rating'];

function patientStatusClass(status) {
  if (status === 'active' || status === 'referred') return 'border-success/20 bg-success/10 text-success';
  if (status === 'draft' || status === 'requested') return 'border-warning/20 bg-warning/10 text-warning';
  return 'border-primary-100 bg-primary-50 text-primary-700';
}

function buildPatientOptions(dietitianId) {
  if (!dietitianId) return [];

  const users = getUsers();
  const plans = getMealPlansForDietitian(dietitianId);
  const consultations = getConsultations({ dietitianId });
  const patientIds = new Set([
    ...plans.map(plan => plan.patientId),
    ...consultations.map(item => item.patientId),
  ].filter(Boolean));

  const sourcePatients = patientIds.size
    ? users.filter(user => patientIds.has(user.id))
    : users.filter(user => user.role === 'patient');

  return sourcePatients.map(patient => {
    const patientPlans = plans
      .filter(plan => plan.patientId === patient.id)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const latestPlan = patientPlans[0] || null;
    return {
      id: patient.id,
      name: patient.fullName || patient.email,
      location: patient.location || patient.address || 'Buea, Fako',
      condition: patient.condition || patient.primaryCondition || 'Clinical nutrition support',
      status: latestPlan?.status || 'requested',
      week: latestPlan?.title || 'Meal plan pending',
      latestPlan,
      plans: patientPlans,
    };
  });
}

export default function ReferChefPage() {
  const [dietitianId, setDietitianId] = useState('');
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [patientId, setPatientId] = useState('');
  const [selectedMealPlanId, setSelectedMealPlanId] = useState('');
  const [selectedChef, setSelectedChef] = useState(null);
  const [notesForChef, setNotesForChef] = useState('Use reduced salt, controlled oil, measured portions, and deliver within the agreed patient time window.');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  function refresh() {
    const id = getCurrentUserId();
    const nextPatients = buildPatientOptions(id);
    setDietitianId(id || '');
    setPatients(nextPatients);
    setPatientId(prev => prev || nextPatients[0]?.id || '');
    setSelectedMealPlanId(prev => prev || nextPatients[0]?.latestPlan?.id || '');
  }

  useEffect(() => {
    queueMicrotask(refresh);
  }, []);

  const patient = useMemo(
    () => patients.find(item => item.id === patientId) || patients[0] || null,
    [patientId, patients]
  );

  const chefs = useMemo(() => {
    const category = filter === 'Nearby'
      ? 'Buea'
      : filter === 'Specialty'
        ? 'low'
        : '';
    const results = searchApprovedChefs({ query, category });
    return filter === 'Rating'
      ? [...results].sort((a, b) => b.rating - a.rating)
      : results;
  }, [filter, query]);

  function changePatient(nextPatientId) {
    const next = patients.find(item => item.id === nextPatientId);
    setPatientId(nextPatientId);
    setSelectedMealPlanId(next?.latestPlan?.id || '');
  }

  function sendReferral() {
    setError('');
    try {
      if (!dietitianId) throw new Error('Please log in again before sending a referral.');
      if (!patient) throw new Error('Choose a patient before sending a referral.');
      if (!selectedChef) throw new Error('Choose an approved chef before sending a referral.');
      if (!selectedMealPlanId) throw new Error('Create or select a meal plan before referring a chef.');

      createReferral({
        dietitianId,
        chefId: selectedChef.id,
        patientId: patient.id,
        mealPlanId: selectedMealPlanId,
        notesForChef,
        chefName: selectedChef.fullName,
        patientName: patient.name,
        patientLocation: patient.location,
        condition: patient.condition,
      });
      setSent(true);
    } catch (err) {
      setError(err.message || 'Could not send referral.');
    }
  }

  if (sent) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-128px)] max-w-md flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success ring-8 ring-success/10">
          <CheckCircle size={34} />
        </div>
        <h1 className="mt-6 text-2xl font-black text-surface-900">Referral Sent</h1>
        <p className="mt-2 text-sm leading-relaxed text-surface-500">
          {selectedChef?.fullName} received safe preparation instructions for {patient?.name}.
        </p>
        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          <button type="button" onClick={() => { setSent(false); setSelectedChef(null); }} className="btn-outline rounded-2xl bg-white">
            New Referral
          </button>
          <Link href="/dietitian/referrals" className="btn-primary rounded-2xl">
            View Referrals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2">
          <Send size={14} />
          Chef referral
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Refer a Chef</h1>
        <p className="mt-2 text-sm text-surface-500">
          Match a patient plan to an admin-approved chef using preparation-safe instructions only.
        </p>
      </header>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="patient">Selected patient</label>
            <select
              id="patient"
              value={patientId}
              onChange={event => changePatient(event.target.value)}
              className="input-medical rounded-2xl"
              disabled={!patients.length}
            >
              {patients.length === 0 && <option value="">No patients available</option>}
              {patients.map(item => (
                <option key={item.id} value={item.id}>{item.name} - {item.condition}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="mealPlan">Meal plan</label>
            <select
              id="mealPlan"
              value={selectedMealPlanId}
              onChange={event => setSelectedMealPlanId(event.target.value)}
              className="input-medical rounded-2xl"
              disabled={!patient?.plans?.length}
            >
              {!patient?.plans?.length && <option value="">Create a meal plan first</option>}
              {patient?.plans?.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.title || plan.id} - {plan.status}</option>
              ))}
            </select>
          </div>
        </div>

        {patient && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-black ${patientStatusClass(patient.status)}`}>
              {patient.status.replace('_', ' ')}
            </span>
            <span className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">
              {patient.week}
            </span>
            <span className="rounded-full border border-surface-100 bg-surface-50 px-3 py-1 text-xs font-bold text-surface-500">
              {patient.location}
            </span>
          </div>
        )}
      </section>

      <section className="flex gap-2">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search approved chefs by name, cuisine, or area..."
            className="input-medical rounded-2xl pl-11"
          />
        </div>
        <button type="button" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-surface-100 bg-white text-primary-600 shadow-sm">
          <Filter size={18} />
        </button>
      </section>

      <section className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(item => {
          const active = filter === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`min-w-[94px] rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                active
                  ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                  : 'border-surface-100 bg-white text-surface-500'
              }`}
            >
              {item}
            </button>
          );
        })}
      </section>

      {chefs.length === 0 ? (
        <section className="rounded-2xl border border-warning/20 bg-warning/10 p-6 text-center">
          <AlertCircle className="mx-auto text-warning" size={26} />
          <h2 className="mt-3 text-sm font-black text-surface-900">No approved chefs yet</h2>
          <p className="mt-1 text-xs leading-relaxed text-surface-600">
            Ask Admin to verify chef accounts before creating clinical meal referrals.
          </p>
        </section>
      ) : (
        <section className="space-y-3">
          {chefs.map(chef => {
            const selected = selectedChef?.id === chef.id;
            return (
              <article
                key={chef.id}
                className={`card-medical rounded-2xl border-surface-100 p-4 transition-colors ${
                  selected ? 'ring-2 ring-primary-100' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xl font-black text-primary-700">
                    {chef.fullName.split(' ').map(part => part[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-black text-surface-900">{chef.fullName}</h2>
                      <CheckCircle size={15} className="text-success" />
                    </div>
                    <p className="mt-1 text-xs font-semibold text-surface-500">{chef.kitchen} - {chef.specialties.slice(0, 2).join(', ')}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-surface-500">
                      <MapPin size={12} className="text-primary-500" />
                      {chef.location}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-surface-500">
                      <span className="inline-flex items-center gap-1 text-warning">
                        <Star size={13} />
                        {chef.rating} ({chef.reviewCount})
                      </span>
                      <span>{chef.priceEstimate.toLocaleString()} XAF estimate</span>
                      <span className={chef.availability === 'Available' ? 'text-success' : 'text-warning'}>{chef.availability}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link href={`/dietitian/chef-profile?chef=${encodeURIComponent(chef.id)}`} className="btn-outline flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs">
                        <ChefHat size={14} />
                        View Profile
                      </Link>
                      <button
                        type="button"
                        onClick={() => setSelectedChef(chef)}
                        className="btn-primary flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs"
                      >
                        <Send size={14} />
                        Refer
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <label className="form-label" htmlFor="notesForChef">Chef-facing instructions</label>
        <textarea
          id="notesForChef"
          className="input-medical min-h-28 rounded-2xl"
          value={notesForChef}
          onChange={event => setNotesForChef(event.target.value)}
        />
        <p className="mt-2 text-xs text-surface-500">
          Keep this practical: cooking method, ingredient restrictions, portion guidance, and delivery timing only.
        </p>
      </section>

      {error && (
        <p className="form-error rounded-xl border border-alert/20 bg-alert/10 px-3 py-2">
          {error}
        </p>
      )}

      {selectedChef && (
        <section className="sticky bottom-20 rounded-2xl border border-primary-100 bg-white p-4 shadow-lg shadow-surface-200/80 md:bottom-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <ShieldCheck size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-surface-900">Selected: {selectedChef.fullName}</p>
              <p className="mt-1 text-xs text-surface-500">{patient?.name} - {patient?.condition}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-primary-100 bg-primary-50 p-3 text-xs leading-relaxed text-primary-700">
            Private clinical notes stay with the dietitian. Chefs receive only safe preparation instructions.
          </div>
          <button type="button" onClick={sendReferral} className="btn-primary mt-4 flex w-full items-center justify-center gap-2 rounded-2xl">
            <UtensilsCrossed size={17} />
            Send Referral
          </button>
        </section>
      )}
    </div>
  );
}
