/**
 * lib/userStore.js
 *
 * The single source of truth for all user data while the app
 * runs on localStorage (pre-Supabase). Every page that reads
 * or writes a user MUST go through these functions — never
 * touch localStorage directly for user data.
 *
 * Swap each function body for a Supabase call when wiring
 * the real backend. The call-sites don't change.
 */

const USERS_KEY = 'cc_users';

/* ─── Raw storage ─────────────────────────────────────────── */

export function getUsers() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch (_) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  // Dispatch a storage event so other tabs / polling hooks
  // can react immediately (pending-review page uses this).
  window.dispatchEvent(new StorageEvent('storage', {
    key:      USERS_KEY,
    newValue: JSON.stringify(users),
  }));
}

/* ─── Reads ───────────────────────────────────────────────── */

export function getUserById(id) {
  return getUsers().find(u => u.id === id) || null;
}

export function getUserByEmail(email) {
  return getUsers().find(
    u => u.email.toLowerCase() === email.toLowerCase()
  ) || null;
}

export function getPendingProfessionals() {
  return getUsers().filter(
    u =>
      (u.role === 'dietitian' || u.role === 'chef') &&
      u.verification_status === 'pending' &&
      u.onboardingCompleted === true
  );
}

/* ─── Writes ──────────────────────────────────────────────── */

/**
 * createUser — called from signup page.
 * Throws if email already exists.
 */
export function createUser({ fullName, email, password, phone, role }) {
  const users  = getUsers();
  const exists = users.find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) throw new Error('An account with this email already exists.');

  const newUser = {
    id:                   `USR-${Date.now()}`,
    email:                email.toLowerCase().trim(),
    // Plain text for MVP. When Supabase is wired, replace with
    // Supabase Auth — never store plain passwords in production.
    password:             password,
    role,
    fullName,
    phone:                phone || '',
    onboardingCompleted:  false,
    // Patients are auto-approved. Professionals wait for admin.
    verification_status:  role === 'patient' ? 'approved' : 'pending',
    createdAt:            new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
}

/**
 * updateUser — generic field patch.
 * Used by: onboarding completion, admin approval/rejection.
 */
export function updateUser(id, updates) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error(`User ${id} not found.`);
  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveUsers(users);
  return users[index];
}

/**
 * approveUser / rejectUser — called from admin verify-users page.
 * Updates the ONE authoritative record in cc_users.
 */
export function approveUser(id) {
  return updateUser(id, { verification_status: 'approved' });
}

export function rejectUser(id, reason = '') {
  return updateUser(id, {
    verification_status: 'rejected',
    rejection_reason:    reason,
  });
}

/**
 * markOnboardingComplete — called at the end of each role's
 * final onboarding step.
 */
export function markOnboardingComplete(id) {
  return updateUser(id, { onboardingCompleted: true });
}

/* ─── Session (cookie) helpers ────────────────────────────── */

/** Write three cookies so middleware can read role + status
 *  without touching localStorage (middleware runs on the edge). */
export function setSession(user) {
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  const base   = `path=/; max-age=${maxAge}; SameSite=Strict`;
  document.cookie = `cc_user_id=${user.id}; ${base}`;
  document.cookie = `cc_role=${user.role}; ${base}`;
  document.cookie = `cc_status=${user.verification_status}; ${base}`;
}

/** Refresh the cc_status cookie after admin approves — called
 *  by pending-review page when it detects the status change. */
export function refreshStatusCookie(newStatus) {
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `cc_status=${newStatus}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

export function clearSession() {
  const expire = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  document.cookie = `cc_user_id=; ${expire}`;
  document.cookie = `cc_role=; ${expire}`;
  document.cookie = `cc_status=; ${expire}`;
}

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getCurrentUserId()   { return getCookie('cc_user_id'); }
export function getCurrentUserRole() { return getCookie('cc_role');    }

export function getCurrentUser() {
  const id = getCurrentUserId();
  return id ? getUserById(id) : null;
}
