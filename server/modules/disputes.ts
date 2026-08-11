/**
 * OSDM Disputes — نظام النزاعات
 *
 * Per the OSDM constitution:
 * - A dispute may be opened within 7 days of delivery (buyer or seller).
 * - Stages: open -> evidence -> counterparty reply -> platform mediation -> admin final decision.
 * - While a dispute is open the escrow is frozen (enforced in finance.assertEscrowNotFrozen,
 *   which escrowRelease calls).
 * - Admin resolution executes the matching escrow action: 'release' -> seller paid (minus fees),
 *   'refund' -> buyer refunded minus the fixed 5 SAR admin fee.
 */
import { and, desc, eq, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "../db";
import { deliveries, disputes } from "../../drizzle/schema";
import { adminProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  escrowRefund,
  escrowRelease,
  findActiveEscrowHold,
  type EscrowMarket,
  type EscrowRef,
} from "./finance";

const DISPUTE_WINDOW_DAYS = 7;

const marketSchema = z.enum(["product", "service", "job"]);

function marketToDisputeType(market: EscrowMarket): "product_order" | "service_order" | "contract" {
  return market === "job" ? "contract" : market === "service" ? "service_order" : "product_order";
}

function disputeTypeToMarket(disputeType: "product_order" | "service_order" | "contract"): EscrowMarket {
  return disputeType === "contract" ? "job" : disputeType === "service_order" ? "service" : "product";
}

interface EvidenceEntry {
  by: number;
  role: "evidence" | "reply";
  urls: string[];
  note?: string;
  at: string;
}

function parseEvidence(raw: string | null): EvidenceEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

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

async function getDisputeOrThrow(id: number) {
  const db = await requireDb();
  const rows = await db.select().from(disputes).where(eq(disputes.id, id)).limit(1);
  if (rows.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "النزاع غير موجود | Dispute not found" });
  }
  return rows[0];
}

