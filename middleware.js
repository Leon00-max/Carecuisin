/**
 * middleware.js
 *
 * Runs on the EDGE before every request.
 * Reads cookies (not localStorage — middleware can't touch it).
 * Three cookies written by lib/userStore.js setSession():
 *   cc_user_id  — presence means logged in
 *   cc_role     — 'patient' | 'dietitian' | 'chef' | 'admin'
 *   cc_status   — 'approved' | 'pending' | 'rejected'
 */

import { NextResponse } from 'next/server';

/* ── Routes that never need auth ── */
const PUBLIC_PATHS = new Set(['/', '/login', '/signup']);

/* ── Prefix helpers ── */
const is = prefix => path => path.startsWith(prefix);
const isPublic      = p => PUBLIC_PATHS.has(p);
const isOnboarding  = is('/onboarding');
const isPatient     = is('/patient');
const isDietitian   = is('/dietitian');
const isChef        = is('/chef');
const isAdmin       = is('/admin');
const isAsset       = p => p.startsWith('/_next') || p.startsWith('/favicon') || p.includes('.');

export function middleware(request) {
  const { pathname } = request.nextUrl;

  /* 1. Always pass through static assets and API routes */
  if (isAsset(pathname) || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const userId = request.cookies.get('cc_user_id')?.value;
  const role   = request.cookies.get('cc_role')?.value;
  const status = request.cookies.get('cc_status')?.value;

  /* 2. Public pages — always accessible */
  if (isPublic(pathname)) {
    // If already logged in and visiting login/signup, redirect to dashboard
    if (userId && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(
        new URL(dashboardFor(role, status), request.url)
      );
    }
    return NextResponse.next();
  }

  /* 3. No session → login */
  if (!userId) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* 4. Onboarding routes — any authenticated user may access */
  if (isOnboarding(pathname)) {
    return NextResponse.next();
  }

  /* 5. Professionals who haven't been approved yet
   *    → hold them on pending-review regardless of what URL they try */
  if (
    (role === 'dietitian' || role === 'chef') &&
    status === 'pending' &&
    pathname !== '/onboarding/pending-review'
  ) {
    return NextResponse.redirect(
      new URL('/onboarding/pending-review', request.url)
    );
  }

  /* 6. Rejected professionals — show rejected page */
  if (
    (role === 'dietitian' || role === 'chef') &&
    status === 'rejected' &&
    pathname !== '/onboarding/rejected'
  ) {
    return NextResponse.redirect(
      new URL('/onboarding/rejected', request.url)
    );
  }

  /* 7. Role-based route guards */
  if (isPatient(pathname)   && role !== 'patient')   return deny(request);
  if (isDietitian(pathname) && role !== 'dietitian') return deny(request);
  if (isChef(pathname)      && role !== 'chef')      return deny(request);
  if (isAdmin(pathname)     && role !== 'admin')     return deny(request);

  return NextResponse.next();
}

function deny(request) {
  // Wrong role for this prefix → back to their own dashboard
  const role   = request.cookies.get('cc_role')?.value;
  const status = request.cookies.get('cc_status')?.value;
  return NextResponse.redirect(
    new URL(dashboardFor(role, status), request.url)
  );
}

function dashboardFor(role, status) {
  if (!role) return '/login';
  if ((role === 'dietitian' || role === 'chef') && status !== 'approved') {
    return status === 'rejected'
      ? '/onboarding/rejected'
      : '/onboarding/pending-review';
  }
  const map = {
    patient:   '/patient/dashboard',
    dietitian: '/dietitian/dashboard',
    chef:      '/chef/dashboard',
    admin:     '/admin/dashboard',
  };
  return map[role] || '/login';
}

export const config = {
  /*
   * Run middleware on every route EXCEPT:
   * - Next.js internal files
   * - Static files with extensions (images, fonts, etc.)
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
