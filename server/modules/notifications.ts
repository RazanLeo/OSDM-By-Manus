/**
 * OSDM Core UI backend — الإشعارات والمحادثات العامة
 *
 * - notificationsRouter: قائمة إشعارات المستخدم + عدد غير المقروء + تحديد كمقروء (فردي/الكل)
 * - conversationsRouter: قائمة محادثات المستخدم (مع اسم الطرف الآخر وآخر رسالة وعدد غير المقروء)
 *   + رسائل محادثة + إرسال رسالة + بدء محادثة مع مستخدم
 *
 * Reuses the existing db helpers (getUserConversations / getConversationMessages /
 * sendMessage / getOrCreateConversation) and the shared drizzle schema.
 */
import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getDb,
  getOrCreateConversation,
  getConversationMessages,
  getUserConversations,
  sendMessage,
} from "../db";
import { conversationMessages, conversations, notifications, users } from "../../drizzle/schema";
import { protectedProcedure, router } from "../_core/trpc";

async function requireDb() {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "قاعدة البيانات غير متاحة | Database not available",
    });
  }
  return db;
}

async function getConversationForUserOrThrow(conversationId: number, userId: number) {
  const db = await requireDb();
  const rows = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1);
  if (rows.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "المحادثة غير موجودة | Conversation not found" });
  }
  const conversation = rows[0];
  if (conversation.participant1 !== userId && conversation.participant2 !== userId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "لست طرفاً في هذه المحادثة | You are not a participant in this conversation" });
  }
  return conversation;
}

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export const notificationsRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(200).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      return db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, ctx.user.id))
        .orderBy(desc(notifications.createdAt))
        .limit(input?.limit ?? 100);
    }),

  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const rows = await db
      .select({ count: sql<string>`COUNT(*)` })
      .from(notifications)
      .where(and(eq(notifications.userId, ctx.user.id), eq(notifications.isRead, false)));
    return { count: rows.length > 0 ? Number(rows[0].count) : 0 };
  }),

  markRead: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      await db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(and(eq(notifications.id, input.id), eq(notifications.userId, ctx.user.id)));
      return { success: true } as const;
    }),

  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await requireDb();
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(and(eq(notifications.userId, ctx.user.id), eq(notifications.isRead, false)));
    return { success: true } as const;
  }),
});

/* ------------------------------------------------------------------ */
/* Conversations                                                       */
/* ------------------------------------------------------------------ */

export const conversationsRouter = router({
  /** Conversations of the current user, with counterpart name, last message and unread count. */
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const convs = await getUserConversations(ctx.user.id);
    if (convs.length === 0) return [];

    const convIds = convs.map(c => c.id);
    const otherIds = Array.from(
      new Set(convs.map(c => (c.participant1 === ctx.user.id ? c.participant2 : c.participant1))),
    );

    const userRows =
      otherIds.length > 0
        ? await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, otherIds))
        : [];
    const nameById = new Map(userRows.map(u => [u.id, u.name]));

    const unreadRows = await db
      .select({ conversationId: conversationMessages.conversationId, count: sql<string>`COUNT(*)` })
      .from(conversationMessages)
      .where(
        and(
          inArray(conversationMessages.conversationId, convIds),
          eq(conversationMessages.isRead, false),
          ne(conversationMessages.senderId, ctx.user.id),
        ),
      )
      .groupBy(conversationMessages.conversationId);
    const unreadByConv = new Map(unreadRows.map(r => [r.conversationId, Number(r.count)]));

    const lastRows = await db
      .select()
      .from(conversationMessages)
      .where(inArray(conversationMessages.conversationId, convIds))
      .orderBy(desc(conversationMessages.createdAt));
    const lastByConv = new Map<number, (typeof lastRows)[number]>();
    for (const row of lastRows) {
      if (!lastByConv.has(row.conversationId)) lastByConv.set(row.conversationId, row);
    }

    return convs.map(c => {
      const otherId = c.participant1 === ctx.user.id ? c.participant2 : c.participant1;
      const last = lastByConv.get(c.id);
      return {
        id: c.id,
        otherUserId: otherId,
        otherUserName: nameById.get(otherId) ?? null,
        lastMessage: last?.message ?? null,
        lastMessageAt: c.lastMessageAt,
        unread: unreadByConv.get(c.id) ?? 0,
      };
    });
  }),

  /** Messages of one conversation (participant-only). Marks incoming messages as read. */
  messages: protectedProcedure
    .input(z.object({ conversationId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      await getConversationForUserOrThrow(input.conversationId, ctx.user.id);
      await db
        .update(conversationMessages)
        .set({ isRead: true })
        .where(
          and(
            eq(conversationMessages.conversationId, input.conversationId),
            ne(conversationMessages.senderId, ctx.user.id),
            eq(conversationMessages.isRead, false),
          ),
        );
      return getConversationMessages(input.conversationId);
    }),

  /** Send a message inside an existing conversation (participant-only). */
  send: protectedProcedure
    .input(z.object({ conversationId: z.number().int(), message: z.string().min(1).max(5000) }))
    .mutation(async ({ ctx, input }) => {
      await getConversationForUserOrThrow(input.conversationId, ctx.user.id);
      await sendMessage({
        conversationId: input.conversationId,
        senderId: ctx.user.id,
        message: input.message,
      });
      return { success: true } as const;
    }),

  /** Start (or reuse) a direct conversation with another user. */
  start: protectedProcedure
    .input(z.object({ userId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن بدء محادثة مع نفسك | Cannot start a conversation with yourself" });
      }
      const conversation = await getOrCreateConversation(ctx.user.id, input.userId);
      return { conversationId: conversation.id } as const;
    }),
});
