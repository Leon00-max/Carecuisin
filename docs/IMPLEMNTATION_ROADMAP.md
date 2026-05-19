# CareCuisin Gap Analysis & Execution Roadmap (May 19, 2026)

## 1) Quick verdict

Your architecture is strong and absolutely viable for the full platform vision. You already have the hardest core: role separation, onboarding, verification gating, and the clinical flow (`plan -> referral -> chef prep`).

The main gaps are not foundational rewrites — they are **experience and coordination layers**:
- mobile-first navigation UX,
- patient-dietitian booking workflow,
- role-to-role communication,
- richer patient and operations views.

---

## 2) What is already good (keep as-is)

- Centralized store pattern in `src/lib` for progressive backend swap.
- Route-level role partitioning under `src/app/*`.
- Admin moderation and verification foundations.
- Existing meal plan + referral stores that can be extended instead of replaced.

---

## 3) Current structure mismatches to clean up first (high impact, low effort)

Before adding new features, fix naming and structure inconsistencies that will slow delivery:

- `src/lib/formatter.js` should be `src/lib/formatters.js` (or update all imports consistently).
- `src/hooks/useRolerRedirection.js` should be renamed to `useRoleRedirect.js`.
- Validation files are inconsistent (`patients.js`, `mealplan.js`) vs intended naming (`patient.js`, `mealPlan.js`).
- Admin page path looks misspelled: `src/app/admin/systemst-status/page.js`.
- Onboarding review route naming is inconsistent (`pendingpage.js`, `rejected-page.js`).
- API route filenames like `idroute.js`, `dietitiants`, `chief` likely need normalization to avoid maintainability bugs.

These are not cosmetic; they reduce confusion and future routing/import errors.

---

## 4) Missing modules/pages to reach your stated vision

## Data layer additions

- `src/lib/bookingStore.js` (consultation booking lifecycle).
- `src/lib/messageStore.js` (chat threads and read states).
- Optional: `src/lib/timelineStore.js` (event aggregation for care timeline).

## UI/shared components

- `src/components/BottomNav.jsx` for patient/dietitian/chef mobile navigation.
- Optional: `src/components/messages/ChatWindow.jsx`, `ChatList.jsx`.

## Patient routes

- `src/app/patient/profile/page.js`
- `src/app/patient/progress/page.js`
- `src/app/patient/find-dietitian/page.js`
- `src/app/patient/choose-chef/page.js`
- `src/app/patient/bookings/page.js`
- `src/app/patient/messages/page.js`

## Dietitian routes

- `src/app/dietitian/patients/[id]/page.js`
- `src/app/dietitian/bookings/page.js`
- `src/app/dietitian/messages/page.js`

## Chef routes

- `src/app/chef/queue/page.js`
- `src/app/chef/history/page.js`
- `src/app/chef/messages/page.js`

## Admin route fix

- Ensure `src/app/admin/page.js` exists and redirects to `/admin/dashboard`.

---

## 5) Minimal ERD extensions you should add now

Add these entities to `docs/ERD.md` before coding the next phase:

- **Bookings**: patient_id, dietitian_id, status, fee, preferred_date, notes, created_at.
- **Messages**: sender_id, receiver_id, content, is_read, created_at.
- **ChefShortlist** (or equivalent on referrals): meal_plan_id, dietitian_id, shortlisted chef ids, created_at.

Also include status enums and role visibility rules per table.

---

## 6) Recommended implementation order (execution plan)

1. **Normalize naming + route cleanup** (fast wins; prevent compounding debt).
2. **BottomNav integration** into patient/dietitian/chef layouts.
3. **bookingStore + patient find-dietitian flow**.
4. **dietitian bookings acceptance flow**.
5. **chef shortlist + patient choose-chef flow**.
6. **patient profile + progress views**.
7. **messageStore + messaging pages**.
8. **chef queue board with status pipeline**.
9. **dietitian patient detail page**.
10. **timeline + family access (basic signals/logging)**.

This order gives you a compelling demonstration narrative quickly: discover professional -> book -> prescribe -> shortlist -> choose chef -> prepare -> track.

---

## 7) What to start with right now (best next contribution)

If we start immediately, the highest-value first sprint is:

- **Sprint A (1-2 days):** naming cleanup + `BottomNav.jsx` + layout integration.
- **Sprint B (2-3 days):** `bookingStore.js` + `patient/find-dietitian` + `dietitian/bookings`.

That delivers visible product polish and a complete patient->dietitian initiation loop, which is key for demos, reviews, and defense.

---

## 8) Definition of done for “phase complete” quality

A feature should be considered complete only if it has:

- role-based route protection,
- store methods + validation schema,
- loading/empty/error states,
- mobile layout behavior,
- admin observability where relevant,
- privacy rule checks (especially clinical notes visibility).

