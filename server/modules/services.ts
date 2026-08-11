/**
 * OSDM Market 2 — سوق الخدمات الرقمية المتخصصة حسب الطلب (Fiverr + Khamsat clone)
 *
 * - إدارة خدمات البائع + الباقات الثلاث (أساسية/قياسية/مميزة)
 * - طلب الخدمة مع دفع مقدم إلى الضمان (Escrow) عبر النواة المالية ./finance
 * - قبول/رفض الطلب (الرفض = استرداد كامل بدون رسوم إدارية)
 * - المراحل (Milestones) مع ضمان لكل مرحلة على حدة للطلبات الكبيرة
 * - التسليم/القبول/طلب التعديل ضمن حد تعديلات الباقة
 * - التقييمات المتبادلة بعد الإكمال + محادثة تفاوض مرتبطة بالطلب
 *
 * All money values are integers in whole SAR. Escrow refs:
 *   order-level hold  -> { market: 'service', orderId: <orderId> }
 *   milestone hold    -> { market: 'service', orderId: MILESTONE_ESCROW_OFFSET + <milestoneId> }
 * (the offset keeps milestone holds from colliding with order-level holds
 *  inside the shared 'escrow_service' reference namespace).
 */
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getDb,
  getOrCreateConversation,
  getConversationMessages,
  sendMessage,
} from "../db";
import {
  deliveries,
  profiles,
  reviews,
  sellerProfiles,
  sellerRatings,
  serviceMilestones,
  serviceOrders,
  servicePackages,
  services,
  transactions,
  users,
  wallets,
} from "../../drizzle/schema";
import {
  assertEscrowNotFrozen,
  escrowHold,
  escrowReferenceType,
  escrowRelease,
  findActiveEscrowHold,
  getOrCreateWallet,
  type EscrowRef,
} from "./finance";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

/* ------------------------------------------------------------------ */
/* Constants & helpers                                                 */
/* ------------------------------------------------------------------ */

/** Keeps per-milestone escrow refs out of the order-id namespace. */
const MILESTONE_ESCROW_OFFSET = 500_000_000;

const orderRef = (orderId: number): EscrowRef => ({ market: "service", orderId });
const milestoneRef = (milestoneId: number): EscrowRef => ({
  market: "service",
  orderId: MILESTONE_ESCROW_OFFSET + milestoneId,
});

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

function err(code: TRPCError["code"], messageAr: string, messageEn: string): never {
  throw new TRPCError({ code, message: `${messageAr} | ${messageEn}` });
}

async function getServiceOrThrow(serviceId: number) {
  const db = await requireDb();
  const rows = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
  if (rows.length === 0) err("NOT_FOUND", "الخدمة غير موجودة", "Service not found");
  return rows[0];
}

async function getOwnServiceOrThrow(serviceId: number, userId: number) {
  const service = await getServiceOrThrow(serviceId);
  if (service.sellerId !== userId) {
    err("FORBIDDEN", "لا تملك هذه الخدمة", "You do not own this service");
  }
  return service;
}

async function getOrderOrThrow(orderId: number) {
  const db = await requireDb();
  const rows = await db.select().from(serviceOrders).where(eq(serviceOrders.id, orderId)).limit(1);
  if (rows.length === 0) err("NOT_FOUND", "الطلب غير موجود", "Order not found");
  return rows[0];
}

type ServiceOrder = typeof serviceOrders.$inferSelect;

function assertBuyer(order: ServiceOrder, userId: number) {
  if (order.buyerId !== userId) {
    err("FORBIDDEN", "هذا الإجراء متاح للمشتري فقط", "Only the buyer can perform this action");
  }
}

function assertSeller(order: ServiceOrder, userId: number) {
  if (order.sellerId !== userId) {
    err("FORBIDDEN", "هذا الإجراء متاح للبائع فقط", "Only the seller can perform this action");
  }
}

function assertParticipant(order: ServiceOrder, userId: number) {
  if (order.buyerId !== userId && order.sellerId !== userId) {
    err("FORBIDDEN", "لست طرفاً في هذا الطلب", "You are not a participant in this order");
  }
}

/* ------------------------------------------------------------------ */
/* Package tiers                                                       */
/* ------------------------------------------------------------------ */

const packageTierSchema = z.enum(["basic", "standard", "premium"]);
type PackageTier = z.infer<typeof packageTierSchema>;

const TIER_ORDER: Record<PackageTier, number> = { basic: 0, standard: 1, premium: 2 };

interface PackageMeta {
  tier: PackageTier;
  revisions: number;
  features: string[];
}

/**
 * servicePackages.features stores a JSON blob { tier, revisions, features[] }
 * (the schema has no dedicated tier/revisions columns and must not change).
 */
