import { mockPatients, mockDietitians, mockChefs, mockReferrals, mockComplaints } from '../../../../lib/mockData'

export async function GET(request) {
  const totalUsers = mockPatients.length + mockDietitians.length + mockChefs.length
  const pendingVerifications = mockDietitians.filter(d => d.status === 'pending').length + mockChefs.filter(c => c.status === 'pending').length
  const activeReferrals = mockReferrals.length
  const openComplaints = mockComplaints.filter(c => c.status === 'Open').length

  return Response.json({
    totalUsers,
    pendingVerifications,
    activeReferrals,
    openComplaints,
  })
}