'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  Phone,
  ShieldAlert,
  User,
} from 'lucide-react';
import { complaints, complaintTimeline } from '@/lib/adminPortalData';
import { Avatar, Modal, PageHeader, SectionCard, SegmentedControl, StatusBadge } from '@/components/admin/AdminUI';

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
];

export default function ComplaintsPage() {
  const [cases, setCases] = useState(complaints);
  const [activeTab, setActiveTab] = useState('all');
  const [selected, setSelected] = useState(null);
  const [resolutionOpen, setResolutionOpen] = useState(false);
  const [resolutionType, setResolutionType] = useState('delivery issue resolved');
  const [notes, setNotes] = useState('');

  const filtered = useMemo(() => cases.filter(item => activeTab === 'all' || item.status.toLowerCase() === activeTab), [activeTab, cases]);

  function markStatus(id, status) {
    setCases(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    setSelected(prev => prev && prev.id === id ? { ...prev, status } : prev);
  }

  function resolveCase() {
    if (!selected || !notes.trim()) return;
    markStatus(selected.id, 'Resolved');
    setResolutionOpen(false);
    setNotes('');
  }

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Safety Desk"
        title="Complaints"
        subtitle="Triage patient and platform issues by urgency, case history, and operational accountability."
        icon={ShieldAlert}
      />

      <SegmentedControl tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="space-y-3">
        {filtered.map(item => (
          <button
            type="button"
            key={item.id}
            onClick={() => setSelected(item)}
            className="card-medical rounded-2xl !p-4 w-full text-left hover:border-primary-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <Avatar name={item.name} tone={priorityTone(item.priority)} className="w-10 h-10 rounded-xl" />
                <div className="min-w-0">
                  <StatusBadge tone={priorityTone(item.priority)}>{item.priority} Priority</StatusBadge>
                  <p className="text-sm font-bold text-surface-900 mt-2">{item.name}</p>
                  <p className="text-xs text-surface-500">{item.role}</p>
                </div>
              </div>
              <StatusBadge tone={statusTone(item.status)}>{item.status}</StatusBadge>
            </div>
            <p className="text-sm font-semibold text-surface-800 mt-4">{item.summary}</p>
            <p className="text-xs text-surface-400 mt-2">{item.date}</p>
          </button>
        ))}
      </div>

      {selected && (
        <Modal title="Complaint Details" onClose={() => setSelected(null)}>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-primary-600">{selected.id}</p>
                <h2 className="text-lg font-bold text-surface-900 mt-1">{selected.summary}</h2>
              </div>
              <StatusBadge tone={statusTone(selected.status)}>{selected.status}</StatusBadge>
            </div>

            <SectionCard title="Complainant" icon={User} className="!p-4">
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} tone={priorityTone(selected.priority)} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-surface-900">{selected.name}</p>
                  <p className="text-xs text-surface-500">Patient - +237 6XX XXX XXX</p>
                </div>
                <button type="button" className="w-10 h-10 rounded-xl border border-primary-100 bg-primary-50 text-primary-600 flex items-center justify-center">
                  <Phone size={16} />
                </button>
              </div>
            </SectionCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['Order ID', selected.orderId],
                ['Related Chef', selected.chef],
                ['Delivery Date', selected.date],
                ['Assigned Admin', selected.assignedAdmin],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-surface-100 p-3">
                  <p className="text-[11px] font-semibold text-surface-400">{label}</p>
                  <p className="text-sm font-bold text-surface-800 mt-1">{value}</p>
                </div>
              ))}
            </div>

            <SectionCard title="Case Description" icon={MessageSquare} className="!p-4">
              <p className="text-sm text-surface-700 leading-relaxed">{selected.description}</p>
            </SectionCard>

            <SectionCard title="Resolution Timeline" icon={Clock} className="!p-4">
              <div className="space-y-4">
                {complaintTimeline.map(step => (
                  <div key={step.title} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-surface-900">{step.title}</p>
                      <p className="text-xs text-surface-500 mt-0.5">{step.detail}</p>
                      <p className="text-[11px] font-semibold text-surface-400 mt-1">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button type="button" className="btn-outline">Assign to Admin</button>
              <button type="button" onClick={() => markStatus(selected.id, 'In Progress')} className="btn-primary">Mark In Progress</button>
              <button type="button" onClick={() => setResolutionOpen(true)} className="bg-success text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all">
                Resolve Complaint
              </button>
            </div>
          </div>
        </Modal>
      )}

      {resolutionOpen && selected && (
        <Modal title="Resolve Complaint" onClose={() => setResolutionOpen(false)}>
          <div className="space-y-4">
            <label className="form-label" htmlFor="resolution-type">Resolution type</label>
            <select id="resolution-type" value={resolutionType} onChange={event => setResolutionType(event.target.value)} className="input-medical">
              <option value="delivery issue resolved">Delivery issue resolved</option>
              <option value="chef contacted">Chef contacted</option>
              <option value="refund requested">Refund requested</option>
              <option value="dietitian review needed">Dietitian review needed</option>
              <option value="patient contacted">Patient contacted</option>
            </select>
            <textarea
              value={notes}
              onChange={event => setNotes(event.target.value)}
              className="input-medical min-h-24"
              placeholder="Resolution notes..."
            />
            <button type="button" disabled={!notes.trim()} onClick={resolveCase} className="w-full bg-success text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-40">
              Confirm Resolution
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function priorityTone(priority) {
  const value = String(priority).toLowerCase();
  if (value === 'high') return 'alert';
  if (value === 'medium') return 'warning';
  return 'primary';
}

function statusTone(status) {
  const value = String(status).toLowerCase();
  if (value === 'resolved') return 'success';
  if (value === 'in progress') return 'warning';
  if (value === 'open') return 'alert';
  return 'neutral';
}
