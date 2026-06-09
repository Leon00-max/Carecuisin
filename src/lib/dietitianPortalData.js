export const DIETITIAN_MEAL_IMAGE = '/hero-meal-placeholder.jpg';

export const DIETITIAN_STATS = [
  { label: 'Active Patients', value: 8, tone: 'primary' },
  { label: 'Plans Today', value: 5, tone: 'warning' },
  { label: 'Follow-ups', value: 3, tone: 'success' },
  { label: 'Referrals', value: 2, tone: 'surface' },
];

export const DIETITIAN_PATIENTS = [
  {
    id: 'PAT-8724',
    name: 'Amara Nkeng',
    sex: 'Female',
    age: 45,
    condition: 'Diabetes + Hypertension',
    location: 'Buea, Fako',
    status: 'Active Plan',
    week: 'Week 3 of 8',
    progress: 71,
    adherence: 'Good',
  },
  {
    id: 'PAT-4418',
    name: 'John Atem',
    sex: 'Male',
    age: 52,
    condition: 'Hypertension',
    location: 'Molyko, Buea',
    status: 'Active Plan',
    week: 'Week 2 of 8',
    progress: 25,
    adherence: 'Stable',
  },
  {
    id: 'PAT-1045',
    name: 'Grace Moki',
    sex: 'Female',
    age: 60,
    condition: 'Diabetes + Obesity',
    location: 'Buea Town',
    status: 'Active Plan',
    week: 'Week 1 of 8',
    progress: 12,
    adherence: 'Review',
  },
  {
    id: 'PAT-3189',
    name: 'Martin Talla',
    sex: 'Male',
    age: 48,
    condition: 'Hypertension',
    location: 'Bonduma, Buea',
    status: 'Active Plan',
    week: 'Week 4 of 8',
    progress: 50,
    adherence: 'Good',
  },
  {
    id: 'PAT-2208',
    name: 'Linda Ekema',
    sex: 'Female',
    age: 35,
    condition: 'PCOS + Weight Management',
    location: 'Great Soppo',
    status: 'Pending Review',
    week: 'Draft Plan',
    progress: 0,
    adherence: 'Pending',
  },
  {
    id: 'PAT-5711',
    name: 'Emmanuel B.',
    sex: 'Male',
    age: 57,
    condition: 'Kidney Disease',
    location: 'Muea',
    status: 'Completed',
    week: 'Completed',
    progress: 100,
    adherence: 'Complete',
  },
];

export const CONSULTATIONS = [
  { time: '10:00 AM', patient: 'Amara Nkeng', type: 'Follow-up', action: 'Video' },
  { time: '11:30 AM', patient: 'John Atem', type: 'Plan Review', action: 'View' },
  { time: '2:00 PM', patient: 'Grace Moki', type: 'Consultation', action: 'Video' },
];

export const DASHBOARD_TASKS = [
  { label: 'Review pending plans', detail: '3 plans', count: 3 },
  { label: 'Follow up with patients', detail: '5 patients', count: 5 },
];

export const MEAL_PLAN_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DIETITIAN_MEALS = [
  {
    type: 'Breakfast',
    name: 'Oatmeal with Banana & Groundnuts',
    calories: 360,
    carbs: '42g',
    protein: '14g',
    fat: '10g',
    fiber: '8g',
    sodium: 'Low',
    guidance: 'Use unsweetened oats and measured groundnuts.',
  },
  {
    type: 'Lunch',
    name: 'Grilled Fish with Plantains & Vegetables',
    calories: 490,
    carbs: '52g',
    protein: '34g',
    fat: '14g',
    fiber: '9g',
    sodium: 'Low',
    guidance: 'Grill fish. Steam vegetables. No frying.',
  },
  {
    type: 'Dinner',
    name: 'Eru with Pounded Yam & Chicken',
    calories: 520,
    carbs: '58g',
    protein: '32g',
    fat: '18g',
    fiber: '6g',
    sodium: 'Reduced',
    guidance: 'Use less oil and salt. Keep portion measured.',
  },
  {
    type: 'Snack',
    name: 'Greek Yogurt with Fruits & Chia Seeds',
    calories: 180,
    carbs: '22g',
    protein: '12g',
    fat: '5g',
    fiber: '6g',
    sodium: 'Low',
    guidance: 'Serve plain yogurt with unsweetened fruit.',
  },
];

