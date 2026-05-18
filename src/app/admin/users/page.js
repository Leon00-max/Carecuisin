'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

/* ────────────────────────────────────────────────────────────
   Helpers – read saved onboarding data & approval status
─────────────────────────────────────────────────────────── */
function getStableId(role) {
  // Retrieve the stable ID we stored during onboarding (Step 3)
  try {
    const key = `cc_onboarding_${role}_id`;
    return localStorage.getItem(key) || null;
  } catch (_) {
    return null;
  }
}

function getApprovalStatus(role, stableId) {
  if (!stableId) return 'Pending';
  const approved = JSON.parse(localStorage.getItem('cc_approved_users') || '[]');
  const rejected = JSON.parse(localStorage.getItem('cc_rejected_users') || '[]');
  if (approved.find(u => u.id === stableId && u.role === role)) return 'Approved';
  if (rejected.find(u => u.id === stableId && u.role === role)) return 'Rejected';
  return 'Pending';
}

function getPatients() {
  try {
    const step1 = JSON.parse(localStorage.getItem('cc_onboarding_patient_step1') || '{}');
    const step2 = JSON.parse(localStorage.getItem('cc_onboarding_patient_step2') || '{}');
    if (!step1.fullName) return [];
    const id = getStableId('patient') || 'P-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    return [{
      id,
      name: step1.fullName,
      phone: step1.phone || '',
      location: step1.location || '',
      condition: step2.conditions?.[0] || 'Not specified',
      status: getApprovalStatus('patient', id),
    }];
  } catch (_) {
    return [];
  }
}

function getDietitians() {
  try {
    const step1 = JSON.parse(localStorage.getItem('cc_onboarding_dietitian_step1') || '{}');
    if (!step1.fullName) return [];
    const id = getStableId('dietitian') || 'D-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    return [{
      id,
      name: step1.fullName,
      qualification: step1.qualification || 'Not specified',
      workplace: step1.workplace || 'Not specified',
      status: getApprovalStatus('dietitian', id),
    }];
  } catch (_) {
    return [];
  }
}

function getChefs() {
  try {
    const step1 = JSON.parse(localStorage.getItem('cc_onboarding_chef_step1') || '{}');
    if (!step1.fullName) return [];
    const id = getStableId('chef') || 'C-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    return [{
      id,
      name: step1.fullName,
      specialty: step1.specialDiets?.[0] || 'General',
      location: step1.serviceArea || 'Unknown',
      status: getApprovalStatus('chef', id),
    }];
  } catch (_) {
    return [];
  }
}

/* ────────────────────────────────────────────────────────────
   Page Component
─────────────────────────────────────────────────────────── */
export default function UserManagement() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role') || 'patients';

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (role === 'patients') setUsers(getPatients());
    else if (role === 'dietitians') setUsers(getDietitians());
    else if (role === 'chefs') setUsers(getChefs());
  }, [role]);

  // Real‑time filter
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleTabChange = (newRole) => {
    router.push(`?role=${newRole}`);
  };

  const tabs = [
    { key: 'patients',   label: 'Patients' },
    { key: 'dietitians', label: 'Dietitians' },
    { key: 'chefs',      label: 'Chefs' },
  ];

  const statusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs font-semibold text-success">Approved</span>
          </div>
        );
      case 'Rejected':
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-alert" />
            <span className="text-xs font-semibold text-alert">Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-xs font-semibold text-warning">Pending</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="badge-clinical mb-2 inline-block">Ecosystem Management</span>
        <h1 className="text-2xl font-bold text-surface-900 capitalize">{role} Registry</h1>
        <p className="text-sm text-surface-500 mt-1">
          View and manage all registered {role} on the platform.
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">🔍</span>
        <input
          type="text"
          placeholder={`Search ${role}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-medical pl-12"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-100 gap-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`pb-3 text-sm font-semibold transition-all capitalize ${
              role === tab.key
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-surface-400 hover:text-surface-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-medical overflow-hidden !p-0">
        <table className="w-full text-left">
          <thead className="bg-surface-50 border-b border-surface-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-surface-700 uppercase tracking-wider">Identity</th>
              <th className="px-6 py-4 text-xs font-semibold text-surface-700 uppercase tracking-wider">Details</th>
              <th className="px-6 py-4 text-xs font-semibold text-surface-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-surface-700 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50">
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-surface-400">
                  No {role} found.
                </td>
              </tr>
            )}
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-surface-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-surface-900">{user.name}</p>
                  <p className="text-xs text-surface-400">{user.id}</p>
                </td>
                <td className="px-6 py-4">
                  {role === 'patients' && (
                    <span className="badge-clinical">{user.condition} · {user.location}</span>
                  )}
                  {role === 'dietitians' && (
                    <div className="flex items-center gap-2">
                      <span className="badge-clinical">{user.qualification}</span>
                      <span className="text-xs text-surface-500">{user.workplace}</span>
                    </div>
                  )}
                  {role === 'chefs' && (
                    <span className="badge-clinical">{user.specialty} · {user.location}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {statusBadge(user.status)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-50 text-surface-600 hover:bg-surface-100 transition-colors">
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}