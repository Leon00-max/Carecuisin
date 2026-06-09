'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ChefHat,
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageCheck,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import { getLatestMealPlanForPatient } from '@/lib/mealPlanStore';
import { createChefOrder, getOrders } from '@/lib/orderStore';
import { createPayment, PAYMENT_PROVIDERS, simulatePaymentResult } from '@/lib/paymentStore';
import { getReferralsForPatient } from '@/lib/referralStore';
import { getCurrentUserId, getUserById } from '@/lib/userStore';
import { getWalletSummary } from '@/lib/walletStore';

function providerIcon(provider) {
  return provider === 'wallet' ? WalletCards : CreditCard;
}

export default function PatientBookChefPage() {
  const [patientId, setPatientId] = useState('');
  const [plan, setPlan] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedReferralId, setSelectedReferralId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [amount, setAmount] = useState('3500');
  const [paymentProvider, setPaymentProvider] = useState('mtn_momo');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function refresh() {
    const id = getCurrentUserId();
    const latestPlan = id ? getLatestMealPlanForPatient(id) : null;
    const patientRefs = id ? getReferralsForPatient(id) : [];
    setPatientId(id || '');
    setPlan(latestPlan);
    setWallet(id ? getWalletSummary(id) : null);
    setReferrals(patientRefs);
    setOrders(id ? getOrders({ patientId: id }) : []);
    setSelectedReferralId(prev => prev || patientRefs[0]?.id || '');
  }

  useEffect(() => {
    queueMicrotask(refresh);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      if (!patientId) throw new Error('Please log in again before booking a chef.');
      const referral = referrals.find(item => item.id === selectedReferralId);
      if (!referral) throw new Error('Choose a dietitian-referred chef before booking.');
      const order = createChefOrder({
        patientId,
        referralId: selectedReferralId,
        mealPlanId: plan?.id,
        deliveryAddress,
        deliveryTime,
        amount,
      });
      const payment = createPayment({
        userId: patientId,
        amount,
        provider: paymentProvider,
        phone,
        relatedType: 'order',
        relatedId: order.id,
        description: `Chef meal order ${order.id}`,
        recipientId: referral.chefId,
        purpose: 'chef_order',
        metadata: {
          referralId: selectedReferralId,
          mealPlanId: plan?.id || referral.mealPlanId,
          deliveryTime,
        },
      });
      const completedPayment = simulatePaymentResult(payment.id, 'successful');
      setMessage(`Order ${order.id} was paid and sent to the chef. Receipt ${completedPayment.receiptNumber} is ready.`);
      setDeliveryAddress('');
      setDeliveryTime('');
      refresh();
    } catch (err) {
      setError(err.message || 'Could not book this chef.');
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <span className="badge-clinical mb-2">Referred chef booking</span>
        <h1 className="text-2xl font-black text-surface-900">Book your referred chef</h1>
        <p className="mt-1 text-sm text-surface-500">
          CareCuisin only lets patients book chefs referred through their dietitian-approved plan.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="card-medical space-y-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <ChefHat size={22} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-surface-900">Dietitian-referred chefs</h2>
              <p className="text-xs text-surface-500">Only safe preparation instructions are shared with the chef.</p>
            </div>
          </div>

          {referrals.length === 0 ? (
            <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm text-surface-700">
              No chef referrals are available yet. Once your dietitian refers a chef, you can book from here.
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map(referral => {
                const chef = getUserById(referral.chefId);
                const selected = selectedReferralId === referral.id;
                return (
                  <button
                    type="button"
                    key={referral.id}
                    onClick={() => setSelectedReferralId(referral.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                      selected ? 'border-primary-200 bg-primary-50' : 'border-surface-100 bg-white hover:border-primary-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-700 shadow-sm">
                        <ChefHat size={22} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-surface-900">{chef?.fullName || referral.chefName || 'Verified chef'}</span>
                        <span className="mt-1 flex items-center gap-1.5 text-xs text-surface-500">
                          <MapPin size={13} />
                          {referral.patientLocation || 'Buea, Fako'}
                        </span>
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-1 text-[11px] font-bold text-success">
                          <ShieldCheck size={13} />
                          Referred by dietitian
                        </span>
                      </span>
                      {selected && <CheckCircle2 className="text-primary-600" size={20} />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-700">Order payment</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="form-label" htmlFor="amount">Amount (XAF)</label>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  className="input-medical bg-white"
                  value={amount}
                  onChange={event => setAmount(event.target.value)}
                />
              </div>
              <div className="rounded-2xl border border-primary-100 bg-white p-3">
                <p className="text-xs font-semibold text-surface-500">Wallet balance</p>
                <p className="mt-1 text-lg font-black text-surface-900">
                  {Number(wallet?.balance || 0).toLocaleString()} XAF
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="deliveryAddress">Delivery address</label>
            <input
              id="deliveryAddress"
              className="input-medical"
              placeholder="Example: Molyko, near UB Junction"
              value={deliveryAddress}
              onChange={event => setDeliveryAddress(event.target.value)}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="deliveryTime">Preferred delivery time</label>
            <input
              id="deliveryTime"
              type="datetime-local"
              className="input-medical"
              value={deliveryTime}
              onChange={event => setDeliveryTime(event.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Payment method</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.values(PAYMENT_PROVIDERS).map(provider => {
                const Icon = providerIcon(provider.id);
                const selected = paymentProvider === provider.id;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => setPaymentProvider(provider.id)}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left text-xs font-bold transition-colors ${
                      selected ? 'border-primary-200 bg-white text-primary-700' : 'border-primary-100 bg-primary-50 text-surface-500'
                    }`}
                  >
                    <Icon size={17} />
                    <span>
                      <span className="block">{provider.label}</span>
                      <span className="font-semibold text-surface-400">{provider.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {paymentProvider !== 'wallet' && (
            <div>
              <label className="form-label" htmlFor="phone">MoMo/Orange number</label>
              <input
                id="phone"
                className="input-medical"
                placeholder="6XXXXXXXX"
                value={phone}
                onChange={event => setPhone(event.target.value)}
              />
            </div>
          )}

          {error && <p className="form-error">{error}</p>}
          {message && <p className="rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-xs font-semibold text-success">{message}</p>}

          <button type="submit" className="btn-primary w-full" disabled={!referrals.length}>
            Pay and Send Chef Booking
          </button>
        </form>

        <section className="card-medical rounded-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-surface-900">Order tracking</h2>
              <p className="text-xs text-surface-500">Chef actions appear here in real time.</p>
            </div>
            <PackageCheck className="text-primary-600" size={21} />
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-surface-100 bg-surface-50 p-5 text-center">
                <p className="text-sm font-bold text-surface-900">No chef orders yet</p>
                <p className="mt-1 text-xs text-surface-500">After booking a referred chef, your order status will show here.</p>
              </div>
            ) : (
              orders.map(order => {
                const chef = getUserById(order.chefId);
                return (
                  <article key={order.id} className="rounded-2xl border border-surface-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-surface-900">{order.id}</p>
                        <p className="mt-1 text-xs text-surface-500">{chef?.fullName || 'Assigned chef'}</p>
                      </div>
                      <span className="rounded-full border border-primary-100 bg-primary-50 px-2.5 py-1 text-[11px] font-bold capitalize text-primary-700">
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-surface-50 p-3">
                        <p className="font-semibold text-surface-500">Payment</p>
                        <p className="mt-1 font-bold capitalize text-surface-900">{order.paymentStatus}</p>
                      </div>
                      <div className="rounded-xl bg-surface-50 p-3">
                        <p className="font-semibold text-surface-500">Delivery</p>
                        <p className="mt-1 font-bold text-surface-900">{order.deliveryTime || 'Not set'}</p>
                      </div>
                    </div>
                    {order.paymentStatus !== 'paid' ? (
                      <Link href={`/patient/payments?type=order&id=${order.id}`} className="btn-outline mt-4 inline-flex w-full justify-center">
                        Complete Payment
                      </Link>
                    ) : (
                      <div className="mt-4 rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-center text-xs font-bold text-success">
                        Paid and sent to chef
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
