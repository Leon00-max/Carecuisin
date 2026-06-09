'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CreditCard,
  Download,
  HandCoins,
  ReceiptText,
  Search,
  WalletCards,
} from 'lucide-react';
import { getPayments, PAYMENT_PROVIDERS, simulatePaymentResult } from '@/lib/paymentStore';
import { decideMoneyRequest, getMoneyRequests } from '@/lib/walletStore';
import { getCurrentUserId, getUserById } from '@/lib/userStore';
import { PageHeader, SectionCard, StatusBadge } from '@/components/admin/AdminUI';

function toneForStatus(status) {
  if (['successful', 'approved', 'paid'].includes(status)) return 'success';
  if (['failed', 'cancelled', 'refunded', 'rejected'].includes(status)) return 'alert';
  return 'warning';
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [decisionNotes, setDecisionNotes] = useState({});
  const [message, setMessage] = useState('');

  function refresh() {
    setPayments(getPayments());
    setRequests(getMoneyRequests());
  }

  useEffect(() => {
    queueMicrotask(refresh);
  }, []);

  const totals = useMemo(() => {
    const successful = payments.filter(payment => payment.status === 'successful');
    return {
      count: payments.length,
      pending: payments.filter(payment => payment.status === 'pending').length,
      successful: successful.length,
      revenue: successful.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      consultationRevenue: successful
        .filter(payment => payment.purpose === 'consultation' || payment.relatedType === 'consultation')
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      chefRevenue: successful
        .filter(payment => payment.purpose === 'chef_order' || payment.relatedType === 'order')
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      walletTopUps: successful
        .filter(payment => payment.purpose === 'wallet_topup' || payment.relatedType === 'wallet_topup')
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      openRequests: requests.filter(request => ['requested', 'under_review'].includes(request.status)).length,
    };
  }, [payments, requests]);

  const visiblePayments = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return payments.filter(payment => {
      const user = getUserById(payment.userId);
      const matchesStatus = status === 'all' || payment.status === status;
      const matchesQuery = !normalized || [
        payment.id,
        payment.transactionReference,
        payment.description,
        user?.fullName,
        PAYMENT_PROVIDERS[payment.provider]?.label,
      ].join(' ').toLowerCase().includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [payments, query, status]);

  function mark(paymentId, nextStatus) {
    const payment = simulatePaymentResult(paymentId, nextStatus);
    setMessage(`Payment ${payment.transactionReference} marked ${nextStatus}.`);
    refresh();
  }

  function decide(requestId, decision) {
    try {
      const adminId = getCurrentUserId() || 'admin';
      const request = decideMoneyRequest(requestId, decision, adminId, decisionNotes[requestId] || '');
      setMessage(`${request.type === 'refund' ? 'Refund' : 'Withdrawal'} request ${request.id} marked ${decision}.`);
      setDecisionNotes(prev => ({ ...prev, [requestId]: '' }));
      refresh();
    } catch (error) {
      setMessage(error.message || 'Could not update money request.');
    }
  }

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Financial Operations"
        title="Payment Management"
        subtitle="Monitor MTN MoMo, Orange Money, and Stripe-ready transactions across CareCuisin."
        icon={WalletCards}
      />

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ['Payments', totals.count],
          ['Pending', totals.pending],
          ['Successful', totals.successful],
          ['Revenue', `${totals.revenue.toLocaleString()} XAF`],
        ].map(([label, value]) => (
          <div key={label} className="card-medical rounded-2xl p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-surface-500">{label}</p>
            <p className="mt-2 text-2xl font-black text-surface-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ['Consultations', `${totals.consultationRevenue.toLocaleString()} XAF`],
          ['Chef Orders', `${totals.chefRevenue.toLocaleString()} XAF`],
          ['Wallet Top-ups', `${totals.walletTopUps.toLocaleString()} XAF`],
          ['Money Requests', totals.openRequests],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-700">{label}</p>
            <p className="mt-2 text-xl font-black text-surface-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            className="input-medical pl-10"
            placeholder="Search by patient, reference, provider..."
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </div>
        <select className="input-medical lg:w-44" value={status} onChange={event => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="successful">Successful</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
        <button type="button" className="btn-outline inline-flex items-center justify-center gap-2">
          <Download size={17} />
          Export
        </button>
      </div>

      {message && (
        <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
          {message}
        </div>
      )}

      <SectionCard title="Transactions" icon={ReceiptText}>
        <div className="space-y-3">
          {visiblePayments.length === 0 ? (
            <div className="rounded-2xl border border-surface-100 bg-surface-50 p-8 text-center">
              <CreditCard className="mx-auto text-surface-400" size={26} />
              <p className="mt-3 text-sm font-bold text-surface-900">No payments recorded</p>
              <p className="mt-1 text-xs text-surface-500">Patient payment records will appear here after checkout simulation.</p>
            </div>
          ) : (
            visiblePayments.map(payment => {
              const user = getUserById(payment.userId);
              return (
                <article key={payment.id} className="rounded-2xl border border-surface-100 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-surface-900">{payment.description || payment.id}</p>
                        <StatusBadge tone={toneForStatus(payment.status)}>{payment.status}</StatusBadge>
                      </div>
                      <p className="mt-1 text-xs text-surface-500">
                        {user?.fullName || payment.userId} - {PAYMENT_PROVIDERS[payment.provider]?.label} - {payment.transactionReference}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <p className="text-lg font-black text-surface-900">{Number(payment.amount || 0).toLocaleString()} {payment.currency}</p>
                      {payment.status === 'pending' && (
                        <div className="grid grid-cols-2 gap-2">
                          <button type="button" onClick={() => mark(payment.id, 'successful')} className="btn-primary px-4">
                            Confirm
                          </button>
                          <button type="button" onClick={() => mark(payment.id, 'failed')} className="btn-outline px-4 text-alert hover:bg-alert/10">
                            Fail
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </SectionCard>

      <SectionCard title="Refunds and Withdrawals" icon={HandCoins}>
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="rounded-2xl border border-surface-100 bg-surface-50 p-8 text-center">
              <WalletCards className="mx-auto text-surface-400" size={26} />
              <p className="mt-3 text-sm font-bold text-surface-900">No money requests</p>
              <p className="mt-1 text-xs text-surface-500">Patient refund and withdrawal requests will appear here.</p>
            </div>
          ) : (
            requests.map(request => {
              const user = getUserById(request.userId);
              return (
                <article key={request.id} className="rounded-2xl border border-surface-100 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold capitalize text-surface-900">{request.type} request</p>
                        <StatusBadge tone={toneForStatus(request.status)}>{request.status.replace('_', ' ')}</StatusBadge>
                      </div>
                      <p className="mt-1 text-xs text-surface-500">
                        {user?.fullName || request.userId} - {request.id}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-surface-700">{request.reason}</p>
                      <p className="mt-2 text-lg font-black text-surface-900">
                        {Number(request.amount || 0).toLocaleString()} {request.currency}
                      </p>
                    </div>
                    <div className="w-full space-y-2 lg:max-w-sm">
                      <textarea
                        className="input-medical min-h-20 resize-none"
                        placeholder="Admin notes"
                        value={decisionNotes[request.id] || ''}
                        onChange={event => setDecisionNotes(prev => ({ ...prev, [request.id]: event.target.value }))}
                        disabled={['approved', 'rejected', 'paid'].includes(request.status)}
                      />
                      {['requested', 'under_review'].includes(request.status) ? (
                        <div className="grid grid-cols-3 gap-2">
                          <button type="button" onClick={() => decide(request.id, 'under_review')} className="btn-outline px-3">
                            Review
                          </button>
                          <button type="button" onClick={() => decide(request.id, 'approved')} className="btn-primary px-3">
                            Approve
                          </button>
                          <button type="button" onClick={() => decide(request.id, 'rejected')} className="btn-outline px-3 text-alert hover:bg-alert/10">
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-surface-100 bg-surface-50 px-3 py-2 text-xs font-bold capitalize text-surface-500">
                          Decision complete: {request.status.replace('_', ' ')}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </SectionCard>
    </div>
  );
}
