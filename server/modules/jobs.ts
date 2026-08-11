/**
 * OSDM — Market 3: Freelance Jobs (Upwork + Mostaql + Bahr clone)
 *
 * سوق العمل الحر: نشر مشاريع مفتوحة (مهارات/ميزانية/مدة/مستوى خبرة) + عطاءات المستقلين
 * + تفاوض عبر المحادثات + عقود رقمية بتمويل ضمان (Escrow) + معالم (Milestones) بتتبع تقدم
 * + تسليم/قبول + تقييمات متبادلة + سمعة وشارات ثقة + ملف مستقل عام.
 *
 * Money logic is NEVER reimplemented here — all escrow/commission flows go through ./finance:
 *   escrowHold(employer, amount, {market:'job', orderId: contractId}) on bid acceptance,
 *   escrowRelease({market:'job', orderId: contractId}, freelancerId) on final acceptance.
 *
 * NOTE on per-milestone escrow: the finance core keeps ONE active hold per EscrowRef
 * (market='job', orderId=contractId) and settles it atomically (release/refund), and the
 * disputes module freezes/settles by that same contract-level ref. Therefore the full
 * contract amount is held upfront at acceptBid (buyer pays upfront per the constitution),
 * milestone approvals are recorded as accepted deliveries + progress, and the single hold
 * is released to the freelancer (minus 25% + 5%) when the LAST milestone is approved —
 * keeping the ledger, dispute-freeze law and commission accounting fully consistent.
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
  contractMilestones,
  contracts,
  deliveries,
  jobBids,
  jobs,
  notifications,
  portfolioItems,
  profiles,
  reviews,
  sellerProfiles,
  sellerRatings,
  userCertifications,
  userSkills,
  users,
} from "../../drizzle/schema";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { escrowHold, escrowRelease } from "./finance";

/* ------------------------------------------------------------------ */
/* Internal helpers                                                    */
/* ------------------------------------------------------------------ */

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

async function notify(
  userId: number,
  titleAr: string,
  titleEn: string,
  bodyAr?: string,
  bodyEn?: string,
  link?: string,
) {
  try {
    const db = await requireDb();
    await db.insert(notifications).values({
      userId,
      titleAr,
      titleEn,
      bodyAr,
      bodyEn,
      link,
      type: "info",
    });
  } catch {
    // notifications are best-effort; never break the main flow
  }
}

async function getJobOrThrow(jobId: number) {
  const db = await requireDb();
  const rows = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
  if (rows.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "المشروع غير موجود | Job not found" });
  }
  return rows[0];
}

async function getBidOrThrow(bidId: number) {
  const db = await requireDb();
  const rows = await db.select().from(jobBids).where(eq(jobBids.id, bidId)).limit(1);
  if (rows.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "العرض غير موجود | Bid not found" });
  }
  return rows[0];
}

async function getContractOrThrow(contractId: number) {
  const db = await requireDb();
  const rows = await db.select().from(contracts).where(eq(contracts.id, contractId)).limit(1);
  if (rows.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "العقد غير موجود | Contract not found" });
  }
  return rows[0];
}

async function getMilestoneOrThrow(milestoneId: number) {
  const db = await requireDb();
  const rows = await db
    .select()
    .from(contractMilestones)
    .where(eq(contractMilestones.id, milestoneId))
    .limit(1);
  if (rows.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "المرحلة غير موجودة | Milestone not found" });
  }
  return rows[0];
}

function assertContractParty(contract: { employerId: number; freelancerId: number }, userId: number) {
  if (contract.employerId !== userId && contract.freelancerId !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "لست طرفاً في هذا العقد | You are not a party to this contract",
    });
  }
}

/** Milestone progress for a contract: approved/total (+ percentage). */
async function getContractProgress(contractId: number) {
  const db = await requireDb();
  const rows = await db
    .select()
    .from(contractMilestones)
    .where(eq(contractMilestones.contractId, contractId))
    .orderBy(contractMilestones.order);
  const total = rows.length;
  const approved = rows.filter(m => m.status === "completed" || m.status === "paid").length;
  return {
    milestones: rows,
    total,
    approved,
    percentage: total > 0 ? Math.round((approved / total) * 100) : 0,
  };
}

/** Trust badges per reputation (بِلُغَتَيْن — computed, never stored). */
function computeTrustBadges(completedContracts: number, avgRating: number, reviewsCount: number) {
  const badges: { key: string; labelAr: string; labelEn: string }[] = [];
  if (completedContracts >= 3 && avgRating >= 4) {
    badges.push({ key: "trusted", labelAr: "موثوق", labelEn: "Trusted" });
  }
  if (completedContracts >= 10 && avgRating >= 4.5) {
    badges.push({ key: "top_rated", labelAr: "الأعلى تقييماً", labelEn: "Top Rated" });
  }
  if (completedContracts >= 1 && completedContracts < 3 && avgRating >= 4.5 && reviewsCount >= 1) {
    badges.push({ key: "rising_talent", labelAr: "موهبة صاعدة", labelEn: "Rising Talent" });
  }
  return badges;
}

