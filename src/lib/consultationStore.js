import { byNewest, createId, insertRecord, readCollection, updateRecord } from './localDb';
import { recordAuditLog } from './auditLogStore';
import { createNotification } from './notificationStore';

export const CONSULTATIONS_KEY = 'cc_consultations';

export const CONSULTATION_STATUSES = [
  'requested',
  'accepted',
  'rejected',
  'scheduled',
  'completed',
  'cancelled',
];

export function getConsultations(filters = {}) {
  let consultations = readCollection(CONSULTATIONS_KEY);

  if (filters.patientId) consultations = consultations.filter(item => item.patientId === filters.patientId);
  if (filters.dietitianId) consultations = consultations.filter(item => item.dietitianId === filters.dietitianId);
  if (filters.status) consultations = consultations.filter(item => item.status === filters.status);

  return byNewest(consultations);
}

export function getConsultationById(id) {
  return readCollection(CONSULTATIONS_KEY).find(item => item.id === id) || null;
}

export function createConsultation({
  patientId,
  dietitianId,
  requestedDateTime,
  reason,
  healthConcern,
  paymentStatus = 'pending',
  consultationFee = 2500,
  paymentId = '',
  paymentMethod = '',
}) {
  if (!patientId) throw new Error('Patient is required.');
  if (!dietitianId) throw new Error('Dietitian is required.');
  if (!requestedDateTime) throw new Error('Preferred consultation time is required.');

  const consultation = insertRecord(CONSULTATIONS_KEY, {
    id: createId('CON'),
    patientId,
    dietitianId,
    requestedDateTime,
    scheduledDateTime: '',
    reason: reason || 'Nutrition consultation',
    healthConcern: healthConcern || '',
    status: 'requested',
    paymentStatus,
    consultationFee: Number(consultationFee || 2500),
    paymentId,
    paymentMethod,
    notes: '',
  });

  createNotification({
    userId: dietitianId,
    title: 'New consultation request',
    message: 'A patient has requested a nutrition consultation.',
    type: 'consultation',
    relatedType: 'consultation',
    relatedId: consultation.id,
  });

  recordAuditLog({
    actorId: patientId,
    action: 'created_consultation',
    module: 'consultations',
    recordId: consultation.id,
    affectedUserId: dietitianId,
    details: consultation.reason,
  });

  return consultation;
}

export function updateConsultationPaymentStatus(id, paymentStatus, updates = {}) {
  const consultation = getConsultationById(id);
  if (!consultation) return null;
  return updateRecord(CONSULTATIONS_KEY, id, {
    paymentStatus,
    ...updates,
  });
}

export function updateConsultationStatus(id, status, updates = {}, actorId = 'system') {
  if (!CONSULTATION_STATUSES.includes(status)) throw new Error('Invalid consultation status.');

  const current = getConsultationById(id);
  if (!current) throw new Error('Consultation not found.');

  const consultation = updateRecord(CONSULTATIONS_KEY, id, {
    ...updates,
    status,
  });

  const targetUser = status === 'requested' ? consultation.dietitianId : consultation.patientId;
  createNotification({
    userId: targetUser,
    title: `Consultation ${status}`,
    message: `Your consultation is now ${status}.`,
    type: 'consultation',
    relatedType: 'consultation',
    relatedId: id,
  });

  recordAuditLog({
    actorId,
    action: `consultation_${status}`,
    module: 'consultations',
    recordId: id,
    affectedUserId: consultation.patientId,
    details: updates.notes || updates.rejectionReason || '',
  });

  return consultation;
}
