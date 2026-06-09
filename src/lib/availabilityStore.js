import { byNewest, createId, insertRecord, readCollection, updateRecord } from './localDb';
import { getConsultations } from './consultationStore';
import { recordAuditLog } from './auditLogStore';
import { createNotification } from './notificationStore';

export const AVAILABILITY_KEY = 'cc_dietitian_availability';

const DAY_MAP = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
};

export const DEFAULT_AVAILABILITY = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  startTime: '08:00',
  endTime: '17:00',
  durationMinutes: 45,
  breakMinutes: 15,
  consultationFee: 2500,
  maxBookingsPerDay: 6,
  mode: 'Online or in-person',
  unavailableDates: [],
};

function toDateInput(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function minutes(value) {
  const [hour, minute] = String(value || '00:00').split(':').map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

function timeFromMinutes(value) {
  const hour = String(Math.floor(value / 60)).padStart(2, '0');
  const minute = String(value % 60).padStart(2, '0');
  return `${hour}:${minute}`;
}

export function getDietitianAvailability(dietitianId) {
  if (!dietitianId) return { ...DEFAULT_AVAILABILITY };
  const saved = readCollection(AVAILABILITY_KEY).find(item => item.dietitianId === dietitianId);
  return saved ? { ...DEFAULT_AVAILABILITY, ...saved } : { ...DEFAULT_AVAILABILITY, dietitianId };
}

export function saveDietitianAvailability(dietitianId, payload, actorId = dietitianId) {
  if (!dietitianId) throw new Error('Dietitian is required.');
  const fee = Number(payload.consultationFee);
  if (!fee || fee <= 0) throw new Error('Consultation fee must be greater than zero.');
  if (!payload.days?.length) throw new Error('Select at least one available day.');
  if (minutes(payload.endTime) <= minutes(payload.startTime)) throw new Error('End time must be after start time.');

  const records = readCollection(AVAILABILITY_KEY);
  const existing = records.find(item => item.dietitianId === dietitianId);
  const data = {
    ...(existing || {}),
    id: existing?.id || createId('AVL'),
    dietitianId,
    days: payload.days,
    startTime: payload.startTime,
    endTime: payload.endTime,
    durationMinutes: Number(payload.durationMinutes || 45),
    breakMinutes: Number(payload.breakMinutes || 0),
    consultationFee: fee,
    maxBookingsPerDay: Number(payload.maxBookingsPerDay || 6),
    mode: payload.mode || 'Online or in-person',
    unavailableDates: payload.unavailableDates || [],
  };

  const saved = existing ? updateRecord(AVAILABILITY_KEY, existing.id, data) : insertRecord(AVAILABILITY_KEY, data);

  createNotification({
    userId: dietitianId,
    title: 'Availability updated',
    message: 'Patients will now see your latest consultation hours.',
    type: 'availability',
    relatedType: 'availability',
    relatedId: saved.id,
  });

  recordAuditLog({
    actorId,
    action: 'dietitian_availability_updated',
    module: 'availability',
    recordId: saved.id,
    affectedUserId: dietitianId,
    details: `${saved.days.join(', ')} ${saved.startTime}-${saved.endTime}`,
  });

  return saved;
}

export function getDietitianSlots(dietitianId, options = {}) {
  const availability = getDietitianAvailability(dietitianId);
  const fromDate = options.fromDate ? new Date(options.fromDate) : new Date();
  const daysAhead = Number(options.daysAhead || 10);
  const booked = getConsultations({ dietitianId })
    .filter(item => !['rejected', 'cancelled'].includes(item.status))
    .map(item => (item.scheduledDateTime || item.requestedDateTime || '').slice(0, 16));

  const slots = [];
  for (let i = 0; i < daysAhead; i += 1) {
    const day = new Date(fromDate);
    day.setDate(fromDate.getDate() + i);
    const short = day.toLocaleDateString('en-US', { weekday: 'short' });
    const dateValue = toDateInput(day);
    if (!availability.days.includes(short)) continue;
    if (availability.unavailableDates.includes(dateValue)) continue;

    let countForDay = 0;
    const start = minutes(availability.startTime);
    const end = minutes(availability.endTime);
    const step = Number(availability.durationMinutes || 45) + Number(availability.breakMinutes || 0);

    for (let cursor = start; cursor + Number(availability.durationMinutes || 45) <= end; cursor += step) {
      if (countForDay >= Number(availability.maxBookingsPerDay || 6)) break;
      const time = timeFromMinutes(cursor);
      const value = `${dateValue}T${time}`;
      const isBooked = booked.includes(value);
      slots.push({
        value,
        date: dateValue,
        time,
        day: DAY_MAP[short] || short,
        label: `${DAY_MAP[short] || short}, ${dateValue} at ${time}`,
        available: !isBooked,
        fee: Number(availability.consultationFee || 2500),
        mode: availability.mode,
      });
      countForDay += 1;
    }
  }

  return slots;
}

export function isDietitianSlotAvailable(dietitianId, slotValue) {
  if (!slotValue) return false;
  return getDietitianSlots(dietitianId, { daysAhead: 30 }).some(slot => slot.value === slotValue && slot.available);
}

export function getAllAvailability() {
  return byNewest(readCollection(AVAILABILITY_KEY));
}
