export function getSessionFromRequest(request) {
  return {
    userId: request.cookies?.get('cc_user_id')?.value || '',
    role: request.cookies?.get('cc_role')?.value || '',
    status: request.cookies?.get('cc_status')?.value || '',
  };
}

export function requireSession(request, allowedRoles = []) {
  const session = getSessionFromRequest(request);

  if (!session.userId) {
    return {
      ok: false,
      session,
      response: Response.json({ error: 'Authentication required.' }, { status: 401 }),
    };
  }

  if (session.status && session.status !== 'approved' && session.role !== 'patient') {
    return {
      ok: false,
      session,
      response: Response.json({ error: 'Account is not approved for this action.' }, { status: 403 }),
    };
  }

  if (allowedRoles.length && !allowedRoles.includes(session.role)) {
    return {
      ok: false,
      session,
      response: Response.json({ error: 'You are not allowed to access this resource.' }, { status: 403 }),
    };
  }

  return { ok: true, session };
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch (_) {
    return {};
  }
}

export function routeError(error, status = 400) {
  return Response.json({ error: error?.message || 'Request failed.' }, { status });
}
