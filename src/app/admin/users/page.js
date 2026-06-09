'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Filter,
  Search,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react';
import { getUsers, updateUser } from '@/lib/userStore';
import { adminUsers } from '@/lib/adminPortalData';
import { Avatar, Modal, PageHeader, SegmentedControl, StatusBadge } from '@/components/admin/AdminUI';

const roleTabs = [
  { key: 'all', label: 'All Users' },
  { key: 'patient', label: 'Patients' },
  { key: 'dietitian', label: 'Dietitians' },
  { key: 'chef', label: 'Chefs' },
];

export default function UserManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRole = normalizeRole(searchParams.get('role') || 'all');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(() => loadUsers());
  const [selected, setSelected] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [reason, setReason] = useState('');

  const counts = useMemo(() => ({
    patient: users.filter(user => user.role.toLowerCase() === 'patient').length,
    dietitian: users.filter(user => user.role.toLowerCase() === 'dietitian').length,
    chef: users.filter(user => user.role.toLowerCase() === 'chef').length,
    admin: 12,
  }), [users]);

  const filtered = useMemo(() => users.filter(user => {
    const roleMatches = queryRole === 'all' || user.role.toLowerCase() === queryRole;
    const term = `${user.name} ${user.role} ${user.status} ${user.condition}`.toLowerCase();
    return roleMatches && term.includes(search.toLowerCase());
  }), [queryRole, search, users]);

  function changeRole(role) {
    router.push(role === 'all' ? '/admin/users' : `/admin/users?role=${role}`);
  }

  function confirmSuspension() {
    if (!reason.trim() || !suspendTarget) return;
    const isReal = getUsers().some(user => user.id === suspendTarget.id);
    if (isReal) updateUser(suspendTarget.id, { account_status: 'suspended' });
    setUsers(prev => prev.map(user => user.id === suspendTarget.id ? { ...user, status: 'Blocked' } : user));
    setSuspendTarget(null);
    setReason('');
    if (selected?.id === suspendTarget.id) setSelected(prev => prev ? { ...prev, status: 'Blocked' } : prev);
  }

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Ecosystem Directory"
        title="User Management"
        subtitle="Browse patients, dietitians, chefs, and admins with role-specific safety context."
        icon={Users}
      />

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            className="input-medical pl-10"
            placeholder="Search users..."
          />
        </div>
        <button type="button" className="w-11 rounded-xl border border-surface-200 bg-white text-surface-500 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center" aria-label="Filter users">
          <Filter size={17} />
        </button>
      </div>

      <SegmentedControl tabs={roleTabs} active={queryRole} onChange={changeRole} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <CountCard label="Patients" value={counts.patient || 1003} />
        <CountCard label="Dietitians" value={counts.dietitian || 67} />
        <CountCard label="Chefs" value={counts.chef || 78} />
        <CountCard label="Admins" value={counts.admin} />
      </div>

      <div className="card-medical rounded-2xl !p-0 overflow-hidden">
        {filtered.map(user => (
          <button
            type="button"
            key={user.id}
            onClick={() => setSelected(user)}
            className="w-full text-left flex items-center gap-3 px-4 py-4 border-b border-surface-100 last:border-b-0 hover:bg-primary-50/40 transition-colors"
          >
            <Avatar name={user.name} tone={toneForStatus(user.status)} className="w-10 h-10 rounded-xl" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-surface-900 truncate">{user.name}</p>
                <StatusBadge tone={toneForStatus(user.status)}>{user.status}</StatusBadge>
              </div>
              <p className="text-xs text-surface-500 truncate">{user.role} - {user.condition}</p>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <p className="text-[11px] text-surface-400">{user.date}</p>
            </div>
            <ChevronRight size={16} className="text-surface-400 shrink-0" />
          </button>
        ))}
      </div>

      {selected && (
        <Modal title="User Detail" onClose={() => setSelected(null)}>
          <UserDetail user={selected} onSuspend={() => {
            setSuspendTarget(selected);
            setReason('');
          }} />
        </Modal>
      )}

      {suspendTarget && (
        <Modal title="Confirm User Suspension" onClose={() => setSuspendTarget(null)}>
          <div className="space-y-4">
            <div className="rounded-2xl border border-alert/20 bg-alert/10 p-4">
              <p className="text-sm font-bold text-alert flex items-center gap-2">
                <AlertTriangle size={16} />
                Suspension may affect active care workflows.
              </p>
              <p className="text-xs text-surface-700 mt-2">
                Suspending a dietitian or chef can interrupt active patients, referrals, and meal preparation. Record a clear reason before continuing.
              </p>
            </div>
            <textarea
              className="input-medical min-h-24"
              value={reason}
              onChange={event => setReason(event.target.value)}
              placeholder="Reason for suspension..."
            />
            <button
              type="button"
              disabled={!reason.trim()}
              onClick={confirmSuspension}
              className="w-full border border-alert/20 bg-alert text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-40"
            >
              Suspend User
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function UserDetail({ user, onSuspend }) {
  const role = user.role.toLowerCase();
  const roleStats = role === 'patient'
    ? [
        ['Care Status', 'Active plan'],
        ['Assigned Dietitian', 'Dr. Ambe Florence'],
        ['Assigned Chef', 'Chef Kwame'],
        ['Meal Progress', 'Week 3 of 8'],
        ['Complaints', user.name === 'Amara Nkeng' ? '1 open' : 'None open'],
      ]
    : role === 'dietitian'
      ? [
          ['Verification', user.status],
          ['Patients Assigned', '8'],
          ['Plans Created', '24'],
          ['Referrals Sent', '12'],
          ['Rating', '4.9 from 156 reviews'],
        ]
      : [
          ['Verification', user.status],
          ['Kitchen', 'Buea, Fako'],
          ['Orders Completed', '42'],
          ['Active Referrals', '4'],
          ['Reliability', '98% on time'],
        ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-4">
        <Avatar name={user.name} tone={toneForStatus(user.status)} />
        <div className="min-w-0">
          <p className="text-base font-bold text-surface-900">{user.name}</p>
          <p className="text-xs text-surface-500">{user.role} - {user.condition}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roleStats.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-surface-100 p-3">
            <p className="text-[11px] font-semibold text-surface-400">{label}</p>
            <p className="text-sm font-bold text-surface-800 mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
        <p className="text-sm font-bold text-primary-700 flex items-center gap-2">
          <ShieldCheck size={16} />
          Account Activity
        </p>
        <p className="text-xs text-primary-700 mt-2">{user.detail}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button type="button" className="btn-outline flex items-center justify-center gap-2">
          <Calendar size={16} />
          Activity
        </button>
        <button type="button" className="btn-outline flex items-center justify-center gap-2">
          <UserCog size={16} />
          Reactivate
        </button>
        <button type="button" onClick={onSuspend} className="border border-alert/20 bg-alert/10 text-alert px-6 py-2.5 rounded-lg font-medium hover:bg-alert/15 transition-all flex items-center justify-center gap-2">
          <AlertTriangle size={16} />
          Suspend
        </button>
      </div>
    </div>
  );
}

function CountCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-surface-100 bg-white p-3 text-center shadow-sm">
      <p className="text-lg font-bold text-surface-900">{value}</p>
      <p className="text-[10px] font-semibold text-surface-500">{label}</p>
    </div>
  );
}

