'use client';

import { ShieldCheck, UserCog } from 'lucide-react';
import { adminRoles } from '@/lib/adminPortalData';
import { Avatar, PageHeader, SectionCard, StatusBadge } from '@/components/admin/AdminUI';

export default function AdminRolesPage() {
  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Permissions"
        title="Admin Roles"
        subtitle="Manage internal admin access levels as the CareCuisin operations team grows."
        icon={UserCog}
      />

      <SectionCard title="Permission Levels" icon={ShieldCheck}>
        <div className="space-y-3">
          {adminRoles.map(admin => (
            <div key={admin.name} className="flex items-center gap-3 rounded-2xl border border-surface-100 p-3">
              <Avatar name={admin.name} tone="primary" className="w-10 h-10 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-surface-900">{admin.name}</p>
                <p className="text-xs text-surface-500">{admin.role} - {admin.access}</p>
              </div>
              <StatusBadge tone="success">{admin.status}</StatusBadge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
