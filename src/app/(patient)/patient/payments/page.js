'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CreditCard,
  History,
  Loader2,
  Phone,
  ReceiptText,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import {
  PAYMENT_PROVIDERS,
  createPayment,
  getPayments,
  simulatePaymentResult,
} from '@/lib/paymentStore';
import { getConsultations } from '@/lib/consultationStore';
import { getOrders } from '@/lib/orderStore';
import { getCurrentUserId } from '@/lib/userStore';
import { createMoneyRequest, getMoneyRequests, getWalletSummary } from '@/lib/walletStore';

function providerIcon(provider) {
  if (provider === 'wallet') return WalletCards;
  if (provider === 'stripe_card') return CreditCard;
  return Phone;
}

function statusClass(status) {
  if (['successful', 'approved', 'paid'].includes(status)) return 'bg-success/10 text-success border-success/20';
  if (['failed', 'cancelled', 'rejected'].includes(status)) return 'bg-alert/10 text-alert border-alert/20';
  return 'bg-warning/10 text-warning border-warning/20';
}

function PatientPaymentsInner() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState('');
  const [wallet, setWallet] = useState(null);
  const [moneyRequests, setMoneyRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [relatedRecords, setRelatedRecords] = useState([]);
  const [form, setForm] = useState({
    provider: 'mtn_momo',
    amount: '3500',
    phone: '',
    relatedType: searchParams.get('type') || 'order',
    relatedId: searchParams.get('id') || '',
    description: 'CareCuisin service payment',
  });
  const [topUp, setTopUp] = useState({
    amount: '5000',
    provider: 'mtn_momo',
    phone: '',
  });
  const [requestForm, setRequestForm] = useState({
    type: 'refund',
    amount: '1000',
    reason: '',
    relatedPaymentId: '',
  });
  const [busyId, setBusyId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function refresh() {
    const id = getCurrentUserId();
    const consultations = id ? getConsultations({ patientId: id }) : [];
    const orders = id ? getOrders({ patientId: id }) : [];
    setUserId(id || '');
    setWallet(id ? getWalletSummary(id) : null);
    setMoneyRequests(id ? getMoneyRequests({ userId: id }) : []);
    setPayments(id ? getPayments({ userId: id }) : []);
    setRelatedRecords([
      ...orders.map(order => ({ type: 'order', id: order.id, label: `Chef order ${order.id}`, amount: order.amount || 3500 })),
      ...consultations.map(item => ({ type: 'consultation', id: item.id, label: `Consultation ${item.id}`, amount: item.consultationFee || 2500 })),
    ]);
  }

  useEffect(() => {
    queueMicrotask(refresh);
  }, []);

  const selectedRelated = useMemo(
    () => relatedRecords.find(item => item.type === form.relatedType && item.id === form.relatedId),
    [form.relatedId, form.relatedType, relatedRecords]
  );

  useEffect(() => {
    if (selectedRelated) {
      queueMicrotask(() => {
        setForm(prev => ({
          ...prev,
          amount: String(selectedRelated.amount),
          description: selectedRelated.label,
        }));
      });
    }
  }, [selectedRelated]);

  function handleCreatePayment(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      if (!userId) throw new Error('Please log in again before making a payment.');
      const payment = createPayment({
        userId,
        amount: form.amount,
        provider: form.provider,
        phone: form.phone,
        relatedType: form.relatedType,
        relatedId: form.relatedId,
        description: form.description,
      });
      setMessage(`Payment ${payment.transactionReference} is pending.`);
      refresh();
    } catch (err) {
      setError(err.message || 'Payment could not be created.');
    }
  }

  function handleTopUp(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      if (!userId) throw new Error('Please log in again before topping up.');
      const payment = createPayment({
        userId,
        amount: topUp.amount,
        provider: topUp.provider,
        phone: topUp.phone,
        relatedType: 'wallet_topup',
        description: 'CareCuisin wallet top-up',
        purpose: 'wallet_topup',
      });
      const completed = simulatePaymentResult(payment.id, 'successful');
      setMessage(`Wallet topped up. Receipt ${completed.receiptNumber} is ready.`);
      refresh();
    } catch (err) {
      setError(err.message || 'Wallet top-up failed.');
    }
  }

  function handleMoneyRequest(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      if (!userId) throw new Error('Please log in again before submitting a money request.');
      const request = createMoneyRequest({
        userId,
        type: requestForm.type,
        amount: requestForm.amount,
        reason: requestForm.reason,
        relatedPaymentId: requestForm.relatedPaymentId,
      });
      setMessage(`${request.type === 'refund' ? 'Refund' : 'Withdrawal'} request ${request.id} was sent to Admin.`);
      setRequestForm(prev => ({ ...prev, reason: '' }));
      refresh();
    } catch (err) {
      setError(err.message || 'Could not submit request.');
    }
  }

  function handleResult(paymentId, result) {
    setBusyId(paymentId);
    setError('');
    setMessage('');

    try {
      const payment = simulatePaymentResult(paymentId, result);
      setMessage(result === 'successful'
        ? `Payment completed. Receipt ${payment.receiptNumber} is ready.`
        : `Payment marked as ${result}.`);
      refresh();
    } catch (err) {
      setError(err.message || 'Payment update failed.');
    } finally {
      setBusyId('');
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="badge-clinical mb-2">Secure payment simulation</span>
          <h1 className="text-2xl font-black text-surface-900">Payments</h1>
          <p className="mt-1 text-sm text-surface-500">
            Prepare MTN MoMo, Orange Money, or Stripe card records before real provider keys are connected.
          </p>
        </div>
        <Link href="/patient/profile" className="btn-outline inline-flex items-center justify-center gap-2">
          <WalletCards size={17} />
          Account
        </Link>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="card-medical rounded-2xl p-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <WalletCards size={23} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-surface-500">Wallet balance</p>
              <p className="text-2xl font-black text-surface-900">
                {Number(wallet?.balance || 0).toLocaleString()} XAF
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-surface-100 bg-surface-50 p-3">
              <p className="text-xs font-semibold text-surface-500">Top-ups</p>
              <p className="mt-1 text-lg font-black text-success">{Number(wallet?.topUps || 0).toLocaleString()} XAF</p>
            </div>
            <div className="rounded-2xl border border-surface-100 bg-surface-50 p-3">
              <p className="text-xs font-semibold text-surface-500">Spent</p>
              <p className="mt-1 text-lg font-black text-primary-700">{Number(wallet?.spent || 0).toLocaleString()} XAF</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleTopUp} className="card-medical space-y-3 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-black text-surface-900">
            <ArrowDownToLine size={18} className="text-primary-600" />
            Top Up Wallet
          </div>
          <input
            type="number"
            min="1"
            className="input-medical"
            value={topUp.amount}
            onChange={event => setTopUp(prev => ({ ...prev, amount: event.target.value }))}
          />
          <select
            className="input-medical"
            value={topUp.provider}
            onChange={event => setTopUp(prev => ({ ...prev, provider: event.target.value }))}
          >
            {Object.values(PAYMENT_PROVIDERS)
              .filter(provider => provider.id !== 'wallet')
              .map(provider => (
                <option key={provider.id} value={provider.id}>{provider.label}</option>
              ))}
          </select>
          <input
            className="input-medical"
            placeholder="6XXXXXXXX"
            value={topUp.phone}
            onChange={event => setTopUp(prev => ({ ...prev, phone: event.target.value }))}
          />
          <button type="submit" className="btn-primary w-full">Top Up</button>
        </form>
      </section>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleCreatePayment} className="card-medical space-y-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <ShieldCheck size={22} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-surface-900">Create payment</h2>
              <p className="text-xs text-surface-500">This is provider-ready simulation, not a live debit.</p>
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="provider">Payment method</label>
            <div className="grid gap-2">
              {Object.values(PAYMENT_PROVIDERS).map(provider => {
                const Icon = providerIcon(provider.id);
                const selected = form.provider === provider.id;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, provider: provider.id }))}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                      selected ? 'border-primary-200 bg-primary-50' : 'border-surface-100 bg-white hover:border-primary-100'
                    }`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
                      <Icon size={19} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-surface-900">{provider.label}</span>
                      <span className="text-xs text-surface-500">{provider.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="relatedId">Pay for</label>
            <select
              id="relatedId"
              className="input-medical"
              value={`${form.relatedType}:${form.relatedId}`}
              onChange={event => {
                const [relatedType, relatedId] = event.target.value.split(':');
                setForm(prev => ({ ...prev, relatedType, relatedId }));
              }}
            >
              <option value={`${form.relatedType}:`}>General CareCuisin payment</option>
              {relatedRecords.map(record => (
                <option key={`${record.type}-${record.id}`} value={`${record.type}:${record.id}`}>
                  {record.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="amount">Amount (XAF)</label>
              <input
                id="amount"
                type="number"
                min="1"
                className="input-medical"
                value={form.amount}
                onChange={event => setForm(prev => ({ ...prev, amount: event.target.value }))}
              />
            </div>
          <div>
            <label className="form-label" htmlFor="phone">MoMo/Orange number</label>
            <input
              id="phone"
              className="input-medical"
              placeholder="6XXXXXXXX"
              value={form.phone}
              onChange={event => setForm(prev => ({ ...prev, phone: event.target.value }))}
              disabled={form.provider === 'wallet'}
            />
          </div>
          </div>

          <div>
            <label className="form-label" htmlFor="description">Description</label>
            <input
              id="description"
              className="input-medical"
              value={form.description}
              onChange={event => setForm(prev => ({ ...prev, description: event.target.value }))}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-xs font-semibold text-success">{message}</p>}

          <button type="submit" className="btn-primary w-full">Create Payment</button>
        </form>

        <section className="card-medical rounded-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-surface-900">Transaction history</h2>
              <p className="text-xs text-surface-500">Successful payments generate patient receipts.</p>
            </div>
            <History className="text-primary-600" size={21} />
          </div>

          <div className="space-y-3">
            {payments.length === 0 ? (
              <div className="rounded-2xl border border-surface-100 bg-surface-50 p-5 text-center">
                <ReceiptText className="mx-auto text-surface-400" size={24} />
                <p className="mt-3 text-sm font-bold text-surface-900">No payments yet</p>
                <p className="mt-1 text-xs text-surface-500">Create a payment to test receipts and status handling.</p>
              </div>
            ) : (
              payments.map(payment => (
                <article key={payment.id} className="rounded-2xl border border-surface-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-surface-900">{payment.description || payment.id}</p>
                      <p className="mt-1 text-xs text-surface-500">{PAYMENT_PROVIDERS[payment.provider]?.label} - {payment.transactionReference}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-50 p-3">
                    <span className="text-xs font-semibold text-surface-500">Amount</span>
                    <span className="text-sm font-black text-surface-900">{payment.amount.toLocaleString()} {payment.currency}</span>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {payment.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleResult(payment.id, 'successful')}
                          className="btn-primary inline-flex items-center justify-center gap-2 px-3"
                          disabled={busyId === payment.id}
                        >
                          {busyId === payment.id && <Loader2 className="animate-spin" size={15} />}
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResult(payment.id, 'failed')}
                          className="btn-outline px-3 text-alert hover:bg-alert/10"
                        >
                          Fail
                        </button>
                      </>
                    )}
                    {payment.status === 'successful' && (
                      <Link href={`/patient/payments/receipt?id=${payment.id}`} className="btn-outline inline-flex justify-center sm:col-span-3">
                        View Receipt
                      </Link>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleMoneyRequest} className="card-medical space-y-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <ArrowUpFromLine size={22} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-surface-900">Refund or withdrawal</h2>
              <p className="text-xs text-surface-500">Admin reviews requests before money moves.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="requestType">Request type</label>
              <select
                id="requestType"
                className="input-medical"
                value={requestForm.type}
                onChange={event => setRequestForm(prev => ({ ...prev, type: event.target.value }))}
              >
                <option value="refund">Refund</option>
                <option value="withdrawal">Wallet withdrawal</option>
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="requestAmount">Amount (XAF)</label>
              <input
                id="requestAmount"
                type="number"
                min="1"
                className="input-medical"
                value={requestForm.amount}
                onChange={event => setRequestForm(prev => ({ ...prev, amount: event.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="relatedPaymentId">Related payment</label>
            <select
              id="relatedPaymentId"
              className="input-medical"
              value={requestForm.relatedPaymentId}
              onChange={event => setRequestForm(prev => ({ ...prev, relatedPaymentId: event.target.value }))}
            >
              <option value="">Not linked</option>
              {payments.filter(payment => payment.status === 'successful').map(payment => (
                <option key={payment.id} value={payment.id}>
                  {payment.description || payment.id} - {Number(payment.amount || 0).toLocaleString()} XAF
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="requestReason">Reason</label>
            <textarea
              id="requestReason"
              className="input-medical min-h-24 resize-none"
              value={requestForm.reason}
              onChange={event => setRequestForm(prev => ({ ...prev, reason: event.target.value }))}
              placeholder="Tell Admin why this request is needed."
            />
          </div>

          <button type="submit" className="btn-outline flex w-full items-center justify-center gap-2">
            Submit Request
          </button>
        </form>

        <section className="card-medical rounded-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-surface-900">Money requests</h2>
              <p className="text-xs text-surface-500">Refunds and withdrawals stay auditable.</p>
            </div>
            <WalletCards className="text-primary-600" size={21} />
          </div>

          <div className="space-y-3">
            {moneyRequests.length === 0 ? (
              <div className="rounded-2xl border border-surface-100 bg-surface-50 p-5 text-center">
                <p className="text-sm font-bold text-surface-900">No money requests yet</p>
                <p className="mt-1 text-xs text-surface-500">Submitted requests will appear here for follow-up.</p>
              </div>
            ) : (
              moneyRequests.map(request => (
                <article key={request.id} className="rounded-2xl border border-surface-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold capitalize text-surface-900">{request.type}</p>
                      <p className="mt-1 text-xs text-surface-500">{request.reason}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-50 p-3">
                    <span className="text-xs font-semibold text-surface-500">Amount</span>
                    <span className="text-sm font-black text-surface-900">{Number(request.amount || 0).toLocaleString()} {request.currency}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </div>
  );
}

export default function PatientPaymentsPage() {
  return (
    <Suspense fallback={<div className="card-medical mx-auto max-w-5xl rounded-2xl">Loading payments...</div>}>
      <PatientPaymentsInner />
    </Suspense>
  );
}
