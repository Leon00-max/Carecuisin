import { byNewest, createId, insertRecord, readCollection, updateRecord, writeCollection } from './localDb';
import { recordAuditLog } from './auditLogStore';
import { createNotification } from './notificationStore';

export const WALLETS_KEY = 'cc_wallets';
export const WALLET_TRANSACTIONS_KEY = 'cc_wallet_transactions';
export const MONEY_REQUESTS_KEY = 'cc_money_requests';

export const MONEY_REQUEST_STATUSES = ['requested', 'under_review', 'approved', 'rejected', 'paid'];

export function getWallet(userId) {
  if (!userId) return null;
  const wallets = readCollection(WALLETS_KEY);
  const existing = wallets.find(wallet => wallet.userId === userId);
  if (existing) return existing;

  const wallet = {
    id: createId('WLT'),
    userId,
    balance: 0,
    currency: 'XAF',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  writeCollection(WALLETS_KEY, [wallet, ...wallets]);
  return wallet;
}

function setWalletBalance(userId, amount) {
  const wallet = getWallet(userId);
  return updateRecord(WALLETS_KEY, wallet.id, { balance: Number(amount) });
}

export function getWalletTransactions(filters = {}) {
  let transactions = readCollection(WALLET_TRANSACTIONS_KEY);
  if (filters.userId) transactions = transactions.filter(item => item.userId === filters.userId);
  if (filters.type) transactions = transactions.filter(item => item.type === filters.type);
  if (filters.status) transactions = transactions.filter(item => item.status === filters.status);
  return byNewest(transactions);
}

export function getWalletSummary(userId) {
  const wallet = getWallet(userId);
  const transactions = userId ? getWalletTransactions({ userId }) : [];
  return {
    wallet,
    balance: Number(wallet?.balance || 0),
    currency: wallet?.currency || 'XAF',
    topUps: transactions.filter(item => item.type === 'top_up' && item.status === 'successful')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0),
    spent: transactions.filter(item => item.type === 'payment' && item.status === 'successful')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0),
    transactions,
  };
}

export function creditWallet({ userId, amount, type = 'top_up', reason = '', relatedPaymentId = '', actorId = userId }) {
  if (!userId) throw new Error('User is required.');
  const value = Number(amount);
  if (!value || value <= 0) throw new Error('Amount must be greater than zero.');

  const wallet = getWallet(userId);
  const nextBalance = Number(wallet.balance || 0) + value;
  setWalletBalance(userId, nextBalance);

  const transaction = insertRecord(WALLET_TRANSACTIONS_KEY, {
    id: createId('WTX'),
    userId,
    type,
    direction: 'credit',
    amount: value,
    currency: wallet.currency || 'XAF',
    status: 'successful',
    reason,
    relatedPaymentId,
    balanceAfter: nextBalance,
  });

  createNotification({
    userId,
    title: 'Wallet credited',
    message: `${value.toLocaleString()} XAF was added to your CareCuisin wallet.`,
    type: 'wallet',
    relatedType: 'wallet_transaction',
    relatedId: transaction.id,
  });

  recordAuditLog({
    actorId,
    action: 'wallet_credited',
    module: 'wallet',
    recordId: transaction.id,
    affectedUserId: userId,
    details: reason,
  });

  return transaction;
}

export function debitWallet({ userId, amount, type = 'payment', reason = '', relatedPaymentId = '', actorId = userId }) {
  if (!userId) throw new Error('User is required.');
  const value = Number(amount);
  if (!value || value <= 0) throw new Error('Amount must be greater than zero.');

  const wallet = getWallet(userId);
  if (Number(wallet.balance || 0) < value) throw new Error('Wallet balance is not enough for this payment.');

  const nextBalance = Number(wallet.balance || 0) - value;
  setWalletBalance(userId, nextBalance);

  const transaction = insertRecord(WALLET_TRANSACTIONS_KEY, {
    id: createId('WTX'),
    userId,
    type,
    direction: 'debit',
    amount: value,
    currency: wallet.currency || 'XAF',
    status: 'successful',
    reason,
    relatedPaymentId,
    balanceAfter: nextBalance,
  });

  recordAuditLog({
    actorId,
    action: 'wallet_debited',
    module: 'wallet',
    recordId: transaction.id,
    affectedUserId: userId,
    details: reason,
  });

  return transaction;
}

export function getMoneyRequests(filters = {}) {
  let requests = readCollection(MONEY_REQUESTS_KEY);
  if (filters.userId) requests = requests.filter(item => item.userId === filters.userId);
  if (filters.type) requests = requests.filter(item => item.type === filters.type);
  if (filters.status) requests = requests.filter(item => item.status === filters.status);
  return byNewest(requests);
}

export function createMoneyRequest({
  userId,
  type = 'refund',
  amount,
  reason,
  relatedPaymentId = '',
}) {
  if (!userId) throw new Error('User is required.');
  if (!['refund', 'withdrawal'].includes(type)) throw new Error('Request type must be refund or withdrawal.');
  const value = Number(amount);
  if (!value || value <= 0) throw new Error('Amount must be greater than zero.');
  if (!reason?.trim()) throw new Error('Reason is required.');

  const request = insertRecord(MONEY_REQUESTS_KEY, {
    id: createId(type === 'refund' ? 'REFUND' : 'WITHDRAW'),
    userId,
    type,
    amount: value,
    currency: 'XAF',
    reason: reason.trim(),
    relatedPaymentId,
    status: 'requested',
    adminDecision: '',
    adminNotes: '',
  });

  createNotification({
    userId,
    title: `${type === 'refund' ? 'Refund' : 'Withdrawal'} request submitted`,
    message: 'Admin will review your request before money moves.',
    type: 'wallet',
    relatedType: 'money_request',
    relatedId: request.id,
  });

  recordAuditLog({
    actorId: userId,
    action: `${type}_requested`,
    module: 'wallet',
    recordId: request.id,
    affectedUserId: userId,
    details: reason,
  });

  return request;
}

export function decideMoneyRequest(id, decision, adminId = 'admin', adminNotes = '') {
  if (!['approved', 'rejected', 'paid', 'under_review'].includes(decision)) {
    throw new Error('Invalid money request decision.');
  }

  const current = readCollection(MONEY_REQUESTS_KEY).find(item => item.id === id);
  if (!current) throw new Error('Money request not found.');

  if (decision === 'approved' && current.type === 'refund') {
    creditWallet({
      userId: current.userId,
      amount: current.amount,
      type: 'refund',
      reason: `Refund approved for ${current.relatedPaymentId || current.id}`,
      actorId: adminId,
    });
  }

  if (decision === 'approved' && current.type === 'withdrawal') {
    debitWallet({
      userId: current.userId,
      amount: current.amount,
      type: 'withdrawal',
      reason: `Withdrawal approved for ${current.id}`,
      actorId: adminId,
    });
  }

  const request = updateRecord(MONEY_REQUESTS_KEY, id, {
    status: decision,
    adminDecision: decision,
    adminNotes,
  });

  createNotification({
    userId: request.userId,
    title: `${request.type === 'refund' ? 'Refund' : 'Withdrawal'} ${decision}`,
    message: adminNotes || `Admin marked your request as ${decision}.`,
    type: 'wallet',
    relatedType: 'money_request',
    relatedId: request.id,
  });

  recordAuditLog({
    actorId: adminId,
    action: `${request.type}_${decision}`,
    module: 'wallet',
    recordId: request.id,
    affectedUserId: request.userId,
    details: adminNotes,
  });

  return request;
}
