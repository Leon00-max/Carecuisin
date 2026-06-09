import { byNewest, createId, insertRecord, readCollection, updateRecord } from './localDb';
import { createNotification } from './notificationStore';

export const CONVERSATIONS_KEY = 'cc_conversations';
export const MESSAGES_KEY = 'cc_messages';

export function getConversationsForUser(userId) {
  return byNewest(readCollection(CONVERSATIONS_KEY).filter(item => item.participantIds?.includes(userId)));
}

export function getConversationById(id) {
  return readCollection(CONVERSATIONS_KEY).find(item => item.id === id) || null;
}

export function findOrCreateConversation({ participantIds, title = '', relatedType = '', relatedId = '' }) {
  const cleanIds = [...new Set((participantIds || []).filter(Boolean))].sort();
  if (cleanIds.length < 2) throw new Error('A conversation needs at least two participants.');

  const conversations = readCollection(CONVERSATIONS_KEY);
  const existing = conversations.find(item =>
    item.relatedType === relatedType &&
    item.relatedId === relatedId &&
    [...(item.participantIds || [])].sort().join('|') === cleanIds.join('|')
  );

  if (existing) return existing;

  return insertRecord(CONVERSATIONS_KEY, {
    id: createId('CNV'),
    participantIds: cleanIds,
    title,
    relatedType,
    relatedId,
    lastMessage: '',
    lastMessageAt: '',
  });
}

export function getMessagesForConversation(conversationId) {
  return readCollection(MESSAGES_KEY)
    .filter(item => item.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
}

export function sendMessage({ conversationId, senderId, body, attachments = [] }) {
  const conversation = getConversationById(conversationId);
  if (!conversation) throw new Error('Conversation not found.');
  if (!conversation.participantIds?.includes(senderId)) throw new Error('Sender is not part of this conversation.');
  if (!body?.trim() && attachments.length === 0) throw new Error('Message cannot be empty.');

  const message = insertRecord(MESSAGES_KEY, {
    id: createId('MSG'),
    conversationId,
    senderId,
    body: body.trim(),
    attachments,
    readBy: [senderId],
  });

  updateRecord(CONVERSATIONS_KEY, conversationId, {
    lastMessage: message.body,
    lastMessageAt: message.createdAt,
  });

  conversation.participantIds
    .filter(id => id !== senderId)
    .forEach(userId => createNotification({
      userId,
      title: 'New secure message',
      message: message.body.slice(0, 80),
      type: 'message',
      relatedType: 'conversation',
      relatedId: conversationId,
    }));

  return message;
}
