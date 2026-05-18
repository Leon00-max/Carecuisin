import { mockDietitians, mockChefs } from '../../../../lib/mockData'

export async function GET(request) {
  const pendingUsers = [
    ...mockDietitians.filter(d => d.status === 'pending').map(d => ({ ...d, type: 'Dietitian' })),
    ...mockChefs.filter(c => c.status === 'pending').map(c => ({ ...c, type: 'Chef' }))
  ]
  return Response.json(pendingUsers)
}

export async function PATCH(request) {
  const { userId, action } = await request.json()
  // Mock approval/rejection
  console.log(`${action === 'approve' ? 'Approved' : 'Rejected'} user ${userId}`)
  return Response.json({ success: true, message: `User ${action}ed successfully` })
}