function parsePackageMeta(featuresRaw: string | null): PackageMeta {
  try {
    const parsed = JSON.parse(featuresRaw ?? "");
    const tier = packageTierSchema.safeParse(parsed?.tier);
    return {
      tier: tier.success ? tier.data : "basic",
      revisions: Number.isInteger(parsed?.revisions) && parsed.revisions >= 0 ? parsed.revisions : 1,
      features: Array.isArray(parsed?.features) ? parsed.features.map(String) : [],
    };
  } catch {
    return { tier: "basic", revisions: 1, features: featuresRaw ? [featuresRaw] : [] };
  }
}

type ServicePackage = typeof servicePackages.$inferSelect;

function packageWithMeta(pkg: ServicePackage) {
  return { ...pkg, meta: parsePackageMeta(pkg.features) };
}

async function getPackagesWithMeta(serviceId: number) {
  const db = await requireDb();
  const rows = await db
    .select()
    .from(servicePackages)
    .where(eq(servicePackages.serviceId, serviceId))
    .orderBy(servicePackages.order);
  return rows.map(packageWithMeta);
}

/* ------------------------------------------------------------------ */
/* Full escrow refund (no admin fee)                                   */
/*                                                                     */
/* The finance core's escrowRefund always charges the fixed 5 SAR      */
/* admin fee. The constitution exempts two cases handled here:         */
/*  1) seller rejects the order (buyer is not at fault)                */
/*  2) converting an order-level hold into per-milestone escrow        */
/* This helper mirrors finance's ledger conventions exactly.           */
/* ------------------------------------------------------------------ */

async function escrowRefundFullNoFee(ref: EscrowRef, descriptionAr: string, descriptionEn: string) {
  const db = await requireDb();
  const hold = await findActiveEscrowHold(ref);
  if (!hold) return { refunded: 0 };
  // Dispute freeze law: a hold under an open/under_review dispute cannot be
  // refunded either — only the admin decision (disputes.adminResolve) moves it.
  await assertEscrowNotFrozen(ref);

  const wallet = await getOrCreateWallet(hold.userId);
  await db
    .update(wallets)
    .set({
      escrowHeld: Math.max(0, wallet.escrowHeld - hold.amount),
      balance: wallet.balance + hold.amount,
    })
    .where(eq(wallets.userId, hold.userId));
  await db.update(transactions).set({ status: "cancelled" }).where(eq(transactions.id, hold.id));
  await db.insert(transactions).values({
    userId: hold.userId,
    type: "refund",
    amount: hold.amount,
    currency: "SAR",
    balanceBefore: wallet.balance,
    balanceAfter: wallet.balance + hold.amount,
    descriptionAr,
    descriptionEn,
    referenceId: String(ref.orderId),
    referenceType: escrowReferenceType(ref.market),
    status: "completed",
  });
  return { refunded: hold.amount };
}

/* ------------------------------------------------------------------ */
/* Rating aggregation                                                  */
/* ------------------------------------------------------------------ */

async function recomputeServiceRating(serviceId: number, sellerId: number) {
  const db = await requireDb();
  const [agg] = await db
    .select({
      avg: sql<string>`COALESCE(AVG(${reviews.rating}), 0)`,
      count: sql<string>`COUNT(*)`,
    })
    .from(reviews)
    .where(
      and(eq(reviews.itemType, "service"), eq(reviews.itemId, serviceId), eq(reviews.revieweeId, sellerId)),
    );
  await db
    .update(services)
    .set({ rating: Math.round(Number(agg?.avg ?? 0)), reviewsCount: Number(agg?.count ?? 0) })
    .where(eq(services.id, serviceId));
}

async function recomputeSellerProfileRating(sellerId: number) {
  const db = await requireDb();
  const existing = await db
    .select({ id: sellerProfiles.id })
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, sellerId))
    .limit(1);
  if (existing.length === 0) return;
  const [agg] = await db
    .select({ avg: sql<string>`COALESCE(AVG(${sellerRatings.overallRating}), 0)` })
    .from(sellerRatings)
    .where(eq(sellerRatings.sellerId, sellerId));
  await db
    .update(sellerProfiles)
    .set({ rating: Math.round(Number(agg?.avg ?? 0)) })
    .where(eq(sellerProfiles.userId, sellerId));
}

/* ------------------------------------------------------------------ */
/* Input schemas                                                       */
/* ------------------------------------------------------------------ */

const deliveryTimeUnitSchema = z.enum(["hours", "days", "weeks"]);

const serviceBodySchema = z.object({
  categoryId: z.number().int().positive(),
  titleAr: z.string().min(1).max(500),
  titleEn: z.string().min(1).max(500),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  startingPrice: z.number().int().positive(),
  deliveryTime: z.number().int().positive(),
  deliveryTimeUnit: deliveryTimeUnitSchema.default("days"),
  coverImage: z.string().min(1),
  images: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["draft", "pending", "active"]).default("pending"),
});

