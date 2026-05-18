import { mockReferrals } from '../../../lib/mockData'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')
  // mock
  return Response.json(mockReferrals)
}

export async function POST(request) {
  const data = await request.json()
  // mock
  return Response.json({ success: true, referral: { id: Date.now(), ...data } })
}