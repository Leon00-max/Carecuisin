export const platformMetrics = [
  { label: 'Total Users', value: '1,248', change: '+18', tone: 'success' },
  { label: 'Dietitians', value: '156', change: '+5', tone: 'success' },
  { label: 'Chefs', value: '89', change: '+3', tone: 'success' },
  { label: 'Complaints', value: '32', change: '-2', tone: 'alert' },
];

export const quickActions = [
  { label: 'Verify Professionals', href: '/admin/verify-users', tone: 'primary' },
  { label: 'Manage Users', href: '/admin/users', tone: 'success' },
  { label: 'View Complaints', href: '/admin/complaints', tone: 'alert' },
  { label: 'System Stats', href: '/admin/systemst-status', tone: 'primary' },
];

export const recentActivity = [
  {
    title: 'Chef Kwame applied',
    detail: 'Pending verification',
    time: '10:30 AM',
    tone: 'warning',
    initials: 'CK',
  },
  {
    title: 'Dr. Ambe Florence approved',
    detail: 'Dietitian verified',
    time: '9:45 AM',
    tone: 'success',
    initials: 'AF',
  },
  {
    title: 'New complaint received',
    detail: 'Pending review',
    time: '8:15 AM',
    tone: 'alert',
    initials: 'NC',
  },
  {
    title: 'Referral accepted',
    detail: 'Chef Grace accepted Amara plan',
    time: 'Yesterday',
    tone: 'primary',
    initials: 'RG',
  },
];

export const demoVerificationApplications = [
  {
    id: 'VER-D-001',
    role: 'dietitian',
    fullName: 'Dr. Ambe Florence',
    email: 'ambe.florence@carecuisin.com',
    phone: '+237 6XX XXX XXX',
    createdAt: '2026-05-12T08:00:00.000Z',
    verification_status: 'pending',
    profile: {
      qualification: 'BSc Nutrition & Dietetics',
      workplace: 'Buea Regional Hospital',
      licenseNumber: 'RDC/MNR/2024/056',
      yearsOfExperience: '6',
      serviceArea: 'Buea, Fako',
      specialties: 'Diabetes, Hypertension, Kidney Disease',
      documents: 'License, national ID, qualification certificate',
    },
  },
  {
    id: 'VER-C-001',
    role: 'chef',
    fullName: 'Chef Kwame',
    email: 'kwame.kitchen@carecuisin.com',
    phone: '+237 6XX XXX XXX',
    createdAt: '2026-05-12T09:15:00.000Z',
    verification_status: 'pending',
    profile: {
      establishmentName: "Kwame's Healthy Kitchen",
      establishmentLocation: 'Buea Town, Fako',
      yearsExperience: '5',
      workEnvironment: 'Certified private kitchen',
      hygieneCertificate: 'Municipal hygiene clearance uploaded',
      foodSafety: 'Low-sodium and diabetes-friendly preparation',
      documents: 'Kitchen license, hygiene certificate, food safety record',
    },
  },
  {
    id: 'VER-D-002',
    role: 'dietitian',
    fullName: 'Dr. Linda Ngozi',
    email: 'linda.ngozi@carecuisin.com',
    phone: '+237 6XX XXX XXX',
    createdAt: '2026-05-11T14:00:00.000Z',
    verification_status: 'pending',
    profile: {
      qualification: 'MSc Clinical Nutrition',
      workplace: 'Mount Mary Health Center',
      licenseNumber: 'RDC/MNR/2023/118',
      yearsOfExperience: '8',
      serviceArea: 'Molyko, Buea',
      specialties: 'PCOS, Obesity, Diabetes',
      documents: 'License, workplace letter, degree certificate',
    },
  },
];

