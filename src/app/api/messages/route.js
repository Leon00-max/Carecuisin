import {
  findOrCreateConversation,
  getConversationsForUser,
  getMessagesForConversation,
  sendMessage,
} from '@/lib/messageStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'dietitian', 'chef', 'admin']);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');
  if (conversationId) {
    return Response.json({ messages: getMessagesForConversation(conversationId) });
  }

  return Response.json({ conversations: getConversationsForUser(auth.session.userId) });
}

export async function POST(request) {
  const auth = requireSession(request, ['patient', 'dietitian', 'chef', 'admin']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    let conversationId = payload.conversationId;
    if (!conversationId) {
      const conversation = findOrCreateConversation({
        participantIds: [auth.session.userId, ...(payload.participantIds || [])],
        title: payload.title || '',
        relatedType: payload.relatedType || '',
        relatedId: payload.relatedId || '',
      });
      conversationId = conversation.id;
    }

    const message = sendMessage({
      conversationId,
      senderId: auth.session.userId,
      body: payload.body || '',
      attachments: payload.attachments || [],
    });
    return Response.json({ message }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
