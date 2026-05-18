import { mockMealPlans } from '../../../lib/mockData'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') || 'patient'
  // mock logic
  return Response.json(mockMealPlans)
}

export async function POST(request) {
  const data = await request.json()
  // mock create
  return Response.json({ success: true, plan: { id: Date.now(), ...data } })
}