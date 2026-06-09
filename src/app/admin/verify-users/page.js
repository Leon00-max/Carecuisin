'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  UtensilsCrossed,
  XCircle,
} from 'lucide-react';
import {
  approveUser,
  getPendingProfessionals,
  rejectUser,
} from '@/lib/userStore';
import { demoVerificationApplications } from '@/lib/adminPortalData';
import { Avatar, Modal, PageHeader, SectionCard, SegmentedControl, StatusBadge } from '@/components/admin/AdminUI';

export default function VerifyUsersPage() {
  const [applications, setApplications] = useState(() => getApplicationsForVault());
  const [activeTab, setActiveTab] = useState('dietitian');
  const [selected, setSelected] = useState(null);
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handler = event => {
      if (event.key === 'cc_users') setApplications(getApplicationsForVault());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const counts = useMemo(() => ({
    dietitian: applications.filter(item => item.role === 'dietitian').length,
    chef: applications.filter(item => item.role === 'chef').length,
  }), [applications]);

  const visibleApplications = applications.filter(item => item.role === activeTab);

  function showToast(message, tone = 'success') {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2600);
  }

  function confirmApprove(app) {
    if (!app.isDemo) approveUser(app.id);
    setApplications(prev => prev.filter(item => item.id !== app.id));
    setApproveTarget(null);
    setSelected(null);
    showToast(`${app.fullName} verified successfully.`, 'success');
  }

  function confirmReject(app) {
    if (!rejectReason.trim()) return;
    if (!app.isDemo) rejectUser(app.id, rejectReason.trim());
    setApplications(prev => prev.filter(item => item.id !== app.id));
    setSelected(null);
    setRejectReason('');
    showToast(`${app.fullName} was rejected with a recorded reason.`, 'alert');
  }

  return (
    <div className="space-y-6 pb-4">
      {toast && (
        <div className={`fixed top-4 right-4 z-[90] rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lg ${
          toast.tone === 'alert'
            ? 'bg-alert/10 text-alert border-alert/20'
            : 'bg-success/10 text-success border-success/20'
        }`}>
          {toast.message}
        </div>
      )}

      <PageHeader
        eyebrow="Trust Operations"
        title="Verification Vault"
        subtitle="Review dietitian licenses and chef kitchen approvals before granting platform access."
        icon={ShieldCheck}
      />

      <SegmentedControl
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'dietitian', label: `Dietitians (${counts.dietitian})` },
          { key: 'chef', label: `Chefs (${counts.chef})` },
        ]}
      />

      <div className="space-y-4">
        {visibleApplications.length === 0 ? (
          <SectionCard title="All clear" subtitle="There are no pending applications in this vault." icon={CheckCircle2}>
            <div className="rounded-2xl border border-success/20 bg-success/10 p-6 text-center text-sm font-semibold text-success">
              Professional verification queue is clear.
            </div>
          </SectionCard>
        ) : (
          visibleApplications.map(app => (
            <ApplicationCard
              key={app.id}
              application={app}
              onView={() => {
                setSelected(app);
                setRejectReason('');
              }}
              onApprove={() => setApproveTarget(app)}
            />
          ))
        )}
      </div>

      {selected && (
        <Modal title="Verification Details" onClose={() => setSelected(null)}>
          <VerificationDetails
            application={selected}
            rejectReason={rejectReason}
            setRejectReason={setRejectReason}
            onApprove={() => setApproveTarget(selected)}
            onReject={() => confirmReject(selected)}
            onRequestInfo={() => showToast(`More information requested from ${selected.fullName}.`, 'warning')}
          />
        </Modal>
      )}

      {approveTarget && (
        <Modal title="Confirm Professional Approval" onClose={() => setApproveTarget(null)}>
          <div className="space-y-5">
            <div className="rounded-2xl bg-primary-50 border border-primary-100 p-4">
              <p className="text-sm font-bold text-surface-900">{approveTarget.fullName}</p>
              <p className="text-xs text-surface-500 capitalize mt-1">{approveTarget.role} application</p>
              <p className="text-xs text-primary-700 mt-3">
                Confirm that identity, credentials, and uploaded documents have been reviewed. Approval grants access to the {approveTarget.role} dashboard.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => confirmApprove(approveTarget)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <ShieldCheck size={16} />
                Approve Professional
              </button>
              <button type="button" onClick={() => setApproveTarget(null)} className="btn-outline flex-1">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ApplicationCard({ application, onView, onApprove }) {
  const isDietitian = application.role === 'dietitian';
  const Icon = isDietitian ? Stethoscope : UtensilsCrossed;
  const profile = application.profile || {};

  return (
    <div className="card-medical rounded-2xl !p-4 sm:!p-5">
      <div className="flex items-start gap-3">
        <Avatar name={application.fullName} tone={isDietitian ? 'primary' : 'success'} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-surface-900 truncate">{application.fullName}</p>
              <p className="text-xs text-surface-500 capitalize">{application.role} application</p>
            </div>
            <StatusBadge tone="warning" icon={Clock}>Pending</StatusBadge>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Info icon={Icon} label={isDietitian ? 'Qualification' : 'Kitchen'} value={isDietitian ? profile.qualification : profile.establishmentName} />
            <Info icon={Building2} label={isDietitian ? 'Workplace' : 'Location'} value={isDietitian ? profile.workplace : profile.establishmentLocation} />
            <Info icon={Award} label="Experience" value={`${profile.yearsOfExperience || profile.yearsExperience || '5'} years`} />
            <Info icon={FileText} label="Documents" value={profile.documents || 'Documents uploaded'} />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={onView} className="btn-outline flex-1 text-sm">
              View Details
            </button>
            <button type="button" onClick={onApprove} className="bg-success text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all active:scale-[0.98] flex-1 text-sm">
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerificationDetails({ application, rejectReason, setRejectReason, onApprove, onReject, onRequestInfo }) {
  const profile = application.profile || {};
  const isDietitian = application.role === 'dietitian';
  const fields = isDietitian
    ? [
        ['Qualification', profile.qualification],
        ['License Number', profile.licenseNumber],
        ['Workplace', profile.workplace],
        ['Specialties', profile.specialties],
        ['Service Area', profile.serviceArea],
        ['Years Experience', `${profile.yearsOfExperience || '6'} years`],
        ['Uploaded Documents', profile.documents],
      ]
    : [
        ['Kitchen Name', profile.establishmentName],
        ['Operating Area', profile.establishmentLocation],
        ['Kitchen Hygiene', profile.hygieneCertificate],
        ['Food Safety', profile.foodSafety],
        ['Work Environment', profile.workEnvironment],
        ['Years Experience', `${profile.yearsExperience || '5'} years`],
        ['Uploaded Documents', profile.documents],
      ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl bg-surface-50 border border-surface-100 p-4">
        <Avatar name={application.fullName} tone={isDietitian ? 'primary' : 'success'} />
        <div className="min-w-0">
          <p className="text-sm font-bold text-surface-900">{application.fullName}</p>
          <p className="text-xs text-surface-500">{application.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-surface-100 p-3">
            <p className="text-[11px] font-semibold text-surface-400">{label}</p>
            <p className="text-sm font-semibold text-surface-800 mt-1">{value || 'Not provided'}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
        <p className="text-sm font-bold text-primary-700 flex items-center gap-2">
          <UserCheck size={16} />
          Secure Review Notes
        </p>
        <p className="text-xs text-primary-700 mt-2">
          Approve only after confirming identity, credential validity, and document consistency. Rejection requires a clear reason so the professional can respond.
        </p>
      </div>

      <textarea
        value={rejectReason}
        onChange={event => setRejectReason(event.target.value)}
        className="input-medical min-h-24"
        placeholder="Required rejection reason if rejecting this application..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button type="button" onClick={onApprove} className="btn-primary flex items-center justify-center gap-2">
          <ShieldCheck size={16} />
          Approve
        </button>
        <button type="button" onClick={onRequestInfo} className="btn-outline flex items-center justify-center gap-2">
          <FileText size={16} />
          More Info
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={!rejectReason.trim()}
          className="border border-alert/20 bg-alert/10 text-alert px-6 py-2.5 rounded-lg font-medium hover:bg-alert/15 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <XCircle size={16} />
          Reject
        </button>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon size={14} className="text-primary-500 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-surface-400">{label}</p>
        <p className="text-xs font-semibold text-surface-800 truncate">{value || 'Not provided'}</p>
      </div>
    </div>
  );
}

function readProfile(user) {
  if (typeof window === 'undefined') return {};
  try {
    const key = user.role === 'dietitian' ? 'cc_onboarding_dietitian_step1' : 'cc_onboarding_chef_step1';
    const raw = localStorage.getItem(`${key}_${user.id}`) || localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getApplicationsForVault() {
  const pending = getPendingProfessionals().map(user => ({
    ...user,
    profile: readProfile(user),
    isDemo: false,
  }));

  return pending.length > 0 ? pending : demoVerificationApplications.map(item => ({ ...item, isDemo: true }));
}
