'use client';

import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Stethoscope,
  ChefHat,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Calendar, 
  Download,
  RefreshCw,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   MOCK DATA
   Every dataset maps to real ERD tables.
   Replace each block with a fetch() to /api/admin/stats
   when Supabase is wired.
───────────────────────────────────────────────────────────── */

// Platform-wide KPIs — maps to aggregate queries across all tables
const KPI_DATA = {
  totalUsers:          1_324,
  usersGrowth:         '+18%',
  usersGrowthDir:      'up',
  activeReferrals:     84,
  referralsGrowth:     '+12%',
  referralsGrowthDir:  'up',
  mealsDelivered:      1_047,
  mealsGrowth:         '+9%',
  mealsGrowthDir:      'up',
  resolutionRate:      91,      // % complaints resolved
  resolutionGrowth:    '+4%',
  resolutionGrowthDir: 'up',
  avgReviewHours:      31,      // avg hours to approve a professional
  reviewGrowth:        '-6h',
  reviewGrowthDir:     'down',  // down = improving (faster)
  openComplaints:      5,
  complaintsGrowth:    '-2',
  complaintsGrowthDir: 'down',  // down = improving (fewer)
};

// Referrals per month — maps to Referrals table grouped by created_at month
const REFERRAL_TREND = [
  { month: 'Dec', referrals: 28, prepared: 24 },
  { month: 'Jan', referrals: 34, prepared: 31 },
  { month: 'Feb', referrals: 41, prepared: 38 },
  { month: 'Mar', referrals: 52, prepared: 49 },
  { month: 'Apr', referrals: 67, prepared: 61 },
  { month: 'May', referrals: 84, prepared: 74 },
];

// User growth — maps to Users table grouped by created_at month + role
const USER_GROWTH = [
  { month: 'Dec', patients: 890,  dietitians: 38, chefs: 22 },
  { month: 'Jan', patients: 960,  dietitians: 41, chefs: 25 },
  { month: 'Feb', patients: 1040, dietitians: 43, chefs: 27 },
  { month: 'Mar', patients: 1110, dietitians: 45, chefs: 29 },
  { month: 'Apr', patients: 1200, dietitians: 47, chefs: 31 },
  { month: 'May', patients: 1240, dietitians: 48, chefs: 32 },
];

// Role breakdown — maps to Users table grouped by role
const ROLE_BREAKDOWN = [
  { role: 'Patients',   count: 1_240, pct: 94, color: 'bg-primary-500',  textColor: 'text-primary-600',  icon: Users       },
  { role: 'Dietitians', count: 48,    pct: 3,  color: 'bg-emerald-500',  textColor: 'text-emerald-600',  icon: Stethoscope },
  { role: 'Chefs',      count: 32,    pct: 2,  color: 'bg-amber-500',    textColor: 'text-amber-600',    icon: ChefHat     },
  { role: 'Admins',     count: 4,     pct: 1,  color: 'bg-surface-400',  textColor: 'text-surface-500',  icon: Users       },
];

// Neighbourhood activity — maps to Patient_Profiles.location_buea
const NEIGHBOURHOOD_DATA = [
  { name: 'Molyko',       patients: 342, referrals: 28, pct: 28 },
  { name: 'Mile 17',      patients: 218, referrals: 19, pct: 18 },
  { name: 'Checkpoint',   patients: 187, referrals: 14, pct: 15 },
  { name: 'Buea Town',    patients: 156, referrals: 11, pct: 13 },
  { name: 'Bonduma',      patients: 134, referrals:  8, pct: 11 },
  { name: 'Great Soppo',  patients: 112, referrals:  6, pct:  9 },
  { name: 'Bokwango',     patients:  91, referrals:  4, pct:  7 },
];

// Complaint categories — maps to Complaints table grouped by category
const COMPLAINT_CATEGORIES = [
  { category: 'Food Safety',   count: 8,  pct: 38, color: 'bg-red-500'     },
  { category: 'Wrong Meal',    count: 5,  pct: 24, color: 'bg-amber-500'   },
  { category: 'Late Delivery', count: 4,  pct: 19, color: 'bg-orange-400'  },
  { category: 'Chef Conduct',  count: 3,  pct: 14, color: 'bg-primary-500' },
  { category: 'No Show',       count: 1,  pct:  5, color: 'bg-surface-400' },
];

