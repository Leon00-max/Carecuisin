'use client';

import Link from 'next/link';
import { X } from 'lucide-react';

const toneStyles = {
  primary: 'bg-primary-50 text-primary-700 border-primary-100',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  alert: 'bg-alert/10 text-alert border-alert/20',
  neutral: 'bg-surface-50 text-surface-600 border-surface-200',
};

export function toneClass(tone = 'neutral') {
  return toneStyles[tone] || toneStyles.neutral;
}

export function PageHeader({ eyebrow, title, subtitle, icon: Icon, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 min-w-0 max-w-full">
      <div className="min-w-0">
        {eyebrow && (
          <span className="badge-clinical mb-2">
            {Icon && <Icon size={12} className="mr-1" />}
            {eyebrow}
          </span>
        )}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-surface-900 tracking-tight leading-tight break-words">{title}</h1>
        {subtitle && <p className="text-sm text-surface-500 mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 max-w-full">{action}</div>}
    </div>
  );
}

export function SectionCard({ title, subtitle, icon: Icon, action, children, className = '' }) {
  return (
    <section className={`card-medical rounded-2xl !p-4 sm:!p-5 min-w-0 max-w-full overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4 min-w-0">
          <div className="flex items-start gap-3 min-w-0">
            {Icon && (
              <span className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center shrink-0">
                <Icon size={17} />
              </span>
            )}
            <div className="min-w-0">
              {title && <h2 className="text-sm font-bold text-surface-900">{title}</h2>}
              {subtitle && <p className="text-xs text-surface-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatusBadge({ tone = 'neutral', children, icon: Icon }) {
  return (
    <span className={`inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none ${toneClass(tone)}`}>
      {Icon ? <Icon size={12} /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      <span className="truncate">{children}</span>
    </span>
  );
}

export function Avatar({ name, tone = 'primary', className = '' }) {
  const initials = String(name || 'CC')
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-xs font-bold shrink-0 ${toneClass(tone)} ${className}`}>
      {initials}
    </div>
  );
}

export function ProgressBar({ value = 0, tone = 'primary' }) {
  const fillClass = tone === 'success' ? 'bg-success' : tone === 'warning' ? 'bg-warning' : tone === 'alert' ? 'bg-alert' : 'bg-primary-500';
  return (
    <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${fillClass} transition-all`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function SegmentedControl({ tabs, active, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:flex gap-1 rounded-2xl bg-surface-100 p-1 min-w-0 max-w-full overflow-hidden">
      {tabs.map(tab => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`min-h-10 min-w-0 rounded-xl px-2 sm:px-3 text-xs font-semibold transition-all ${
            active === tab.key
              ? 'bg-white text-primary-700 shadow-sm border border-primary-100'
              : 'text-surface-500 hover:text-surface-800'
          }`}
        >
          <span className="block truncate">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export function ActionTile({ href, icon: Icon, label, tone = 'primary' }) {
  return (
    <Link href={href} className="card-medical rounded-2xl !p-4 min-w-0 flex flex-col items-start gap-3 hover:-translate-y-0.5 transition-all">
      <span className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-sm ${toneClass(tone)}`}>
        <Icon size={18} />
      </span>
      <span className="text-xs font-bold text-surface-800 leading-tight break-words">{label}</span>
    </Link>
  );
}

export function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[80] bg-surface-900/30 backdrop-blur-sm px-3 sm:px-4 py-6 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-xl bg-white rounded-3xl border border-surface-200 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between gap-4">
          <h3 className="text-base font-bold text-surface-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-surface-200 text-surface-500 hover:text-alert hover:bg-alert/5 transition-colors flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 max-h-[75vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
