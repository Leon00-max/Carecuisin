/**
 * src/lib/mockData.js
 *
 * Mock data fallback definitions for the mock API endpoints.
 */

export const mockPatients = [
  { id: 'PAT-001', name: 'Fru Emmanuel', status: 'approved' },
  { id: 'PAT-002', name: 'Ngo Beatrice', status: 'approved' }
];

export const mockDietitians = [
  { id: 'USR-DEMO-D1', fullName: 'Dr. Catherine Stone', status: 'approved', licenseNumber: 'RD-92840-A' },
  { id: 'USR-DEMO-D2', fullName: 'Dietitian Clara', status: 'pending', licenseNumber: 'RD-11234-B' }
];

export const mockChefs = [
  { id: 'USR-DEMO-C1', fullName: 'Chef Gordon', status: 'approved' },
  { id: 'USR-DEMO-C2', fullName: 'Chef Jamie', status: 'pending' }
];

export const mockReferrals = [];

export const mockComplaints = [];

export const mockMealPlans = [];