export const disputesRouter = router({
  /**
   * Open a dispute (buyer or seller) — allowed only within 7 days of the latest delivery.
   * If no delivery exists yet (e.g. non-delivery complaint) the dispute may still be opened.
   */
  open: protectedProcedure
    .input(
      z.object({
        market: marketSchema,
        orderId: z.number().int().positive(),
        againstUserId: z.number().int().positive(),
        reason: z.string().min(3).max(500),
        description: z.string().min(10).max(5000),
        evidence: z.array(z.string().url()).max(20).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const disputeType = marketToDisputeType(input.market);

      // Escrow must exist for the ref — a dispute is about held money
      const hold = await findActiveEscrowHold({ market: input.market, orderId: input.orderId });
      if (!hold) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "لا يوجد مبلغ في الضمان لهذا الطلب — لا يمكن فتح نزاع | No escrowed amount for this order — a dispute cannot be opened",
        });
      }

      // 7-day window from the latest delivery (per the constitution)
      const idColumn = input.market === "job" ? deliveries.contractId : deliveries.orderId;
      const latestDelivery = await db
        .select()
        .from(deliveries)
        .where(eq(idColumn, input.orderId))
        .orderBy(desc(deliveries.createdAt))
        .limit(1);
      if (latestDelivery.length > 0) {
        const deliveredAt = latestDelivery[0].createdAt.getTime();
        const windowMs = DISPUTE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
        if (Date.now() - deliveredAt > windowMs) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "انتهت مهلة فتح النزاع (7 أيام من التسليم) | The dispute window has expired (7 days from delivery)",
          });
        }
      }

      // No duplicate open dispute for the same ref
      const refIdColumn = input.market === "job" ? disputes.contractId : disputes.orderId;
      const existing = await db
        .select({ id: disputes.id })
        .from(disputes)
        .where(
          and(
            eq(disputes.disputeType, disputeType),
            eq(refIdColumn, input.orderId),
            inArray(disputes.status, ["open", "under_review"]),
          ),
        )
        .limit(1);
      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "يوجد نزاع مفتوح بالفعل لهذا الطلب | A dispute is already open for this order",
        });
      }

      const evidenceEntries: EvidenceEntry[] =
        input.evidence && input.evidence.length > 0
          ? [{ by: ctx.user.id, role: "evidence", urls: input.evidence, at: new Date().toISOString() }]
          : [];

      await db.insert(disputes).values({
        orderId: input.market === "job" ? null : input.orderId,
        contractId: input.market === "job" ? input.orderId : null,
        disputeType,
        raisedBy: ctx.user.id,
        againstUserId: input.againstUserId,
        reason: input.reason,
        description: input.description,
        evidence: JSON.stringify(evidenceEntries),
        status: "open",
      });

      return { success: true } as const;
    }),

  /** Submit additional evidence (attachment URLs) — either party. */
  submitEvidence: protectedProcedure
    .input(
      z.object({
        disputeId: z.number().int().positive(),
        urls: z.array(z.string().url()).min(1).max(20),
        note: z.string().max(2000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const dispute = await getDisputeOrThrow(input.disputeId);
      if (dispute.raisedBy !== ctx.user.id && dispute.againstUserId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "لست طرفاً في هذا النزاع | You are not a party to this dispute" });
      }
      if (dispute.status !== "open" && dispute.status !== "under_review") {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "النزاع مغلق | The dispute is closed" });
      }
      const entries = parseEvidence(dispute.evidence);
      entries.push({ by: ctx.user.id, role: "evidence", urls: input.urls, note: input.note, at: new Date().toISOString() });
      await db.update(disputes).set({ evidence: JSON.stringify(entries) }).where(eq(disputes.id, dispute.id));
      return { success: true } as const;
    }),

  /** Counterparty reply — moves the dispute into platform mediation (under_review). */
  reply: protectedProcedure
    .input(
      z.object({
        disputeId: z.number().int().positive(),
        message: z.string().min(3).max(5000),
        urls: z.array(z.string().url()).max(20).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const dispute = await getDisputeOrThrow(input.disputeId);
      if (dispute.againstUserId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "الرد متاح للطرف الآخر فقط | Only the counterparty can reply" });
      }
      if (dispute.status !== "open" && dispute.status !== "under_review") {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "النزاع مغلق | The dispute is closed" });
      }
      const entries = parseEvidence(dispute.evidence);
      if (input.urls && input.urls.length > 0) {
        entries.push({ by: ctx.user.id, role: "reply", urls: input.urls, note: input.message, at: new Date().toISOString() });
      }
      await db
        .update(disputes)
        .set({ counterpartyReply: input.message, evidence: JSON.stringify(entries), status: "under_review" })
        .where(eq(disputes.id, dispute.id));
      return { success: true } as const;
    }),

  /** My disputes (raised by me or against me). */
  myDisputes: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    return db
      .select()
      .from(disputes)
      .where(or(eq(disputes.raisedBy, ctx.user.id), eq(disputes.againstUserId, ctx.user.id)))
      .orderBy(desc(disputes.createdAt));
  }),

  getById: protectedProcedure
    .input(z.object({ disputeId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const dispute = await getDisputeOrThrow(input.disputeId);
      const isParty = dispute.raisedBy === ctx.user.id || dispute.againstUserId === ctx.user.id;
      if (!isParty && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "لست طرفاً في هذا النزاع | You are not a party to this dispute" });
      }
      return { ...dispute, evidenceEntries: parseEvidence(dispute.evidence) };
    }),

  // ---- Admin ----
  adminListAll: adminProcedure
    .input(
      z.object({ status: z.enum(["open", "under_review", "resolved", "closed"]).optional() }).optional(),
    )
    .query(async ({ input }) => {
      const db = await requireDb();
      if (input?.status) {
        return db.select().from(disputes).where(eq(disputes.status, input.status)).orderBy(desc(disputes.createdAt));
      }
      return db.select().from(disputes).orderBy(desc(disputes.createdAt));
    }),

  /**
   * Final admin decision: 'release' pays the seller (escrowRelease, 25%+5% fees applied),
   * 'refund' returns the money to the buyer minus the fixed 5 SAR admin fee (escrowRefund).
   */
  adminResolve: adminProcedure
    .input(
      z.object({
        disputeId: z.number().int().positive(),
        decision: z.enum(["release", "refund"]),
        resolution: z.string().min(3).max(5000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const dispute = await getDisputeOrThrow(input.disputeId);
      if (dispute.status !== "open" && dispute.status !== "under_review") {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "النزاع محسوم بالفعل | Dispute already resolved" });
      }

      const market = disputeTypeToMarket(dispute.disputeType);
      const orderId = market === "job" ? dispute.contractId : dispute.orderId;
      if (!orderId) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "مرجع النزاع غير صالح | Invalid dispute reference" });
      }
      const ref: EscrowRef = { market, orderId };

      // Mark resolved FIRST so the escrow freeze (open-dispute check) no longer blocks release.
      await db
        .update(disputes)
        .set({
          status: "resolved",
          resolution: `[${input.decision}] ${input.resolution}`,
          resolvedBy: ctx.user.id,
          resolvedAt: new Date(),
        })
        .where(eq(disputes.id, dispute.id));

      try {
        if (input.decision === "release") {
          const hold = await findActiveEscrowHold(ref);
          if (!hold) {
            throw new TRPCError({ code: "NOT_FOUND", message: "لا يوجد مبلغ محجوز | No active escrow hold" });
          }
          // The buyer is whoever funded the escrow; the seller is the other party.
          const sellerId = dispute.raisedBy === hold.userId ? dispute.againstUserId : dispute.raisedBy;
          const fees = await escrowRelease(ref, sellerId);
          return { success: true, decision: input.decision, fees } as const;
        }
        const refund = await escrowRefund(ref);
        return { success: true, decision: input.decision, refund } as const;
      } catch (err) {
        // Escrow action failed — reopen the dispute so money is not lost in limbo.
        await db
          .update(disputes)
          .set({ status: "under_review", resolution: null, resolvedBy: null, resolvedAt: null })
          .where(eq(disputes.id, dispute.id));
        throw err;
      }
    }),
});