const packageInputSchema = z.object({
  tier: packageTierSchema,
  nameAr: z.string().min(1).max(255),
  nameEn: z.string().min(1).max(255),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  price: z.number().int().positive(),
  deliveryDays: z.number().int().positive(),
  revisions: z.number().int().min(0).max(100),
  features: z.array(z.string().min(1)).max(30).default([]),
});

const milestoneInputSchema = z.object({
  titleAr: z.string().min(1).max(255),
  titleEn: z.string().min(1).max(255),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  amount: z.number().int().positive(),
  dueDate: z.coerce.date().optional(),
});

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

export const servicesExtRouter = router({
  /* ================= Seller: service CRUD ================= */

  createService: protectedProcedure.input(serviceBodySchema).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const [result] = await db.insert(services).values({
      ...input,
      sellerId: ctx.user.id,
      currency: "SAR",
    });
    return { serviceId: result.insertId };
  }),

  updateService: protectedProcedure
    .input(z.object({ serviceId: z.number().int().positive() }).merge(serviceBodySchema.partial()))
    .mutation(async ({ ctx, input }) => {
      const { serviceId, ...fields } = input;
      await getOwnServiceOrThrow(serviceId, ctx.user.id);
      const db = await requireDb();
      if (Object.keys(fields).length > 0) {
        await db.update(services).set(fields).where(eq(services.id, serviceId));
      }
      return { success: true } as const;
    }),

  deleteService: protectedProcedure
    .input(z.object({ serviceId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await getOwnServiceOrThrow(input.serviceId, ctx.user.id);
      const db = await requireDb();
      const activeOrders = await db
        .select({ id: serviceOrders.id })
        .from(serviceOrders)
        .where(
          and(
            eq(serviceOrders.serviceId, input.serviceId),
            inArray(serviceOrders.status, ["pending", "in_progress", "delivered", "revision", "disputed"]),
          ),
        )
        .limit(1);
      if (activeOrders.length > 0) {
        err(
          "PRECONDITION_FAILED",
          "لا يمكن حذف خدمة عليها طلبات نشطة",
          "Cannot delete a service with active orders",
        );
      }
      await db.delete(servicePackages).where(eq(servicePackages.serviceId, input.serviceId));
      await db.delete(services).where(eq(services.id, input.serviceId));
      return { success: true } as const;
    }),

  myServices: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    return db
      .select()
      .from(services)
      .where(eq(services.sellerId, ctx.user.id))
      .orderBy(desc(services.createdAt));
  }),

  /** Replaces the service's packages with up to 3 tiers (basic/standard/premium). */
  setPackages: protectedProcedure
    .input(
      z.object({
        serviceId: z.number().int().positive(),
        packages: z.array(packageInputSchema).min(1).max(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await getOwnServiceOrThrow(input.serviceId, ctx.user.id);
      const tiers = input.packages.map(p => p.tier);
      if (new Set(tiers).size !== tiers.length) {
        err("BAD_REQUEST", "لا يمكن تكرار نفس الباقة", "Duplicate package tiers are not allowed");
      }
      const db = await requireDb();
      await db.delete(servicePackages).where(eq(servicePackages.serviceId, input.serviceId));
      for (const pkg of input.packages) {
        await db.insert(servicePackages).values({
          serviceId: input.serviceId,
          nameAr: pkg.nameAr,
          nameEn: pkg.nameEn,
          descriptionAr: pkg.descriptionAr,
          descriptionEn: pkg.descriptionEn,
          price: pkg.price,
          deliveryTime: pkg.deliveryDays,
          deliveryTimeUnit: "days",
          features: JSON.stringify({ tier: pkg.tier, revisions: pkg.revisions, features: pkg.features }),
          order: TIER_ORDER[pkg.tier],
        });
      }
      return getPackagesWithMeta(input.serviceId);
    }),

  packages: publicProcedure
    .input(z.object({ serviceId: z.number().int().positive() }))
    .query(async ({ input }) => getPackagesWithMeta(input.serviceId)),

  /* ================= Buyer: ordering ================= */

  /** Buyer orders a service (optionally a specific package); price goes to escrow upfront. */
  orderService: protectedProcedure
    .input(
      z.object({
        serviceId: z.number().int().positive(),
        packageId: z.number().int().positive().optional(),
        requirements: z.string().min(1).max(10000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = await getServiceOrThrow(input.serviceId);
      if (service.status !== "active" || !service.isActive) {
        err("PRECONDITION_FAILED", "الخدمة غير متاحة للطلب حالياً", "Service is not currently available");
      }
      if (service.sellerId === ctx.user.id) {
        err("BAD_REQUEST", "لا يمكنك طلب خدمتك الخاصة", "You cannot order your own service");
      }

      let price = service.startingPrice;
      let deliveryTime = service.deliveryTime;
      let deliveryTimeUnit = service.deliveryTimeUnit;
      if (input.packageId) {
        const db = await requireDb();
        const pkgRows = await db
          .select()
          .from(servicePackages)
          .where(and(eq(servicePackages.id, input.packageId), eq(servicePackages.serviceId, input.serviceId)))
          .limit(1);
        if (pkgRows.length === 0) {
          err("NOT_FOUND", "الباقة غير موجودة لهذه الخدمة", "Package not found for this service");
        }
        price = pkgRows[0].price;
        deliveryTime = pkgRows[0].deliveryTime;
        deliveryTimeUnit = pkgRows[0].deliveryTimeUnit;
      }

      const db = await requireDb();
      const [result] = await db.insert(serviceOrders).values({
        serviceId: service.id,
        packageId: input.packageId,
        buyerId: ctx.user.id,
        sellerId: service.sellerId,
        titleAr: service.titleAr,
        titleEn: service.titleEn,
        descriptionAr: input.requirements,
        descriptionEn: input.requirements,
        price,
        currency: "SAR",
        deliveryTime,
        deliveryTimeUnit,
        status: "pending",
      });
      const orderId = result.insertId;

      try {
        await escrowHold(ctx.user.id, price, orderRef(orderId));
      } catch (e) {
        // Roll back the order row so a failed payment leaves no orphan order.
        await db.delete(serviceOrders).where(eq(serviceOrders.id, orderId));
        throw e;
      }

      return { orderId, price };
    }),

  /** Seller accepts a pending (paid) order and starts working. */
  acceptOrder: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderOrThrow(input.orderId);
      assertSeller(order, ctx.user.id);
      if (order.status !== "pending") {
        err("PRECONDITION_FAILED", "الطلب ليس بانتظار القبول", "Order is not awaiting acceptance");
      }
      const hold = await findActiveEscrowHold(orderRef(order.id));
      const db = await requireDb();
      const milestonesFunded = await db
        .select({ id: serviceMilestones.id })
        .from(serviceMilestones)
        .where(and(eq(serviceMilestones.orderId, order.id), eq(serviceMilestones.status, "in_progress")))
        .limit(1);
      if (!hold && milestonesFunded.length === 0) {
        err("PRECONDITION_FAILED", "الطلب غير مدفوع (لا يوجد ضمان محجوز)", "Order is unpaid (no escrow hold)");
      }
      await db
        .update(serviceOrders)
        .set({ status: "in_progress", startDate: new Date() })
        .where(eq(serviceOrders.id, order.id));
      await db
        .update(services)
        .set({ ordersCount: sql`${services.ordersCount} + 1` })
        .where(eq(services.id, order.serviceId));
      return { success: true } as const;
    }),

  /** Seller rejects a pending order: full refund to the buyer, no admin fee. */
  rejectOrder: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive(), reason: z.string().max(2000).optional() }))
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderOrThrow(input.orderId);
      assertSeller(order, ctx.user.id);
      if (order.status !== "pending") {
        err("PRECONDITION_FAILED", "لا يمكن رفض طلب غير معلّق", "Only pending orders can be rejected");
      }
      const refund = await escrowRefundFullNoFee(
        orderRef(order.id),
        "استرداد كامل — رفض البائع للطلب (بدون رسوم إدارية)",
        "Full refund — seller rejected the order (no admin fee)",
      );
      const db = await requireDb();
      await db.update(serviceOrders).set({ status: "cancelled" }).where(eq(serviceOrders.id, order.id));
      return { success: true, refunded: refund.refunded } as const;
    }),

  /* ================= Milestones (large orders) ================= */

  /**
   * Seller proposes a milestone plan whose amounts must sum to the order price.
   * Rows are stored with status 'pending' until the buyer approves them.
   */
  proposeMilestones: protectedProcedure
    .input(
      z.object({
        orderId: z.number().int().positive(),
        milestones: z.array(milestoneInputSchema).min(2).max(20),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderOrThrow(input.orderId);
      assertSeller(order, ctx.user.id);
      if (order.status !== "pending" && order.status !== "in_progress") {
        err("PRECONDITION_FAILED", "لا يمكن اقتراح مراحل لهذا الطلب في حالته الحالية", "Cannot propose milestones for this order in its current state");
      }
      const total = input.milestones.reduce((sum, m) => sum + m.amount, 0);
      if (total !== order.price) {
        err(
          "BAD_REQUEST",
          `مجموع مبالغ المراحل (${total}) يجب أن يساوي سعر الطلب (${order.price})`,
          `Milestone amounts total (${total}) must equal the order price (${order.price})`,
        );
      }
      const db = await requireDb();
      const started = await db
        .select({ id: serviceMilestones.id })
        .from(serviceMilestones)
        .where(
          and(
            eq(serviceMilestones.orderId, order.id),
            inArray(serviceMilestones.status, ["in_progress", "completed"]),
          ),
        )
        .limit(1);
      if (started.length > 0) {
        err("PRECONDITION_FAILED", "توجد مراحل معتمدة بالفعل لهذا الطلب", "Approved milestones already exist for this order");
      }
      // Replace any previous (unapproved) proposal
      await db
        .delete(serviceMilestones)
        .where(and(eq(serviceMilestones.orderId, order.id), eq(serviceMilestones.status, "pending")));
      let position = 0;
      for (const m of input.milestones) {
        await db.insert(serviceMilestones).values({
          orderId: order.id,
          titleAr: m.titleAr,
          titleEn: m.titleEn,
          descriptionAr: m.descriptionAr,
          descriptionEn: m.descriptionEn,
          amount: m.amount,
          dueDate: m.dueDate,
          status: "pending",
          order: position++,
        });
      }
      return { success: true, count: input.milestones.length } as const;
    }),

  /**
   * Buyer approves the proposed milestone plan. The order-level escrow hold is
   * converted (refunded in full, no fee) into per-milestone funding.
   */
  approveMilestones: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderOrThrow(input.orderId);
      assertBuyer(order, ctx.user.id);
      const db = await requireDb();
      const proposed = await db
        .select()
        .from(serviceMilestones)
        .where(and(eq(serviceMilestones.orderId, order.id), eq(serviceMilestones.status, "pending")));
      if (proposed.length === 0) {
        err("NOT_FOUND", "لا توجد مراحل مقترحة بانتظار الموافقة", "No proposed milestones awaiting approval");
      }
      // Check the freeze BEFORE mutating milestone rows so a frozen order
      // cannot end up half-converted (milestones in_progress + hold intact).
      await assertEscrowNotFrozen(orderRef(order.id));
      await db
        .update(serviceMilestones)
        .set({ status: "in_progress" })
        .where(and(eq(serviceMilestones.orderId, order.id), eq(serviceMilestones.status, "pending")));
      // Convert the order-level hold into per-milestone escrow (no fee — structural conversion)
      await escrowRefundFullNoFee(
        orderRef(order.id),
        "تحويل ضمان الطلب إلى ضمان مراحل (بدون رسوم)",
        "Order escrow converted to per-milestone escrow (no fee)",
      );
      await db
        .update(serviceOrders)
        .set({ status: "in_progress", startDate: order.startDate ?? new Date() })
        .where(eq(serviceOrders.id, order.id));
      return { success: true, milestones: proposed.length } as const;
    }),

  /** Buyer funds one approved milestone (moves its amount into escrow). */
  fundMilestone: protectedProcedure
    .input(z.object({ milestoneId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const rows = await db
        .select()
        .from(serviceMilestones)
        .where(eq(serviceMilestones.id, input.milestoneId))
        .limit(1);
      if (rows.length === 0) err("NOT_FOUND", "المرحلة غير موجودة", "Milestone not found");
      const milestone = rows[0];
      const order = await getOrderOrThrow(milestone.orderId);
      assertBuyer(order, ctx.user.id);
      if (milestone.status !== "in_progress") {
        err("PRECONDITION_FAILED", "المرحلة ليست معتمدة أو انتهت بالفعل", "Milestone is not approved or already finished");
      }
      const result = await escrowHold(ctx.user.id, milestone.amount, milestoneRef(milestone.id));
      return { success: true, transactionId: result.transactionId } as const;
    }),

  /** Seller delivers a funded milestone (deliverable URL/files + note). */
  deliverMilestone: protectedProcedure
    .input(
      z.object({
        milestoneId: z.number().int().positive(),
        message: z.string().max(10000).optional(),
        files: z.array(z.string().min(1)).max(20).default([]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const rows = await db
        .select()
        .from(serviceMilestones)
        .where(eq(serviceMilestones.id, input.milestoneId))
        .limit(1);
      if (rows.length === 0) err("NOT_FOUND", "المرحلة غير موجودة", "Milestone not found");
      const milestone = rows[0];
      const order = await getOrderOrThrow(milestone.orderId);
      assertSeller(order, ctx.user.id);
      if (milestone.status !== "in_progress") {
        err("PRECONDITION_FAILED", "المرحلة ليست قيد التنفيذ", "Milestone is not in progress");
      }
      const hold = await findActiveEscrowHold(milestoneRef(milestone.id));
      if (!hold) {
        err("PRECONDITION_FAILED", "المرحلة غير ممولة بعد — بانتظار حجز الضمان من المشتري", "Milestone is not funded yet — awaiting buyer escrow");
      }
      const [result] = await db.insert(deliveries).values({
        orderId: order.id,
        milestoneId: milestone.id,
        deliveryType: "milestone",
        deliveredBy: ctx.user.id,
        deliveredTo: order.buyerId,
        messageAr: input.message,
        messageEn: input.message,
        files: JSON.stringify(input.files),
        status: "pending_review",
      });
      return { success: true, deliveryId: result.insertId } as const;
    }),

  /** Buyer accepts a milestone delivery: escrow released to seller (25%+5% fees). */
  acceptMilestone: protectedProcedure
    .input(z.object({ milestoneId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const rows = await db
        .select()
        .from(serviceMilestones)
        .where(eq(serviceMilestones.id, input.milestoneId))
        .limit(1);
      if (rows.length === 0) err("NOT_FOUND", "المرحلة غير موجودة", "Milestone not found");
      const milestone = rows[0];
      const order = await getOrderOrThrow(milestone.orderId);
      assertBuyer(order, ctx.user.id);
      if (milestone.status !== "in_progress") {
        err("PRECONDITION_FAILED", "المرحلة ليست قيد التنفيذ", "Milestone is not in progress");
      }
      const delivery = await db
        .select()
        .from(deliveries)
        .where(and(eq(deliveries.milestoneId, milestone.id), eq(deliveries.status, "pending_review")))
        .orderBy(desc(deliveries.createdAt))
        .limit(1);
      if (delivery.length === 0) {
        err("PRECONDITION_FAILED", "لا يوجد تسليم بانتظار المراجعة لهذه المرحلة", "No delivery pending review for this milestone");
      }
      // Escrow freeze law: an open dispute on the parent order freezes all its milestones
      await assertEscrowNotFrozen(orderRef(order.id));
      const fees = await escrowRelease(milestoneRef(milestone.id), order.sellerId);
      await db.update(deliveries).set({ status: "accepted" }).where(eq(deliveries.id, delivery[0].id));
      await db
        .update(serviceMilestones)
        .set({ status: "completed" })
        .where(eq(serviceMilestones.id, milestone.id));

      // Order completes when every milestone is completed (or cancelled)
      const remaining = await db
        .select({ id: serviceMilestones.id })
        .from(serviceMilestones)
        .where(
          and(
            eq(serviceMilestones.orderId, order.id),
            inArray(serviceMilestones.status, ["pending", "in_progress"]),
          ),
        )
        .limit(1);
      let orderCompleted = false;
      if (remaining.length === 0) {
        await db
          .update(serviceOrders)
          .set({ status: "completed", completedDate: new Date() })
          .where(eq(serviceOrders.id, order.id));
        orderCompleted = true;
      }
      return { success: true, fees, orderCompleted } as const;
    }),

  milestones: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const order = await getOrderOrThrow(input.orderId);
      assertParticipant(order, ctx.user.id);
      const db = await requireDb();
      const rows = await db
        .select()
        .from(serviceMilestones)
        .where(eq(serviceMilestones.orderId, order.id))
        .orderBy(serviceMilestones.order);
      const withFunding = [] as Array<(typeof rows)[number] & { funded: boolean }>;
      for (const m of rows) {
        const hold = m.status === "in_progress" ? await findActiveEscrowHold(milestoneRef(m.id)) : null;
        withFunding.push({ ...m, funded: Boolean(hold) || m.status === "completed" });
      }
      return withFunding;
    }),

  /* ================= Simple flow (no milestones) ================= */

  /** Seller delivers the whole order (deliverable URL/files + note). */
  deliverOrder: protectedProcedure
    .input(
      z.object({
        orderId: z.number().int().positive(),
        message: z.string().max(10000).optional(),
        files: z.array(z.string().min(1)).max(20).default([]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderOrThrow(input.orderId);
      assertSeller(order, ctx.user.id);
      if (order.status !== "in_progress" && order.status !== "revision") {
        err("PRECONDITION_FAILED", "الطلب ليس قيد التنفيذ", "Order is not in progress");
      }
      const db = await requireDb();
      const hasMilestones = await db
        .select({ id: serviceMilestones.id })
        .from(serviceMilestones)
        .where(
          and(
            eq(serviceMilestones.orderId, order.id),
            inArray(serviceMilestones.status, ["in_progress", "completed"]),
          ),
        )
        .limit(1);
      if (hasMilestones.length > 0) {
        err("PRECONDITION_FAILED", "هذا الطلب يعمل بنظام المراحل — سلّم كل مرحلة على حدة", "This order uses milestones — deliver each milestone separately");
      }
      const [result] = await db.insert(deliveries).values({
        orderId: order.id,
        deliveryType: "service_order",
        deliveredBy: ctx.user.id,
        deliveredTo: order.buyerId,
        messageAr: input.message,
        messageEn: input.message,
        files: JSON.stringify(input.files),
        status: "pending_review",
      });
      await db
        .update(serviceOrders)
        .set({ status: "delivered", deliveryDate: new Date() })
        .where(eq(serviceOrders.id, order.id));
      return { success: true, deliveryId: result.insertId } as const;
    }),

  /** Buyer accepts the delivery: escrow released to seller minus 25%+5% fees. */
  acceptDelivery: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderOrThrow(input.orderId);
      assertBuyer(order, ctx.user.id);
      if (order.status !== "delivered") {
        err("PRECONDITION_FAILED", "لا يوجد تسليم بانتظار القبول", "No delivery awaiting acceptance");
      }
      const db = await requireDb();
      const delivery = await db
        .select()
        .from(deliveries)
        .where(
          and(
            eq(deliveries.orderId, order.id),
            eq(deliveries.deliveryType, "service_order"),
            eq(deliveries.status, "pending_review"),
          ),
        )
        .orderBy(desc(deliveries.createdAt))
        .limit(1);
      if (delivery.length === 0) {
        err("PRECONDITION_FAILED", "لا يوجد تسليم بانتظار المراجعة", "No delivery pending review");
      }
      const fees = await escrowRelease(orderRef(order.id), order.sellerId);
      await db.update(deliveries).set({ status: "accepted" }).where(eq(deliveries.id, delivery[0].id));
      await db
        .update(serviceOrders)
        .set({ status: "completed", completedDate: new Date() })
        .where(eq(serviceOrders.id, order.id));
      return { success: true, fees } as const;
    }),

  /** Buyer requests a revision, bounded by the package's revisions allowance. */
  requestRevision: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive(), note: z.string().min(1).max(10000) }))
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderOrThrow(input.orderId);
      assertBuyer(order, ctx.user.id);
      if (order.status !== "delivered") {
        err("PRECONDITION_FAILED", "لا يوجد تسليم يمكن طلب تعديله", "No delivery to request a revision for");
      }
      const db = await requireDb();

      // Allowance comes from the ordered package (default 1 when no package)
      let allowed = 1;
      if (order.packageId) {
        const pkgRows = await db
          .select()
          .from(servicePackages)
          .where(eq(servicePackages.id, order.packageId))
          .limit(1);
        if (pkgRows.length > 0) allowed = parsePackageMeta(pkgRows[0].features).revisions;
      }
      const [used] = await db
        .select({ count: sql<string>`COUNT(*)` })
        .from(deliveries)
        .where(
          and(
            eq(deliveries.orderId, order.id),
            eq(deliveries.deliveryType, "service_order"),
            eq(deliveries.status, "revision_requested"),
          ),
        );
      const usedCount = Number(used?.count ?? 0);
      if (usedCount >= allowed) {
        err(
          "PRECONDITION_FAILED",
          `تم استنفاد عدد التعديلات المسموح (${allowed})`,
          `Revision allowance exhausted (${allowed})`,
        );
      }

      const delivery = await db
        .select()
        .from(deliveries)
        .where(
          and(
            eq(deliveries.orderId, order.id),
            eq(deliveries.deliveryType, "service_order"),
            eq(deliveries.status, "pending_review"),
          ),
        )
        .orderBy(desc(deliveries.createdAt))
        .limit(1);
      if (delivery.length === 0) {
        err("PRECONDITION_FAILED", "لا يوجد تسليم بانتظار المراجعة", "No delivery pending review");
      }
      await db
        .update(deliveries)
        .set({ status: "revision_requested", revisionCount: delivery[0].revisionCount + 1 })
        .where(eq(deliveries.id, delivery[0].id));
      await db.update(serviceOrders).set({ status: "revision" }).where(eq(serviceOrders.id, order.id));

      // The revision note goes into the order conversation so both parties see it
      const conversation = await getOrCreateConversation(order.buyerId, order.sellerId);
      await sendMessage({
        conversationId: conversation.id,
        senderId: ctx.user.id,
        message: input.note,
      });
      return { success: true, revisionsUsed: usedCount + 1, revisionsAllowed: allowed } as const;
    }),

  deliveries: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const order = await getOrderOrThrow(input.orderId);
      assertParticipant(order, ctx.user.id);
      const db = await requireDb();
      return db
        .select()
        .from(deliveries)
        .where(eq(deliveries.orderId, order.id))
        .orderBy(desc(deliveries.createdAt));
    }),

  /* ================= Mutual reviews ================= */

  /**
   * Either party reviews the other after the order completes.
   * Buyer -> seller also records a detailed sellerRatings row and refreshes
   * the service + seller profile aggregates.
   */
  reviewOrder: protectedProcedure
    .input(
      z.object({
        orderId: z.number().int().positive(),
        rating: z.number().int().min(1).max(5),
        commentAr: z.string().max(5000).optional(),
        commentEn: z.string().max(5000).optional(),
        communicationRating: z.number().int().min(1).max(5).optional(),
        qualityRating: z.number().int().min(1).max(5).optional(),
        deliveryRating: z.number().int().min(1).max(5).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderOrThrow(input.orderId);
      assertParticipant(order, ctx.user.id);
      if (order.status !== "completed") {
        err("PRECONDITION_FAILED", "التقييم متاح بعد إكمال الطلب فقط", "Reviews are only available after the order is completed");
      }
      const isBuyer = ctx.user.id === order.buyerId;
      const revieweeId = isBuyer ? order.sellerId : order.buyerId;
      const db = await requireDb();

      if (isBuyer) {
        const existing = await db
          .select({ id: sellerRatings.id })
          .from(sellerRatings)
          .where(and(eq(sellerRatings.orderId, order.id), eq(sellerRatings.buyerId, ctx.user.id)))
          .limit(1);
        if (existing.length > 0) {
          err("CONFLICT", "قيّمت هذا الطلب بالفعل", "You have already reviewed this order");
        }
      } else {
        const existing = await db
          .select({ id: reviews.id })
          .from(reviews)
          .where(
            and(
              eq(reviews.reviewerId, ctx.user.id),
              eq(reviews.revieweeId, revieweeId),
              eq(reviews.itemType, "service"),
              eq(reviews.itemId, order.serviceId),
            ),
          )
          .limit(1);
        if (existing.length > 0) {
          err("CONFLICT", "قيّمت هذا الطرف بالفعل على هذه الخدمة", "You have already reviewed this party for this service");
        }
      }

      await db.insert(reviews).values({
        reviewerId: ctx.user.id,
        revieweeId,
        itemId: order.serviceId,
        itemType: "service",
        rating: input.rating,
        commentAr: input.commentAr,
        commentEn: input.commentEn,
      });

      if (isBuyer) {
        await db.insert(sellerRatings).values({
          sellerId: order.sellerId,
          buyerId: ctx.user.id,
          orderId: order.id,
          communicationRating: input.communicationRating ?? input.rating,
          qualityRating: input.qualityRating ?? input.rating,
          deliveryRating: input.deliveryRating ?? input.rating,
          overallRating: input.rating,
          comment: input.commentAr ?? input.commentEn,
        });
        await recomputeServiceRating(order.serviceId, order.sellerId);
        await recomputeSellerProfileRating(order.sellerId);
      }
      return { success: true } as const;
    }),

  /* ================= Order conversation (negotiation) ================= */

  sendOrderMessage: protectedProcedure
    .input(
      z.object({
        orderId: z.number().int().positive(),
        message: z.string().min(1).max(10000),
        attachments: z.array(z.string().min(1)).max(10).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderOrThrow(input.orderId);
      assertParticipant(order, ctx.user.id);
      const conversation = await getOrCreateConversation(order.buyerId, order.sellerId);
      await sendMessage({
        conversationId: conversation.id,
        senderId: ctx.user.id,
        message: input.message,
        attachments: input.attachments ? JSON.stringify(input.attachments) : undefined,
      });
      return { success: true, conversationId: conversation.id } as const;
    }),

  orderMessages: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const order = await getOrderOrThrow(input.orderId);
      assertParticipant(order, ctx.user.id);
      const conversation = await getOrCreateConversation(order.buyerId, order.sellerId);
      return getConversationMessages(conversation.id);
    }),

  /* ================= Public: service details ================= */

  serviceDetails: publicProcedure
    .input(z.object({ serviceId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const service = await getServiceOrThrow(input.serviceId);

      await db
        .update(services)
        .set({ views: sql`${services.views} + 1` })
        .where(eq(services.id, service.id));

      const packages = await getPackagesWithMeta(service.id);

      const sellerRows = await db
        .select({
          id: users.id,
          name: users.name,
          userType: users.userType,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, service.sellerId))
        .limit(1);
      const profileRows = await db
        .select({ avatar: profiles.avatar, bio: profiles.bio, country: profiles.country, city: profiles.city })
        .from(profiles)
        .where(eq(profiles.userId, service.sellerId))
        .limit(1);
      const sellerProfileRows = await db
        .select()
        .from(sellerProfiles)
        .where(eq(sellerProfiles.userId, service.sellerId))
        .limit(1);

      const serviceReviews = await db
        .select({
          id: reviews.id,
          reviewerId: reviews.reviewerId,
          reviewerName: users.name,
          rating: reviews.rating,
          commentAr: reviews.commentAr,
          commentEn: reviews.commentEn,
          createdAt: reviews.createdAt,
        })
        .from(reviews)
        .leftJoin(users, eq(users.id, reviews.reviewerId))
        .where(
          and(
            eq(reviews.itemType, "service"),
            eq(reviews.itemId, service.id),
            eq(reviews.revieweeId, service.sellerId),
            eq(reviews.isPublic, true),
          ),
        )
        .orderBy(desc(reviews.createdAt))
        .limit(50);

      return {
        service: { ...service, views: service.views + 1 },
        packages,
        seller: {
          ...(sellerRows[0] ?? null),
          profile: profileRows[0] ?? null,
          sellerProfile: sellerProfileRows[0] ?? null,
        },
        reviews: serviceReviews,
      };
    }),
});
