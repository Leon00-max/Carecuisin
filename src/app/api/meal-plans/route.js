import {
  getAllMealPlans,
  getMealPlansForDietitian,
  getMealPlansForPatient,
  saveMealPlan,
} from '@/lib/mealPlanStore';
import { recordAuditLog } from '@/lib/auditLogStore';
import { createNotification } from '@/lib/notificationStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'dietitian', 'chef', 'admin']);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  if (auth.session.role === 'admin') return Response.json({ mealPlans: getAllMealPlans() });
  if (auth.session.role === 'dietitian') return Response.json({ mealPlans: getMealPlansForDietitian(auth.session.userId) });
  if (auth.session.role === 'patient') return Response.json({ mealPlans: getMealPlansForPatient(auth.session.userId) });

  const patientId = searchParams.get('patientId');
  return Response.json({ mealPlans: patientId ? getMealPlansForPatient(patientId) : [] });
}

export async function POST(request) {
  const auth = requireSession(request, ['dietitian']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const mealPlan = saveMealPlan({
      ...payload,
      dietitianId: auth.session.userId,
      status: payload.status || 'draft',
    });

    if (mealPlan.patientId && mealPlan.status !== 'draft') {
      createNotification({
        userId: mealPlan.patientId,
        title: 'Meal plan created',
        message: 'Your dietitian has published a CareCuisin meal plan.',
        type: 'meal_plan',
        relatedType: 'meal_plan',
        relatedId: mealPlan.id,
      });
    }

    recordAuditLog({
      actorId: auth.session.userId,
      action: 'meal_plan_saved',
      module: 'meal_plans',
      recordId: mealPlan.id,
      affectedUserId: mealPlan.patientId,
      details: mealPlan.title,
    });

    return Response.json({ mealPlan }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