export const adminUsers = [
  {
    id: 'PAT-001',
    name: 'Amara Nkeng',
    role: 'Patient',
    status: 'Active',
    date: 'May 12, 2026',
    condition: 'Diabetes + Hypertension',
    detail: 'Week 3 of 8 plan, Dr. Ambe Florence, Chef Kwame',
  },
  {
    id: 'PAT-002',
    name: 'John Atem',
    role: 'Patient',
    status: 'Active',
    date: 'May 12, 2026',
    condition: 'Hypertension',
    detail: 'Week 2 of 8 plan, plan review due',
  },
  {
    id: 'DIE-001',
    name: 'Dr. Ambe Florence',
    role: 'Dietitian',
    status: 'Verified',
    date: 'May 11, 2026',
    condition: 'Clinical nutrition',
    detail: '8 patients assigned, 24 plans created, 12 referrals sent',
  },
  {
    id: 'CHF-001',
    name: 'Chef Grace Moki',
    role: 'Chef',
    status: 'Verified',
    date: 'May 11, 2026',
    condition: 'Verified kitchen',
    detail: '42 orders completed, 98% reliability',
  },
  {
    id: 'PAT-003',
    name: 'Linda Ekema',
    role: 'Patient',
    status: 'Active',
    date: 'May 10, 2026',
    condition: 'PCOS + Weight Management',
    detail: 'Active plan, water target monitoring',
  },
  {
    id: 'CHF-002',
    name: 'Chef Martin Talla',
    role: 'Chef',
    status: 'Verified',
    date: 'May 10, 2026',
    condition: 'Low sodium meals',
    detail: '21 referrals accepted, 4.7 rating',
  },
];

export const complaints = [
  {
    id: 'CMP-2026-0512',
    priority: 'High',
    name: 'Amara Nkeng',
    role: 'Patient',
    summary: 'Food was delivered late and was cold.',
    description: 'The lunch delivery arrived 48 minutes late. Patient reported the meal was cold and requested review before tomorrow.',
    date: 'May 12, 2026 - 10:30 AM',
    status: 'Open',
    chef: 'Chef Kwame',
    orderId: '#ORD-250518',
    assignedAdmin: 'Admin User',
  },
  {
    id: 'CMP-2026-0511',
    priority: 'Medium',
    name: 'John Atem',
    role: 'Patient',
    summary: "Portion size does not match plan.",
    description: 'Patient says the evening meal portion appeared smaller than the dietitian-approved plan.',
    date: 'May 11, 2026 - 2:15 PM',
    status: 'In Progress',
    chef: 'Chef Martin Talla',
    orderId: '#ORD-250411',
    assignedAdmin: 'Support Admin',
  },
  {
    id: 'CMP-2026-0510',
    priority: 'Low',
    name: 'Linda Ekema',
    role: 'Patient',
    summary: 'Question about tomorrow meal plan.',
    description: 'Patient asked whether the next breakfast can be moved one hour later.',
    date: 'May 10, 2026 - 9:45 AM',
    status: 'Resolved',
    chef: 'Chef Grace Moki',
    orderId: '#ORD-249990',
    assignedAdmin: 'Admin User',
  },
];

export const complaintTimeline = [
  { title: 'Complaint created', time: '10:30 AM', detail: 'Patient submitted case from mobile portal.' },
  { title: 'Case reviewed', time: '10:45 AM', detail: 'Admin verified order and delivery history.' },
  { title: 'Chef contacted', time: '11:05 AM', detail: 'Kitchen asked to explain delay and meal temperature.' },
  { title: 'Resolution pending', time: 'Now', detail: 'Awaiting admin decision and patient follow-up note.' },
];

export const operationCards = [
  { label: 'Pending Verifications', value: '13', detail: '5 dietitians, 8 chefs', tone: 'warning' },
  { label: 'Open Complaints', value: '12', detail: '3 high priority', tone: 'alert' },
  { label: 'Overdue Meals', value: '4', detail: 'Dispatch needs review', tone: 'warning' },
  { label: 'Delayed Referrals', value: '6', detail: 'Chef response over SLA', tone: 'primary' },
  { label: 'Support Messages', value: '9', detail: 'Unresolved conversations', tone: 'primary' },
];

