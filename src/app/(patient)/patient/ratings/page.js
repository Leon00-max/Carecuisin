'use client';

import { useEffect, useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { getOrders } from '@/lib/orderStore';
import { createRating, getRatings } from '@/lib/ratingStore';
import { getReferralsForPatient } from '@/lib/referralStore';
import { getCurrentUserId, getUserById } from '@/lib/userStore';

export default function PatientRatingsPage() {
  const [patientId, setPatientId] = useState('');
  const [targets, setTargets] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [form, setForm] = useState({
    professionalId: '',
    role: 'chef',
    stars: 5,
    comment: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function refresh() {
    const id = getCurrentUserId();
    const referrals = id ? getReferralsForPatient(id) : [];
    const orders = id ? getOrders({ patientId: id }) : [];
    const items = [];

    referrals.forEach(referral => {
      if (referral.dietitianId) items.push({ professionalId: referral.dietitianId, role: 'dietitian' });
      if (referral.chefId) items.push({ professionalId: referral.chefId, role: 'chef' });
    });
    orders.forEach(order => {
      if (order.chefId) items.push({ professionalId: order.chefId, role: 'chef', relatedType: 'order', relatedId: order.id });
    });

    const unique = items.filter((item, index, list) =>
      list.findIndex(other => other.professionalId === item.professionalId && other.role === item.role) === index
    );

    setPatientId(id || '');
    setTargets(unique);
    setRatings(id ? getRatings({ patientId: id }) : []);
    setForm(prev => ({
      ...prev,
      professionalId: prev.professionalId || unique[0]?.professionalId || '',
      role: prev.professionalId ? prev.role : unique[0]?.role || 'chef',
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
      const rating = createRating({
        patientId,
        professionalId: form.professionalId,
        role: form.role,
        stars: form.stars,
        comment: form.comment,
      });
      setMessage(`Thank you. Your ${rating.stars}-star feedback was saved.`);
      setForm(prev => ({ ...prev, comment: '' }));
      refresh();
    } catch (err) {
      setError(err.message || 'Feedback could not be saved.');
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <span className="badge-clinical mb-2">Quality feedback</span>
        <h1 className="text-2xl font-black text-surface-900">Rate your care team</h1>
        <p className="mt-1 text-sm text-surface-500">Ratings help Admin maintain trusted dietitian and chef quality.</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="card-medical space-y-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <ThumbsUp size={22} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-surface-900">Submit feedback</h2>
              <p className="text-xs text-surface-500">Feedback is visible to Admin and the professional.</p>
            </div>
          </div>

          {targets.length === 0 ? (
            <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm text-surface-700">
              No completed care relationship is available for rating yet.
            </div>
          ) : (
            <div>
              <label className="form-label" htmlFor="professionalId">Professional</label>
              <select
                id="professionalId"
                className="input-medical"
                value={`${form.role}:${form.professionalId}`}
                onChange={event => {
                  const [role, professionalId] = event.target.value.split(':');
                  setForm(prev => ({ ...prev, role, professionalId }));
                }}
              >
                {targets.map(target => {
                  const user = getUserById(target.professionalId);
                  return (
                    <option key={`${target.role}-${target.professionalId}`} value={`${target.role}:${target.professionalId}`}>
                      {user?.fullName || target.professionalId} - {target.role}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div>
            <label className="form-label">Rating</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, stars: value }))}
                  className={`flex h-12 items-center justify-center rounded-2xl border transition-colors ${
                    Number(form.stars) >= value ? 'border-warning/30 bg-warning/10 text-warning' : 'border-surface-100 text-surface-400'
                  }`}
                  aria-label={`${value} stars`}
                >
                  <Star size={18} fill="currentColor" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              className="input-medical min-h-28 resize-none"
              placeholder="What went well? What should improve?"
              value={form.comment}
              onChange={event => setForm(prev => ({ ...prev, comment: event.target.value }))}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-xs font-semibold text-success">{message}</p>}

          <button type="submit" className="btn-primary w-full" disabled={!targets.length}>Submit Rating</button>
        </form>

        <section className="card-medical rounded-2xl">
          <h2 className="text-lg font-bold text-surface-900">Your feedback history</h2>
          <div className="mt-4 space-y-3">
            {ratings.length === 0 ? (
              <div className="rounded-2xl border border-surface-100 bg-surface-50 p-5 text-center text-sm text-surface-500">
                No ratings submitted yet.
              </div>
            ) : (
              ratings.map(rating => {
                const user = getUserById(rating.professionalId);
                return (
                  <article key={rating.id} className="rounded-2xl border border-surface-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-surface-900">{user?.fullName || rating.professionalId}</p>
                        <p className="mt-1 text-xs capitalize text-surface-500">{rating.role}</p>
                      </div>
                      <span className="rounded-full border border-warning/20 bg-warning/10 px-2.5 py-1 text-[11px] font-bold text-warning">
                        {rating.stars}/5
                      </span>
                    </div>
                    {rating.comment && <p className="mt-3 text-sm text-surface-600">{rating.comment}</p>}
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
