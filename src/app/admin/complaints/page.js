'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  X,
  ChevronDown,
  ArrowUpRight,
  User,
  ChefHat,
  FileText,
  Calendar,
  TrendingDown,
  ShieldAlert,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   MOCK DATA
   Every field maps to Complaints table in ERD +
   joined data from Referrals, Patient_Profiles, Chef_Profiles
───────────────────────────────────────────────────────────── */
const MOCK_COMPLAINTS = [
  {
    id:           'CMP-019',
    patientName:  'Fru Emmanuel',
    patientId:    'USR-492',
    chefName:     'Chef Tabi Ernest',
    chefId:       'USR-211',
    referralId:   'REF-108',
    category:     'Food Safety',
    priority:     'high',
    status:       'investigating',
    description:  'Meal delivered contained peanuts. Patient has a documented peanut allergy listed in their health profile. Patient experienced a mild allergic reaction and required antihistamines.',
    adminNote:    'Called chef — claims he was unaware. Reviewing referral notes sent by dietitian.',
    filedAt:      '2026-05-09T08:14:00Z',
    updatedAt:    '2026-05-09T10:30:00Z',
  },
  {
    id:           'CMP-020',
    patientName:  'Ngo Beatrice',
    patientId:    'USR-381',
    chefName:     'Chef Mbah Collins',
    chefId:       'USR-189',
    referralId:   'REF-111',
    category:     'Late Delivery',
    priority:     'medium',
    status:       'open',
    description:  'Chef arrived 2 hours after scheduled meal time. Patient missed their medication window which requires food intake. This is the second occurrence this month.',
    adminNote:    '',
    filedAt:      '2026-05-09T06:45:00Z',
    updatedAt:    '2026-05-09T06:45:00Z',
  },
  {
    id:           'CMP-018',
    patientName:  'Epie Roland',
    patientId:    'USR-344',
    chefName:     'Chef Nkemdirim Grace',
    chefId:       'USR-204',
    referralId:   'REF-099',
    category:     'Wrong Meal',
    priority:     'high',
    status:       'open',
    description:  'Received a high-sodium meal. Patient has Stage 2 renal disease. Meal plan clearly states sodium intake must be under 1,200mg per day. Dietitian confirmed meal was not compliant.',
    adminNote:    '',
    filedAt:      '2026-05-08T19:22:00Z',
    updatedAt:    '2026-05-08T19:22:00Z',
  },
  {
    id:           'CMP-017',
    patientName:  'Anchang Mary',
    patientId:    'USR-290',
    chefName:     'Chef Ayuk Peter',
    chefId:       'USR-178',
    referralId:   'REF-094',
    category:     'Chef Conduct',
    priority:     'medium',
    status:       'resolved',
    description:  'Chef was rude during delivery. Patient felt uncomfortable and did not want to continue with the service. Chef used inappropriate language when patient asked about ingredients.',
    adminNote:    'Chef issued a formal warning. Patient reassigned to Chef Nkemdirim Grace. Chef Ayuk placed on probation for 30 days.',
    filedAt:      '2026-05-07T14:10:00Z',
    updatedAt:    '2026-05-08T09:00:00Z',
  },
  {
    id:           'CMP-016',
    patientName:  'Tambe Julius',
    patientId:    'USR-267',
    chefName:     'Chef Bih Sandra',
    chefId:       'USR-155',
    referralId:   'REF-088',
    category:     'Hygiene',
    priority:     'high',
    status:       'resolved',
    description:  'Patient found a foreign object (plastic wrap fragment) inside prepared meal. Meal was completely unacceptable and potentially dangerous.',
    adminNote:    'Chef suspended for 2 weeks. Full hygiene review conducted. Patient refunded and apologised to. Chef re-trained on food preparation standards.',
    filedAt:      '2026-05-06T11:30:00Z',
    updatedAt:    '2026-05-07T16:00:00Z',
  },
  {
    id:           'CMP-015',
    patientName:  'Ngole Sandra',
    patientId:    'USR-231',
    chefName:     'Chef Tabi Ernest',
    chefId:       'USR-211',
    referralId:   'REF-081',
    category:     'No Show',
    priority:     'low',
    status:       'resolved',
    description:  'Chef did not show up for the scheduled meal preparation. Patient waited for 3 hours with no communication. No cancellation notice was given.',
    adminNote:    'Chef cited transport issue. Documented in chef profile. Patient rescheduled same day with backup chef.',
    filedAt:      '2026-05-05T09:00:00Z',
    updatedAt:    '2026-05-05T15:45:00Z',
  },
];

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const STATUS_TABS = ['all', 'open', 'investigating', 'resolved'];