/** Public freelancer profile: identity + skills + portfolio + reputation + trust badges. */
async function getFreelancerPublicProfile(userId: number) {
  const db = await requireDb();

  const userRows = await db
    .select({
      id: users.id,
      name: users.name,
      userType: users.userType,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (userRows.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود | User not found" });
  }

  const profileRows = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  const skills = await db.select().from(userSkills).where(eq(userSkills.userId, userId));
  const certifications = await db
    .select()
    .from(userCertifications)
    .where(eq(userCertifications.userId, userId));
  const portfolio = await db
    .select()
    .from(portfolioItems)
    .where(and(eq(portfolioItems.userId, userId), eq(portfolioItems.isPublic, true)))
    .orderBy(portfolioItems.displayOrder);

  const ratingRows = await db
    .select({
      avgRating: sql<string>`COALESCE(AVG(${reviews.rating}), 0)`,
      reviewsCount: sql<string>`COUNT(*)`,
    })
    .from(reviews)
    .where(and(eq(reviews.revieweeId, userId), eq(reviews.isPublic, true)));
  const avgRating = ratingRows.length > 0 ? Number(ratingRows[0].avgRating) : 0;
  const reviewsCount = ratingRows.length > 0 ? Number(ratingRows[0].reviewsCount) : 0;

  const completedRows = await db
    .select({ count: sql<string>`COUNT(*)` })
    .from(contracts)
    .where(and(eq(contracts.freelancerId, userId), eq(contracts.status, "completed")));
  const completedContracts = completedRows.length > 0 ? Number(completedRows[0].count) : 0;

  const profile = profileRows.length > 0 ? profileRows[0] : null;

  return {
    userId: userRows[0].id,
    name: userRows[0].name,
    userType: userRows[0].userType,
    memberSince: userRows[0].createdAt,
    avatar: profile?.avatar ?? null,
    bio: profile?.bio ?? null,
    country: profile?.country ?? null,
    city: profile?.city ?? null,
    website: profile?.website ?? null,
    skills,
    certifications,
    portfolio,
    avgRating: Math.round(avgRating * 10) / 10,
    reviewsCount,
    completedContracts,
    trustBadges: computeTrustBadges(completedContracts, avgRating, reviewsCount),
  };
}

/**
 * Final settlement of a contract: releases the escrow to the freelancer via the
 * finance core (25% commission + 5% gateway fee applied there), marks milestones
 * paid, completes the contract and its job.
 */
async function settleContract(contract: typeof contracts.$inferSelect) {
  const db = await requireDb();
  const fees = await escrowRelease({ market: "job", orderId: contract.id }, contract.freelancerId);

  await db
    .update(contractMilestones)
    .set({ status: "paid" })
    .where(eq(contractMilestones.contractId, contract.id));
  await db
    .update(contracts)
    .set({ status: "completed", completedDate: new Date() })
    .where(eq(contracts.id, contract.id));
  await db.update(jobs).set({ status: "completed" }).where(eq(jobs.id, contract.jobId));

  await notify(
    contract.freelancerId,
    "تم الإفراج عن مستحقاتك",
    "Your earnings have been released",
    `اكتمل العقد #${contract.id} وأُودع صافي ${fees.sellerNet} ر.س في محفظتك بعد خصم العمولة`,
    `Contract #${contract.id} completed — net ${fees.sellerNet} SAR credited to your wallet after commission`,
    "/dashboard/wallet",
  );

  return fees;
}

/* ------------------------------------------------------------------ */
/* Zod inputs                                                          */
/* ------------------------------------------------------------------ */

const budgetTypeSchema = z.enum(["fixed", "hourly"]);
const durationUnitSchema = z.enum(["hours", "days", "weeks", "months"]);
const experienceLevelSchema = z.enum(["beginner", "intermediate", "expert"]);

const postJobInput = z.object({
  categoryId: z.number().int().positive(),
  titleAr: z.string().min(1).max(500),
  titleEn: z.string().min(1).max(500),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  budget: z.number().int().positive(),
  budgetType: budgetTypeSchema.default("fixed"),
  duration: z.number().int().positive().optional(),
  durationUnit: durationUnitSchema.default("days"),
  experienceLevel: experienceLevelSchema.default("intermediate"),
  skills: z.array(z.string().min(1).max(100)).max(30).optional(),
  attachments: z.array(z.string().url()).max(20).optional(),
  deadline: z.coerce.date().optional(),
});

const updateJobInput = postJobInput.partial().extend({
  jobId: z.number().int().positive(),
});

const milestoneDefInput = z.object({
  titleAr: z.string().min(1).max(255),
  titleEn: z.string().min(1).max(255),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  amount: z.number().int().positive(),
  dueDate: z.coerce.date().optional(),
});

/* ------------------------------------------------------------------ */
/* tRPC router — merged in server/routers.ts as `jobsExt`              */
/* ------------------------------------------------------------------ */

export const jobsExtRouter = router({
  /* ---------------------------- Public ---------------------------- */
  public: router({
    /** Job details — increments the views counter. */
    jobDetails: publicProcedure
      .input(z.object({ jobId: z.number().int().positive() }))
      .query(async ({ input }) => {
        const db = await requireDb();
        const job = await getJobOrThrow(input.jobId);
        await db
          .update(jobs)
          .set({ views: job.views + 1 })
          .where(eq(jobs.id, input.jobId));

        const employerRows = await db
          .select({ id: users.id, name: users.name })
          .from(users)
          .where(eq(users.id, job.employerId))
          .limit(1);

        return {
          ...job,
          views: job.views + 1,
          employer: employerRows.length > 0 ? employerRows[0] : null,
        };
      }),

    /** Public freelancer profile with reputation + trust badges. */
    freelancerProfile: publicProcedure
      .input(z.object({ userId: z.number().int().positive() }))
      .query(async ({ input }) => getFreelancerPublicProfile(input.userId)),

    /** Public reviews received by a user (mutual-review reputation feed). */
    userReviews: publicProcedure
      .input(z.object({ userId: z.number().int().positive() }))
      .query(async ({ input }) => {
        const db = await requireDb();
        return db
          .select()
          .from(reviews)
          .where(and(eq(reviews.revieweeId, input.userId), eq(reviews.isPublic, true)))
          .orderBy(desc(reviews.createdAt));
      }),
  }),

  /* --------------------------- Employer --------------------------- */
  employer: router({
    /** Post a new open job (skills, fixed/hourly budget, duration, experience level). */
    postJob: protectedProcedure.input(postJobInput).mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const [result] = await db.insert(jobs).values({
        employerId: ctx.user.id,
        categoryId: input.categoryId,
        titleAr: input.titleAr,
        titleEn: input.titleEn,
        descriptionAr: input.descriptionAr,
        descriptionEn: input.descriptionEn,
        budget: input.budget,
        budgetType: input.budgetType,
        currency: "SAR",
        duration: input.duration,
        durationUnit: input.durationUnit,
        experienceLevel: input.experienceLevel,
        skills: input.skills ? JSON.stringify(input.skills) : null,
        attachments: input.attachments ? JSON.stringify(input.attachments) : null,
        deadline: input.deadline,
        status: "open",
      });
      return { jobId: result.insertId };
    }),

    /** Update an owned job while it is still draft/open. */
    update: protectedProcedure.input(updateJobInput).mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const job = await getJobOrThrow(input.jobId);
      if (job.employerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "هذا المشروع ليس لك | This job is not yours" });
      }
      if (job.status !== "draft" && job.status !== "open") {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "لا يمكن تعديل مشروع بدأ تنفيذه | Cannot edit a job after work has started",
        });
      }
      const { jobId, skills: skillsArr, attachments: attachmentsArr, ...rest } = input;
      await db
        .update(jobs)
        .set({
          ...rest,
          ...(skillsArr !== undefined ? { skills: JSON.stringify(skillsArr) } : {}),
          ...(attachmentsArr !== undefined ? { attachments: JSON.stringify(attachmentsArr) } : {}),
        })
        .where(eq(jobs.id, jobId));
      return { success: true } as const;
    }),

    /** Close an open job (no more bids accepted). */
    close: protectedProcedure
      .input(z.object({ jobId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const job = await getJobOrThrow(input.jobId);
        if (job.employerId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "هذا المشروع ليس لك | This job is not yours" });
        }
        if (job.status !== "draft" && job.status !== "open") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "لا يمكن إغلاق مشروع بدأ تنفيذه | Cannot close a job after work has started",
          });
        }
        await db.update(jobs).set({ status: "closed" }).where(eq(jobs.id, input.jobId));
        return { success: true } as const;
      }),

    /** Jobs I posted. */
    myJobs: protectedProcedure.query(async ({ ctx }) => {
      const db = await requireDb();
      return db
        .select()
        .from(jobs)
        .where(eq(jobs.employerId, ctx.user.id))
        .orderBy(desc(jobs.createdAt));
    }),

    /** Bids on my job, each enriched with the freelancer's public profile + reputation. */
    jobBids: protectedProcedure
      .input(z.object({ jobId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const db = await requireDb();
        const job = await getJobOrThrow(input.jobId);
        if (job.employerId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "هذا المشروع ليس لك | This job is not yours" });
        }
        const bids = await db
          .select()
          .from(jobBids)
          .where(eq(jobBids.jobId, input.jobId))
          .orderBy(desc(jobBids.createdAt));

        return Promise.all(
          bids.map(async bid => ({
            ...bid,
            freelancer: await getFreelancerPublicProfile(bid.freelancerId),
          })),
        );
      }),

    /**
     * Accept a bid: creates the digital contract, funds it via mandatory escrow
     * (full amount held from the employer's wallet), rejects other bids and moves
     * the job to in_progress.
     */
    acceptBid: protectedProcedure
      .input(z.object({ bidId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const bid = await getBidOrThrow(input.bidId);
        const job = await getJobOrThrow(bid.jobId);
        if (job.employerId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "هذا المشروع ليس لك | This job is not yours" });
        }
        if (job.status !== "open") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "المشروع ليس مفتوحاً لقبول العروض | Job is not open for accepting bids",
          });
        }
        if (bid.status !== "pending") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "هذا العرض لم يعد قابلاً للقبول | This bid can no longer be accepted",
          });
        }

        const [created] = await db.insert(contracts).values({
          jobId: job.id,
          bidId: bid.id,
          employerId: ctx.user.id,
          freelancerId: bid.freelancerId,
          titleAr: job.titleAr,
          titleEn: job.titleEn,
          descriptionAr: job.descriptionAr,
          descriptionEn: job.descriptionEn,
          amount: bid.amount,
          currency: "SAR",
          deliveryTime: bid.deliveryTime,
          deliveryTimeUnit: bid.deliveryTimeUnit,
          status: "active",
          startDate: new Date(),
        });
        const contractId = created.insertId;

        // Mandatory escrow: buyer pays upfront (finance core enforces balance + no duplicates).
        let escrowTx: { transactionId: number };
        try {
          escrowTx = await escrowHold(ctx.user.id, bid.amount, { market: "job", orderId: contractId });
        } catch (err) {
          // Roll back the contract shell so no unfunded contract survives.
          await db.delete(contracts).where(eq(contracts.id, contractId));
          throw err;
        }
        await db
          .update(contracts)
          .set({ transactionId: String(escrowTx.transactionId) })
          .where(eq(contracts.id, contractId));

        await db.update(jobBids).set({ status: "accepted" }).where(eq(jobBids.id, bid.id));
        await db
          .update(jobBids)
          .set({ status: "rejected" })
          .where(and(eq(jobBids.jobId, job.id), eq(jobBids.status, "pending")));
        await db.update(jobs).set({ status: "in_progress" }).where(eq(jobs.id, job.id));

        await notify(
          bid.freelancerId,
          "تم قبول عرضك",
          "Your bid was accepted",
          `قُبل عرضك على «${job.titleAr}» وتم تمويل العقد في الضمان`,
          `Your bid on "${job.titleEn}" was accepted and the contract is funded in escrow`,
          `/dashboard/contracts`,
        );

        return { contractId, escrowTransactionId: escrowTx.transactionId };
      }),

    /**
     * Define contract milestones (title/amount/dueDate). Sum MUST equal the
     * contract amount. Only before any milestones exist.
     */
    defineMilestones: protectedProcedure
      .input(
        z.object({
          contractId: z.number().int().positive(),
          milestones: z.array(milestoneDefInput).min(1).max(50),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const contract = await getContractOrThrow(input.contractId);
        if (contract.employerId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "هذا العقد ليس لك | This contract is not yours" });
        }
        if (contract.status !== "active" && contract.status !== "in_progress") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "لا يمكن تحديد مراحل لعقد منتهٍ | Cannot define milestones on a finished contract",
          });
        }
        const existing = await db
          .select({ id: contractMilestones.id })
          .from(contractMilestones)
          .where(eq(contractMilestones.contractId, input.contractId))
          .limit(1);
        if (existing.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "المراحل محددة مسبقاً لهذا العقد | Milestones are already defined for this contract",
          });
        }
        const total = input.milestones.reduce((sum, m) => sum + m.amount, 0);
        if (total !== contract.amount) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `مجموع المراحل (${total} ر.س) يجب أن يساوي قيمة العقد (${contract.amount} ر.س) | Milestones total (${total} SAR) must equal the contract amount (${contract.amount} SAR)`,
          });
        }

        for (let i = 0; i < input.milestones.length; i++) {
          const m = input.milestones[i];
          await db.insert(contractMilestones).values({
            contractId: input.contractId,
            titleAr: m.titleAr,
            titleEn: m.titleEn,
            descriptionAr: m.descriptionAr,
            descriptionEn: m.descriptionEn,
            amount: m.amount,
            currency: "SAR",
            dueDate: m.dueDate,
            order: i,
            status: "pending",
          });
        }

        await notify(
          contract.freelancerId,
          "تم تحديد مراحل العقد",
          "Contract milestones defined",
          `حدد صاحب العمل ${input.milestones.length} مراحل للعقد #${contract.id}`,
          `The employer defined ${input.milestones.length} milestones for contract #${contract.id}`,
          `/dashboard/contracts`,
        );

        return { count: input.milestones.length };
      }),

    /**
     * Approve a delivered milestone. When the LAST milestone is approved the
     * contract escrow is released to the freelancer (25% + 5% deducted by the
     * finance core) and the contract + job complete.
     */
    approveMilestone: protectedProcedure
      .input(z.object({ milestoneId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const milestone = await getMilestoneOrThrow(input.milestoneId);
        const contract = await getContractOrThrow(milestone.contractId);
        if (contract.employerId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "هذا العقد ليس لك | This contract is not yours" });
        }
        if (milestone.status === "completed" || milestone.status === "paid") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "هذه المرحلة معتمدة مسبقاً | This milestone is already approved",
          });
        }

        const deliveryRows = await db
          .select()
          .from(deliveries)
          .where(
            and(
              eq(deliveries.milestoneId, input.milestoneId),
              eq(deliveries.deliveryType, "milestone"),
              eq(deliveries.status, "pending_review"),
            ),
          )
          .orderBy(desc(deliveries.createdAt))
          .limit(1);
        if (deliveryRows.length === 0) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "لا يوجد تسليم بانتظار المراجعة لهذه المرحلة | No delivery pending review for this milestone",
          });
        }

        await db.update(deliveries).set({ status: "accepted" }).where(eq(deliveries.id, deliveryRows[0].id));
        await db
          .update(contractMilestones)
          .set({ status: "completed" })
          .where(eq(contractMilestones.id, input.milestoneId));

        const progress = await getContractProgress(contract.id);
        const allApproved = progress.total > 0 && progress.approved === progress.total;

        let released = null as null | Awaited<ReturnType<typeof settleContract>>;
        if (allApproved) {
          released = await settleContract(contract);
        } else {
          await notify(
            contract.freelancerId,
            "تم اعتماد مرحلة",
            "Milestone approved",
            `اعتُمدت مرحلة «${milestone.titleAr}» (${progress.approved}/${progress.total})`,
            `Milestone "${milestone.titleEn}" approved (${progress.approved}/${progress.total})`,
            `/dashboard/contracts`,
          );
        }

        return {
          milestoneId: input.milestoneId,
          progress: { approved: progress.approved, total: progress.total, percentage: progress.percentage },
          contractCompleted: allApproved,
          fees: released,
        };
      }),

    /** Request a revision on a pending delivery (milestone or whole-contract). */
    requestRevision: protectedProcedure
      .input(z.object({ deliveryId: z.number().int().positive(), note: z.string().min(1).max(2000) }))
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const rows = await db.select().from(deliveries).where(eq(deliveries.id, input.deliveryId)).limit(1);
        if (rows.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "التسليم غير موجود | Delivery not found" });
        }
        const delivery = rows[0];
        if (delivery.deliveredTo !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "هذا التسليم ليس موجهاً إليك | This delivery is not addressed to you" });
        }
        if (delivery.status !== "pending_review") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "التسليم ليس بانتظار المراجعة | Delivery is not pending review",
          });
        }
        await db
          .update(deliveries)
          .set({ status: "revision_requested", revisionCount: delivery.revisionCount + 1 })
          .where(eq(deliveries.id, input.deliveryId));

        const conversation = await getOrCreateConversation(ctx.user.id, delivery.deliveredBy);
        await sendMessage({
          conversationId: conversation.id,
          senderId: ctx.user.id,
          message: `طلب تعديل | Revision requested: ${input.note}`,
        });
        await notify(
          delivery.deliveredBy,
          "طُلب تعديل على التسليم",
          "Revision requested on your delivery",
          input.note,
          input.note,
          `/dashboard/contracts`,
        );
        return { success: true } as const;
      }),

    /** Accept a whole-contract delivery (contracts without milestones) -> escrow release. */
    acceptDelivery: protectedProcedure
      .input(z.object({ deliveryId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const rows = await db.select().from(deliveries).where(eq(deliveries.id, input.deliveryId)).limit(1);
        if (rows.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "التسليم غير موجود | Delivery not found" });
        }
        const delivery = rows[0];
        if (delivery.deliveryType !== "contract" || !delivery.contractId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "هذا التسليم ليس تسليم عقد كامل | This is not a whole-contract delivery",
          });
        }
        const contract = await getContractOrThrow(delivery.contractId);
        if (contract.employerId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "هذا العقد ليس لك | This contract is not yours" });
        }
        if (delivery.status !== "pending_review") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "التسليم ليس بانتظار المراجعة | Delivery is not pending review",
          });
        }

        await db.update(deliveries).set({ status: "accepted" }).where(eq(deliveries.id, input.deliveryId));
        const fees = await settleContract(contract);
        return { contractCompleted: true, fees };
      }),
  }),

  /* -------------------------- Freelancer -------------------------- */
  freelancer: router({
    /** Place a bid on an open job (amount + delivery days + cover letter). */
    placeBid: protectedProcedure
      .input(
        z.object({
          jobId: z.number().int().positive(),
          amount: z.number().int().positive(),
          deliveryDays: z.number().int().positive().max(365),
          coverLetter: z.string().min(1).max(5000),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const job = await getJobOrThrow(input.jobId);
        if (job.status !== "open") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "المشروع غير مفتوح لاستقبال العروض | Job is not open for bids",
          });
        }
        if (job.employerId === ctx.user.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "لا يمكنك التقديم على مشروعك | You cannot bid on your own job",
          });
        }
        const existing = await db
          .select({ id: jobBids.id })
          .from(jobBids)
          .where(
            and(
              eq(jobBids.jobId, input.jobId),
              eq(jobBids.freelancerId, ctx.user.id),
              inArray(jobBids.status, ["pending", "accepted"]),
            ),
          )
          .limit(1);
        if (existing.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "لديك عرض قائم على هذا المشروع بالفعل | You already have an active bid on this job",
          });
        }

        const [result] = await db.insert(jobBids).values({
          jobId: input.jobId,
          freelancerId: ctx.user.id,
          amount: input.amount,
          currency: "SAR",
          deliveryTime: input.deliveryDays,
          deliveryTimeUnit: "days",
          proposalAr: input.coverLetter,
          proposalEn: input.coverLetter,
          status: "pending",
        });
        await db
          .update(jobs)
          .set({ bidsCount: job.bidsCount + 1 })
          .where(eq(jobs.id, input.jobId));

        await notify(
          job.employerId,
          "عرض جديد على مشروعك",
          "New bid on your job",
          `وصل عرض جديد بقيمة ${input.amount} ر.س على «${job.titleAr}»`,
          `A new ${input.amount} SAR bid arrived on "${job.titleEn}"`,
          `/jobs/${job.id}`,
        );

        return { bidId: result.insertId };
      }),

    /** Withdraw my pending bid. */
    withdrawBid: protectedProcedure
      .input(z.object({ bidId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const bid = await getBidOrThrow(input.bidId);
        if (bid.freelancerId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "هذا العرض ليس لك | This bid is not yours" });
        }
        if (bid.status !== "pending") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "لا يمكن سحب هذا العرض | This bid can no longer be withdrawn",
          });
        }
        await db.update(jobBids).set({ status: "withdrawn" }).where(eq(jobBids.id, input.bidId));
        const job = await getJobOrThrow(bid.jobId);
        await db
          .update(jobs)
          .set({ bidsCount: Math.max(0, job.bidsCount - 1) })
          .where(eq(jobs.id, bid.jobId));
        return { success: true } as const;
      }),

    /** My bids with the job each one targets. */
    myBids: protectedProcedure.query(async ({ ctx }) => {
      const db = await requireDb();
      const bids = await db
        .select()
        .from(jobBids)
        .where(eq(jobBids.freelancerId, ctx.user.id))
        .orderBy(desc(jobBids.createdAt));
      if (bids.length === 0) return [];
      const jobIds = Array.from(new Set(bids.map(b => b.jobId)));
      const jobRows = await db.select().from(jobs).where(inArray(jobs.id, jobIds));
      const byId = new Map(jobRows.map(j => [j.id, j]));
      return bids.map(bid => ({ ...bid, job: byId.get(bid.jobId) ?? null }));
    }),

    /** Deliver a milestone (files + message) -> pending employer review. */
    deliverMilestone: protectedProcedure
      .input(
        z.object({
          milestoneId: z.number().int().positive(),
          messageAr: z.string().max(5000).optional(),
          messageEn: z.string().max(5000).optional(),
          files: z.array(z.string().url()).max(20).optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const milestone = await getMilestoneOrThrow(input.milestoneId);
        const contract = await getContractOrThrow(milestone.contractId);
        if (contract.freelancerId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "لست المستقل في هذا العقد | You are not the freelancer on this contract" });
        }
        if (contract.status !== "active" && contract.status !== "in_progress") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "العقد ليس قيد التنفيذ | Contract is not in progress",
          });
        }
        if (milestone.status === "completed" || milestone.status === "paid") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "هذه المرحلة معتمدة مسبقاً | This milestone is already approved",
          });
        }
        const pending = await db
          .select({ id: deliveries.id })
          .from(deliveries)
          .where(
            and(
              eq(deliveries.milestoneId, input.milestoneId),
              eq(deliveries.deliveryType, "milestone"),
              eq(deliveries.status, "pending_review"),
            ),
          )
          .limit(1);
        if (pending.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "يوجد تسليم بانتظار المراجعة لهذه المرحلة | A delivery is already pending review for this milestone",
          });
        }

        const [result] = await db.insert(deliveries).values({
          contractId: contract.id,
          milestoneId: input.milestoneId,
          deliveryType: "milestone",
          deliveredBy: ctx.user.id,
          deliveredTo: contract.employerId,
          messageAr: input.messageAr,
          messageEn: input.messageEn,
          files: input.files ? JSON.stringify(input.files) : null,
          status: "pending_review",
        });
        await db
          .update(contractMilestones)
          .set({ status: "in_progress" })
          .where(eq(contractMilestones.id, input.milestoneId));
        await db.update(contracts).set({ status: "in_progress" }).where(eq(contracts.id, contract.id));

        await notify(
          contract.employerId,
          "تسليم مرحلة جديد",
          "New milestone delivery",
          `سلّم المستقل مرحلة «${milestone.titleAr}» وهي بانتظار مراجعتك`,
          `The freelancer delivered milestone "${milestone.titleEn}" — awaiting your review`,
          `/dashboard/contracts`,
        );

        return { deliveryId: result.insertId };
      }),

    /** Deliver the whole contract (contracts without milestones). */
    deliverWork: protectedProcedure
      .input(
        z.object({
          contractId: z.number().int().positive(),
          messageAr: z.string().max(5000).optional(),
          messageEn: z.string().max(5000).optional(),
          files: z.array(z.string().url()).max(20).optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const contract = await getContractOrThrow(input.contractId);
        if (contract.freelancerId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "لست المستقل في هذا العقد | You are not the freelancer on this contract" });
        }
        if (contract.status !== "active" && contract.status !== "in_progress") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "العقد ليس قيد التنفيذ | Contract is not in progress",
          });
        }
        const hasMilestones = await db
          .select({ id: contractMilestones.id })
          .from(contractMilestones)
          .where(eq(contractMilestones.contractId, input.contractId))
          .limit(1);
        if (hasMilestones.length > 0) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "هذا العقد يعمل بنظام المراحل — سلّم كل مرحلة على حدة | This contract uses milestones — deliver each milestone individually",
          });
        }

        const [result] = await db.insert(deliveries).values({
          contractId: contract.id,
          deliveryType: "contract",
          deliveredBy: ctx.user.id,
          deliveredTo: contract.employerId,
          messageAr: input.messageAr,
          messageEn: input.messageEn,
          files: input.files ? JSON.stringify(input.files) : null,
          status: "pending_review",
        });
        await db.update(contracts).set({ status: "delivered", deliveryDate: new Date() }).where(eq(contracts.id, contract.id));

        await notify(
          contract.employerId,
          "تسليم عمل جديد",
          "New work delivery",
          `سلّم المستقل العمل الكامل للعقد #${contract.id} وهو بانتظار مراجعتك`,
          `The freelancer delivered the full work for contract #${contract.id} — awaiting your review`,
          `/dashboard/contracts`,
        );

        return { deliveryId: result.insertId };
      }),

    /** Progress update note — logged in the contract conversation, visible to both parties. */
    updateProgress: protectedProcedure
      .input(z.object({ contractId: z.number().int().positive(), note: z.string().min(1).max(2000) }))
      .mutation(async ({ ctx, input }) => {
        const contract = await getContractOrThrow(input.contractId);
        if (contract.freelancerId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "لست المستقل في هذا العقد | You are not the freelancer on this contract" });
        }
        if (contract.status !== "active" && contract.status !== "in_progress" && contract.status !== "delivered") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "العقد ليس قيد التنفيذ | Contract is not in progress",
          });
        }
        const conversation = await getOrCreateConversation(ctx.user.id, contract.employerId);
        await sendMessage({
          conversationId: conversation.id,
          senderId: ctx.user.id,
          message: `تحديث تقدم العقد #${contract.id} | Contract #${contract.id} progress update: ${input.note}`,
        });
        await notify(
          contract.employerId,
          "تحديث تقدم من المستقل",
          "Progress update from the freelancer",
          input.note,
          input.note,
          `/messages`,
        );
        return { success: true } as const;
      }),
  }),

  /* ------------------------- Negotiation --------------------------- */
  negotiation: router({
    /** Send a bid-scoped negotiation message (employer <-> bidding freelancer). */
    send: protectedProcedure
      .input(z.object({ bidId: z.number().int().positive(), message: z.string().min(1).max(5000) }))
      .mutation(async ({ ctx, input }) => {
        const bid = await getBidOrThrow(input.bidId);
        const job = await getJobOrThrow(bid.jobId);
        if (ctx.user.id !== bid.freelancerId && ctx.user.id !== job.employerId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "لست طرفاً في هذا التفاوض | You are not a party to this negotiation",
          });
        }
        const other = ctx.user.id === bid.freelancerId ? job.employerId : bid.freelancerId;
        const conversation = await getOrCreateConversation(ctx.user.id, other);
        await sendMessage({
          conversationId: conversation.id,
          senderId: ctx.user.id,
          message: input.message,
        });
        await notify(
          other,
          "رسالة تفاوض جديدة",
          "New negotiation message",
          `رسالة جديدة حول عرض المشروع «${job.titleAr}»`,
          `New message about the bid on "${job.titleEn}"`,
          `/messages`,
        );
        return { conversationId: conversation.id };
      }),

    /** List the negotiation thread for a bid (both parties only). */
    list: protectedProcedure
      .input(z.object({ bidId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const bid = await getBidOrThrow(input.bidId);
        const job = await getJobOrThrow(bid.jobId);
        if (ctx.user.id !== bid.freelancerId && ctx.user.id !== job.employerId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "لست طرفاً في هذا التفاوض | You are not a party to this negotiation",
          });
        }
        const other = ctx.user.id === bid.freelancerId ? job.employerId : bid.freelancerId;
        const conversation = await getOrCreateConversation(ctx.user.id, other);
        return getConversationMessages(conversation.id);
      }),
  }),

  /* --------------------------- Contracts --------------------------- */
  contracts: router({
    /** Contract details + milestones + deliveries + progress (parties only). */
    getById: protectedProcedure
      .input(z.object({ contractId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const db = await requireDb();
        const contract = await getContractOrThrow(input.contractId);
        assertContractParty(contract, ctx.user.id);
        const progress = await getContractProgress(input.contractId);
        const contractDeliveries = await db
          .select()
          .from(deliveries)
          .where(eq(deliveries.contractId, input.contractId))
          .orderBy(desc(deliveries.createdAt));
        return {
          ...contract,
          milestones: progress.milestones,
          deliveries: contractDeliveries,
          progress: { approved: progress.approved, total: progress.total, percentage: progress.percentage },
        };
      }),

    /** Milestones of a contract with progress (parties only). */
    milestones: protectedProcedure
      .input(z.object({ contractId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const contract = await getContractOrThrow(input.contractId);
        assertContractParty(contract, ctx.user.id);
        const progress = await getContractProgress(input.contractId);
        return progress;
      }),
  }),

  /* ---------------------------- Reviews ---------------------------- */
  reviewsExt: router({
    /**
     * Mutual review after contract completion: each party reviews the other once.
     * Employer -> freelancer reviews also feed the seller rating aggregates.
     */
    submit: protectedProcedure
      .input(
        z.object({
          contractId: z.number().int().positive(),
          rating: z.number().int().min(1).max(5),
          commentAr: z.string().max(2000).optional(),
          commentEn: z.string().max(2000).optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const contract = await getContractOrThrow(input.contractId);
        assertContractParty(contract, ctx.user.id);
        if (contract.status !== "completed") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "التقييم متاح بعد اكتمال العقد فقط | Reviews are only available after the contract completes",
          });
        }
        const revieweeId = ctx.user.id === contract.employerId ? contract.freelancerId : contract.employerId;

        const existing = await db
          .select({ id: reviews.id })
          .from(reviews)
          .where(
            and(
              eq(reviews.reviewerId, ctx.user.id),
              eq(reviews.revieweeId, revieweeId),
              eq(reviews.itemId, contract.jobId),
              eq(reviews.itemType, "job"),
            ),
          )
          .limit(1);
        if (existing.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "قيّمت هذا العقد مسبقاً | You have already reviewed this contract",
          });
        }

        const [result] = await db.insert(reviews).values({
          reviewerId: ctx.user.id,
          revieweeId,
          itemId: contract.jobId,
          itemType: "job",
          rating: input.rating,
          commentAr: input.commentAr,
          commentEn: input.commentEn,
          isPublic: true,
        });

        // Employer reviewing the freelancer feeds the seller reputation aggregates.
        if (ctx.user.id === contract.employerId) {
          await db.insert(sellerRatings).values({
            sellerId: contract.freelancerId,
            buyerId: contract.employerId,
            orderId: contract.id,
            communicationRating: input.rating,
            qualityRating: input.rating,
            deliveryRating: input.rating,
            overallRating: input.rating,
            comment: input.commentAr ?? input.commentEn,
          });

          const agg = await db
            .select({ avgRating: sql<string>`COALESCE(AVG(${reviews.rating}), 0)` })
            .from(reviews)
            .where(and(eq(reviews.revieweeId, contract.freelancerId), eq(reviews.isPublic, true)));
          const avgRounded = Math.round(Number(agg.length > 0 ? agg[0].avgRating : 0));

          const sellerProfile = await db
            .select({ id: sellerProfiles.id })
            .from(sellerProfiles)
            .where(eq(sellerProfiles.userId, contract.freelancerId))
            .limit(1);
          if (sellerProfile.length > 0) {
            await db
              .update(sellerProfiles)
              .set({ rating: avgRounded })
              .where(eq(sellerProfiles.userId, contract.freelancerId));
          } else {
            await db.insert(sellerProfiles).values({ userId: contract.freelancerId, rating: avgRounded });
          }
        }

        await notify(
          revieweeId,
          "تقييم جديد",
          "New review received",
          `حصلت على تقييم ${input.rating}/5 على العقد #${contract.id}`,
          `You received a ${input.rating}/5 review on contract #${contract.id}`,
          `/dashboard`,
        );

        return { reviewId: result.insertId };
      }),

    /** Reviews I have written. */
    myGivenReviews: protectedProcedure.query(async ({ ctx }) => {
      const db = await requireDb();
      return db
        .select()
        .from(reviews)
        .where(eq(reviews.reviewerId, ctx.user.id))
        .orderBy(desc(reviews.createdAt));
    }),
  }),
});