function toneForStatus(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('active') || normalized.includes('verified') || normalized.includes('approved')) return 'success';
  if (normalized.includes('pending')) return 'warning';
  if (normalized.includes('blocked') || normalized.includes('rejected')) return 'alert';
  return 'neutral';
}

function normalizeRole(role) {
  const normalized = String(role || 'all').toLowerCase();
  if (normalized === 'patients') return 'patient';
  if (normalized === 'dietitians') return 'dietitian';
  if (normalized === 'chefs') return 'chef';
  return ['all', 'patient', 'dietitian', 'chef'].includes(normalized) ? normalized : 'all';
}

function loadUsers() {
  const stored = getUsers().map(user => ({
    id: user.id,
    name: user.fullName || user.email,
    role: capitalize(user.role),
    status: user.account_status === 'suspended'
      ? 'Blocked'
      : user.verification_status === 'approved'
        ? user.role === 'patient' ? 'Active' : 'Verified'
        : user.verification_status === 'rejected'
          ? 'Rejected'
          : 'Pending',
    date: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
    condition: user.role === 'patient' ? 'Care profile' : user.role === 'dietitian' ? 'Clinical nutrition' : 'Kitchen operations',
    detail: `${capitalize(user.role)} account managed from local CareCuisin store.`,
  }));

  return stored.length > 0 ? stored : adminUsers;
}

function capitalize(value) {
  return String(value || '').charAt(0).toUpperCase() + String(value || '').slice(1);
}
