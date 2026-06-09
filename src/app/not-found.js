'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserRound, Stethoscope, ChefHat, PenTool, Clock, HomeIcon} from 'lucide-react';

const KEYFRAMES = `
  @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
  @keyframes floatY  { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
  @keyframes pulse2  { 0%,100%{opacity:1}50%{opacity:0.5} }
  @keyframes drift1  { 0%{transform:translate(0,0) rotate(0deg)}100%{transform:translate(30px,20px) rotate(180deg)} }
  @keyframes drift2  { 0%{transform:translate(0,0) rotate(0deg)}100%{transform:translate(-20px,30px) rotate(-180deg)} }
`;

const FEATURES=[
  {icon:<Stethoscope />,title:'Clinical Intermediary',body:'The dietitian acts as the medical gatekeeper. Every meal plan is prescribed — not guessed.'},
  {icon:<UserRound />,title:'Medical Masking',body:'Clinical rationale, sodium targets, and diagnoses never reach the chef. Architecture-level privacy.'},
  {icon:<ChefHat />,title:'Local-First Design',body:'Chef matching filtered by Buea neighbourhood. MTN/Orange MoMo ready for payments.'},
  {icon:<PenTool />,title:'Role-Based Security',body:'Four isolated dashboards. Middleware guards every route. No cross-role data leakage.'},
  {icon:<HomeIcon />,title:'And much more...',body:'This is just a taste. CareCuisin is packed with thoughtful features to make clinical nutrition seamless and effective.'}
];


/* ── Role-aware quick links ─────────────────────────────── */
function getQuickLinks() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/cc_role=([^;]+)/);
  const role  = match ? match[1] : null;
  if (!role) return null;

  const map = {
    patient:   { label: 'Go to Patient Dashboard',   href: '/patient/dashboard'   },
    dietitian: { label: 'Go to Dietitian Dashboard',  href: '/dietitian/dashboard' },
    chef:      { label: 'Go to Chef Dashboard',       href: '/chef/dashboard'      },
    admin:     { label: 'Go to Admin Console',        href: '/admin/dashboard'     },
  };
  return map[role] || null;
}

export default function NotFound() {
  const [vis,       setVis]       = useState(false);
  const [roleLink,  setRoleLink]  = useState(null);
  const [seconds,   setSeconds]   = useState(10);

  useEffect(() => {
    setTimeout(() => setVis(true), 80);
    queueMicrotask(() => {
      setRoleLink(getQuickLinks());
    });

    /* Auto-redirect countdown */
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(t); window.location.href = '/'; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }}/>

      <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6 py-16"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)' }}>

        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Drifting orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: '#2563eb', animation: 'drift1 8s ease-in-out infinite alternate' }}
        />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full blur-2xl opacity-10"
          style={{ background: '#10b981', animation: 'drift2 6s ease-in-out infinite alternate' }}
        />

        {/* Content card */}
        <div className="relative z-10 max-w-lg w-full text-center"
          style={{ animation: vis ? 'fadeUp 0.6s ease-out forwards' : 'none', opacity: 0 }}>

          {/* Floating 404 number */}
          <div className="relative mb-8 select-none"
            style={{ animation: 'floatY 4s ease-in-out infinite' }}>
            <p className="text-[10rem] sm:text-[12rem] font-black leading-none tracking-tighter"
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                opacity: 0.85,
              }}>
              404
            </p>

            {/* Floating elements around the 404 */}
            <div className="absolute top-4 right-8 w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-xl"
              style={{ animation: 'floatY 3s 0.5s ease-in-out infinite' }}>
              <span className="text-emerald-400"><Clock /></span>
            </div>
            <div className="absolute bottom-4 left-8 w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-xl"
              style={{ animation: 'floatY 3.5s 1s ease-in-out infinite' }}>
              <span className="text-blue-400"><Stethoscope /></span>
            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
              This page does not exist.
            </h1>
            <p className="text-blue-200 text-base leading-relaxed">
              The URL you visited is not part of CareCuisin -
              it may have been mistyped, moved, or never existed.
            </p>
          </div>

          {/* Auto-redirect notice */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400"
              style={{ animation: 'pulse2 1s ease-in-out infinite' }}/>
            <p className="text-blue-200 text-sm font-medium">
              Redirecting to home in{' '}
              <span className="text-white font-bold tabular-nums">{seconds}s</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary-500 text-white font-bold text-sm hover:bg-primary-400 transition-all shadow-xl shadow-blue-900/50 w-full sm:w-auto justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Back to Home
            </Link>

            {roleLink && (
              <Link href={roleLink.href}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-blue-400/40 text-white font-bold text-sm hover:bg-white/10 transition-colors backdrop-blur-sm w-full sm:w-auto justify-center">
                {roleLink.label}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </Link>
            )}
          </div>

          {/* Helpful links grid */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-blue-200/60 text-xs font-semibold uppercase tracking-widest mb-4">
              Where would you like to go?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon:<HomeIcon />, label:'Homepage',        href:'/'                  },
                { icon:<UserRound />, label:'Log in',          href:'/auth/login'             },
                { icon:<UserRound />, label:'Sign up',         href:'/auth/signup'            },
                { icon:<UserRound />, label:'Patient signup',  href:'/auth/signup?role=patient'   },
                { icon:<Stethoscope />, label:'Dietitian signup',href:'/auth/signup?role=dietitian' },
                { icon:<ChefHat />, label:'Chef signup',   href:'/auth/signup?role=chef'      },
              ].map(({ icon, label, href }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-blue-200 hover:text-white text-xs font-medium transition-all group">
                  <span className="text-base">{icon}</span>
                  <span>{label}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Footer branding */}
        <div className="relative z-10 mt-12 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-white font-black text-xs">CC</span>
          </div>
          <span className="text-blue-300/50 text-xs font-medium">CareCuisin · Buea, Cameroon</span>
        </div>

      </main>
    </>
  );
}
