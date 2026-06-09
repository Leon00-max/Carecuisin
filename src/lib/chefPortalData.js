export const CHEF_MEAL_IMAGE = '/hero-meal-placeholder.jpg';

export const CHEF_OVERVIEW = [
  { label: 'Active Orders', value: 8, tone: 'primary' },
  { label: 'Preparing', value: 3, tone: 'warning' },
  { label: 'Ready', value: 2, tone: 'success' },
  { label: 'Completed', value: 1, tone: 'surface' },
];

export const CHEF_ORDERS = [
  {
    id: 'ORD-250518',
    patientName: 'Amara Nkeng',
    patientRef: 'P-8724',
    sex: 'Female',
    age: 45,
    condition: 'Diabetes & Hypertension',
    meal: 'Eru with Pounded Yam & Chicken',
    description: 'Low glycemic meal prepared with reduced oil and salt.',
    calories: 520,
    due: '11:30 AM',
    dueLabel: 'Due in 45 mins',
    status: 'preparing',
    stage: 2,
    totalStages: 4,
    macros: { carbs: '58g', protein: '32g', fat: '18g', fiber: '6g' },
    note: 'Low glycemic meal for blood sugar control. Use less oil and salt. Steam vegetables thoroughly. No frying.',
    instructions: [
      'Use palm oil in small quantity',
      'Steam vegetables thoroughly',
      'Avoid added sugar or salt',
    ],
  },
  {
    id: 'ORD-250519',
    patientName: 'John Atem',
    patientRef: 'P-4418',
    sex: 'Male',
    age: 52,
    condition: 'Hypertension',
    meal: 'Grilled Fish with Plantains',
    description: 'Lean grilled fish with controlled plantain portion.',
    calories: 480,
    due: '12:00 PM',
    dueLabel: 'Due in 1 hr',
    status: 'preparing',
    stage: 2,
    totalStages: 4,
    macros: { carbs: '45g', protein: '36g', fat: '14g', fiber: '7g' },
    note: 'Keep sodium low. Grill instead of frying. Serve vegetables steamed and lightly seasoned.',
    instructions: [
      'No extra salt',
      'Grill fish with minimal oil',
      'Pack plantain portion separately',
    ],
  },
  {
    id: 'ORD-250520',
    patientName: 'Grace Moki',
    patientRef: 'P-1045',
    sex: 'Female',
    age: 60,
    condition: 'Kidney Disease',
    meal: 'Achu Soup with Wheat',
    description: 'Measured portion with dietitian-approved seasoning.',
    calories: 450,
    due: '10:45 AM',
    dueLabel: 'Ready for pickup',
    status: 'ready',
    stage: 4,
    totalStages: 4,
    macros: { carbs: '52g', protein: '24g', fat: '15g', fiber: '8g' },
    note: 'Keep seasoning mild. Follow the approved portion exactly.',
    instructions: [
      'Confirm portion weight',
      'Use mild seasoning only',
      'Seal with verified kitchen label',
    ],
  },
  {
    id: 'ORD-250521',
    patientName: 'Martin Talla',
    patientRef: 'P-3189',
    sex: 'Male',
    age: 48,
    condition: 'Weight Management',
    meal: 'Beans Porridge with Plantains',
    description: 'Fiber-forward meal with plantain portion control.',
    calories: 460,
    due: '12:30 PM',
    dueLabel: 'Due in 1 hr 30 mins',
    status: 'preparing',
    stage: 1,
    totalStages: 4,
    macros: { carbs: '50g', protein: '22g', fat: '12g', fiber: '11g' },
    note: 'Keep oil low and avoid sweetened additives.',
    instructions: [
      'Measure beans portion',
      'Use low oil',
      'No added sugar',
    ],
  },
];

export const CHEF_PATIENTS = [
  {
    id: 'P-8724',
    name: 'Amara Nkeng',
    sex: 'Female',
    age: 45,
    category: 'Diabetes & Hypertension',
    status: 'Active Plan',
  },
  {
    id: 'P-4418',
    name: 'John Atem',
    sex: 'Male',
    age: 52,
    category: 'Hypertension',
    status: 'Active Plan',
  },
  {
    id: 'P-1045',
    name: 'Grace Moki',
    sex: 'Female',
    age: 60,
    category: 'Kidney Disease',
    status: 'Review Plan',
  },
  {
    id: 'P-3189',
    name: 'Martin Talla',
    sex: 'Male',
    age: 48,
    category: 'Weight Management',
    status: 'Active Plan',
  },
  {
    id: 'P-2208',
    name: 'Linda Ekema',
    sex: 'Female',
    age: 35,
    category: 'PCOS',
    status: 'Active Plan',
  },
];

export const CHEF_HISTORY = [
  { meal: 'Grilled Fish', description: 'with Plantains & Vegetables', date: 'May 12, 10:30 AM', calories: 480, status: 'delivered' },
  { meal: 'Achu Soup', description: 'with Wheat', date: 'May 11, 6:45 PM', calories: 450, status: 'delivered' },
  { meal: 'Fufu Kati Kati', description: 'with Light Soup', date: 'May 11, 1:20 PM', calories: 500, status: 'delivered' },
  { meal: 'Beans Porridge', description: 'with Plantains', date: 'May 10, 11:00 AM', calories: 460, status: 'ready' },
  { meal: 'Eru with Pounded Yam', description: '& Chicken', date: 'May 10, 9:30 AM', calories: 0, status: 'cancelled' },
];

export const CHEF_NOTIFICATIONS = [
  { title: 'New referral received', body: 'Dr. Ambe assigned a diabetes-safe lunch order.', time: '5 min ago', category: 'Referral' },
  { title: 'Meal due in 30 minutes', body: 'Eru with Pounded Yam & Chicken is approaching its preparation deadline.', time: '20 min ago', category: 'Deadline' },
  { title: 'Dietitian updated instructions', body: 'Use less oil and keep vegetables steamed for order ORD-250518.', time: '42 min ago', category: 'Instruction' },
  { title: 'Patient meal marked delivered', body: 'Grilled Fish was delivered and logged in the care timeline.', time: 'Today, 10:30 AM', category: 'Delivery' },
];

export const CHEF_TRANSACTIONS = [
  { label: 'Eru with Pounded Yam & Chicken', date: 'Today', amount: '4,500 XAF', status: 'Pending' },
  { label: 'Grilled Fish with Plantains', date: 'May 12', amount: '4,200 XAF', status: 'Paid' },
  { label: 'Achu Soup with Wheat', date: 'May 11', amount: '3,800 XAF', status: 'Paid' },
  { label: 'Beans Porridge', date: 'May 10', amount: '3,500 XAF', status: 'Paid' },
];

export function orderStatusMeta(status) {
  if (status === 'ready') {
    return {
      label: 'Ready',
      className: 'border-success/20 bg-success/10 text-success',
      dot: 'bg-success',
    };
  }
  if (status === 'delivered') {
    return {
      label: 'Delivered',
      className: 'border-success/20 bg-success/10 text-success',
      dot: 'bg-success',
    };
  }
  if (status === 'cancelled') {
    return {
      label: 'Cancelled',
      className: 'border-alert/20 bg-alert/10 text-alert',
      dot: 'bg-alert',
    };
  }
  return {
    label: 'Preparing',
    className: 'border-warning/20 bg-warning/10 text-warning',
    dot: 'bg-warning',
  };
}
