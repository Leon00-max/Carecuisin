import { byNewest, createId, insertRecord, readCollection } from './localDb';

export const AUDIT_LOGS_KEY = 'cc_audit_logs';

export function getAuditLogs(filters = {}) {
  let logs = readCollection(AUDIT_LOGS_KEY);

  if (filters.module) logs = logs.filter(log => log.module === filters.module);
  if (filters.actorId) logs = logs.filter(log => log.actorId === filters.actorId);
  if (filters.affectedUserId) logs = logs.filter(log => log.affectedUserId === filters.affectedUserId);
  if (filters.recordId) logs = logs.filter(log => log.recordId === filters.recordId);

  return byNewest(logs);
}

export function recordAuditLog({
  actorId = 'system',
  action,
  module,
  recordId = '',
  affectedUserId = '',
  details = '',
}) {
  if (!action || !module) return null;

  return insertRecord(AUDIT_LOGS_KEY, {
    id: createId('AUD'),
    actorId,
    action,
    module,
    recordId,
    affectedUserId,
    details,
  });
}
