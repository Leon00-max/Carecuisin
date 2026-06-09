'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileClock, Filter, Search } from 'lucide-react';
import { auditLogs } from '@/lib/adminPortalData';
import { getAuditLogs } from '@/lib/auditLogStore';
import { Avatar, PageHeader, SectionCard, StatusBadge } from '@/components/admin/AdminUI';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    queueMicrotask(() => {
      setLogs(getAuditLogs());
    });
  }, []);

  const visibleLogs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const realLogs = logs.map(log => ({
      id: log.id,
      action: log.action.replaceAll('_', ' '),
      type: log.module,
      admin: log.actorId,
      target: log.affectedUserId || log.recordId || 'system',
      date: log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'Today',
      time: log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      details: log.details || '',
    }));
    const fallbackLogs = auditLogs.map((log, index) => ({ ...log, id: `demo-${index}` }));
    const source = realLogs.length ? realLogs : fallbackLogs;

    if (!normalized) return source;
    return source.filter(log =>
      [log.action, log.type, log.admin, log.target, log.details].join(' ').toLowerCase().includes(normalized)
    );
  }, [logs, query]);

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Accountability"
        title="Audit Logs"
        subtitle="Review admin actions across verification, complaints, user safety, and platform control."
        icon={FileClock}
      />

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            className="input-medical pl-10"
            placeholder="Search logs by admin, target, or action..."
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </div>
        <button type="button" className="w-11 rounded-xl border border-surface-200 bg-white text-surface-500 flex items-center justify-center">
          <Filter size={17} />
        </button>
      </div>

      <SectionCard title="Recent Actions" icon={FileClock}>
        <div className="space-y-3">
          {visibleLogs.map(log => (
            <div key={log.id || `${log.action}-${log.time}`} className="flex items-start gap-3 rounded-2xl border border-surface-100 p-3">
              <Avatar name={log.admin} tone="primary" className="w-10 h-10 rounded-xl" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold capitalize text-surface-900">{log.action}</p>
                  <StatusBadge tone={String(log.type).toLowerCase().includes('complaint') ? 'alert' : String(log.type).toLowerCase().includes('verification') ? 'success' : 'warning'}>{log.type}</StatusBadge>
                </div>
                <p className="text-xs text-surface-500 mt-1">By {log.admin} - affected {log.target}</p>
                {log.details && <p className="text-xs text-surface-500 mt-1">{log.details}</p>}
                <p className="text-[11px] text-surface-400 mt-1">{log.date}, {log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
