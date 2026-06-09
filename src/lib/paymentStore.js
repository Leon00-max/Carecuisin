import { byNewest, createId, insertRecord, readCollection, updateRecord } from './localDb';
import { recordAuditLog } from './auditLogStore';
import { createNotification } from './notificationStore';
import { updateConsultationPaymentStatus } from './consultationStore';
import { updateOrderPaymentStatus } from './orderStore';
import { creditWallet, debitWallet } from './walletStore';

export const PAYMENTS_KEY = 'cc_payments';

export const PAYMENT_PROVIDERS = {
  mtn_momo: {
    id: 'mtn_momo',
    label: 'MTN MoMo',
    hint: 'Use an MTN Cameroon MoMo number.',
  },
  orange_money: {
    id: 'orange_money',
    label: 'Orange Money',
    hint: 'Use an Orange Cameroon Money number.',
  },
  stripe_card: {
    id: 'stripe_card',
    label: 'Card by Stripe',
    hint: 'Card processing placeholder ready for Stripe keys.',
  },
  wallet: {
    id: 'wallet',
    label: 'CareCuisin Wallet',
    hint: 'Use your available wallet balance.',
  },
};

export const PAYMENT_STATUSES = ['pending', 'successful', 'failed', 'cancelled', 'refunded'];

export function getPayments(filters = {}) {
  let payments = readCollection(PAYMENTS_KEY);

  if (filters.userId) payments = payments.filter(item => item.userId === filters.userId);
  if (filters.provider) payments = payments.filter(item => item.provider === filters.provider);
  if (filters.status) payments = payments.filter(item => item.status === filters.status);
  if (filters.relatedType) payments = payments.filter(item => item.relatedType === filters.relatedType);
  if (filters.relatedId) payments = payments.filter(item => item.relatedId === filters.relatedId);

  return byNewest(payments);
}

export function getPaymentById(id) {
  return readCollection(PAYMENTS_KEY).find(item => item.id === id) || null;
}

export function createPayment({
  userId,
  amount,
  currency = 'XAF',
  provider = 'mtn_momo',
  phone = '',
  relatedType,
  relatedId,
  description = '',
  recipientId = '',
  purpose = '',
  metadata = {},
}) {
  if (!userId) throw new Error('User is required.');
  if (!amount || Number(amount) <= 0) throw new Error('Payment amount must be greater than zero.');
  if (!PAYMENT_PROVIDERS[provider]) throw new Error('Unsupported payment provider.');
  if ((provider === 'mtn_momo' || provider === 'orange_money') && phone && !/^[26][0-9]{8}$/.test(phone)) {
    throw new Error('Enter a valid Cameroon mobile number.');
  }

  const payment = insertRecord(PAYMENTS_KEY, {
    id: createId('PAY'),
    userId,
    amount: Number(amount),
    currency,
    provider,
    phone,
    relatedType: relatedType || '',
    relatedId: relatedId || '',
    description,
    recipientId,
    purpose,
    metadata,
    status: 'pending',
    transactionReference: createId(provider === 'stripe_card' ? 'STR' : 'MOB'),
    receiptNumber: '',
    paidAt: '',
    failureReason: '',
  });

  createNotification({
    userId,
    title: 'Payment started',
    message: `${PAYMENT_PROVIDERS[provider].label} payment is pending.`,
    type: 'payment',
    relatedType: 'payment',
    relatedId: payment.id,
  });

  recordAuditLog({
    actorId: userId,
    action: 'payment_created',
    module: 'payments',
    recordId: payment.id,
    details: `${payment.currency} ${payment.amount}`,
  });

  return payment;
}

export function simulatePaymentResult(id, result = 'successful') {
  if (!PAYMENT_STATUSES.includes(result)) throw new Error('Invalid payment result.');

  const current = getPaymentById(id);
  if (!current) throw new Error('Payment not found.');
  if (current.status === result && result === 'successful') return current;

  if (result === 'successful' && current.provider === 'wallet') {
    debitWallet({
      userId: current.userId,
      amount: current.amount,
      reason: current.description || current.purpose || 'CareCuisin wallet payment',
      relatedPaymentId: current.id,
      actorId: current.userId,
    });
  }

  const payment = updateRecord(PAYMENTS_KEY, id, {
    status: result,
    paidAt: result === 'successful' ? new Date().toISOString() : current.paidAt,
    receiptNumber: result === 'successful' ? `RCP-${Date.now()}` : current.receiptNumber,
    failureReason: result === 'failed' ? 'Provider simulation returned failed.' : '',
  });

  if (payment.relatedType === 'order' && payment.relatedId && result === 'successful') {
    updateOrderPaymentStatus(payment.relatedId, 'paid');
  }

  if (payment.relatedType === 'consultation' && payment.relatedId && result === 'successful') {
    updateConsultationPaymentStatus(payment.relatedId, 'paid', {
      paymentId: payment.id,
      paymentMethod: payment.provider,
    });
  }

  if (payment.relatedType === 'wallet_topup' && result === 'successful') {
    creditWallet({
      userId: payment.userId,
      amount: payment.amount,
      type: 'top_up',
      reason: payment.description || 'Wallet top-up',
      relatedPaymentId: payment.id,
      actorId: payment.userId,
    });
  }

  createNotification({
    userId: payment.userId,
    title: result === 'successful' ? 'Payment received' : `Payment ${result}`,
    message: result === 'successful'
      ? `Receipt ${payment.receiptNumber} has been generated.`
      : `Payment ${payment.transactionReference} is ${result}.`,
    type: 'payment',
    relatedType: 'payment',
    relatedId: payment.id,
  });

  recordAuditLog({
    actorId: payment.userId,
    action: `payment_${result}`,
    module: 'payments',
    recordId: payment.id,
    details: payment.transactionReference,
  });

  if (payment.recipientId && result === 'successful') {
    createNotification({
      userId: payment.recipientId,
      title: 'Payment received',
      message: `${payment.amount.toLocaleString()} ${payment.currency} was paid for ${payment.purpose || payment.description || 'CareCuisin service'}.`,
      type: 'payment',
      relatedType: 'payment',
      relatedId: payment.id,
    });
  }

  return payment;
}

export function linkPaymentToRecord(paymentId, relatedType, relatedId) {
  return updateRecord(PAYMENTS_KEY, paymentId, { relatedType, relatedId });
}

export function getReceiptByPaymentId(id) {
  const payment = getPaymentById(id);
  if (!payment || payment.status !== 'successful') return null;
  return {
    receiptNumber: payment.receiptNumber,
    paymentId: payment.id,
    amount: payment.amount,
    currency: payment.currency,
    provider: PAYMENT_PROVIDERS[payment.provider]?.label || payment.provider,
    transactionReference: payment.transactionReference,
    paidAt: payment.paidAt,
    description: payment.description,
  };
}
