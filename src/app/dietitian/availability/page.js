'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  Clock,
  Plus,
  Save,
  Trash2,
  WalletCards,
} from 'lucide-react';
import {
  DEFAULT_AVAILABILITY,
  getDietitianAvailability,
  getDietitianSlots,
  saveDietitianAvailability,
} from '@/lib/availabilityStore';
import { getCurrentUserId } from '@/lib/userStore';

const DAYS = [
  { key: 'Mon', label: 'Mon' },
  { key: 'Tue', label: 'Tue' },
  { key: 'Wed', label: 'Wed' },
  { key: 'Thu', label: 'Thu' },
  { key: 'Fri', label: 'Fri' },
  { key: 'Sat', label: 'Sat' },
  { key: 'Sun', label: 'Sun' },
];

function normalizeAvailability(value) {
  return {
    ...DEFAULT_AVAILABILITY,
    ...value,
    unavailableDates: value?.unavailableDates || [],
  };
}

export default function AvailabilityPage() {
  const [dietitianId, setDietitianId] = useState('');
  const [form, setForm] = useState(normalizeAvailability(DEFAULT_AVAILABILITY));
  const [blockedDate, setBlockedDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function refresh() {
    const id = getCurrentUserId();
    setDietitianId(id || '');
    setForm(normalizeAvailability(getDietitianAvailability(id)));
  }

  useEffect(() => {
    queueMicrotask(refresh);
  }, []);

  const previewSlots = useMemo(
    () => dietitianId
      ? getDietitianSlots(dietitianId, { daysAhead: 10 }).filter(slot => slot.available).slice(0, 8)
      : [],
    [dietitianId, form]
  );

  function toggleDay(day) {
    setForm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(item => item !== day)
        : [...prev.days, day],
    }));
  }

  function addBlockedDate() {
    if (!blockedDate) return;
    setForm(prev => ({
      ...prev,
      unavailableDates: prev.unavailableDates.includes(blockedDate)
        ? prev.unavailableDates
        : [...prev.unavailableDates, blockedDate],
    }));
    setBlockedDate('');
  }

  function removeBlockedDate(date) {
    setForm(prev => ({
      ...prev,
      unavailableDates: prev.unavailableDates.filter(item => item !== date),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      if (!dietitianId) throw new Error('Please log in again before saving availability.');
      const saved = saveDietitianAvailability(dietitianId, form, dietitianId);
      setForm(normalizeAvailability(saved));
      setMessage('Availability saved. Patients can now book from these slots.');
    } catch (err) {
      setError(err.message || 'Could not save availability.');
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2">
          <CalendarDays size={14} />
          Availability
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Consultation Hours</h1>
        <p className="mt-2 text-sm text-surface-500">
          Set patient booking windows, consultation fees, and unavailable dates.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <section className="card-medical space-y-5 rounded-2xl border-surface-100 p-5">
          <div>
            <h2 className="text-sm font-black text-surface-900">Working Days</h2>
            <p className="mt-1 text-xs text-surface-500">Patients only see slots generated from these days.</p>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {DAYS.map(day => {
                const active = form.days.includes(day.key);
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => toggleDay(day.key)}
                    className={`min-h-14 rounded-2xl border text-xs font-black transition-colors ${
                      active
                        ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                        : 'border-surface-100 bg-white text-surface-400 hover:border-primary-100'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="startTime" className="form-label">Start time</label>
              <input
                id="startTime"
                type="time"
                className="input-medical"
                value={form.startTime}
                onChange={event => setForm(prev => ({ ...prev, startTime: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="endTime" className="form-label">End time</label>
              <input
                id="endTime"
                type="time"
                className="input-medical"
                value={form.endTime}
                onChange={event => setForm(prev => ({ ...prev, endTime: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="durationMinutes" className="form-label">Consultation duration</label>
              <select
                id="durationMinutes"
                className="input-medical"
                value={form.durationMinutes}
                onChange={event => setForm(prev => ({ ...prev, durationMinutes: event.target.value }))}
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            <div>
              <label htmlFor="breakMinutes" className="form-label">Break between sessions</label>
              <select
                id="breakMinutes"
                className="input-medical"
                value={form.breakMinutes}
                onChange={event => setForm(prev => ({ ...prev, breakMinutes: event.target.value }))}
              >
                <option value="0">No break</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
            <div>
              <label htmlFor="consultationFee" className="form-label">Consultation fee (XAF)</label>
              <input
                id="consultationFee"
                type="number"
                min="500"
                className="input-medical"
                value={form.consultationFee}
                onChange={event => setForm(prev => ({ ...prev, consultationFee: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="maxBookingsPerDay" className="form-label">Max bookings per day</label>
              <input
                id="maxBookingsPerDay"
                type="number"
                min="1"
                className="input-medical"
                value={form.maxBookingsPerDay}
                onChange={event => setForm(prev => ({ ...prev, maxBookingsPerDay: event.target.value }))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="mode" className="form-label">Consultation mode</label>
            <select
              id="mode"
              className="input-medical"
              value={form.mode}
              onChange={event => setForm(prev => ({ ...prev, mode: event.target.value }))}
            >
              <option>Online or in-person</option>
              <option>Online only</option>
              <option>In-person only</option>
            </select>
          </div>

          <div>
            <label htmlFor="blockedDate" className="form-label">Unavailable dates</label>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                id="blockedDate"
                type="date"
                className="input-medical"
                value={blockedDate}
                onChange={event => setBlockedDate(event.target.value)}
              />
              <button type="button" onClick={addBlockedDate} className="btn-outline inline-flex items-center justify-center gap-2">
                <Plus size={16} />
                Add Date
              </button>
            </div>
            {form.unavailableDates.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.unavailableDates.map(date => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => removeBlockedDate(date)}
                    className="inline-flex items-center gap-2 rounded-full border border-surface-100 bg-surface-50 px-3 py-1 text-xs font-bold text-surface-600"
                  >
                    {date}
                    <Trash2 size={12} className="text-alert" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="form-error flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-xs font-semibold text-success">
              {message}
            </p>
          )}

          <button type="submit" className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl">
            <Save size={17} />
            Save Availability
          </button>
        </section>

        <aside className="space-y-4">
          <section className="card-medical rounded-2xl border-surface-100 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <WalletCards size={20} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-surface-400">Patient fee</p>
                <p className="text-xl font-black text-surface-900">
                  {Number(form.consultationFee || 0).toLocaleString()} XAF
                </p>
              </div>
            </div>
          </section>

          <section className="card-medical rounded-2xl border-surface-100 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black text-surface-900">Next Open Slots</h2>
                <p className="mt-1 text-xs text-surface-500">Preview of what patients will see.</p>
              </div>
              <Clock size={20} className="text-primary-600" />
            </div>

            <div className="mt-4 space-y-2">
              {previewSlots.length === 0 ? (
                <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4 text-xs font-semibold text-surface-600">
                  Save availability to generate patient-visible slots.
                </div>
              ) : (
                previewSlots.map(slot => (
                  <div key={slot.value} className="flex items-center justify-between gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-3">
                    <div>
                      <p className="text-xs font-black text-surface-900">{slot.day}</p>
                      <p className="mt-1 text-xs text-surface-500">{slot.date} at {slot.time}</p>
                    </div>
                    <span className="rounded-full border border-success/20 bg-success/10 px-2 py-1 text-[11px] font-bold text-success">
                      Open
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-success/20 bg-success/10 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-success">
              <CheckCircle size={17} />
              Double-booking protected
            </div>
            <p className="mt-2 text-xs leading-relaxed text-surface-600">
              Booked consultation times are removed from patient slot options automatically.
            </p>
          </section>
        </aside>
      </form>
    </div>
  );
}