export const patientTimeline = [
  { title: 'Consultation completed', detail: 'Dr. Ambe Florence reviewed Amara Nkeng.', time: 'Mon, 9:00 AM', tone: 'success' },
  { title: 'Meal plan published', detail: 'Week 3 diabetic and low sodium plan active.', time: 'Mon, 11:20 AM', tone: 'primary' },
  { title: 'Chef assigned', detail: 'Chef Kwame accepted preparation instructions.', time: 'Mon, 1:10 PM', tone: 'success' },
  { title: 'Meal delayed', detail: 'Lunch delivery exceeded the service window.', time: 'Today, 12:48 PM', tone: 'warning' },
  { title: 'Complaint opened', detail: 'Patient reported cold delivery for order #ORD-250518.', time: 'Today, 1:05 PM', tone: 'alert' },
];

export const analyticsStats = [
  { label: 'Total Referrals', value: '156', change: '+12%', tone: 'success' },
  { label: 'Accepted', value: '98', change: '+15%', tone: 'success' },
  { label: 'Declined', value: '35', change: '-5%', tone: 'alert' },
  { label: 'Completed', value: '23', change: '+10%', tone: 'success' },
];

export const referralTrendPoints = [22, 35, 48, 39, 51, 42, 45];

export const topDietitians = [
  { name: 'Dr. Ambe Florence', referrals: 24, growth: '+12' },
  { name: 'Dr. Linda Ngozi', referrals: 18, growth: '+8' },
  { name: 'Dr. Martin Eyong', referrals: 15, growth: '+5' },
];

export const topAreas = [
  { name: 'Molyko', users: 542, pct: 100 },
  { name: 'Bokwango', users: 321, pct: 59 },
  { name: 'Great Soppo', users: 210, pct: 39 },
  { name: 'Buea Town', users: 175, pct: 32 },
];

export const platformHealth = [
  { label: 'Active Users', value: '864', change: '+14%', tone: 'success' },
  { label: 'Meal Plans Created', value: '342', change: '+9%', tone: 'success' },
  { label: 'Meals Delivered', value: '289', change: '+11%', tone: 'success' },
  { label: 'Complaints', value: '32', change: '-2%', tone: 'alert' },
];

export const auditLogs = [
  { admin: 'Admin User', action: 'Approved Chef Kwame', type: 'Verification', date: 'May 25, 2026', time: '09:42 AM', target: 'Chef Kwame' },
  { admin: 'Admin User', action: 'Resolved complaint CMP-2026-0512', type: 'Complaint', date: 'May 25, 2026', time: '09:10 AM', target: 'Amara Nkeng' },
  { admin: 'Verification Admin', action: 'Requested more information', type: 'Verification', date: 'May 24, 2026', time: '4:18 PM', target: 'Dr. Linda Ngozi' },
  { admin: 'Operations Admin', action: 'Suspended user account', type: 'User', date: 'May 24, 2026', time: '2:02 PM', target: 'USR-2091' },
];

export const exportReports = [
  { name: 'Users Report', detail: 'Patients, professionals, admins', format: 'CSV or PDF' },
  { name: 'Referrals Report', detail: 'Accepted, pending, declined referrals', format: 'CSV or PDF' },
  { name: 'Complaints Report', detail: 'Case status and resolution notes', format: 'CSV or PDF' },
  { name: 'Meal Plan Statistics', detail: 'Plan creation and adherence summaries', format: 'CSV or PDF' },
];

export const adminNotifications = [
  { title: 'New professional application', detail: 'Chef Kwame submitted hygiene documents.', time: '8 min ago', tone: 'warning' },
  { title: 'Urgent patient issue', detail: 'High-priority complaint from Amara Nkeng.', time: '22 min ago', tone: 'alert' },
  { title: 'Referral declined', detail: 'Chef Martin declined a low-sodium plan.', time: '1 hr ago', tone: 'warning' },
  { title: 'Document update approved', detail: 'Dr. Ambe Florence license update verified.', time: 'Yesterday', tone: 'success' },
];

export const adminRoles = [
  { name: 'Admin User', role: 'Super Admin', access: 'All platform controls', status: 'Active' },
  { name: 'Mercy Tabi', role: 'Verification Admin', access: 'Applications and document review', status: 'Active' },
  { name: 'Paul Nji', role: 'Support Admin', access: 'Complaints and patient support', status: 'Active' },
  { name: 'Clara Ebai', role: 'Operations Admin', access: 'Meal operations and dispatch review', status: 'Active' },
];
