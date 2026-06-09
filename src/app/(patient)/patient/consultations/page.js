'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  CreditCard,
  MessageSquare,
  Search,
  ShieldCheck,
  Star,
  Stethoscope,
  WalletCards,
  XCircle,
} from 'lucide-react';
import { createConsultation, getConsultations } from '@/lib/consultationStore';
import { getDietitianSlots, isDietitianSlotAvailable } from '@/lib/availabilityStore';
import { createPayment, linkPaymentToRecord, PAYMENT_PROVIDERS, simulatePaymentResult } from '@/lib/paymentStore';
import { searchApprovedDietitians } from '@/lib/professionalSearchStore';
import { getCurrentUserId, getUserById } from '@/lib/userStore';
import { getWalletSummary } from '@/lib/walletStore';

function statusClass(status) {
  if (status === 'completed' || status === 'accepted' || status === 'scheduled') return 'bg-success/10 text-success border-success/20';
  if (status === 'rejected' || status === 'cancelled') return 'bg-alert/10 text-alert border-alert/20';
  return 'bg-warning/10 text-warning border-warning/20';
}

export default function PatientConsultationsPage() {
  const [patientId, setPatientId] = useState('');
  const [wallet, setWallet] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [filters, setFilters] = useState({
    query: '',
    condition: '',
    maxFee: '',
  });
  const [form, setForm] = useState({
    dietitianId: '',
    slot: '',
    reason: 'Initial nutrition consultation',
    healthConcern: '',
    provider: 'mtn_momo',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const dietitians = useMemo(
    () => searchApprovedDietitians(filters),
    [filters]
  );

  const selectedDietitian = useMemo(
    () => dietitians.find(item => item.id === form.dietitianId),
    [dietitians, form.dietitianId]
  );

  const availableSlots = useMemo(
    () => form.dietitianId
      ? getDietitianSlots(form.dietitianId, { daysAhead: 14 }).filter(slot => slot.available)
      : [],
    [form.dietitianId]
  );

  const selectedSlot = availableSlots.find(slot => slot.value === form.slot) || availableSlots[0] || null;

  function refresh() {
    const id = getCurrentUserId();
    const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
    const requestedDietitian = url?.searchParams.get('dietitian') || '';

    setPatientId(id || '');
    setWallet(id ? getWalletSummary(id) : null);
    setConsultations(id ? getConsultations({ patientId: id }) : []);
    setForm(prev => ({
      ...prev,
      dietitianId: prev.dietitianId || requestedDietitian || searchApprovedDietitians(filters)[0]?.id || '',
    }));
  }

  useEffect(() => {
    queueMicrotask(refresh);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      if (!patientId) throw new Error('Please log in again before booking a consultation.');
      if (!selectedDietitian) throw new Error('Choose an approved dietitian.');
      if (!selectedSlot) throw new Error('Choose an available slot.');
      if (!isDietitianSlotAvailable(selectedDietitian.id, selectedSlot.value)) {
        throw new Error('This slot was just taken. Please choose another available time.');
      }
      const fee = Number(selectedSlot.fee || selectedDietitian.fee || 2500);
      const payment = createPayment({
        userId: patientId,
        amount: fee,
        provider: form.provider,
        phone: form.phone,
        relatedType: 'consultation_pending',
        description: `Consultation with ${selectedDietitian.fullName}`,
        recipientId: selectedDietitian.id,
        purpose: 'consultation',
        metadata: {
          dietitianId: selectedDietitian.id,
          slot: selectedSlot.value,
          reason: form.reason,
        },
      });
      const completedPayment = simulatePaymentResult(payment.id, 'successful');
      const consultation = createConsultation({
        patientId,
        dietitianId: form.dietitianId,
        requestedDateTime: selectedSlot.value,
        reason: form.reason,
        healthConcern: form.healthConcern,
        paymentStatus: 'paid',
        consultationFee: fee,
        paymentId: completedPayment.id,
        paymentMethod: form.provider,
      });
      linkPaymentToRecord(completedPayment.id, 'consultation', consultation.id);
      setMessage(`Consultation ${consultation.id} was booked and paid. Receipt ${completedPayment.receiptNumber} is ready.`);
      setForm(prev => ({ ...prev, healthConcern: '' }));
      refresh();
    } catch (err) {
      setError(err.message || 'Could not submit consultation request.');
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="badge-clinical mb-2">Dietitian care</span>
          <h1 className="text-2xl font-black text-surface-900">Book a consultation</h1>
          <p className="mt-1 text-sm text-surface-500">
            Request time with a verified dietitian before your meal plan is prescribed.
          </p>
        </div>
        <Link href="/patient/messages" className="btn-outline inline-flex items-center justify-center gap-2">
          <MessageSquare size={17} />
          Messages
        </Link>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSubmit} className="card-medical space-y-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <Stethoscope size={22} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-surface-900">Consultation request</h2>
              <p className="text-xs text-surface-500">Choose a verified dietitian, pay, and send the booking request.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="form-label" htmlFor="query">Search dietitians</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  id="query"
                  className="input-medical pl-10"
                  placeholder="Diabetes, hypertension, kidney..."
                  value={filters.query}
                  onChange={event => setFilters(prev => ({ ...prev, query: event.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="condition">Condition</label>
              <select
                id="condition"
                className="input-medical"
                value={filters.condition}
                onChange={event => setFilters(prev => ({ ...prev, condition: event.target.value }))}
              >
                <option value="">Any</option>
                <option value="diabetes">Diabetes</option>
                <option value="hypertension">Hypertension</option>
                <option value="kidney">Kidney disease</option>
                <option value="weight">Weight management</option>
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="maxFee">Max fee</label>
              <input
                id="maxFee"
                className="input-medical"
                type="number"
                placeholder="5000"
                value={filters.maxFee}
                onChange={event => setFilters(prev => ({ ...prev, maxFee: event.target.value }))}
              />
            </div>
          </div>

          {dietitians.length === 0 ? (
            <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm text-surface-700">
              No approved dietitian account is available yet. Ask an admin to approve a dietitian, then return here.
            </div>
          ) : (
            <div className="space-y-3">
              <label className="form-label" htmlFor="dietitianId">Dietitian</label>
              <div className="grid gap-3">
                {dietitians.slice(0, 4).map(dietitian => {
                  const active = form.dietitianId === dietitian.id;
                  return (
                    <button
                      key={dietitian.id}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, dietitianId: dietitian.id, slot: '' }))}
                      className={`rounded-2xl border p-4 text-left transition-colors ${
                        active ? 'border-primary-200 bg-primary-50' : 'border-surface-100 bg-white hover:border-primary-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-primary-700 shadow-sm">
                          {dietitian.fullName.split(' ').map(part => part[0]).join('').slice(0, 2)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-black text-surface-900">{dietitian.fullName}</span>
                            <ShieldCheck size={15} className="text-success" />
                          </span>
                          <span className="mt-1 block text-xs text-surface-500">{dietitian.specialties.slice(0, 2).join(' - ')}</span>
                          <span className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-surface-500">
                            <span className="inline-flex items-center gap-1 text-warning"><Star size={13} /> {dietitian.rating}</span>
                            <span>{dietitian.fee.toLocaleString()} XAF</span>
                            <span>{dietitian.nextSlot ? `Next ${dietitian.nextSlot.time}` : 'No slot yet'}</span>
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="form-label" htmlFor="slot">Available slot</label>
            <select
              id="slot"
              className="input-medical"
              value={form.slot || selectedSlot?.value || ''}
              onChange={event => setForm(prev => ({ ...prev, slot: event.target.value }))}
              disabled={!availableSlots.length}
            >
              {availableSlots.length === 0 && <option value="">No available slots</option>}
              {availableSlots.slice(0, 20).map(slot => (
                <option key={slot.value} value={slot.value}>{slot.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="reason">Consultation reason</label>
            <select
              id="reason"
              className="input-medical"
              value={form.reason}
              onChange={event => setForm(prev => ({ ...prev, reason: event.target.value }))}
            >
              <option>Initial nutrition consultation</option>
              <option>Meal plan review</option>
              <option>Health progress follow-up</option>
              <option>Condition-specific dietary support</option>
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="healthConcern">Health concern or goal</label>
            <textarea
              id="healthConcern"
              className="input-medical min-h-28 resize-none"
              placeholder="Example: I want meals that support blood sugar stability and blood pressure control."
              value={form.healthConcern}
              onChange={event => setForm(prev => ({ ...prev, healthConcern: event.target.value }))}
            />
          </div>

          {selectedDietitian && (
            <div className="rounded-2xl border border-success/20 bg-success/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-success">Verified professional</p>
              <p className="mt-1 text-sm font-bold text-surface-900">{selectedDietitian.fullName}</p>
              <p className="text-xs text-surface-500">{selectedDietitian.bio}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full border border-primary-100 bg-white px-2 py-1 text-primary-700">
                  Fee: {(selectedSlot?.fee || selectedDietitian.fee).toLocaleString()} XAF
                </span>
                <span className="rounded-full border border-primary-100 bg-white px-2 py-1 text-primary-700">
                  Wallet: {Number(wallet?.balance || 0).toLocaleString()} XAF
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="form-label">Payment method</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.values(PAYMENT_PROVIDERS).map(provider => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, provider: provider.id }))}
                  className={`flex items-center gap-2 rounded-2xl border p-3 text-left text-xs font-bold transition-colors ${
                    form.provider === provider.id
                      ? 'border-primary-200 bg-primary-50 text-primary-700'
                      : 'border-surface-100 bg-white text-surface-500'
                  }`}
                >
                  {provider.id === 'wallet' ? <WalletCards size={16} /> : <CreditCard size={16} />}
                  {provider.label}
                </button>
              ))}
            </div>
          </div>

          {form.provider !== 'wallet' && (
            <div>
              <label className="form-label" htmlFor="phone">MoMo/Orange number</label>
              <input
                id="phone"
                className="input-medical"
                placeholder="6XXXXXXXX"
                value={form.phone}
                onChange={event => setForm(prev => ({ ...prev, phone: event.target.value }))}
              />
            </div>
          )}

          {error && <p className="form-error">{error}</p>}
          {message && <p className="rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-xs font-semibold text-success">{message}</p>}

          <button type="submit" className="btn-primary w-full" disabled={!dietitians.length}>
            Pay and Book Consultation
          </button>
        </form>

        <section className="card-medical rounded-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-surface-900">Request status</h2>
              <p className="text-xs text-surface-500">Follow every booking from request to completion.</p>
            </div>
            <CalendarClock className="text-primary-600" size={20} />
          </div>

          <div className="space-y-3">
            {consultations.length === 0 ? (
              <div className="rounded-2xl border border-surface-100 bg-surface-50 p-5 text-center">
                <Clock className="mx-auto text-surface-400" size={24} />
                <p className="mt-3 text-sm font-bold text-surface-900">No consultation requests yet</p>
                <p className="mt-1 text-xs text-surface-500">Your status history will appear here after you submit a request.</p>
              </div>
            ) : (
              consultations.map(item => {
                const dietitian = getUserById(item.dietitianId);
                return (
                  <article key={item.id} className="rounded-2xl border border-surface-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-surface-900">{item.reason}</p>
                        <p className="mt-1 text-xs text-surface-500">{dietitian?.fullName || 'Assigned dietitian'}</p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-surface-50 p-3">
                        <p className="font-semibold text-surface-500">Requested</p>
                        <p className="mt-1 font-bold text-surface-900">{item.requestedDateTime || 'Not set'}</p>
                      </div>
                      <div className="rounded-xl bg-surface-50 p-3">
                        <p className="font-semibold text-surface-500">Payment</p>
                        <p className="mt-1 font-bold capitalize text-surface-900">{item.paymentStatus || 'pending'}</p>
                      </div>
                    </div>
                    {item.status === 'scheduled' && (
                      <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-success">
                        <CheckCircle2 size={14} />
                        Scheduled for {item.scheduledDateTime}
                      </p>
                    )}
                    {item.status === 'rejected' && (
                      <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-alert">
                        <XCircle size={14} />
                        {item.rejectionReason || 'The dietitian could not accept this slot.'}
                      </p>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
