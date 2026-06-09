import { byNewest, createId, insertRecord, readCollection, updateRecord } from './localDb';
import { recordAuditLog } from './auditLogStore';
import { createNotification } from './notificationStore';
import { getReferralById } from './referralStore';

export const ORDERS_KEY = 'cc_orders';

export const ORDER_STATUSES = [
  'requested',
  'accepted',
  'rejected',
  'preparing',
  'ready',
  'delivered',
  'completed',
  'cancelled',
];

export function getOrders(filters = {}) {
  let orders = readCollection(ORDERS_KEY);

  if (filters.patientId) orders = orders.filter(item => item.patientId === filters.patientId);
  if (filters.chefId) orders = orders.filter(item => item.chefId === filters.chefId);
  if (filters.dietitianId) orders = orders.filter(item => item.dietitianId === filters.dietitianId);
  if (filters.status) orders = orders.filter(item => item.status === filters.status);

  return byNewest(orders);
}

export function getOrderById(id) {
  return readCollection(ORDERS_KEY).find(item => item.id === id) || null;
}

export function createChefOrder({
  patientId,
  referralId,
  mealPlanId,
  deliveryAddress = '',
  deliveryTime = '',
  notes = '',
  amount = 0,
}) {
  if (!patientId) throw new Error('Patient is required.');
  if (!referralId) throw new Error('A dietitian referral is required before booking a chef.');

  const referral = getReferralById(referralId);
  if (!referral || referral.patientId !== patientId) {
    throw new Error('This chef referral is not available for this patient.');
  }

  const order = insertRecord(ORDERS_KEY, {
    id: createId('ORD'),
    patientId,
    dietitianId: referral.dietitianId,
    chefId: referral.chefId,
    referralId,
    mealPlanId: mealPlanId || referral.mealPlanId,
    status: 'requested',
    paymentStatus: 'pending',
    deliveryAddress,
    deliveryTime,
    notes,
    amount,
    statusHistory: [
      { status: 'requested', at: new Date().toISOString(), by: patientId },
    ],
  });

  createNotification({
    userId: referral.chefId,
    title: 'New chef order request',
    message: 'A patient has booked you from a dietitian referral.',
    type: 'order',
    relatedType: 'order',
    relatedId: order.id,
  });

  recordAuditLog({
    actorId: patientId,
    action: 'created_order',
    module: 'orders',
    recordId: order.id,
    affectedUserId: referral.chefId,
    details: `Referral ${referralId}`,
  });

  return order;
}

export function updateOrderStatus(id, status, actorId = 'system', details = '') {
  if (!ORDER_STATUSES.includes(status)) throw new Error('Invalid order status.');

  const current = getOrderById(id);
  if (!current) throw new Error('Order not found.');

  const order = updateRecord(ORDERS_KEY, id, {
    status,
    statusHistory: [
      ...(current.statusHistory || []),
      { status, at: new Date().toISOString(), by: actorId, details },
    ],
  });

  const notifyUserId = actorId === order.patientId ? order.chefId : order.patientId;
  createNotification({
    userId: notifyUserId,
    title: `Order ${status}`,
    message: `Order ${order.id} is now ${status}.`,
    type: 'order',
    relatedType: 'order',
    relatedId: id,
  });

  recordAuditLog({
    actorId,
    action: `order_${status}`,
    module: 'orders',
    recordId: id,
    affectedUserId: notifyUserId,
    details,
  });

  return order;
}

export function updateOrderPaymentStatus(id, paymentStatus) {
  return updateRecord(ORDERS_KEY, id, { paymentStatus });
}
