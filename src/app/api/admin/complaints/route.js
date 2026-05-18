'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, Clock, Eye, X } from 'lucide-react';

const MOCK_COMPLAINTS = [
  {
    id: 'CMP-001',
    patient: 'Patient A',
    description: 'Chef used peanuts despite documented allergy. Mild reaction reported.',
    priority: 'high',
    status: 'open',
    filed: '2 hours ago',
  },
  {
    id: 'CMP-002',
    patient: 'Patient B',
    description: 'Chef arrived 2 hours late. Patient missed medication window.',
    priority: 'medium',
    status: 'investigating',
    filed: '5 hours ago',
  },
  {
    id: 'CMP-003',
    patient: 'Patient C',
    description: 'Wrong meal plan delivered — high sodium given to renal patient.',
    priority: 'high',
    status: 'resolved',
    filed: '1 day ago',
  },
];

const STATUS_COLORS = {
  open: 'bg-red-50 text-red-700 border-red-200',
  investigating: 'bg-amber-50 text-amber-700 border-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);

  const updateStatus = (id, newStatus) => {
    setComplaints(prev =>
      prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="badge-clinical mb-2 inline-block">Platform Safety</span>
        <h1 className="text-2xl font-bold text-surface-900">Complaints & Safety</h1>
        <p className="text-sm text-surface-500 mt-1">
          Review and resolve all patient‑reported issues.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-medical !p-4">
          <p className="text-xs text-surface-500 uppercase tracking-widest">Open</p>
          <p className="text-2xl font-bold text-red-600">{complaints.filter(c => c.status === 'open').length}</p>
        </div>
        <div className="card-medical !p-4">
          <p className="text-xs text-surface-500 uppercase tracking-widest">Investigating</p>
          <p className="text-2xl font-bold text-amber-600">{complaints.filter(c => c.status === 'investigating').length}</p>
        </div>
        <div className="card-medical !p-4">
          <p className="text-xs text-surface-500 uppercase tracking-widest">Resolved</p>
          <p className="text-2xl font-bold text-emerald-600">{complaints.filter(c => c.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Complaints table */}
      <div className="card-medical overflow-hidden !p-0">
        <table className="w-full text-left">
          <thead className="bg-surface-50 border-b border-surface-100">
            <tr className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50">
            {complaints.map(c => (
              <tr key={c.id} className="hover:bg-surface-50/50 transition-colors">
                <td className="px-6 py-4 text-xs font-bold text-surface-400">{c.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-surface-900">{c.patient}</td>
                <td className="px-6 py-4 text-sm text-surface-600 max-w-xs truncate">{c.description}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    c.priority === 'high' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {c.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select
                    value={c.status}
                    onChange={e => updateStatus(c.id, e.target.value)}
                    className="text-xs border border-surface-200 rounded-lg px-2 py-1 bg-white"
                  >
                    <option value="open">Open</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}