export const CLINICAL_PRIVATE_NOTE = 'Aim: blood sugar control and BP stability. Low glycemic index foods. Reduce salt. Encourage hydration.';

export const DIETITIAN_CHEFS = [
  {
    id: 'CHEF-KWAME',
    name: 'Chef Kwame',
    kitchen: 'Healthy Kitchen',
    location: 'Buea Town',
    specialty: 'Diabetic-friendly + Low Sodium',
    rating: 4.8,
    reviews: 128,
    delivered: 24,
    status: 'Available',
  },
  {
    id: 'CHEF-LINDA',
    name: 'Chef Linda Ekema',
    kitchen: 'Renal Friendly Kitchen',
    location: 'Buea, Fako',
    specialty: 'Kidney-friendly meals',
    rating: 4.7,
    reviews: 96,
    delivered: 18,
    status: 'Available',
  },
  {
    id: 'CHEF-MARTIN',
    name: 'Chef Martin Talla',
    kitchen: 'Low Sodium Kitchen',
    location: 'Molyko',
    specialty: 'Hypertension + DASH-style meals',
    rating: 4.6,
    reviews: 74,
    delivered: 16,
    status: 'Busy',
  },
  {
    id: 'CHEF-GRACE',
    name: 'Chef Grace Moki',
    kitchen: 'Balanced Meals',
    location: 'Buea Town',
    specialty: 'Balanced clinical meals',
    rating: 4.5,
    reviews: 63,
    delivered: 12,
    status: 'Available',
  },
];

export const DIETITIAN_MESSAGES = [
  { type: 'Patients', name: 'Amara Nkeng', preview: 'Thank you! The meals have been helpful.', time: '10:30 AM', unread: 2 },
  { type: 'Chefs', name: 'Chef Kwame', preview: 'Referral accepted for Amara Nkeng.', time: '9:15 AM', unread: 1 },
  { type: 'Patients', name: 'John Atem', preview: 'Can we reschedule tomorrow?', time: 'Yesterday', unread: 0 },
  { type: 'Patients', name: 'Grace Moki', preview: 'Meal plan update looks good.', time: 'Yesterday', unread: 0 },
  { type: 'Admin', name: 'Admin Team', preview: 'Your document has been verified.', time: 'May 10', unread: 0 },
  { type: 'Chefs', name: 'Chef Maria', preview: 'New menu available this week.', time: 'May 9', unread: 0 },
];

export const DIETITIAN_REFERRALS = [
  { id: 'REF-1001', patient: 'Amara Nkeng', meal: 'Eru with Pounded Yam & Chicken', chef: 'Chef Kwame', date: 'Today', status: 'Accepted' },
  { id: 'REF-1002', patient: 'John Atem', meal: 'Grilled Fish with Plantains', chef: 'Chef Martin Talla', date: 'Yesterday', status: 'Pending' },
  { id: 'REF-1003', patient: 'Grace Moki', meal: 'Achu Soup with Wheat', chef: 'Chef Linda Ekema', date: 'May 10', status: 'Declined' },
  { id: 'REF-1004', patient: 'Martin Talla', meal: 'Beans Porridge', chef: 'Chef Grace Moki', date: 'May 9', status: 'Accepted' },
];

export const DIETITIAN_NOTIFICATIONS = [
  { title: 'Patient completed today\'s meal', body: 'Amara Nkeng marked lunch complete.', time: '8 min ago', category: 'Patient' },
  { title: 'Chef accepted referral', body: 'Chef Kwame accepted the Amara Nkeng referral.', time: '24 min ago', category: 'Chef' },
  { title: 'Plan review due tomorrow', body: 'John Atem has a plan review scheduled tomorrow.', time: '1 hr ago', category: 'Plan' },
  { title: 'Admin approved your updated document', body: 'Your license document has been verified.', time: 'Yesterday', category: 'Admin' },
];

export function statusTone(status) {
  if (status === 'Active Plan' || status === 'Accepted' || status === 'Completed') {
    return 'border-success/20 bg-success/10 text-success';
  }
  if (status === 'Pending Review' || status === 'Pending' || status === 'Draft') {
    return 'border-warning/20 bg-warning/10 text-warning';
  }
  if (status === 'Declined') {
    return 'border-alert/20 bg-alert/10 text-alert';
  }
  return 'border-primary-100 bg-primary-50 text-primary-700';
}
