'use client';

import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  MessageSquare,
  ShieldCheck,
  Truck,
  UtensilsCrossed,
} from 'lucide-react';
import { operationCards, patientTimeline, complaints } from '@/lib/adminPortalData';
import { PageHeader, ProgressBar, SectionCard, StatusBadge } from '@/components/admin/AdminUI';

export default function AdminOperationsPage() {
  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Daily Workspace"
        title="Operations"
        subtitle="Monitor verifications, complaints, referrals, meal delays, and patient care events from one command surface."
        icon={Activity}
      />

      <section className="card-medical rounded-3xl !p-5 border-primary-100 bg-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <StatusBadge tone="success" icon={CheckCircle2}>Platform Stable</StatusBadge>
            <h2 className="text-xl font-bold text-surface-900 mt-3">Care operations are within threshold.</h2>
            <p className="text-sm text-surface-500 mt-1">Two queues need attention before lunch dispatch closes.</p>
          </div>
          <span className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center shrink-0">
            <Activity size={22} />
          </span>
        </div>
        <div className="mt-5">
          <ProgressBar value={82} tone="success" />
          <div className="flex justify-between text-[11px] font-semibold text-surface-500 mt-2">
            <span>Operational readiness</span>
            <span>82%</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {operationCards.map(card => (
          <Link key={card.label} href={card.tone === 'alert' ? '/admin/complaints' : card.label.includes('Verification') ? '/admin/verify-users' : '/admin/operations'} className="card-medical rounded-2xl !p-4">
            <StatusBadge tone={card.tone}>{card.label}</StatusBadge>
            <p className="text-2xl font-bold text-surface-900 mt-3">{card.value}</p>
            <p className="text-xs text-surface-500 mt-1">{card.detail}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title="Active Meal Issues" subtitle="Meals and referrals needing operational attention." icon={UtensilsCrossed}>
          <div className="space-y-3">
            {[
              { title: 'Lunch delivery late', detail: 'Amara Nkeng - Chef Kwame', time: '12 min overdue', tone: 'alert', icon: Truck },
              { title: 'Referral waiting', detail: 'John Atem plan awaiting chef response', time: '2 hr open', tone: 'warning', icon: Clock },
              { title: 'Plan review due', detail: 'Linda Ekema needs dietitian update', time: 'Today', tone: 'primary', icon: ShieldCheck },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-surface-100 p-3">
                  <span className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                    item.tone === 'alert' ? 'bg-alert/10 text-alert border-alert/20' : item.tone === 'warning' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-primary-50 text-primary-600 border-primary-100'
                  }`}>
                    <Icon size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-surface-900">{item.title}</p>
                    <p className="text-xs text-surface-500 truncate">{item.detail}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-surface-400">{item.time}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Pending Complaints" subtitle="Priority case queue from support desk." icon={AlertTriangle}>
          <div className="space-y-3">
            {complaints.slice(0, 3).map(item => (
              <Link href="/admin/complaints" key={item.id} className="flex items-center gap-3 rounded-2xl border border-surface-100 p-3 hover:bg-primary-50/40 transition-colors">
                <StatusBadge tone={item.priority === 'High' ? 'alert' : item.priority === 'Medium' ? 'warning' : 'primary'}>{item.priority}</StatusBadge>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-surface-900 truncate">{item.summary}</p>
                  <p className="text-xs text-surface-500 truncate">{item.name}</p>
                </div>
                <ChevronRight size={15} className="text-surface-400" />
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Patient Care Timeline" subtitle="Trace consultations, prescriptions, chef assignments, progress, and safety events." icon={MessageSquare}>
        <div className="space-y-5">
          {patientTimeline.map((event, index) => (
            <div key={event.title} className="relative pl-9">
              {index < patientTimeline.length - 1 && <span className="absolute left-3 top-7 bottom-[-20px] w-px bg-surface-200" />}
              <span className={`absolute left-0 top-0 w-7 h-7 rounded-full border flex items-center justify-center ${
                event.tone === 'alert' ? 'bg-alert/10 text-alert border-alert/20' : event.tone === 'warning' ? 'bg-warning/10 text-warning border-warning/20' : event.tone === 'success' ? 'bg-success/10 text-success border-success/20' : 'bg-primary-50 text-primary-600 border-primary-100'
              }`}>
                <CheckCircle2 size={14} />
              </span>
              <div className="rounded-2xl border border-surface-100 p-4 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-surface-900">{event.title}</h3>
                  <span className="text-[11px] font-semibold text-surface-400 shrink-0">{event.time}</span>
                </div>
                <p className="text-xs text-surface-500 mt-1">{event.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
