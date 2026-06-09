import { byNewest, createId, insertRecord, readCollection, updateRecord } from './localDb';
import { recordAuditLog } from './auditLogStore';
import { createNotification } from './notificationStore';

export const COMPLAINTS_KEY = 'cc_complaints';

export const COMPLAINT_STATUSES = ['open', 'in_review', 'resolved', 'closed', 'rejected'];

export function getComplaints(filters = {}) {
  let complaints = readCollection(COMPLAINTS_KEY);

  if (filters.submittedBy) complaints = complaints.filter(item => item.submittedBy === filters.submittedBy);
  if (filters.status) complaints = complaints.filter(item => item.status === filters.status);
  if (filters.priority) complaints = complaints.filter(item => item.priority === filters.priority);
  if (filters.relatedType) complaints = complaints.filter(item => item.relatedType === filters.relatedType);

  return byNewest(complaints);
}

export function getComplaintById(id) {
  return readCollection(COMPLAINTS_KEY).find(item => item.id === id) || null;
}

export function submitComplaint({
  submittedBy,
  type,
  summary,
  description,
  relatedType = '',
  relatedId = '',
  relatedUserId = '',
  priority = 'medium',
}) {
  if (!submittedBy) throw new Error('User is required.');
  if (!type) throw new Error('Complaint type is required.');
  if (!summary?.trim()) throw new Error('Complaint summary is required.');
  if (!description?.trim()) throw new Error('Complaint details are required.');

  const complaint = insertRecord(COMPLAINTS_KEY, {
    id: createId('CMP'),
    submittedBy,
    type,
    summary: summary.trim(),
    description: description.trim(),
    relatedType,
    relatedId,
    relatedUserId,
    priority,
    status: 'open',
    adminResponse: '',
    assignedAdminId: '',
    resolutionType: '',
    resolutionNotes: '',
  });

  recordAuditLog({
    actorId: submittedBy,
    action: 'complaint_submitted',
    module: 'complaints',
    recordId: complaint.id,
    affectedUserId: relatedUserId,
    details: summary,
  });

  return complaint;
}

export function updateComplaintStatus(id, status, updates = {}, actorId = 'system') {
  if (!COMPLAINT_STATUSES.includes(status)) throw new Error('Invalid complaint status.');
  const complaint = updateRecord(COMPLAINTS_KEY, id, { ...updates, status });
  if (!complaint) throw new Error('Complaint not found.');

  createNotification({
    userId: complaint.submittedBy,
    title: `Complaint ${status.replace('_', ' ')}`,
    message: updates.adminResponse || updates.resolutionNotes || 'Your complaint status has been updated.',
    type: 'complaint',
    relatedType: 'complaint',
    relatedId: complaint.id,
  });

  recordAuditLog({
    actorId,
    action: `complaint_${status}`,
    module: 'complaints',
    recordId: complaint.id,
    affectedUserId: complaint.submittedBy,
    details: updates.resolutionNotes || updates.adminResponse || '',
  });

  return complaint;
}
