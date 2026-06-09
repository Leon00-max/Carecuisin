'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardPlus,
  FileCheck2,
  Stethoscope,
  XCircle,
} from 'lucide-react';
import { getConsultations, updateConsultationStatus } from '@/lib/consultationStore';
import { createReport } from '@/lib/reportStore';
import { getCurrentUserId, getUserById } from '@/lib/userStore';

function statusClass(status) {
  if (status === 'completed' || status === 'accepted' || status === 'scheduled') return 'bg-success/10 text-success border-success/20';
  if (status === 'rejected' || status === 'cancelled') return 'bg-alert/10 text-alert border-alert/20';
  return 'bg-warning/10 text-warning border-warning/20';
}

export default function DietitianConsultationsPage() {
  const [dietitianId, setDietitianId] = useState('');
  const [consultations, setConsultations] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function refresh() {
    const id = getCurrentUserId();
    const records = id ? getConsultations({ dietitianId: id }) : [];
    setDietitianId(id || '');
    setConsultations(records);
    setSelectedId(prev => prev || records[0]?.id || '');
  }

  useEffect(() => {
    queueMicrotask(refresh);
  }, []);

  const selected = consultations.find(item => item.id === selectedId) || consultations[0];
  const selectedPatient = selected ? getUserById(selected.patientId) : null;

  function updateSelected(status, extra = {}) {
    setError('');
    setMessage('');

    try {
      if (!selected) throw new Error('Select a consultation first.');
      const updated = updateConsultationStatus(
        selected.id,
        status,
        {
          scheduledDateTime: extra.scheduledDateTime || scheduledDateTime || selected.scheduledDateTime,
          notes: extra.notes || notes || selected.notes,
          rejectionReason: extra.rejectionReason || '',
        },
        dietitianId
      );
      setMessage(`Consultation ${updated.id} is now ${status}.`);
      refresh();
    } catch (err) {
      setError(err.message || 'Consultation update failed.');
    }
  }

  function handleReport() {
    setError('');
    setMessage('');

    try {
      if (!selected) throw new Error('Select a completed consultation first.');
      if (selected.status !== 'completed') throw new Error('Reports should be generated after consultation completion.');
      const report = createReport({
        patientId: selected.patientId,
        dietitianId,
        consultationId: selected.id,
        title: 'Nutrition consultation report',
        publicSummary: 'This CareCuisin report confirms a completed nutrition consultation with a verified dietitian.',
      });
      setMessage(`Report ${report.id} generated with verification code ${report.verificationCode}.`);
    } catch (err) {
      setError(err.message || 'Report generation failed.');
    }
  }

  return (
    <div className="space-y-6 pb-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="badge-clinical mb-2">Clinical workflow</span>
          <h1 className="text-2xl font-black text-surface-900">Consultation requests</h1>
          <p className="mt-1 text-sm text-surface-500">
            Accept, schedule, reject, complete, and generate verified reports from patient requests.
          </p>
        </div>
        <Link href="/dietitian/create-plan" className="btn-primary inline-flex items-center justify-center gap-2">
          <ClipboardPlus size={17} />
          Create Plan
        </Link>
      </header>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="card-medical rounded-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-surface-900">Requests</h2>
              <p className="text-xs text-surface-500">{consultations.length} consultation records</p>
            </div>
            <Stethoscope className="text-primary-600" size={21} />
          </div>

          <div className="space-y-3">
            {consultations.length === 0 ? (
              <div className="rounded-2xl border border-surface-100 bg-surface-50 p-5 text-center">
                <p className="text-sm font-bold text-surface-900">No patient requests yet</p>
                <p className="mt-1 text-xs text-surface-500">New requests will appear here after patients book you.</p>
              </div>
            ) : (
              consultations.map(item => {
                const patient = getUserById(item.patientId);
                const active = selected?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id);
                      setScheduledDateTime(item.scheduledDateTime || '');
                      setNotes(item.notes || '');
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                      active ? 'border-primary-200 bg-primary-50' : 'border-surface-100 bg-white hover:border-primary-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-surface-900">{patient?.fullName || 'Patient'}</p>
                        <p className="mt-1 text-xs text-surface-500">{item.reason}</p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="card-medical rounded-2xl">
          {selected ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-surface-500">Selected patient</p>
                  <h2 className="mt-1 text-xl font-black text-surface-900">{selectedPatient?.fullName || 'Patient'}</h2>
                  <p className="mt-1 text-sm text-surface-500">{selected.healthConcern || selected.reason}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(selected.status)}`}>
                  {selected.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="form-label" htmlFor="scheduledDateTime">Scheduled time</label>
                  <input
                    id="scheduledDateTime"
                    type="datetime-local"
                    className="input-medical"
                    value={scheduledDateTime}
                    onChange={event => setScheduledDateTime(event.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Requested time</label>
                  <div className="flex min-h-[42px] items-center rounded-lg border border-surface-200 bg-surface-50 px-4 text-sm font-semibold text-surface-700">
                    {selected.requestedDateTime || 'Not set'}
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="notes">Consultation notes</label>
                <textarea
                  id="notes"
                  className="input-medical min-h-28 resize-none"
                  placeholder="Private dietitian working notes. Keep chef-facing instructions separate in the meal plan."
                  value={notes}
                  onChange={event => setNotes(event.target.value)}
                />
              </div>

              {error && <p className="form-error">{error}</p>}
              {message && <p className="rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-xs font-semibold text-success">{message}</p>}

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => updateSelected('accepted')} className="btn-outline inline-flex items-center justify-center gap-2">
                  <CheckCircle2 size={17} />
                  Accept
                </button>
                <button type="button" onClick={() => updateSelected('scheduled')} className="btn-primary inline-flex items-center justify-center gap-2">
                  <CalendarCheck size={17} />
                  Schedule
                </button>
                <button type="button" onClick={() => updateSelected('rejected', { rejectionReason: 'Dietitian unavailable for this slot.' })} className="btn-outline inline-flex items-center justify-center gap-2 text-alert hover:bg-alert/10">
                  <XCircle size={17} />
                  Reject
                </button>
                <button type="button" onClick={() => updateSelected('completed')} className="btn-outline inline-flex items-center justify-center gap-2 text-success hover:bg-success/10">
                  <CheckCircle2 size={17} />
                  Complete
                </button>
              </div>

              <button type="button" onClick={handleReport} className="btn-outline inline-flex w-full items-center justify-center gap-2">
                <FileCheck2 size={17} />
                Generate Verified Report
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-surface-100 bg-surface-50 p-8 text-center">
              <p className="text-sm font-bold text-surface-900">Select a consultation</p>
              <p className="mt-1 text-xs text-surface-500">Request details and clinical actions will appear here.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
