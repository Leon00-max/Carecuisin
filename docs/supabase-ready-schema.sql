-- CareCuisin Supabase/PostgreSQL-ready schema draft.
-- This mirrors the local workflow stores added for the pre-database implementation.

create table if not exists users (
  id text primary key,
  email text unique not null,
  full_name text not null,
  phone text,
  role text not null check (role in ('patient', 'dietitian', 'chef', 'admin')),
  verification_status text not null default 'pending',
  onboarding_completed boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists consultations (
  id text primary key,
  patient_id text not null references users(id),
  dietitian_id text not null references users(id),
  requested_date_time timestamptz,
  scheduled_date_time timestamptz,
  reason text,
  health_concern text,
  status text not null check (status in ('requested','accepted','rejected','scheduled','completed','cancelled')),
  payment_status text not null default 'pending',
  consultation_fee integer,
  payment_id text,
  payment_method text,
  notes text,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists dietitian_availability (
  id text primary key,
  dietitian_id text not null references users(id),
  days text[] not null default '{Mon,Tue,Wed,Thu,Fri}',
  start_time time not null default '08:00',
  end_time time not null default '17:00',
  duration_minutes integer not null default 45,
  break_minutes integer not null default 15,
  consultation_fee integer not null default 2500,
  max_bookings_per_day integer not null default 6,
  mode text not null default 'Online or in-person',
  unavailable_dates date[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists meal_plans (
  id text primary key,
  patient_id text not null references users(id),
  dietitian_id text not null references users(id),
  consultation_id text references consultations(id),
  title text not null,
  description text,
  status text not null default 'draft',
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists meal_plan_items (
  id text primary key,
  meal_plan_id text not null references meal_plans(id) on delete cascade,
  day_name text not null,
  meal_type text not null,
  meal_name text not null,
  calories integer,
  carbs_g numeric,
  protein_g numeric,
  fat_g numeric,
  fiber_g numeric,
  patient_note text,
  chef_instruction text,
  created_at timestamptz not null default now()
);

create table if not exists clinical_notes (
  id text primary key,
  meal_plan_id text not null references meal_plans(id) on delete cascade,
  dietitian_id text not null references users(id),
  private_note text not null,
  created_at timestamptz not null default now()
);

create table if not exists chef_referrals (
  id text primary key,
  patient_id text not null references users(id),
  dietitian_id text not null references users(id),
  chef_id text not null references users(id),
  meal_plan_id text not null references meal_plans(id),
  notes_for_chef text,
  status text not null default 'pending',
  decline_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  patient_id text not null references users(id),
  dietitian_id text references users(id),
  chef_id text not null references users(id),
  referral_id text references chef_referrals(id),
  meal_plan_id text references meal_plans(id),
  status text not null check (status in ('requested','accepted','rejected','preparing','ready','delivered','completed','cancelled')),
  payment_status text not null default 'pending',
  delivery_address text,
  delivery_time timestamptz,
  amount integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payments (
  id text primary key,
  user_id text not null references users(id),
  recipient_id text references users(id),
  amount integer not null,
  currency text not null default 'XAF',
  provider text not null check (provider in ('mtn_momo','orange_money','stripe_card','wallet')),
  phone text,
  purpose text,
  related_type text,
  related_id text,
  metadata jsonb not null default '{}',
  status text not null check (status in ('pending','successful','failed','cancelled','refunded')),
  transaction_reference text not null,
  receipt_number text,
  paid_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists wallets (
  id text primary key,
  user_id text not null unique references users(id),
  balance integer not null default 0,
  currency text not null default 'XAF',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists wallet_transactions (
  id text primary key,
  user_id text not null references users(id),
  type text not null,
  direction text not null check (direction in ('credit','debit')),
  amount integer not null,
  currency text not null default 'XAF',
  status text not null default 'successful',
  reason text,
  related_payment_id text references payments(id),
  balance_after integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists money_requests (
  id text primary key,
  user_id text not null references users(id),
  type text not null check (type in ('refund','withdrawal')),
  amount integer not null,
  currency text not null default 'XAF',
  reason text not null,
  related_payment_id text references payments(id),
  status text not null check (status in ('requested','under_review','approved','rejected','paid')),
  admin_decision text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists conversations (
  id text primary key,
  title text,
  related_type text,
  related_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists conversation_participants (
  conversation_id text references conversations(id) on delete cascade,
  user_id text references users(id) on delete cascade,
  primary key (conversation_id, user_id)
);

create table if not exists messages (
  id text primary key,
  conversation_id text not null references conversations(id) on delete cascade,
  sender_id text not null references users(id),
  body text not null,
  read_by text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id text primary key,
  user_id text not null references users(id),
  title text not null,
  message text,
  type text,
  related_type text,
  related_id text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists complaints (
  id text primary key,
  submitted_by text not null references users(id),
  type text not null,
  summary text not null,
  description text not null,
  related_type text,
  related_id text,
  related_user_id text references users(id),
  priority text not null default 'medium',
  status text not null check (status in ('open','in_review','resolved','closed','rejected')),
  admin_response text,
  assigned_admin_id text references users(id),
  resolution_type text,
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ratings (
  id text primary key,
  patient_id text not null references users(id),
  professional_id text not null references users(id),
  role text not null check (role in ('dietitian','chef')),
  related_type text,
  related_id text,
  stars integer not null check (stars between 1 and 5),
  comment text,
  visibility text not null default 'admin_professional',
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id text primary key,
  patient_id text not null references users(id),
  dietitian_id text not null references users(id),
  consultation_id text references consultations(id),
  meal_plan_id text references meal_plans(id),
  title text not null,
  public_summary text,
  verification_code text unique not null,
  status text not null default 'valid',
  issued_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id text primary key,
  actor_id text,
  action text not null,
  module text not null,
  record_id text,
  affected_user_id text,
  details text,
  created_at timestamptz not null default now()
);

create index if not exists idx_consultations_patient on consultations(patient_id);
create index if not exists idx_consultations_dietitian on consultations(dietitian_id);
create index if not exists idx_availability_dietitian on dietitian_availability(dietitian_id);
create index if not exists idx_orders_patient on orders(patient_id);
create index if not exists idx_orders_chef on orders(chef_id);
create index if not exists idx_payments_user on payments(user_id);
create index if not exists idx_payments_recipient on payments(recipient_id);
create index if not exists idx_wallet_transactions_user on wallet_transactions(user_id);
create index if not exists idx_money_requests_user on money_requests(user_id);
create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_audit_logs_module on audit_logs(module);
