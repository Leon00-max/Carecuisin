import { getLatestMealPlanForPatient, getMealPlanById } from '@/lib/mealPlanStore';
import { requireSession } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'dietitian', 'chef', 'admin']);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const patientId = searchParams.get('patientId') || auth.session.userId;

  if (id) {
    const mealPlan = getMealPlanById(id);
    if (!mealPlan) return Response.json({ error: 'Meal plan not found.' }, { status: 404 });
    return Response.json({ mealPlan });
  }

  if (auth.session.role === 'patient' && patientId !== auth.session.userId) {
    return Response.json({ error: 'Not allowed.' }, { status: 403 });
  }

  return Response.json({ mealPlan: getLatestMealPlanForPatient(patientId) });
}
