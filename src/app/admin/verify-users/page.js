'use client';

/**
 * app/(admin)/admin/verify-users/page.js
 *
 * Admin page for reviewing and approving / rejecting
 * pending dietitian and chef applications.
 *
 * CRITICAL FIX: calls approveUser(id) / rejectUser(id)
 * from lib/userStore — which updates the SINGLE authoritative
 * cc_users record. The old broken version wrote to a separate
 * cc_approved_users key that nothing else read.
 */

import { useState, useEffect } from 'react';
import {
  getPendingProfessionals,
  approveUser,
  rejectUser,
} from '@/lib/userStore';
import {
  ShieldCheck,
  XCircle,
  FileText,
  User,
  Phone,
  Building,
  Award,
  Clock,
} from 'lucide-react';

export default function VerifyUsersPage() {
  const [pending,      setPending]      = useState([]);
  const [rejecting,    setRejecting]    = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toast,        setToast]        = useState(null);

  /* ── Load pending professionals ── */
  function load() {
    const users    = getPendingProfessionals();
    const enriched = users.map(user => {
      let profile = {};
      try {
        /* Try user-specific key first, then fall back to shared key
           (shared key is used in single-user dev/demo mode)         */
        const key    = user.role === 'dietitian'
          ? 'cc_onboarding_dietitian_step1'
          : 'cc_onboarding_chef_step1';
        const raw    = localStorage.getItem(`${key}_${user.id}`)
                    || localStorage.getItem(key);
        if (raw) profile = JSON.parse(raw);
      } catch (_) {}
      return { ...user, profile };
    });
    setPending(enriched);
  }

  useEffect(() => {
    load();
    /* Re-load instantly when another tab writes to cc_users */
    const handler = e => { if (e.key === 'cc_users') load(); };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  /* ── Toast helper ── */
  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  /* ── Approve ── */
  function handleApprove(user) {
    approveUser(user.id);                                  // ← updates cc_users
    setPending(prev => prev.filter(u => u.id !== user.id));
    showToast(`${user.fullName} approved successfully.`, 'success');
  }

  /* ── Reject ── */
  function handleRejectConfirm(user) {
    rejectUser(user.id, rejectReason.trim());              // ← updates cc_users
    setPending(prev => prev.filter(u => u.id !== user.id));
    setRejecting(null);
    setRejectReason('');
    showToast(`${user.fullName}'s application rejected.`, 'error');
  }

  return (
    <div className="space-y-7">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 transition-all ${
          toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success'
            ? <ShieldCheck size={16} />
            : <XCircle    size={16} />
          }
          {toast.msg}
        </div>
      )}

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Verification Vault</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Review and approve professional applications before they access the platform.
        </p>
      </div>

      {/* ── Pending count badge ── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm font-semibold text-amber-700">
            {pending.length} pending{' '}
            {pending.length === 1 ? 'application' : 'applications'}
          </span>
        </div>
      </div>

      {/* ── Empty state ── */}
      {pending.length === 0 && (
        <div className="bg-white border border-surface-100 rounded-2xl py-16 text-center">
          <ShieldCheck size={36} className="text-emerald-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-surface-700">
            All clear — no pending verifications
          </p>
          <p className="text-xs text-surface-400 mt-1">
            New applications appear here automatically.
          </p>
        </div>
      )}

      {/* ── Application cards ── */}
      <div className="space-y-5">
        {pending.map(user => {
          const p = user.profile || {};

          return (
            <div key={user.id}
              className="bg-white border border-surface-100 rounded-2xl overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 bg-surface-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    user.role === 'dietitian'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {(user.fullName || '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-surface-900">{user.fullName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                        user.role === 'dietitian'
                          ? 'bg-primary-50 text-primary-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-surface-400">
                      {user.email} · {user.id}
                    </p>
                  </div>
                </div>

                {/* Submitted date */}
                <div className="flex items-center gap-1.5 text-xs text-surface-400 shrink-0">
                  <Clock size={11} />
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })
                    : 'Recently'
                  }
                </div>
              </div>

              {/* Profile fields */}
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">

                  {/* Fields common to both roles */}
                  <InfoRow icon={Phone}    label="Phone"
                    value={p.phone || user.phone || '—'} />
                  <InfoRow icon={Building}
                    label={user.role === 'dietitian' ? 'Workplace' : 'Establishment'}
                    value={p.workplace || p.establishmentName || '—'} />
                  <InfoRow icon={User}
                    label={user.role === 'dietitian' ? 'Service Area' : 'Location'}
                    value={p.serviceArea || p.establishmentLocation || p.location || '—'} />

                  {/* Dietitian-specific fields */}
                  {user.role === 'dietitian' && (
                    <>
                      <InfoRow icon={Award}    label="Qualification"
                        value={p.qualification || p.degreeType || '—'} />
                      <InfoRow icon={Building} label="Institution"
                        value={p.institution || '—'} />
                      <InfoRow icon={FileText} label="License No."
                        value={p.licenseNumber || '—'} />
                      <InfoRow icon={User}     label="Years of Experience"
                        value={p.yearsOfExperience ? `${p.yearsOfExperience} years` : '—'} />
                      <InfoRow icon={Phone}    label="Supervisor Contact"
                        value={p.supervisorContact || '—'} />
                    </>
                  )}

                  {/* Chef-specific fields */}
                  {user.role === 'chef' && (
                    <>
                      <InfoRow icon={Award}      label="Work Environment"
                        value={p.workEnvironment || '—'} />
                      <InfoRow icon={User}        label="Years Experience"
                        value={p.yearsExperience ? `${p.yearsExperience} years` : '—'} />
                      <InfoRow icon={Phone}       label="Reference Contact"
                        value={p.referencePhone || '—'} />
                      <InfoRow
                        icon={ShieldCheck}
                        label="Medical-Capable"
                        value={p.canFollowMedicalPlans ? 'Yes — confirmed' : 'Not confirmed'}
                        valueColor={p.canFollowMedicalPlans ? 'text-emerald-600' : 'text-amber-600'}
                      />
                    </>
                  )}

                </div>

                {/* Documents note */}
                <div className="mt-4 pt-4 border-t border-surface-50 flex items-center gap-2 text-xs text-surface-400">
                  <FileText size={12} />
                  {p.degreeFileName || p.mealPhotoFileName || p.certFileName
                    ? 'Documents uploaded — review in file storage (Supabase when wired).'
                    : 'No document files uploaded yet.'
                  }
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 px-6 pb-5">

                <button
                  onClick={() => handleApprove(user)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <ShieldCheck size={15} />
                  Approve
                </button>

                <button
                  onClick={() => { setRejecting(user.id); setRejectReason(''); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors border border-red-200"
                >
                  <XCircle size={15} />
                  Reject
                </button>

                {/* Inline reject-reason form */}
                {rejecting === user.id && (
                  <div className="flex flex-1 items-center gap-2 min-w-0">
                    <input
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection (optional)…"
                      className="input-medical flex-1 text-sm py-2"
                    />
                    <button
                      onClick={() => handleRejectConfirm(user)}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shrink-0"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setRejecting(null)}
                      className="px-3 py-2 rounded-xl text-sm text-surface-500 hover:bg-surface-100 transition-colors shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

/* ── Reusable info row ── */
function InfoRow({ icon: Icon, label, value, valueColor }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={13} className="text-surface-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-surface-400 font-medium">{label}</p>
        <p className={`text-sm font-semibold leading-snug ${valueColor || 'text-surface-800'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}