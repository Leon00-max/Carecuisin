import { getComplaints } from '@/lib/complaintStore';
import { getConsultations } from '@/lib/consultationStore';
import { getAllMealPlans } from '@/lib/mealPlanStore';
import { getOrders } from '@/lib/orderStore';
import { getPayments } from '@/lib/paymentStore';
import { getReferrals } from '@/lib/referralStore';
import { requireSession } from '@/lib/apiAuth';
import { getUsers } from '@/lib/userStore';

export async function GET(request) {
  const auth = requireSession(request, ['admin']);
  if (!auth.ok) return auth.response;

  const users = getUsers();
  const payments = getPayments();
  const successfulPayments = payments.filter(payment => payment.status === 'successful');

  return Response.json({
    totalUsers: users.length,
    patients: users.filter(user => user.role === 'patient').length,
    dietitians: users.filter(user => user.role === 'dietitian').length,
    chefs: users.filter(user => user.role === 'chef').length,
    pendingVerifications: users.filter(user =>
      ['dietitian', 'chef'].includes(user.role) && user.verification_status === 'pending'
    ).length,
    activeReferrals: getReferrals().filter(referral => ['pending', 'accepted', 'prepared'].includes(referral.status)).length,
    consultations: getConsultations().length,
    mealPlans: getAllMealPlans().length,
    orders: getOrders().length,
    openComplaints: getComplaints().filter(complaint => ['open', 'in_review'].includes(complaint.status)).length,
    paymentRevenue: successfulPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    successfulPayments: successfulPayments.length,
    pendingPayments: payments.filter(payment => payment.status === 'pending').length,
  });
}