// Top performing chefs — maps to Chef_Profiles joined with Referrals
const TOP_CHEFS = [
  { name: 'Chef Nkemdirim Grace', referrals: 24, rating: 4.9, area: 'Molyko'     },
  { name: 'Chef Mbah Collins',    referrals: 19, rating: 4.8, area: 'Mile 17'    },
  { name: 'Chef Bih Sandra',      referrals: 16, rating: 4.7, area: 'Checkpoint' },
  { name: 'Chef Ayuk Peter',      referrals: 14, rating: 4.6, area: 'Buea Town'  },
  { name: 'Chef Tabi Ernest',     referrals: 11, rating: 4.3, area: 'Bonduma'    },
];

// Verification pipeline — maps to Users WHERE verification_status = 'pending'
const VERIFICATION_PIPELINE = [
  { stage: 'Submitted',   count: 7,  color: 'bg-surface-300' },
  { stage: 'Under Review',count: 4,  color: 'bg-amber-400'   },
  { stage: 'Approved',    count: 80, color: 'bg-emerald-500'  },
  { stage: 'Rejected',    count: 6,  color: 'bg-red-400'      },
];

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const TIME_RANGES = ['Last 7 days', 'Last 30 days', 'Last 6 months', 'All time'];

function Trend({ dir, value }) {
  const isPositive = dir === 'up';
  const isNeutral  = value.includes('h') && dir === 'down'; // faster review = good
  const good = isPositive || (dir === 'down' && value.startsWith('-'));
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
      good ? 'text-emerald-600' : 'text-red-600'
    }`}>
      {dir === 'up'
        ? <TrendingUp  size={12} />
        : <TrendingDown size={12} />
      }
      {value}
    </span>
  );
}

// Minimal bar chart using pure CSS — no external chart lib needed
function BarChart({ data, valueKey, labelKey, color = 'bg-primary-500', maxValue }) {
  const max = maxValue || Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="flex items-end gap-2 h-32 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-bold text-surface-600">
            {d[valueKey]}
          </span>
          <div
            className={`w-full rounded-t-md ${color} transition-all duration-700`}
            style={{ height: `${(d[valueKey] / max) * 80}%`, minHeight: '4px' }}
          />
          <span className="text-xs text-surface-400 text-center leading-none">
            {d[labelKey]}
          </span>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-sm font-semibold text-surface-900">{title}</h2>
        {subtitle && <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function SystemStatsPage() {
  const [timeRange,    setTimeRange]    = useState('Last 6 months');
  const [refreshing,   setRefreshing]   = useState(false);
  const [lastRefreshed] = useState(new Date());

  function handleRefresh() {
    setRefreshing(true);
    // TODO: re-fetch all stats from /api/admin/stats
    setTimeout(() => setRefreshing(false), 1200);
  }

  return (
    <div className="space-y-8">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Platform Analytics</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Live overview of the CareCuisin clinical nutrition network in Buea.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center gap-1 bg-surface-50 border border-surface-200 rounded-xl p-1">
            {TIME_RANGES.map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeRange === range
                    ? 'bg-white text-surface-900 shadow-sm border border-surface-100'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-surface-200 bg-white text-xs font-semibold text-surface-600 hover:bg-surface-50 transition-colors"
          >
            <RefreshCw
              size={13}
              className={refreshing ? 'animate-spin text-primary-500' : ''}
            />
            Refresh
          </button>

          {/* Export stub */}
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors">
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Last refreshed */}
      <p className="text-xs text-surface-400 -mt-4">
        Last updated: {lastRefreshed.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        <span className="ml-2 inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </p>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            label:    'Total Users',
            value:    KPI_DATA.totalUsers.toLocaleString(),
            growth:   KPI_DATA.usersGrowth,
            dir:      KPI_DATA.usersGrowthDir,
            sub:      'across all roles',
            icon:     Users,
            iconBg:   'bg-primary-50',
            iconColor:'text-primary-600',
          },
          {
            label:    'Active Referrals',
            value:    KPI_DATA.activeReferrals,
            growth:   KPI_DATA.referralsGrowth,
            dir:      KPI_DATA.referralsGrowthDir,
            sub:      'this month',
            icon:     Activity,
            iconBg:   'bg-emerald-50',
            iconColor:'text-emerald-600',
          },
          {
            label:    'Meals Delivered',
            value:    KPI_DATA.mealsDelivered.toLocaleString(),
            growth:   KPI_DATA.mealsGrowth,
            dir:      KPI_DATA.mealsGrowthDir,
            sub:      'all time',
            icon:     CheckCircle,
            iconBg:   'bg-blue-50',
            iconColor:'text-blue-600',
          },
          {
            label:    'Complaint Resolution',
            value:    `${KPI_DATA.resolutionRate}%`,
            growth:   KPI_DATA.resolutionGrowth,
            dir:      KPI_DATA.resolutionGrowthDir,
            sub:      'cases resolved',
            icon:     AlertTriangle,
            iconBg:   'bg-amber-50',
            iconColor:'text-amber-600',
          },
          {
            label:    'Avg Review Time',
            value:    `${KPI_DATA.avgReviewHours}h`,
            growth:   KPI_DATA.reviewGrowth,
            dir:      KPI_DATA.reviewGrowthDir,
            sub:      'to approve professionals',
            icon:     Clock,
            iconBg:   'bg-purple-50',
            iconColor:'text-purple-600',
          },
          {
            label:    'Open Complaints',
            value:    KPI_DATA.openComplaints,
            growth:   KPI_DATA.complaintsGrowth,
            dir:      KPI_DATA.complaintsGrowthDir,
            sub:      'need attention',
            icon:     AlertTriangle,
            iconBg:   'bg-red-50',
            iconColor:'text-red-500',
          },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white border border-surface-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                  <Icon size={16} className={kpi.iconColor} />
                </div>
                <Trend dir={kpi.dir} value={kpi.growth} />
              </div>
              <p className="text-2xl font-bold text-surface-900 mb-0.5">{kpi.value}</p>
              <p className="text-xs font-medium text-surface-500">{kpi.label}</p>
              <p className="text-xs text-surface-400 mt-0.5">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Referral trend */}
        <div className="bg-white border border-surface-100 rounded-2xl p-6">
          <SectionHeader
            title="Monthly Referrals"
            subtitle="Referrals created vs meals prepared"
          />
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-4 text-xs text-surface-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-primary-500" />
                Referrals created
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-400" />
                Meals prepared
              </span>
            </div>
          </div>
          {/* Dual bar chart */}
          <div className="flex items-end gap-3 h-36 w-full">
            {REFERRAL_TREND.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-end gap-0.5 w-full" style={{ height: '100px' }}>
                  <div
                    className="flex-1 bg-primary-500 rounded-t-sm transition-all duration-700"
                    style={{ height: `${(d.referrals / 84) * 100}%` }}
                  />
                  <div
                    className="flex-1 bg-emerald-400 rounded-t-sm transition-all duration-700"
                    style={{ height: `${(d.prepared / 84) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-surface-400">{d.month}</span>
              </div>
            ))}
          </div>
          {/* Conversion rate note */}
          <div className="mt-4 pt-4 border-t border-surface-50 flex items-center justify-between">
            <span className="text-xs text-surface-400">Avg preparation rate</span>
            <span className="text-xs font-bold text-emerald-600">
              {Math.round((REFERRAL_TREND[REFERRAL_TREND.length - 1].prepared /
                REFERRAL_TREND[REFERRAL_TREND.length - 1].referrals) * 100)}%
            </span>
          </div>
        </div>

        {/* User growth */}
        <div className="bg-white border border-surface-100 rounded-2xl p-6">
          <SectionHeader
            title="User Growth"
            subtitle="Platform adoption by role over time"
          />
          <BarChart
            data={USER_GROWTH}
            valueKey="patients"
            labelKey="month"
            color="bg-primary-500"
            maxValue={1400}
          />
          <div className="mt-4 pt-4 border-t border-surface-50 grid grid-cols-3 gap-3">
            {[
              { label: 'Patients',   value: 1240, color: 'text-primary-600' },
              { label: 'Dietitians', value: 48,   color: 'text-emerald-600' },
              { label: 'Chefs',      value: 32,   color: 'text-amber-600'   },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-surface-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Middle row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* User role breakdown */}
        <div className="bg-white border border-surface-100 rounded-2xl p-6">
          <SectionHeader
            title="User Breakdown"
            subtitle="By role"
          />
          <div className="space-y-4">
            {ROLE_BREAKDOWN.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.role}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon size={13} className={item.textColor} />
                      <span className="text-xs font-medium text-surface-700">{item.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-surface-800">{item.count.toLocaleString()}</span>
                      <span className="text-xs text-surface-400">{item.pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-700`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Neighbourhood activity */}
        <div className="bg-white border border-surface-100 rounded-2xl p-6">
          <SectionHeader
            title="Buea Activity Map"
            subtitle="Patients and referrals by neighbourhood"
          />
          <div className="space-y-3">
            {NEIGHBOURHOOD_DATA.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-surface-300 w-4 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-surface-700 truncate">{item.name}</span>
                    <span className="text-xs text-surface-400 shrink-0 ml-2">
                      {item.patients} patients · {item.referrals} ref
                    </span>
                  </div>
                  <div className="h-1 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-400 rounded-full transition-all duration-700"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complaint categories */}
        <div className="bg-white border border-surface-100 rounded-2xl p-6">
          <SectionHeader
            title="Complaint Types"
            subtitle="Distribution this period"
          />
          <div className="space-y-3">
            {COMPLAINT_CATEGORIES.map(item => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-surface-700">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-surface-800">{item.count}</span>
                    <span className="text-xs text-surface-400">{item.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-surface-50">
            <p className="text-xs text-surface-400">
              Food Safety complaints are flagged for immediate escalation regardless of volume.
            </p>
          </div>
        </div>

      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top performing chefs */}
        <div className="bg-white border border-surface-100 rounded-2xl p-6">
          <SectionHeader
            title="Top Performing Chefs"
            subtitle="By referrals completed this period"
            action={
              <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View all <ArrowUpRight size={12} />
              </button>
            }
          />
          <div className="space-y-3">
            {TOP_CHEFS.map((chef, i) => (
              <div
                key={chef.name}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors"
              >
                {/* Rank */}
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  i === 0 ? 'bg-amber-100 text-amber-700'
                  : i === 1 ? 'bg-surface-100 text-surface-600'
                  : 'bg-surface-50 text-surface-400'
                }`}>
                  {i + 1}
                </span>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {chef.name.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-800 truncate">{chef.name}</p>
                  <p className="text-xs text-surface-400">{chef.area}</p>
                </div>

                {/* Stats */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-surface-900">{chef.referrals}</p>
                  <p className="text-xs text-surface-400">referrals</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-emerald-600">★ {chef.rating}</p>
                  <p className="text-xs text-surface-400">rating</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification pipeline */}
        <div className="bg-white border border-surface-100 rounded-2xl p-6">
          <SectionHeader
            title="Verification Pipeline"
            subtitle="Professional application funnel — all time"
          />

          {/* Funnel visual */}
          <div className="space-y-3 mb-6">
            {VERIFICATION_PIPELINE.map((stage, i) => {
              const maxCount = Math.max(...VERIFICATION_PIPELINE.map(s => s.count));
              return (
                <div key={stage.stage} className="flex items-center gap-4">
                  <span className="text-xs font-medium text-surface-500 w-28 shrink-0">
                    {stage.stage}
                  </span>
                  <div className="flex-1 h-7 bg-surface-50 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full ${stage.color} rounded-lg transition-all duration-700 flex items-center justify-end pr-3`}
                      style={{ width: `${(stage.count / maxCount) * 100}%`, minWidth: '40px' }}
                    >
                      <span className="text-xs font-bold text-white">{stage.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Approval rate */}
          <div className="bg-surface-50 rounded-xl p-4 border border-surface-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-surface-800">Overall Approval Rate</p>
                <p className="text-xs text-surface-400 mt-0.5">Approved ÷ (Approved + Rejected)</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">
                  {Math.round(
                    (VERIFICATION_PIPELINE.find(s => s.stage === 'Approved').count /
                    (VERIFICATION_PIPELINE.find(s => s.stage === 'Approved').count +
                     VERIFICATION_PIPELINE.find(s => s.stage === 'Rejected').count)) * 100
                  )}%
                </p>
                <p className="text-xs text-surface-400">of applicants</p>
              </div>
            </div>
          </div>

          {/* Data freshness note */}
          <div className="mt-4 flex items-center gap-2 text-xs text-surface-400">
            <Calendar size={11} />
            Data reflects all verified professionals since platform launch.
          </div>
        </div>

      </div>

      {/* ── Coming soon banner ── */}
      <div className="bg-surface-800 rounded-2xl p-6 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-white mb-1">
            Advanced analytics coming in Phase 2
          </p>
          <p className="text-xs text-surface-400 leading-relaxed max-w-xl">
            Patient health outcome tracking, dietitian plan compliance rates,
            chef performance scoring, and predictive demand forecasting for
            Buea neighbourhoods will be available once Supabase is fully connected.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-600 rounded-xl text-white text-xs font-semibold shrink-0">
          <Activity size={14} />
          Phase 2 Roadmap
        </div>
      </div>

    </div>
  );
}