const PRIORITY_CONFIG = {
  high:   { label: 'High',   bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500'    },
  medium: { label: 'Medium', bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400'  },
  low:    { label: 'Low',    bg: 'bg-surface-50', text: 'text-surface-600', border: 'border-surface-200', dot: 'bg-surface-400' },
};

const STATUS_CONFIG = {
  open:          { label: 'Open',          bg: 'bg-red-50',    text: 'text-red-700',    icon: AlertTriangle },
  investigating: { label: 'Investigating', bg: 'bg-amber-50',  text: 'text-amber-700',  icon: Clock         },
  resolved:      { label: 'Resolved',      bg: 'bg-emerald-50',text: 'text-emerald-700',icon: CheckCircle   },
};

const CATEGORIES = ['All Categories', 'Food Safety', 'Late Delivery', 'Wrong Meal', 'Chef Conduct', 'Hygiene', 'No Show'];

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

/* ─────────────────────────────────────────────────────────────
   COMPLAINT DETAIL MODAL
───────────────────────────────────────────────────────────── */
function ComplaintModal({ complaint, onClose, onStatusChange, onNoteSave }) {
  const [note, setNote]       = useState(complaint.adminNote || '');
  const [status, setStatus]   = useState(complaint.status);
  const [saving, setSaving]   = useState(false);

  const StatusIcon = STATUS_CONFIG[status].icon;
  const priority   = PRIORITY_CONFIG[complaint.priority];

  async function handleSave() {
    setSaving(true);
    // TODO: PATCH /api/admin/complaints with { id, status, adminNote: note }
    setTimeout(() => {
      onStatusChange(complaint.id, status, note);
      setSaving(false);
      onClose();
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-surface-100 sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-surface-400">{complaint.id}</span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${priority.bg} ${priority.text} ${priority.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                {priority.label} Priority
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-surface-50 text-surface-500 border border-surface-200">
                {complaint.category}
              </span>
            </div>
            <p className="text-sm text-surface-500">
              Filed {formatDate(complaint.filedAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-surface-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Parties involved */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-50 rounded-xl p-4 border border-surface-100">
              <div className="flex items-center gap-2 mb-2">
                <User size={13} className="text-primary-500" />
                <span className="text-xs font-semibold text-surface-500 uppercase tracking-wide">Patient</span>
              </div>
              <p className="text-sm font-semibold text-surface-800">{complaint.patientName}</p>
              <p className="text-xs text-surface-400 mt-0.5">{complaint.patientId}</p>
            </div>
            <div className="bg-surface-50 rounded-xl p-4 border border-surface-100">
              <div className="flex items-center gap-2 mb-2">
                <ChefHat size={13} className="text-emerald-500" />
                <span className="text-xs font-semibold text-surface-500 uppercase tracking-wide">Chef</span>
              </div>
              <p className="text-sm font-semibold text-surface-800">{complaint.chefName}</p>
              <p className="text-xs text-surface-400 mt-0.5">{complaint.chefId}</p>
            </div>
          </div>

          {/* Linked referral */}
          <div className="flex items-center justify-between bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-700">
                Linked Referral: <strong>{complaint.referralId}</strong>
              </span>
            </div>
            <Link
              href={`/admin/referrals/${complaint.referralId}`}
              className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              View referral <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Complaint description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={13} className="text-surface-400" />
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide">Patient Report</p>
            </div>
            <div className="bg-white border border-surface-100 rounded-xl p-4">
              <p className="text-sm text-surface-700 leading-relaxed">{complaint.description}</p>
            </div>
          </div>

          {/* Admin note */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={13} className="text-surface-400" />
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide">Admin Investigation Notes</p>
            </div>
            <textarea
              rows={4}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Document your investigation steps, actions taken, and outcome here. This is visible only to the admin team."
              className="w-full px-4 py-3 text-sm text-surface-700 bg-white border border-surface-200 rounded-xl resize-none focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder:text-surface-300 leading-relaxed"
            />
          </div>

          {/* Status update */}
          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-3">
              Update Status
            </p>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatus(key)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                      status === key
                        ? `${cfg.bg} ${cfg.text} border-current`
                        : 'border-surface-100 text-surface-500 hover:border-surface-200'
                    }`}
                  >
                    <Icon size={16} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 btn-outline py-2.5"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 btn-primary py-2.5"
            >
              {saving
                ? <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Saving…
                  </span>
                : 'Save & Update'
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function ComplaintsPage() {
  const [complaints,      setComplaints]      = useState(MOCK_COMPLAINTS);
  const [activeTab,       setActiveTab]       = useState('all');
  const [search,          setSearch]          = useState('');
  const [categoryFilter,  setCategoryFilter]  = useState('All Categories');
  const [priorityFilter,  setPriorityFilter]  = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  /* ── Derived stats ── */
  const stats = useMemo(() => ({
    total:         complaints.length,
    open:          complaints.filter(c => c.status === 'open').length,
    investigating: complaints.filter(c => c.status === 'investigating').length,
    resolved:      complaints.filter(c => c.status === 'resolved').length,
    highPriority:  complaints.filter(c => c.priority === 'high' && c.status !== 'resolved').length,
  }), [complaints]);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const matchTab      = activeTab === 'all' || c.status === activeTab;
      const matchSearch   = !search
        || c.id.toLowerCase().includes(search.toLowerCase())
        || c.patientName.toLowerCase().includes(search.toLowerCase())
        || c.chefName.toLowerCase().includes(search.toLowerCase())
        || c.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'All Categories' || c.category === categoryFilter;
      const matchPriority = priorityFilter === 'all' || c.priority === priorityFilter;
      return matchTab && matchSearch && matchCategory && matchPriority;
    });
  }, [complaints, activeTab, search, categoryFilter, priorityFilter]);

  /* ── Handlers ── */
  function handleStatusChange(id, newStatus, newNote) {
    setComplaints(prev => prev.map(c =>
      c.id === id
        ? { ...c, status: newStatus, adminNote: newNote, updatedAt: new Date().toISOString() }
        : c
    ));
  }

  /* ── Render ── */
  return (
    <div className="space-y-7">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Safety & Complaints</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Review and resolve all patient-reported issues across the platform.
          </p>
        </div>
        {stats.highPriority > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {stats.highPriority} high-priority {stats.highPriority === 1 ? 'issue' : 'issues'} need attention
          </div>
        )}
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',         value: stats.total,         color: 'text-surface-700',  bg: 'bg-white'       },
          { label: 'Open',          value: stats.open,          color: 'text-red-600',      bg: 'bg-red-50'      },
          { label: 'Investigating', value: stats.investigating,  color: 'text-amber-600',    bg: 'bg-amber-50'    },
          { label: 'Resolved',      value: stats.resolved,      color: 'text-emerald-600',  bg: 'bg-emerald-50'  },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className={`${bg} border border-surface-100 rounded-2xl px-5 py-4`}
          >
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs font-medium text-surface-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters row ── */}
      <div className="bg-white border border-surface-100 rounded-2xl p-4 space-y-3">

        {/* Status tabs */}
        <div className="flex gap-1 bg-surface-50 rounded-xl p-1 w-fit">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-surface-900 shadow-sm border border-surface-100'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              {tab}
              {tab !== 'all' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({complaints.filter(c => c.status === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search + dropdowns */}
        <div className="flex flex-wrap gap-3">

          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by patient, chef, ID…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-surface-200 rounded-xl bg-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder:text-surface-300"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-surface-200 rounded-xl bg-white text-surface-700 focus:outline-none focus:border-primary-400 cursor-pointer"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
          </div>

          {/* Priority filter */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-surface-200 rounded-xl bg-white text-surface-700 focus:outline-none focus:border-primary-400 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* ── Complaints list ── */}
      <div className="space-y-3">

        {filtered.length === 0 ? (
          <div className="bg-white border border-surface-100 rounded-2xl py-16 text-center">
            <CheckCircle size={36} className="text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-surface-700">No complaints match this filter</p>
            <p className="text-xs text-surface-400 mt-1">Try adjusting the search or status filter above</p>
          </div>
        ) : (
          filtered.map(complaint => {
            const priority   = PRIORITY_CONFIG[complaint.priority];
            const statusCfg  = STATUS_CONFIG[complaint.status];
            const StatusIcon = statusCfg.icon;

            return (
              <div
                key={complaint.id}
                className={`bg-white border rounded-2xl p-5 transition-all hover:shadow-md ${
                  complaint.priority === 'high' && complaint.status !== 'resolved'
                    ? 'border-red-200'
                    : 'border-surface-100'
                }`}
              >
                <div className="flex items-start gap-4">

                  {/* Priority dot */}
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${priority.dot}`} />

                  {/* Main content */}
                  <div className="flex-1 min-w-0">

                    {/* Top row */}
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="text-xs font-bold text-surface-400">{complaint.id}</span>
                      <span className="text-surface-200">·</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${priority.bg} ${priority.text} ${priority.border}`}>
                        {priority.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-50 text-surface-500 border border-surface-100 font-medium">
                        {complaint.category}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
                        <StatusIcon size={11} />
                        {statusCfg.label}
                      </span>
                    </div>

                    {/* Parties */}
                    <div className="flex items-center gap-4 mb-2.5 text-xs text-surface-500">
                      <span className="flex items-center gap-1">
                        <User size={11} className="text-primary-400" />
                        {complaint.patientName}
                      </span>
                      <span className="text-surface-200">vs</span>
                      <span className="flex items-center gap-1">
                        <ChefHat size={11} className="text-emerald-400" />
                        {complaint.chefName}
                      </span>
                      <span className="flex items-center gap-1 text-surface-400">
                        <FileText size={11} />
                        {complaint.referralId}
                      </span>
                    </div>

                    {/* Description preview */}
                    <p className="text-sm text-surface-600 leading-relaxed line-clamp-2 mb-3">
                      {complaint.description}
                    </p>

                    {/* Admin note preview */}
                    {complaint.adminNote && (
                      <div className="flex items-start gap-2 bg-primary-50 border border-primary-100 rounded-lg px-3 py-2 mb-3">
                        <ShieldAlert size={12} className="text-primary-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-primary-700 line-clamp-1">{complaint.adminNote}</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-4 text-xs text-surface-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        Filed {timeAgo(complaint.filedAt)}
                      </span>
                      {complaint.updatedAt !== complaint.filedAt && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          Updated {timeAgo(complaint.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-50 border border-surface-200 text-xs font-semibold text-surface-700 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-all shrink-0"
                  >
                    <Eye size={13} />
                    {complaint.status === 'resolved' ? 'View' : 'Handle'}
                  </button>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Results count */}
      {filtered.length > 0 && (
        <p className="text-xs text-surface-400 text-center pb-2">
          Showing {filtered.length} of {complaints.length} complaints
        </p>
      )}

      {/* ── Detail modal ── */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusChange={handleStatusChange}
        />
      )}

    </div>
  );
}