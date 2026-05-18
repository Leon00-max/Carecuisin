# CareCuisin Entity Relationship Diagram (ERD)

## 1. Core Authentication
### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password_hash` (String)
- `role` (Enum: 'patient', 'dietitian', 'chef', 'admin')
- `onboarding_completed` (Boolean, Default: false)
- `verification_status` (Enum: 'pending', 'approved', 'rejected', Default: 'pending' for dietitian/chef, 'approved' for patient)
- `locale` (String, Default: 'en')
- `created_at` (Timestamp)

## 2. Role-Specific Profiles

### Patient_Profiles
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key → Users.id, Unique)
- `full_name` (String)
- `date_of_birth` (Date)
- `gender` (String)
- `phone` (String)
- `location_buea` (String)
- `medical_conditions` (JSON Array, e.g., ["diabetes", "hypertension"])
- `allergies` (JSON Array)
- `dietary_preferences` (Text)
- `budget_range` (Enum: 'low', 'medium', 'high')
- `has_personal_chef` (Boolean, Default: false)
- `assigned_dietitian_id` (Foreign Key → Users.id, nullable)
- `created_at` (Timestamp)

### Dietitian_Profiles
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key → Users.id, Unique)
- `full_name` (String)
- `phone` (String)
- `degree_type` (String)
- `institution` (String)
- `graduation_year` (Integer)
- `years_of_practice` (Integer)
- `specializations` (JSON Array)
- `workplace` (String, e.g., "Buea Regional Hospital")
- `other_workplace` (String, if workplace = 'Other')
- `department` (String)
- `employment_status` (String)
- `supervisor_contact` (String)
- `documents` (JSON Array of URLs)
- `consultation_fee` (Decimal, e.g., 5000.00)              ← NEW
- `available_days` (JSON Array, e.g., ["Monday","Wednesday"])  ← NEW
- `available_time_slots` (Text, e.g., "9:00 AM – 12:00 PM")   ← NEW
- `created_at` (Timestamp)

### Chef_Profiles
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key → Users.id, Unique)
- `full_name` (String)
- `phone` (String)
- `years_experience` (Integer)
- `work_environment` (Enum: 'home', 'restaurant', 'catering')
- `establishment_name` (String)
- `establishment_location` (String)
- `reference_name` (String)
- `reference_phone` (String)
- `can_follow_medical_plans` (Boolean)
- `service_type` (Enum: 'home_delivery', 'pickup', 'cook_at_home')
- `documents` (JSON Array of URLs)
- `created_at` (Timestamp)

## 3. Dietitian Booking System (NEW)
### Bookings
- `id` (UUID, Primary Key)
- `patient_id` (Foreign Key → Users.id)
- `dietitian_id` (Foreign Key → Users.id)
- `requested_date` (Date)
- `status` (Enum: 'requested', 'accepted', 'declined', 'completed')
- `created_at` (Timestamp)

## 4. The Core System (Privacy Architecture)

### Meal_Plans (Public View — Safe for Chefs & Patients)
- `id` (UUID, Primary Key)
- `dietitian_id` (Foreign Key → Users.id)
- `patient_id` (Foreign Key → Users.id)
- `title` (String)
- `description` (Text) — public meal description
- `start_date` (Date)
- `end_date` (Date)
- `details` (JSON) — weekly meal breakdown (Mon‑Sun), public fields only
- `status` (Enum: 'draft', 'active', 'referred', 'completed')   ← "draft" added
- `created_at` (Timestamp)

### Clinical_Notes (Private — Dietitian ONLY)
- `id` (UUID, Primary Key)
- `meal_plan_id` (Foreign Key → Meal_Plans.id, Unique)
- `medical_rationale` (Text) — e.g., "Low sodium due to Stage 2 CKD"
- `clinical_targets` (JSON) — e.g., {"sodium_mg": 1500, "carbs_g": 200}
- `allergy_flags` (JSON Array)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## 5. Dietitian‑Curated Chef Selection (NEW)
### Chef_Shortlist
- `id` (UUID, Primary Key)
- `meal_plan_id` (Foreign Key → Meal_Plans.id)
- `chef_id` (Foreign Key → Users.id)
- `added_by_dietitian_id` (Foreign Key → Users.id)
- `created_at` (Timestamp)

## 6. The Handshake (Referrals — Updated)
### Referrals
- `id` (UUID, Primary Key)
- `dietitian_id` (Foreign Key → Users.id)
- `chef_id` (Foreign Key → Users.id) — chosen by patient from shortlist
- `patient_id` (Foreign Key → Users.id)
- `meal_plan_id` (Foreign Key → Meal_Plans.id)
- `shortlist_id` (Foreign Key → Chef_Shortlist.id, nullable)     ← NEW
- `notes_for_chef` (Text, nullable)
- `status` (Enum: 'pending', 'accepted', 'declined', 'prepared', 'delivered')
- `patient_chose_at` (Timestamp)                                  ← NEW
- `created_at` (Timestamp)

## 7. Complaints & Feedback

### Complaints
- `id` (UUID, Primary Key)
- `patient_id` (Foreign Key → Users.id)
- `description` (Text)
- `status` (Enum: 'open', 'investigating', 'resolved')
- `created_at` (Timestamp)
- `referral_id` (Foreign Key → Referrals.id, nullable)

## 8. Notifications (Future‑proof)

### Notifications
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key → Users.id)
- `type` (Enum: 'referral_new', 'referral_accepted', 'verification_approved', 'complaint_filed', etc.)
- `message` (Text)
- `is_read` (Boolean, Default: false)
- `created_at` (Timestamp)