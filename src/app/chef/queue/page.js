'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Filter,
  Flame,
  ListChecks,
  PackageCheck,
  Truck,
} from 'lucide-react';
import { CHEF_ORDERS, orderStatusMeta } from '@/lib/chefPortalData';
import { getMealPlanById } from '@/lib/mealPlanStore';
import { getOrders, updateOrderStatus } from '@/lib/orderStore';
import { getCurrentUserId, getUserById } from '@/lib/userStore';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
];

export default function KitchenQueuePage() {
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState(CHEF_ORDERS);

  function loadOrders() {
    const chefId = getCurrentUserId();
    const realOrders = chefId ? getOrders({ chefId }).map(order => {
      const patient = getUserById(order.patientId);
      const plan = getMealPlanById(order.mealPlanId);
      const status = order.status === 'requested' || order.status === 'accepted' ? 'preparing' : order.status;
      const stageMap = { preparing: 2, ready: 3, delivered: 4, completed: 4, rejected: 1, cancelled: 1 };

      return {
        ...order,
        source: 'store',
        patientName: patient?.fullName || order.patientName || 'Patient',
        meal: plan?.title || order.meal || 'Prescribed CareCuisin meal',
        due: order.deliveryTime || 'Today',
        dueLabel: status === 'ready' ? 'Ready for pickup' : status === 'delivered' || status === 'completed' ? 'Delivered' : 'Due today',
        calories: plan?.calories || order.calories || 520,
        status,
        stage: stageMap[status] || 2,
        totalStages: 4,
      };
    }) : [];

    setOrders(realOrders.length ? realOrders : CHEF_ORDERS);
  }

  useEffect(() => {
    queueMicrotask(loadOrders);
  }, []);

  const visibleOrders = useMemo(() => (
    filter === 'all' ? orders : orders.filter(order => order.status === filter)
  ), [filter, orders]);

  const markDelivered = (orderId) => {
    const target = orders.find(order => order.id === orderId);
    if (target?.source === 'store') {
      updateOrderStatus(orderId, 'delivered', getCurrentUserId(), 'Chef marked meal delivered.');
      loadOrders();
      return;
    }

    setOrders(prev => prev.map(order => (
      order.id === orderId ? { ...order, status: 'delivered', dueLabel: 'Delivered' } : order
    )));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <span className="badge-clinical gap-2">
            <ListChecks size={14} />
            Kitchen Queue
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Production Pipeline</h1>
          <p className="mt-2 text-sm text-surface-500">Move each prescribed meal through preparation, ready, and delivery.</p>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm"
          aria-label="Filter queue"
        >
          <Filter size={19} />
        </button>
      </header>

      <section className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(item => {
          const active = filter === item.id;
          const count = item.id === 'all' ? orders.length : orders.filter(order => order.status === item.id).length;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`min-w-[112px] rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                active
                  ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                  : 'border-surface-100 bg-white text-surface-500 hover:bg-surface-50'
              }`}
            >
              {item.label} ({count})
            </button>
          );
        })}
      </section>

      <section className="space-y-3">
        {visibleOrders.map(order => (
          <QueueCard key={order.id} order={order} onDelivered={markDelivered} />
        ))}
      </section>
    </div>
  );
}

function QueueCard({ order, onDelivered }) {
  const meta = orderStatusMeta(order.status);
  const progress = Math.round((order.stage / order.totalStages) * 100);
  const isReady = order.status === 'ready';
  const isDelivered = order.status === 'delivered';

  return (
    <article className="card-medical rounded-2xl border-surface-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-black ${meta.className}`}>
          {isReady || isDelivered ? <CheckCircle size={13} /> : <Clock size={13} />}
          {meta.label}
        </span>
        <span className={`text-xs font-black ${isReady || isDelivered ? 'text-success' : 'text-warning'}`}>
          {order.dueLabel}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-black text-primary-700">
          {order.patientName.split(' ').map(part => part[0]).join('').slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-black text-surface-900">{order.patientName}</h2>
          <p className="mt-1 truncate text-xs text-surface-500">{order.meal}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-surface-500">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {order.due}
            </span>
            <span className="inline-flex items-center gap-1">
              <Flame size={12} />
              {order.calories} kcal
            </span>
          </div>
        </div>
        <Link
          href={`/chef/order-details?order=${encodeURIComponent(order.id)}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-surface-100 bg-surface-50 text-primary-600 transition-colors hover:bg-primary-50"
          aria-label="View order details"
        >
          <ChevronRight size={18} />
        </Link>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex justify-between text-xs font-bold text-surface-500">
          <span>Step {order.stage} of {order.totalStages}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-100">
          <div
            className={`h-full rounded-full ${isReady || isDelivered ? 'bg-success' : 'bg-primary-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isReady && (
        <button
          type="button"
          onClick={() => onDelivered(order.id)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-success px-5 py-3 text-sm font-black text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Truck size={17} />
          Mark as Delivered
        </button>
      )}

      {isDelivered && (
        <Link
          href="/chef/delivery-confirmation"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-success/20 bg-success/10 px-5 py-3 text-sm font-black text-success transition-colors hover:bg-success/15"
        >
          <PackageCheck size={17} />
          View Delivery Confirmation
        </Link>
      )}
    </article>
  );
}
