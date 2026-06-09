'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, LifeBuoy, ShieldAlert } from 'lucide-react';
import { getComplaints, submitComplaint } from '@/lib/complaintStore';
import { getCurrentUserId } from '@/lib/userStore';

function statusClass(status) {
  if (status === 'resolved' || status === 'closed') return 'bg-success/10 text-success border-success/20';
  if (status === 'rejected') return 'bg-alert/10 text-alert border-alert/20';
  return 'bg-warning/10 text-warning border-warning/20';
}

export default function PatientComplaintsPage() {
  const [userId, setUserId] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    type: 'order',
    priority: 'medium',
    summary: '',
    description: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function refresh() {
    const id = getCurrentUserId();
    setUserId(id || '');
    setComplaints(id ? getComplaints({ submittedBy: id }) : []);
  }

  useEffect(() => {
    queueMicrotask(refresh);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const complaint = submitComplaint({
        submittedBy: userId,
        type: form.type,
        priority: form.priority,
        summary: form.summary,
        description: form.description,
      });
      setMessage(`Complaint ${complaint.id} has been sent to Admin.`);
      setForm(prev => ({ ...prev, summary: '', description: '' }));
      refresh();
    } catch (err) {
      setError(err.message || 'Complaint could not be submitted.');
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <span className="badge-clinical mb-2">Support and safety</span>
        <h1 className="text-2xl font-black text-surface-900">Complaints</h1>
        <p className="mt-1 text-sm text-surface-500">Raise meal, payment, consultation, or platform issues and track Admin action.</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="card-medical space-y-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-alert/10 text-alert">
              <ShieldAlert size={22} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-surface-900">Submit an issue</h2>
              <p className="text-xs text-surface-500">Admin will review and respond inside the platform.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="type">Complaint type</label>
              <select
                id="type"
                className="input-medical"
                value={form.type}
                onChange={event => setForm(prev => ({ ...prev, type: event.target.value }))}
              >
                <option value="consultation">Consultation</option>
                <option value="dietitian">Dietitian</option>
                <option value="chef">Chef</option>
                <option value="order">Order</option>
                <option value="payment">Payment</option>
                <option value="platform">Platform issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="priority">Priority</label>
              <select
                id="priority"
                className="input-medical"
                value={form.priority}
                onChange={event => setForm(prev => ({ ...prev, priority: event.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="summary">Short summary</label>
            <input
              id="summary"
              className="input-medical"
              placeholder="Example: Food arrived late and cold"
              value={form.summary}
              onChange={event => setForm(prev => ({ ...prev, summary: event.target.value }))}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="description">Details</label>
            <textarea
              id="description"
              className="input-medical min-h-32 resize-none"
              placeholder="Explain what happened, who was involved, and what support you need."
              value={form.description}
              onChange={event => setForm(prev => ({ ...prev, description: event.target.value }))}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-xs font-semibold text-success">{message}</p>}

          <button type="submit" className="btn-primary w-full">Submit Complaint</button>
        </form>

        <section className="card-medical rounded-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-surface-900">Tracking</h2>
              <p className="text-xs text-surface-500">Every issue keeps status and response history.</p>
            </div>
            <LifeBuoy className="text-primary-600" size={21} />
          </div>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="rounded-2xl border border-surface-100 bg-surface-50 p-5 text-center">
                <CheckCircle2 className="mx-auto text-success" size={24} />
                <p className="mt-3 text-sm font-bold text-surface-900">No complaints submitted</p>
                <p className="mt-1 text-xs text-surface-500">If something goes wrong, submit it here and Admin will see it.</p>
              </div>
            ) : (
              complaints.map(complaint => (
                <article key={complaint.id} className="rounded-2xl border border-surface-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-surface-900">{complaint.summary}</p>
                      <p className="mt-1 text-xs text-surface-500">{complaint.id} - {complaint.type}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(complaint.status)}`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-surface-600">{complaint.description}</p>
                  {complaint.adminResponse && (
                    <div className="mt-3 rounded-xl border border-primary-100 bg-primary-50 p-3 text-xs text-primary-700">
                      {complaint.adminResponse}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
