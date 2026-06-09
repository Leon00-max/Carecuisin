'use client';

import { useState } from 'react';
import {
  Check,
  Edit3,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { DIETITIAN_MESSAGES } from '@/lib/dietitianPortalData';

const TABS = ['All', 'Patients', 'Chefs', 'Admin'];

export default function DietitianMessagesPage() {
  const [tab, setTab] = useState('All');
  const [activeName, setActiveName] = useState(DIETITIAN_MESSAGES[0].name);
  const [messages, setMessages] = useState([
    { sender: 'patient', text: 'Thank you! The meals have been helpful.', time: '10:30 AM' },
    { sender: 'dietitian', text: 'I am glad to hear that. Keep following the plan and hydration target.', time: '10:32 AM' },
  ]);
  const [draft, setDraft] = useState('');
  const conversations = DIETITIAN_MESSAGES.filter(item => tab === 'All' || item.type === tab);

  const sendMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages(prev => [...prev, { sender: 'dietitian', text, time: 'Just now' }]);
    setDraft('');
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-4 pb-4 lg:grid-cols-[340px_1fr]">
      <section className="rounded-2xl border border-surface-100 bg-white shadow-sm">
        <div className="border-b border-surface-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="badge-clinical gap-2">
                <MessageSquare size={14} />
                Messages
              </span>
              <h1 className="mt-3 text-xl font-black text-surface-900">Secure Inbox</h1>
            </div>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <Edit3 size={18} />
            </button>
          </div>
          <div className="relative mt-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
            <input placeholder="Search messages..." className="input-medical rounded-2xl pl-10" />
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {TABS.map(item => {
              const active = tab === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={`min-w-[80px] rounded-full border px-3 py-2 text-xs font-black ${
                    active
                      ? 'border-primary-200 bg-primary-50 text-primary-700'
                      : 'border-surface-100 bg-white text-surface-500'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="divide-y divide-surface-100">
          {conversations.map(item => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActiveName(item.name)}
              className={`flex w-full items-center gap-3 p-4 text-left transition-colors ${
                activeName === item.name ? 'bg-primary-50' : 'hover:bg-surface-50'
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-black text-primary-700">
                {item.name.split(' ').map(part => part[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-black text-surface-900">{item.name}</p>
                  <span className="shrink-0 text-[10px] font-semibold text-surface-400">{item.time}</span>
                </div>
                <p className="mt-1 truncate text-xs text-surface-500">{item.preview}</p>
              </div>
              {item.unread > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-[10px] font-black text-white">
                  {item.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="flex min-h-[calc(100vh-128px)] flex-col overflow-hidden rounded-2xl border border-surface-100 bg-white shadow-sm">
        <header className="border-b border-surface-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-sm font-black text-primary-700">
              {activeName.split(' ').map(part => part[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-black text-surface-900">{activeName}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-success">
                <ShieldCheck size={12} />
                Secure clinical communication
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto bg-surface-50 p-4">
          {messages.map((item, index) => {
            const mine = item.sender === 'dietitian';
            return (
              <div key={`${item.time}-${index}`} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[84%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  mine
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-surface-100 bg-white text-surface-800'
                }`}>
                  <p>{item.text}</p>
                  <p className={`mt-2 flex items-center justify-end gap-1 text-[10px] font-semibold ${
                    mine ? 'text-primary-100' : 'text-surface-400'
                  }`}>
                    {item.time}
                    {mine && <Check size={11} />}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 border-t border-surface-100 bg-white p-4">
          <button type="button" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-surface-100 bg-surface-50 text-surface-500">
            <Paperclip size={18} />
          </button>
          <input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Type a message..." className="input-medical rounded-2xl" />
          <button type="submit" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <Send size={18} />
          </button>
        </form>
      </section>
    </div>
  );
}
