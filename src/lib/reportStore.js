import { byNewest, createId, insertRecord, readCollection, updateRecord } from './localDb';
import { recordAuditLog } from './auditLogStore';
import { createNotification } from './notificationStore';

export const REPORTS_KEY = 'cc_reports';

export function getReports(filters = {}) {
  let reports = readCollection(REPORTS_KEY);
  if (filters.patientId) reports = reports.filter(item => item.patientId === filters.patientId);
  if (filters.dietitianId) reports = reports.filter(item => item.dietitianId === filters.dietitianId);
  if (filters.status) reports = reports.filter(item => item.status === filters.status);
  return byNewest(reports);
}

export function getReportById(id) {
  return readCollection(REPORTS_KEY).find(item => item.id === id) || null;
}

export function getReportByVerificationCode(code) {
  return readCollection(REPORTS_KEY).find(item => item.verificationCode === code) || null;
}

export function createReport({
  patientId,
  dietitianId,
  consultationId = '',
  mealPlanId = '',
  title = 'Nutrition consultation report',
  publicSummary = 'This CareCuisin report was issued by a verified dietitian.',
}) {
  if (!patientId || !dietitianId) throw new Error('Patient and dietitian are required.');

  const verificationCode = createId('VRF');
  const report = insertRecord(REPORTS_KEY, {
    id: createId('RPT'),
    patientId,
    dietitianId,
    consultationId,
    mealPlanId,
    title,
    publicSummary,
    verificationCode,
    qrPayload: `/verify/${verificationCode}`,
    status: 'valid',
    issuedAt: new Date().toISOString(),
  });

  createNotification({
    userId: patientId,
    title: 'Care report generated',
    message: 'Your dietitian has generated a verified CareCuisin report.',
    type: 'report',
    relatedType: 'report',
    relatedId: report.id,
  });

  recordAuditLog({
    actorId: dietitianId,
    action: 'report_generated',
    module: 'reports',
    recordId: report.id,
    affectedUserId: patientId,
    details: title,
  });

  return report;
}

export function revokeReport(id, actorId = 'system') {
  const report = updateRecord(REPORTS_KEY, id, { status: 'revoked' });
  if (report) {
    recordAuditLog({
      actorId,
      action: 'report_revoked',
      module: 'reports',
      recordId: id,
      affectedUserId: report.patientId,
    });
  }
  return report;
}
