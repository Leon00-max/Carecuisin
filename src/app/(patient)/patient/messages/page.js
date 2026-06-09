'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CalendarClock,
  Check,
  CheckCircle,
  ChefHat,
  Headphones,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    sender: 'patient',
    text: 'Hi Doctor, I enjoyed today\'s meal. I felt more energetic throughout the day.',
    time: '10:30 AM',
  },
  {
    sender: 'dietitian',
    text: 'That is wonderful to hear, Amara. Keep staying consistent with your meals and hydration.',
    time: '10:32 AM',
  },
  {
    sender: 'patient',
    text: 'Will do. Looking forward to tomorrow\'s meal.',
    time: '10:33 AM',
  },
];

const CARE_SHORTCUTS = [
  { href: '/patient/dietitian', label: 'Dietitian', icon: Stethoscope },
  { href: '/patient/chef', label: 'Chef', icon: ChefHat },
  { href: '/patient/notifications', label: 'Support', icon: Headphones },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [message, setMessage] = useState('');

  const sendMessage = (event) => {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;

    setMessages(prev => [
      ...prev,
      { sender: 'patient', text, time: 'Just now' },
    ]);
    setMessage('');
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-128px)] max-w-5xl flex-col overflow-hidden rounded-2xl border border-surface-100 bg-white shadow-sm md:min-h-[calc(100vh-96px)]">
      <header className="border-b border-surface-100 bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <Link href="/patient/dietitian" className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-black text-primary-700">
              AF
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate text-base font-black text-surface-900">Dr. Ambe Florence</h1>
                <CheckCircle size={15} className="shrink-0 text-success" />
              </div>
              <p className="mt-0.5 text-xs font-semibold text-surface-500">Verified Dietitian</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success ring-4 ring-success/10" />
                Online
              </p>
            </div>
          </Link>

          <a
            href="tel:+237650000000"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-primary-600 transition-colors hover:bg-primary-100"
            aria-label="Call dietitian"
          >
            <Phone size={18} />
          </a>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {CARE_SHORTCUTS.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border border-surface-100 bg-surface-50 text-xs font-black text-surface-500 transition-colors hover:border-primary-100 hover:bg-primary-50 hover:text-primary-700"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      </header>

      <section className="flex-1 space-y-4 overflow-y-auto bg-surface-50 p-4 sm:p-5">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-[11px] font-bold text-primary-700">
          <ShieldCheck size={13} />
          Secure clinical chat
        </div>

        {messages.map((item, index) => {
          const isPatient = item.sender === 'patient';
          return (
            <div key={`${item.time}-${index}`} className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[84%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm ${
                isPatient
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-surface-100 bg-white text-surface-800'
              }`}>
                <p>{item.text}</p>
                <p className={`mt-2 flex items-center justify-end gap-1 text-[10px] font-semibold ${
                  isPatient ? 'text-primary-100' : 'text-surface-400'
                }`}>
                  {item.time}
                  {isPatient && <Check size={11} />}
                </p>
              </div>
            </div>
          );
        })}

        <Link
          href="/patient/plan-review"
          className="block rounded-2xl border border-primary-100 bg-white p-4 shadow-sm transition-colors hover:bg-primary-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <CalendarClock size={21} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-surface-900">Next Plan Review</p>
              <p className="mt-1 text-xs text-surface-500">Friday, May 29, 2026, 10:00 AM</p>
            </div>
            <MessageSquare size={17} className="text-surface-400" />
          </div>
        </Link>
      </section>

      <form onSubmit={sendMessage} className="flex gap-2 border-t border-surface-100 bg-white p-4">
        <input
          value={message}
          onChange={event => setMessage(event.target.value)}
          placeholder="Type a message..."
          className="input-medical rounded-2xl"
        />
        <button
          type="submit"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm shadow-primary-200 transition-colors hover:bg-primary-700"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
