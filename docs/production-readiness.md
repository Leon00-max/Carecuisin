# CareCuisin Production Readiness Notes

This pass adds the missing workflow foundation while preserving the existing role dashboards.

## Implemented in the codebase

- Consultation store, API routes, patient booking page, and dietitian management page.
- Chef referral booking/order store and patient referred-chef booking page.
- Payment store and UI with MTN MoMo, Orange Money, and Stripe-card provider options.
- CareCuisin wallet simulation with top-ups, wallet payments, refund requests, and withdrawal requests.
- Dietitian availability store and UI so patients book real open slots without double-booking.
- Patient consultation booking now includes dietitian search, slot selection, and same-flow payment.
- Dietitian chef referrals now use approved chef accounts instead of static demo chef lists.
- Patient referred-chef booking now creates a paid chef order in one flow.
- Patient payment receipts and Admin payment management.
- Admin payment management now includes revenue breakdown and refund/withdrawal review controls.
- Messaging, notification, complaint, rating, report, and audit-log stores.
- Patient complaint, report, rating, payment, consultation, and chef-booking screens.
- Public `/verify/[id]` route now verifies report codes safely.
- Pending/rejected professional pages now match middleware redirects.
- Correct onboarding aliases for `/onboarding/dietitian/...` and `/onboarding/chef/...`.
- Public signup is limited to patient, dietitian, and chef roles.
- Supabase/PostgreSQL schema draft in `docs/supabase-ready-schema.sql`.

## Payment integration status

The app now records provider-ready transactions for:

- `mtn_momo`
- `orange_money`
- `stripe_card`
- `wallet`

These are still simulated until live provider credentials are added. When credentials are ready, replace `simulatePaymentResult` in `src/lib/paymentStore.js` with provider calls and webhook confirmation.

## Database path

The workflow stores currently use a local adapter so the frontend can function before the database is connected. The database-ready shape is documented in `docs/supabase-ready-schema.sql`.

When Supabase is added:

1. Run the schema against Supabase SQL editor or migrations.
2. Replace the store internals with Supabase queries while keeping exported function names stable.
3. Move auth to Supabase Auth or another secure server session provider.
4. Keep private clinical notes in `clinical_notes`, never in patient/chef payloads.

## Remaining production tasks

- Wire Supabase Auth and remove password storage from `userStore.js`.
- Replace local adapter persistence with Supabase tables.
- Add real MTN MoMo, Orange Money, and Stripe API calls/webhooks.
- Add admin invitation/seed command for first admin creation.
- Add role-aware Row Level Security policies in Supabase.
- Expand API validation with a schema library before accepting untrusted requests.
