import { byNewest, createId, insertRecord, readCollection } from './localDb';
import { recordAuditLog } from './auditLogStore';

export const RATINGS_KEY = 'cc_ratings';

export function getRatings(filters = {}) {
  let ratings = readCollection(RATINGS_KEY);
  if (filters.patientId) ratings = ratings.filter(item => item.patientId === filters.patientId);
  if (filters.professionalId) ratings = ratings.filter(item => item.professionalId === filters.professionalId);
  if (filters.role) ratings = ratings.filter(item => item.role === filters.role);
  return byNewest(ratings);
}

export function createRating({
  patientId,
  professionalId,
  role,
  relatedType,
  relatedId,
  stars,
  comment = '',
}) {
  const value = Number(stars);
  if (!patientId || !professionalId) throw new Error('Patient and professional are required.');
  if (!['dietitian', 'chef'].includes(role)) throw new Error('Rating role must be dietitian or chef.');
  if (value < 1 || value > 5) throw new Error('Rating must be between 1 and 5.');

  const rating = insertRecord(RATINGS_KEY, {
    id: createId('RAT'),
    patientId,
    professionalId,
    role,
    relatedType: relatedType || '',
    relatedId: relatedId || '',
    stars: value,
    comment: comment.trim(),
    visibility: 'admin_professional',
  });

  recordAuditLog({
    actorId: patientId,
    action: 'rating_created',
    module: 'ratings',
    recordId: rating.id,
    affectedUserId: professionalId,
    details: `${value} stars`,
  });

  return rating;
}

export function getRatingSummary(professionalId) {
  const ratings = getRatings({ professionalId });
  if (!ratings.length) return { average: 0, count: 0 };
  const total = ratings.reduce((sum, rating) => sum + Number(rating.stars || 0), 0);
  return {
    average: Math.round((total / ratings.length) * 10) / 10,
    count: ratings.length,
  };
}
