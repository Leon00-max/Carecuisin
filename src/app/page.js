'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserRound, Stethoscope, ChefHat,ShieldCheck, Activity,Clock, Locate, PenTool, HospitalIcon, Verified, } from 'lucide-react';

const KEYFRAMES = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0}to{opacity:1} }
  @keyframes floatY   { 0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)} }
  @keyframes floatY2  { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
  @keyframes pulse2   { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.05)} }
`;

const TEAM=[
  {initials:'JM',name:'Mbanwei John-Simon',role:'Lead Developer & System Architect',quote:'Built the clinical privacy layer that keeps every patient\'s data safe.',color:'from-blue-600 to-blue-900'},
  {initials:'PT',name:'Samuelson Peter Tebo',role:'Dietitian Workflow Specialist',quote:'Designed the meal plan creation and referral logic end-to-end.',color:'from-emerald-600 to-emerald-900'},
  {initials:'HE',name:'Ebong Halle Etoh',role:'Chef Relations & UX Designer',quote:'Crafted the chef onboarding and referral card experience.',color:'from-violet-600 to-violet-900'},
  {initials:'NA',name:'Nga Enanga Arielle',role:'Frontend & Visual Designer',quote:'Defined the design system and every pixel of the UI.',color:'from-rose-600 to-rose-900'},
  {initials:'BW',name:'Kammegne Blaise Wereku',role:'Backend & Database Engineer',quote:'Architected the ERD and API route structure for Supabase.',color:'from-amber-600 to-amber-900'},
  {initials:'NN',name:'Ngalame Nervil Ngame',role:'Quality Assurance & Testing Lead',quote:'Stress-tested every user flow from signup to meal delivery.',color:'from-cyan-600 to-cyan-900'},
  {initials:'DA',name:'Dr. Ali',role:'Project Manager & Clinical Consultant',quote:'Ensured the platform meets the real needs of Buea\'s patients and professionals.',color:'from-green-600 to-green-900'},
];
const TESTIMONIALS=[
  {role:'Patient',name:'Fru Emmanuel',text:'I have diabetes and always struggled to eat right after hospital visits. CareCuisin changed everything — my meals are now prescribed and prepared for me.'},
  {role:'Dietitian',name:'Dr. Ambe Florence',text:'For the first time I can ensure my patients actually eat what I prescribe. The clinical notes stay private and my referrals are tracked in real time.'},
  {role:'Chef',name:'Chef Nkemdirim Grace',text:'CareCuisin gave me a professional edge I never had before. I receive clear cooking instructions and build real credibility in Buea.'},
];
const FEATURES=[
  {icon:<Stethoscope />,title:'Clinical Intermediary',body:'The dietitian acts as the medical gatekeeper. Every meal plan is prescribed — not guessed.'},
  {icon:<UserRound />,title:'Medical Masking',body:'Clinical rationale, sodium targets, and diagnoses never reach the chef. Architecture-level privacy.'},
  {icon:<ChefHat />,title:'Local-First Design',body:'Chef matching filtered by Buea neighbourhood. MTN/Orange MoMo ready for payments.'},
  {icon:<ShieldCheck />,title:'Next.js + Docker',body:'Server-side rendering for fast loads on Cameroon mobile networks. Dockerised for any machine.'},
  {icon:<PenTool />,title:'Role-Based Security',body:'Four isolated dashboards. Middleware guards every route. No cross-role data leakage.'},
  {icon:<Activity />,title:'Admin Intelligence',body:'Real-time analytics, complaint handling, and professional verification in one console.'},
  {icon:<Clock />,title:'Built for Buea',body:'Every feature, flow, and pixel designed specifically for the needs of Buea\'s patients, dietitians, and chefs.'},
  {icon:<Locate />,title:'Scalable for Africa',body:'A modular, extensible architecture ready to expand across Cameroon and the continent.'},
  {icon:<HospitalIcon />,title:'Healthcare-Grade',body:'Designed to meet the needs of clinical nutrition — the most complex, high-stakes dietetic domain.'},
  {icon:<Verified />,title:'Verified Professionals',body:'All chefs and dietitians are verified and certified before joining the platform.'}
];

export default function HomePage(){
  const [vis, setVis] = useState(false);
  useEffect(()=>{ setTimeout(()=>setVis(true),100); },[]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:KEYFRAMES}}/>

      {/* ───── SECTION 1: HERO ───── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden" style={{background:'linear-gradient(135deg,#0f172a 0%,#1e3a8a 45%,#1e40af 100%)'}}>
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'linear-gradient(#2563eb 1px,transparent 1px),linear-gradient(90deg,#2563eb 1px,transparent 1px)',backgroundSize:'60px 60px'}}/>
        {/* Orbs */}
        <div className="absolute top-24 right-16 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{background:'#2563eb',animation:'floatY 6s ease-in-out infinite'}}/>
        <div className="absolute bottom-32 left-16 w-48 h-48 rounded-full opacity-10 blur-2xl" style={{background:'#10b981',animation:'floatY2 5s ease-in-out infinite'}}/>

        {/* Nav */}
        <nav className="relative z-50 flex items-center justify-between px-6 sm:px-12 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <span className="text-blue-700 font-black text-sm">CC</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Care<span className="text-blue-300">Cuisin</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[['#problem','Why Us'],['#workflow','How It Works'],['#team','Our Team'],['#contact','Contact']].map(([h,l])=>(
              <a key={h} href={h} className="text-blue-200 hover:text-white text-sm font-medium transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden sm:block px-5 py-2 rounded-xl border border-blue-400/40 text-blue-200 text-sm font-semibold hover:bg-white/10 transition-colors">Log in</Link>
            <Link href="/auth/signup" className="px-5 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-400 transition-all shadow-lg">Join Platform</Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center px-6 sm:px-12 py-12">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm mb-8"
                style={{animation:vis?'fadeIn 0.6s ease-out forwards':'none',opacity:0}}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Buea's First Clinical Meal Platform</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-6"
                style={{animation:vis?'fadeUp 0.7s 0.2s ease-out both':'none'}}>
                Clinical<br/>
                <span className="text-transparent" style={{WebkitTextStroke:'2px #60a5fa'}}>Precision.</span><br/>
                <span className="bg-clip-text text-transparent" style={{backgroundImage:'linear-gradient(90deg,#60a5fa,#34d399)'}}>Kitchen Fresh.</span>
              </h1>

              <p className="text-blue-200 text-lg leading-relaxed max-w-lg mb-10"
                style={{animation:vis?'fadeUp 0.7s 0.4s ease-out both':'none',opacity:0}}>
                Dietitian prescribed meal plans, prepared by admin verified chefs in Buea.
                Because your diet shouldn't be a guess  it should be a prescription.
              </p>

              <div className="flex flex-wrap gap-4 mb-12" style={{animation:vis?'fadeUp 0.7s 0.6s ease-out both':'none',opacity:0}}>
                <Link href="/auth/signup" className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary-500 text-white font-bold text-base hover:bg-primary-400 transition-all shadow-2xl shadow-blue-900/60 group" style={{animation:'pulse2 3s ease-in-out infinite'}}>
                  Get Started Free
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                </Link>
                <a href="#workflow" className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-blue-400/40 text-white font-bold text-base hover:bg-white/10 transition-colors backdrop-blur-sm">
                  How It Works
                </a>
              </div>

              <div className="flex flex-wrap gap-3" style={{animation:vis?'fadeUp 0.7s 0.8s ease-out both':'none',opacity:0}}>
                {[[<span className="text-emerald-400"><Clock /></span>,'Clinical Data Protected'],[
                  <span className="text-emerald-400"><Verified /></span>,'Admin-Verified Pros'],
                  [<span className="text-emerald-400"><Locate /></span>,'Built for Buea'],
                  [<span className="text-emerald-400"><HospitalIcon /></span>,'Hospital-Grade']].map(([icon,label])=>(
                  <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-sm">{icon}</span>
                    <span className="text-blue-200 text-xs font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating UI previews */}
            <div className="relative hidden lg:flex items-center justify-center h-[520px]">
              {/* Main dashboard card */}
              {/* REPLACE: inner content with real screenshot */}
              <div className="absolute top-0 right-0 w-72 rounded-2xl overflow-hidden shadow-2xl" style={{background:'rgba(255,255,255,0.07)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.12)',animation:'floatY 7s ease-in-out infinite'}}>
                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                  <div className="flex gap-1"><span className="w-3 h-3 rounded-full bg-red-400"/><span className="w-3 h-3 rounded-full bg-amber-400"/><span className="w-3 h-3 rounded-full bg-emerald-400"/></div>
                  <span className="text-white/60 text-xs ml-2">Patient Dashboard</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-2.5 bg-white/20 rounded-full w-3/4"/>
                  <div className="h-2 bg-white/10 rounded-full w-full"/>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {['71%','85%','60%'].map((v,i)=>(
                      <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-white font-bold text-lg">{v}</p>
                        <p className="text-white/40 text-xs">Track {i+1}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary-500/30 rounded-xl p-3 border border-primary-400/30">
                    <p className="text-blue-200 text-xs font-semibold">Today's Lunch</p>
                    <p className="text-white/60 text-xs mt-0.5">Grilled fish · Plantains · Vegetables</p>
                  </div>
                </div>
              </div>

              {/* Chef match card */}
              <div className="absolute bottom-16 left-0 w-64 rounded-2xl p-4 shadow-2xl" style={{background:'rgba(255,255,255,0.07)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.12)',animation:'floatY2 5s ease-in-out infinite'}}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center text-lg"><ChefHat /></div>
                  <div><p className="text-white text-xs font-semibold">Chef Matched</p><p className="text-white/50 text-xs">Molyko · 94% match</p></div>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{width:'94%'}}/>
                </div>
                <p className="text-emerald-300 text-xs mt-2 font-medium">✓ Medical plan certified</p>
              </div>

              {/* Verified badge */}
              <div className="absolute top-1/3 left-1/4 rounded-2xl px-4 py-3 shadow-xl" style={{background:'rgba(37,99,235,0.3)',backdropFilter:'blur(12px)',border:'1px solid rgba(96,165,250,0.3)',animation:'floatY 4s 1s ease-in-out infinite'}}>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400"><Verified /></span>
                  <div><p className="text-white text-xs font-semibold">Dr. Ambe Florence</p><p className="text-blue-300 text-xs">Verified Dietitian</p></div>
                </div>
              </div>

              {/* Privacy shield */}
              <div className="absolute bottom-8 right-8 rounded-2xl px-4 py-3 shadow-xl" style={{background:'rgba(15,23,42,0.6)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.08)',animation:'floatY2 6s 2s ease-in-out infinite'}}>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400"><Clock /></span>
                  <div><p className="text-white text-xs font-semibold">Clinical Notes</p><p className="text-white/40 text-xs">Dietitian only · Never shared</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-8">
          <div className="flex flex-col items-center gap-1 text-blue-300/50 animate-bounce">
            <span className="text-xs">Scroll</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>
      </section>

      {/* ───── SECTION 2: PROBLEM ───── */}
      <section id="problem" className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex justify-center mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full">The Problem We Solve</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-surface-900 text-center leading-tight mb-4 max-w-3xl mx-auto">
            Patients receive prescriptions.<br/><span className="text-primary-600">Not meals.</span>
          </h2>
          <p className="text-lg text-surface-500 text-center max-w-2xl mx-auto mb-16 leading-relaxed">
            Diabetes, hypertension, renal disease — dietitians write the plan. But between the clinic and the kitchen, everything breaks down.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {icon:'😰',bg:'bg-red-50 border-red-100',ibg:'bg-red-100',stat:'67%',sc:'text-red-600',title:'of chronic patients',body:'don\'t follow their prescribed diet because they don\'t know how to cook it.'},
              {icon:'🍽️',bg:'bg-amber-50 border-amber-100',ibg:'bg-amber-100',stat:'0',sc:'text-amber-600',title:'platforms in Buea',body:'connect dietitians with chefs for medically-supervised meal preparation.'},
              {icon:'🔒',bg:'bg-primary-50 border-primary-100',ibg:'bg-primary-100',stat:'100%',sc:'text-primary-600',title:'of clinical data',body:'should remain private. Chefs should cook  not diagnose.'},
            ].map(({icon,bg,ibg,stat,sc,title,body})=>(
              <div key={stat} className={`rounded-2xl border p-7 ${bg}`}>
                <div className={`w-12 h-12 rounded-xl ${ibg} flex items-center justify-center text-2xl mb-5`}>{icon}</div>
                <p className={`text-4xl font-black ${sc} mb-1`}>{stat}</p>
                <p className="text-sm font-bold text-surface-700 mb-2">{title}</p>
                <p className="text-sm text-surface-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="relative rounded-3xl overflow-hidden p-10 sm:p-14 text-center" style={{background:'linear-gradient(135deg,#1e3a8a 0%,#1e40af 50%,#2563eb 100%)'}}>
            <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(circle at 25% 50%,white 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>
            <div className="relative">
              <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-4">The CareCuisin Answer</p>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">A clinical intermediary layer<br/>between the clinic and the kitchen.</h3>
              <p className="text-blue-200 text-base max-w-2xl mx-auto leading-relaxed">Dietitians prescribe. The platform guards privacy. Verified chefs cook. Patients eat safely. Every step tracked, every role protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── SECTION 3: HOW IT WORKS ───── */}
      <section id="workflow" className="bg-surface-50 py-24 sm:py-32 border-t border-surface-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full inline-block mb-6">The Clinical Workflow</span>
            <h2 className="text-4xl sm:text-5xl font-black text-surface-900 leading-tight mb-4">From clinic to kitchen<br/>in three steps.</h2>
            <p className="text-surface-500 text-lg max-w-xl mx-auto">Every meal goes through a clinical review before it reaches your plate.</p>
          </div>

          {/* Role flow */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center mb-16">
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-3xl mb-4">🩺</div>
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Step 01</span>
              <h3 className="text-lg font-bold text-surface-900 mt-1 mb-2">Dietitian Prescribes</h3>
              <p className="text-sm text-surface-500 leading-relaxed">Builds a medically sound meal plan with private clinical notes. Sets sodium, carb, and calorie targets per condition.</p>
              <div className="mt-4 p-3 bg-surface-800 rounded-xl">
                <p className="text-xs text-surface-400 font-mono leading-relaxed"><span className="text-emerald-400">clinical_notes</span> → <span className="text-red-400">PRIVATE</span><br/><span className="text-blue-300">meal_plan</span> → <span className="text-emerald-400">SAFE</span></p>
              </div>
            </div>
            <div className="md:col-span-1 flex justify-center">
              <div className="hidden md:block w-full h-0.5 bg-gradient-to-r from-primary-300 to-amber-300"/>
              <div className="md:hidden h-10 w-0.5 bg-gradient-to-b from-primary-300 to-amber-300"/>
            </div>
            <div className="md:col-span-2 bg-surface-900 rounded-2xl p-6 border border-surface-700 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{background:'radial-gradient(circle at 50% 50%,#2563eb,transparent 70%)'}}/>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-3xl mb-4">⚡</div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Step 02</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">Platform Connects</h3>
                <p className="text-sm text-surface-400 leading-relaxed">Smart chef matching by location and condition. Clinical notes stay locked. Only safe cooking instructions pass through.</p>
                <div className="mt-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/><span className="text-xs text-emerald-400 font-medium">Privacy enforced at DB level</span></div>
              </div>
            </div>
            <div className="md:col-span-1 flex justify-center">
              <div className="hidden md:block w-full h-0.5 bg-gradient-to-r from-amber-300 to-emerald-300"/>
              <div className="md:hidden h-10 w-0.5 bg-gradient-to-b from-amber-300 to-emerald-300"/>
            </div>
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl mb-4">👨‍🍳</div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Step 03</span>
              <h3 className="text-lg font-bold text-surface-900 mt-1 mb-2">Chef Prepares</h3>
              <p className="text-sm text-surface-500 leading-relaxed">Verified chef receives safe cooking instructions. Marks meal prepared. Patient eats food designed for their body.</p>
              <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs text-emerald-700 font-semibold">✓ Chef sees: ingredients + method</p>
                <p className="text-xs text-red-500 font-semibold mt-1">✗ Never sees: diagnosis, clinical data</p>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({icon,title,body})=>(
              <div key={title} className="group bg-white border border-surface-100 rounded-2xl p-6 hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 transition-all duration-200 cursor-default">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-2xl mb-4 group-hover:bg-primary-100 transition-colors">{icon}</div>
                <h4 className="text-sm font-bold text-surface-900 mb-2">{title}</h4>
                <p className="text-xs text-surface-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── SECTION 4: TEAM ───── */}
      <section id="team" className="bg-white py-24 sm:py-32 border-t border-surface-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full inline-block mb-6">The Builders</span>
            <h2 className="text-4xl sm:text-5xl font-black text-surface-900 leading-tight mb-4">Meet Group 6</h2>
            <p className="text-surface-500 text-lg max-w-xl mx-auto">Six Computer Science students at the University of Buea who built CareCuisin as a real healthcare solution, not a class assignment.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {TEAM.map(({initials,name,role,quote,color})=>(
              <div key={name} className="group rounded-2xl overflow-hidden border border-surface-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* REPLACE: swap for <Image src={`/team/${initials}.jpg`} .../> */}
                <div className={`h-48 bg-gradient-to-br ${color} relative flex items-center justify-center`}>
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-2xl shadow-lg border border-white/30">{initials}</div>
                  <div className="absolute bottom-3 right-3 text-xs text-white/40 bg-black/20 px-2 py-1 rounded-lg">📸 photo</div>
                </div>
                <div className="p-5 bg-white">
                  <h3 className="text-sm font-bold text-surface-900 mb-0.5">{name}</h3>
                  <p className="text-xs font-semibold text-primary-600 mb-3">{role}</p>
                  <p className="text-xs text-surface-500 leading-relaxed italic">"{quote}"</p>
                </div>
              </div>
            ))}
          </div>

          {/* Group photo placeholder */}
          <div className="rounded-3xl overflow-hidden border-2 border-dashed border-surface-200 relative mb-16">
            {/* REPLACE: <Image src="/team/group.jpg" width={1200} height={500} className="w-full object-cover" alt="Group 6"/> */}
            <div className="h-64 sm:h-72 bg-gradient-to-br from-surface-100 to-surface-200 flex flex-col items-center justify-center gap-3">
              <div className="text-4xl">📸</div>
              <p className="text-surface-400 font-semibold text-sm">REPLACE: Group photo here</p>
              <p className="text-surface-300 text-xs">All 6 members · "CareCuisin" sign · Buea campus</p>
            </div>
            <div className="absolute inset-0 flex items-end p-6 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3 border border-surface-100 shadow-sm">
                <p className="text-sm font-bold text-surface-900">Group 6 — University of Buea, 2026</p>
                <p className="text-xs text-surface-500">CSC 404 · Supervised by Dr. Ali Joan Beri Wacka</p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <h3 className="text-center text-lg font-bold text-surface-700 mb-8">What users say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({role,name,text})=>(
              <div key={name} className="bg-surface-50 border border-surface-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">{name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                  <div><p className="text-sm font-semibold text-surface-800">{name}</p><p className="text-xs text-primary-600 font-medium">{role}</p></div>
                </div>
                <p className="text-sm text-surface-600 leading-relaxed italic">"{text}"</p>
                <div className="mt-3 flex gap-0.5">{[...Array(5)].map((_,i)=><span key={i} className="text-amber-400 text-sm">★</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── SECTION 5: CTA + FOOTER ───── */}
      <section id="contact" className="relative py-24 sm:py-32 overflow-hidden" style={{background:'linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#1e40af 100%)'}}>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{background:'#2563eb'}}/>
        <div className="relative max-w-4xl mx-auto px-6 sm:px-12 text-center">
          <span className="text-blue-300 text-sm font-bold uppercase tracking-widest block mb-6">Ready to start?</span>
          <h2 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
            Take control of<br/>
            <span className="bg-clip-text text-transparent" style={{backgroundImage:'linear-gradient(90deg,#60a5fa,#34d399)'}}>your health today.</span>
          </h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto mb-10 leading-relaxed">Join CareCuisin — it's free to start. Patients get immediate access. Professionals reviewed within 48 hours.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link href="/signup" className="px-10 py-4 rounded-2xl bg-primary-500 text-white font-bold text-base hover:bg-primary-400 transition-all shadow-2xl shadow-blue-900/60 w-full sm:w-auto">Create your account →</Link>
            <Link href="/login" className="px-10 py-4 rounded-2xl border border-blue-400/40 text-white font-bold text-base hover:bg-white/10 transition-colors w-full sm:w-auto">Sign in</Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-blue-300/60 text-xs">
            {['Dietitian-guided','Chefs verified','Privacy protected','Built for Buea'].map((t,i,a)=>(
              <span key={t} className="flex items-center gap-4">{t}{i<a.length-1&&<span className="text-blue-400/30">·</span>}</span>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-surface-900 border-t border-surface-800 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xs">CC</div>
                <span className="text-white font-bold">CareCuisin</span>
              </div>
              <p className="text-surface-400 text-sm leading-relaxed max-w-xs">Connecting clinical dietitians, verified chefs, and patients in Buea, Cameroon.</p>
              <p className="text-surface-600 text-xs mt-4">Built with ♥ in Buea · {new Date().getFullYear()}</p>
            </div>
            <div>
              <p className="text-surface-400 text-xs font-bold uppercase tracking-widest mb-4">Quick Links</p>
              <div className="space-y-2">
                {[['Home','/'],['How It Works','#workflow'],['Our Team','#team'],['Sign Up','/signup'],['Log In','/login']].map(([l,h])=>(
                  <a key={l} href={h} className="block text-sm text-surface-500 hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-surface-400 text-xs font-bold uppercase tracking-widest mb-4">Contact</p>
              <div className="space-y-1.5 text-sm text-surface-500">
                <p>University of Buea</p>
                <p>Department of Computer Science</p>
                <p>CSC 404 — Group 6</p>
                <a href="mailto:group6@carecuisin.cm" className="text-primary-400 hover:text-primary-300 transition-colors block mt-2">group6@carecuisin.cm</a>
              </div>
            </div>
          </div>
          <div className="border-t border-surface-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-surface-600 text-xs">© {new Date().getFullYear()} CareCuisin · All rights reserved</p>
            <p className="text-surface-700 text-xs text-center sm:text-right">Developed as a CSC 404 project under the supervision of <span className="text-surface-500">Dr. Ali Joan Beri Wacka</span></p>
          </div>
        </div>
      </footer>
    </>
  );
}