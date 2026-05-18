'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, ClipboardCheck, Activity, ArrowRight, PlusCircle } from 'lucide-react';

/* ── Helpers ── */
function getPatients() {
  const patients = [];
  try {
    const step1 = JSON.parse(localStorage.getItem('cc_onboarding_patient_step1') || '{}');
    const step2 = JSON.parse(localStorage.getItem('cc_onboarding_patient_step2') || '{}');
    if (step1.fullName) {
      patients.push({
        id: 'P-001',
        name: step1.fullName,
        condition: step2.conditions?.[0] || 'General',
        status: 'Needs Plan',
      });
    }
  } catch (_) {}
  if (patients.length === 0) {
    patients.push({ id: 'P-DEMO', name: 'John Sample', condition: 'Hypertension', status: 'Needs Plan' });
  }
  return patients;
}

/* ────────────────────────────────────────────────────────────
   PAGE
─────────────────────────────────────────────────────────── */
export default function DietitianDashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    setPatients(getPatients());
  }, []);

  const pending = patients.filter(p => p.status === 'Needs Plan').length;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <span className="badge-clinical mb-2 inline-block">Dietitian Portal</span>
        <h1 className="text-2xl font-bold text-surface-900">Clinical Overview</h1>
        <p className="text-sm text-surface-500 mt-1">
          Current status of patient dietary interventions.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-medical !p-4">
          <Users size={20} className="text-blue-600 mb-2" />
          <p className="text-xs text-surface-500 uppercase tracking-widest">Active Patients</p>
          <p className="text-2xl font-bold text-surface-900">{patients.length}</p>
        </div>
        <div className="card-medical !p-4">
          <ClipboardCheck size={20} className="text-primary-600 mb-2" />
          <p className="text-xs text-surface-500 uppercase tracking-widest">Plans Pending</p>
          <p className="text-2xl font-bold text-surface-900">{pending}</p>
        </div>
        <div className="card-medical !p-4">
          <Activity size={20} className="text-emerald-600 mb-2" />
          <p className="text-xs text-surface-500 uppercase tracking-widest">System Health</p>
          <p className="text-2xl font-bold text-surface-900">98%</p>
        </div>
      </div>

      {/* Patient Pipeline table */}
      <div className="card-medical overflow-hidden !p-0">
        <div className="bg-surface-50 border-b border-surface-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-surface-800">Patient Pipeline</h2>
          <Link
            href="/dietitian/create-plan"
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
          >
            <PlusCircle size={14} /> New Plan
          </Link>
        </div>
        <table className="w-full text-left">
          <thead className="bg-surface-50 border-b border-surface-100">
            <tr className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Condition</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50">
            {patients.map(p => (
              <tr key={p.id} className="hover:bg-surface-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-surface-900">{p.name}</td>
                <td className="px-6 py-4 text-sm text-surface-600">{p.condition}</td>
                <td className="px-6 py-4">
                  <span className="badge-clinical">{p.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href="/dietitian/create-plan"
                    className="text-primary-600 hover:text-primary-700 text-sm font-semibold inline-flex items-center gap-1"
                  >
                    Create Plan <ArrowRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}