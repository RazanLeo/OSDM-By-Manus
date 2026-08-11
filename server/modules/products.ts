/**
 * OSDM Market 1 — سوق المنتجات الرقمية الجاهزة (Gumroad + Picalica clone)
 *
 * - Seller product CRUD + sales analytics (net of 25% commission + 5% gateway fee)
 * - Buyer purchase flow routed through the finance escrow core:
 *   escrowHold -> IMMEDIATE escrowRelease (ready products are delivered instantly,
 *   escrow is per-order and commission always applies) -> productPurchases row
 *   + productLicenses row (license key doubles as the download token).
 * - Coupons (seller-owned via the `S<sellerId>-` code prefix convention, since the
 *   coupons table has no owner column and the schema is frozen), bundles, reviews.
 *
 * Money = whole-SAR ints. All user-facing messages are bilingual "عربي | English".
 * Financial primitives come from ./finance — never reimplemented here.
 */
import crypto from "crypto";
import { and, desc, eq, inArray, like, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "../db";
import {
  couponUsages,
  coupons,
  productBundles,
  productLicenses,
  productPurchases,
  products,
  reviews,
  sellerProfiles,
  transactions,
  users,
  wallets,
} from "../../drizzle/schema";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  computeFees,
  escrowHold,
  escrowRelease,
  escrowReferenceType,
  findActiveEscrowHold,
  getOrCreateWallet,
  type EscrowRef,
} from "./finance";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
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

function productEscrowRef(purchaseId: number): EscrowRef {
  return { market: "product", orderId: purchaseId };
}

function generateLicenseKey(): string {
  // OSDM-XXXX-XXXX-XXXX-XXXX style key; also used as the download token.
  const raw = crypto.randomBytes(10).toString("hex").toUpperCase();
  return `OSDM-${raw.slice(0, 5)}-${raw.slice(5, 10)}-${raw.slice(10, 15)}-${raw.slice(15, 20)}`;
}

async function getProductOrThrow(productId: number) {
  const db = await requireDb();
  const rows = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  if (rows.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "المنتج غير موجود | Product not found" });
  }
  return rows[0];
}

async function getOwnProductOrThrow(productId: number, sellerId: number) {
  const product = await getProductOrThrow(productId);
  if (product.sellerId !== sellerId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "هذا المنتج لا يخصك | This product does not belong to you",
    });
  }
  return product;
}

/* ------------------------------------------------------------------ */
/* Coupons — seller ownership convention                               */
/* ------------------------------------------------------------------ */

/**
 * The frozen `coupons` table has no owner column, so seller-owned coupon codes are
 * namespaced with an `S<sellerId>-` prefix generated server-side. Buyers enter the
 * full code at checkout; at apply time the prefix must match the product's seller.
 */
function sellerCouponPrefix(sellerId: number): string {
  return `S${sellerId}-`;
}

function couponOwnerSellerId(code: string): number | null {
  const match = /^S(\d+)-/.exec(code);
  return match ? Number(match[1]) : null;
}

interface AppliedCoupon {
  couponId: number;
  code: string;
  discount: number;
}

/** Validates a coupon for a product purchase and returns the discount (whole SAR). */
async function validateCouponForPurchase(
  code: string,
  productSellerId: number,
  amount: number,
): Promise<AppliedCoupon> {
  const db = await requireDb();
  const rows = await db
    .select()
    .from(coupons)
    .where(and(eq(coupons.code, code), eq(coupons.isActive, true)))
    .limit(1);
  if (rows.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "كود الخصم غير صالح أو غير مفعّل | Coupon code is invalid or inactive",
    });
  }
  const coupon = rows[0];

  const now = new Date();
  if (coupon.validFrom > now || coupon.validTo < now) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "كود الخصم منتهي الصلاحية أو لم يبدأ بعد | Coupon is expired or not yet valid",
    });
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "تم استنفاد الحد الأقصى لاستخدام كود الخصم | Coupon usage limit reached",
    });
  }
  if (coupon.applicableFor !== "all" && coupon.applicableFor !== "products") {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "كود الخصم غير قابل للتطبيق على المنتجات | Coupon is not applicable to products",
    });
  }
  if (amount < coupon.minPurchase) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: `الحد الأدنى للشراء لاستخدام الكود هو ${coupon.minPurchase} ر.س | Minimum purchase for this coupon is ${coupon.minPurchase} SAR`,
    });
  }

  const ownerSellerId = couponOwnerSellerId(coupon.code);
  if (ownerSellerId !== null && ownerSellerId !== productSellerId) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "كود الخصم لا يخص بائع هذا المنتج | Coupon does not belong to this product's seller",
    });
  }

  let discount =
    coupon.discountType === "percentage"
      ? Math.round((amount * coupon.discountValue) / 100)
      : Math.min(coupon.discountValue, amount);
  if (coupon.maxDiscount !== null) {
    discount = Math.min(discount, coupon.maxDiscount);
  }
  // Purchases must stay >= 1 SAR (escrow requires a positive amount).
  discount = Math.max(0, Math.min(discount, amount - 1));

  return { couponId: coupon.id, code: coupon.code, discount };
}

async function recordCouponUsage(applied: AppliedCoupon, userId: number, orderId: number) {
  const db = await requireDb();
  await db.insert(couponUsages).values({
    couponId: applied.couponId,
    userId,
    orderId,
    discountAmount: applied.discount,
  });
  await db
    .update(coupons)
    .set({ usedCount: sql`${coupons.usedCount} + 1` })
    .where(eq(coupons.id, applied.couponId));
}

/* ------------------------------------------------------------------ */
/* Purchase core (shared by single purchase + bundle purchase)         */
/* ------------------------------------------------------------------ */

interface CompletedPurchase {
  purchaseId: number;
  productId: number;
  amountPaid: number;
  licenseKey: string;
}

/**
 * Creates the productPurchases row, holds the amount in escrow, releases it
 * immediately to the seller (instant delivery => commission applies), and issues
 * a license whose key is also the download token.
 */
async function executeProductPurchase(
  buyerId: number,
  product: typeof products.$inferSelect,
  amount: number,
): Promise<CompletedPurchase> {
  const db = await requireDb();

  const [inserted] = await db.insert(productPurchases).values({
    productId: product.id,
    buyerId,
    sellerId: product.sellerId,
    price: amount,
    currency: "SAR",
    status: "pending",
  });
  const purchaseId = inserted.insertId;
  const ref = productEscrowRef(purchaseId);

  try {
    const { transactionId } = await escrowHold(buyerId, amount, ref);
    // Ready digital products: delivery is instant, so escrow is released per-order
    // immediately — the 25% commission + 5% gateway fee are applied inside.
    await escrowRelease(ref, product.sellerId);
    await db
      .update(productPurchases)
      .set({ status: "completed", transactionId: String(transactionId) })
      .where(eq(productPurchases.id, purchaseId));
  } catch (err) {
    // Roll back so a retry is possible: if the hold succeeded but the release
    // failed, return the money to the buyer fee-free (this is a failed
    // purchase, not a buyer-initiated refund), then delete the pending row —
    // otherwise the amount would dangle in escrowHeld with no recoverable ref.
    const hold = await findActiveEscrowHold(ref);
    if (hold) {
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
        descriptionAr: "استرداد كامل — فشل إتمام شراء المنتج (بدون رسوم)",
        descriptionEn: "Full refund — product purchase failed to complete (no fee)",
        referenceId: String(ref.orderId),
        referenceType: escrowReferenceType(ref.market),
        status: "completed",
      });
    }
    await db.delete(productPurchases).where(eq(productPurchases.id, purchaseId));
    throw err;
  }

  const licenseKey = generateLicenseKey();
  await db.insert(productLicenses).values({
    productId: product.id,
    purchaseId,
    userId: buyerId,
    licenseKey,
    licenseType: "personal",
    activationLimit: 1,
    status: "active",
  });

  return { purchaseId, productId: product.id, amountPaid: amount, licenseKey };
}

/* ------------------------------------------------------------------ */
/* Zod inputs                                                          */
/* ------------------------------------------------------------------ */

const productCreateSchema = z.object({
  categoryId: z.number().int().positive(),
  titleAr: z.string().min(1).max(500),
  titleEn: z.string().min(1).max(500),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  price: z.number().int().positive(),
  coverImage: z.string().min(1),
  images: z.string().optional(),
  demoUrl: z.string().optional(),
  tags: z.string().optional(),
  fileUrl: z.string().min(1),
  fileSize: z.number().int().positive().optional(),
  fileType: z.string().max(100).optional(),
  status: z.enum(["draft", "pending", "active"]).default("draft"),
});

const productUpdateSchema = productCreateSchema.partial().extend({
  productId: z.number().int().positive(),
});

const couponCreateSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[A-Za-z0-9_-]+$/, "كود الخصم يقبل حروفاً وأرقاماً فقط | Coupon code accepts letters and digits only"),
  descriptionAr: z.string().max(1000).optional(),
  descriptionEn: z.string().max(1000).optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().int().positive(),
  minPurchase: z.number().int().min(0).default(0),
  maxDiscount: z.number().int().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  validFrom: z.date(),
  validTo: z.date(),
});

const bundleCreateSchema = z.object({
  titleAr: z.string().min(1).max(500),
  titleEn: z.string().min(1).max(500),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  coverImage: z.string().min(1),
  productIds: z.array(z.number().int().positive()).min(2),
  bundlePrice: z.number().int().positive(),
});

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

export const productsExtRouter = router({
  /* ------------------------------ Seller ------------------------------ */
  seller: router({
    createProduct: protectedProcedure.input(productCreateSchema).mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const [inserted] = await db.insert(products).values({
        ...input,
        sellerId: ctx.user.id,
        currency: "SAR",
      });
      return { productId: inserted.insertId };
    }),

    updateProduct: protectedProcedure.input(productUpdateSchema).mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const { productId, ...fields } = input;
      await getOwnProductOrThrow(productId, ctx.user.id);
      if (Object.keys(fields).length === 0) return { success: true } as const;
      await db.update(products).set(fields).where(eq(products.id, productId));
      return { success: true } as const;
    }),

    deleteProduct: protectedProcedure
      .input(z.object({ productId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        await getOwnProductOrThrow(input.productId, ctx.user.id);
        // Soft delete (existing platform convention): keep purchase history intact.
        await db.update(products).set({ isActive: false }).where(eq(products.id, input.productId));
        return { success: true } as const;
      }),

    myProducts: protectedProcedure.query(async ({ ctx }) => {
      const db = await requireDb();
      return db
        .select()
        .from(products)
        .where(eq(products.sellerId, ctx.user.id))
        .orderBy(desc(products.createdAt));
    }),

    // Per-product sales analytics: sales count, gross + net revenue (after 25%+5%), downloads, views.
    salesStats: protectedProcedure.query(async ({ ctx }) => {
      const db = await requireDb();
      const myProducts = await db
        .select()
        .from(products)
        .where(eq(products.sellerId, ctx.user.id))
        .orderBy(desc(products.createdAt));

      const salesRows = await db
        .select({
          productId: productPurchases.productId,
          salesCount: sql<string>`COUNT(*)`,
          grossRevenue: sql<string>`COALESCE(SUM(${productPurchases.price}), 0)`,
        })
        .from(productPurchases)
        .where(and(eq(productPurchases.sellerId, ctx.user.id), eq(productPurchases.status, "completed")))
        .groupBy(productPurchases.productId);

      const salesByProduct = new Map(salesRows.map(r => [r.productId, r]));

      let totalSales = 0;
      let totalGross = 0;
      const perProduct = myProducts.map(p => {
        const row = salesByProduct.get(p.id);
        const salesCount = row ? Number(row.salesCount) : 0;
        const gross = row ? Number(row.grossRevenue) : 0;
        totalSales += salesCount;
        totalGross += gross;
        return {
          productId: p.id,
          titleAr: p.titleAr,
          titleEn: p.titleEn,
          status: p.status,
          price: p.price,
          salesCount,
          grossRevenue: gross,
          netRevenue: gross > 0 ? computeFees(gross).sellerNet : 0,
          downloads: p.downloads,
          views: p.views,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
        };
      });

      return {
        products: perProduct,
        totals: {
          salesCount: totalSales,
          grossRevenue: totalGross,
          netRevenue: totalGross > 0 ? computeFees(totalGross).sellerNet : 0,
        },
      };
    }),
  }),

  /* ------------------------------ Buyer ------------------------------- */
  buyer: router({
    purchase: protectedProcedure
      .input(
        z.object({
          productId: z.number().int().positive(),
          couponCode: z.string().max(50).optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const product = await getProductOrThrow(input.productId);
        if (product.status !== "active" || !product.isActive) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "المنتج غير متاح للشراء حالياً | Product is not currently available for purchase",
          });
        }
        if (product.sellerId === ctx.user.id) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "لا يمكنك شراء منتجك الخاص | You cannot purchase your own product",
          });
        }

        const alreadyOwned = await db
          .select({ id: productPurchases.id })
          .from(productPurchases)
          .where(
            and(
              eq(productPurchases.productId, product.id),
              eq(productPurchases.buyerId, ctx.user.id),
              eq(productPurchases.status, "completed"),
            ),
          )
          .limit(1);
        if (alreadyOwned.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "لقد اشتريت هذا المنتج مسبقاً | You already own this product",
          });
        }

        let amount = product.price;
        let applied: AppliedCoupon | null = null;
        if (input.couponCode) {
          applied = await validateCouponForPurchase(input.couponCode.trim(), product.sellerId, amount);
          amount -= applied.discount;
        }

        const purchase = await executeProductPurchase(ctx.user.id, product, amount);
        if (applied && applied.discount > 0) {
          await recordCouponUsage(applied, ctx.user.id, purchase.purchaseId);
        }

        return {
          ...purchase,
          discount: applied?.discount ?? 0,
          downloadUrl: product.fileUrl,
          messageAr: "تم الشراء بنجاح — يمكنك التحميل الآن",
          messageEn: "Purchase completed — you can download now",
        };
      }),

    purchaseBundle: protectedProcedure
      .input(z.object({ bundleId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const bundleRows = await db
          .select()
          .from(productBundles)
          .where(eq(productBundles.id, input.bundleId))
          .limit(1);
        if (bundleRows.length === 0 || bundleRows[0].status !== "active") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "الحزمة غير موجودة أو غير مفعّلة | Bundle not found or inactive",
          });
        }
        const bundle = bundleRows[0];
        if (bundle.sellerId === ctx.user.id) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "لا يمكنك شراء حزمتك الخاصة | You cannot purchase your own bundle",
          });
        }

        let productIds: number[] = [];
        try {
          productIds = z.array(z.number().int().positive()).parse(JSON.parse(bundle.productIds));
        } catch {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "بيانات الحزمة تالفة | Bundle data is corrupted",
          });
        }

        const bundleProducts = await db.select().from(products).where(inArray(products.id, productIds));
        const purchasable = bundleProducts.filter(p => p.status === "active" && p.isActive);
        if (purchasable.length === 0) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "لا توجد منتجات متاحة في هذه الحزمة | No purchasable products in this bundle",
          });
        }
        if (bundle.bundlePrice < purchasable.length) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "سعر الحزمة غير صالح | Bundle price is invalid",
          });
        }

        // Split the bundle price across products proportionally to their list prices
        // (whole SAR, each share >= 1, remainder assigned to the last product) so that
        // each per-order escrow reference maps to a real productPurchases row.
        const listTotal = purchasable.reduce((sum, p) => sum + p.price, 0);
        const shares: number[] = [];
        let remaining = bundle.bundlePrice;
        purchasable.forEach((p, i) => {
          const left = purchasable.length - 1 - i;
          let share =
            i === purchasable.length - 1
              ? remaining
              : Math.max(1, Math.floor((bundle.bundlePrice * p.price) / Math.max(1, listTotal)));
          share = Math.min(share, remaining - left); // keep >=1 SAR for each remaining product
          shares.push(share);
          remaining -= share;
        });

        const purchases: CompletedPurchase[] = [];
        for (let i = 0; i < purchasable.length; i++) {
          purchases.push(await executeProductPurchase(ctx.user.id, purchasable[i], shares[i]));
        }

        return {
          bundleId: bundle.id,
          totalPaid: bundle.bundlePrice,
          purchases,
          messageAr: "تم شراء الحزمة بنجاح",
          messageEn: "Bundle purchased successfully",
        };
      }),

    myPurchases: protectedProcedure.query(async ({ ctx }) => {
      const db = await requireDb();
      const rows = await db
        .select({ purchase: productPurchases, product: products })
        .from(productPurchases)
        .leftJoin(products, eq(productPurchases.productId, products.id))
        .where(eq(productPurchases.buyerId, ctx.user.id))
        .orderBy(desc(productPurchases.createdAt));

      const purchaseIds = rows.map(r => r.purchase.id);
      const licenseRows =
        purchaseIds.length > 0
          ? await db.select().from(productLicenses).where(inArray(productLicenses.purchaseId, purchaseIds))
          : [];
      const licenseByPurchase = new Map(licenseRows.map(l => [l.purchaseId, l]));

      return rows.map(r => ({
        purchaseId: r.purchase.id,
        productId: r.purchase.productId,
        titleAr: r.product?.titleAr ?? "",
        titleEn: r.product?.titleEn ?? "",
        coverImage: r.product?.coverImage ?? "",
        fileType: r.product?.fileType ?? null,
        price: r.purchase.price,
        currency: r.purchase.currency,
        status: r.purchase.status,
        downloadCount: r.purchase.downloadCount,
        downloadUrl: r.purchase.status === "completed" ? (r.product?.fileUrl ?? null) : null,
        licenseKey: licenseByPurchase.get(r.purchase.id)?.licenseKey ?? null,
        licenseType: licenseByPurchase.get(r.purchase.id)?.licenseType ?? null,
        purchasedAt: r.purchase.createdAt,
      }));
    }),

    // Validates ownership, increments download counters, returns the download URL.
    download: protectedProcedure
      .input(z.object({ purchaseId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const rows = await db
          .select()
          .from(productPurchases)
          .where(eq(productPurchases.id, input.purchaseId))
          .limit(1);
        if (rows.length === 0 || rows[0].buyerId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "عملية الشراء هذه لا تخصك | This purchase does not belong to you",
          });
        }
        const purchase = rows[0];
        if (purchase.status !== "completed") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "عملية الشراء غير مكتملة — التحميل غير متاح | Purchase is not completed — download unavailable",
          });
        }

        const product = await getProductOrThrow(purchase.productId);

        await db
          .update(productPurchases)
          .set({ downloadCount: sql`${productPurchases.downloadCount} + 1` })
          .where(eq(productPurchases.id, purchase.id));
        await db
          .update(products)
          .set({ downloads: sql`${products.downloads} + 1` })
          .where(eq(products.id, product.id));

        return {
          fileUrl: product.fileUrl,
          fileType: product.fileType,
          fileSize: product.fileSize,
          titleAr: product.titleAr,
          titleEn: product.titleEn,
        };
      }),

    // Review only after a completed purchase; updates product rating/reviewsCount.
    reviewProduct: protectedProcedure
      .input(
        z.object({
          productId: z.number().int().positive(),
          rating: z.number().int().min(1).max(5),
          commentAr: z.string().max(2000).optional(),
          commentEn: z.string().max(2000).optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const product = await getProductOrThrow(input.productId);

        const owned = await db
          .select({ id: productPurchases.id })
          .from(productPurchases)
          .where(
            and(
              eq(productPurchases.productId, product.id),
              eq(productPurchases.buyerId, ctx.user.id),
              eq(productPurchases.status, "completed"),
            ),
          )
          .limit(1);
        if (owned.length === 0) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "لا يمكنك تقييم منتج لم تشترِه | You can only review products you have purchased",
          });
        }

        const existing = await db
          .select({ id: reviews.id })
          .from(reviews)
          .where(
            and(
              eq(reviews.reviewerId, ctx.user.id),
              eq(reviews.itemId, product.id),
              eq(reviews.itemType, "product"),
            ),
          )
          .limit(1);
        if (existing.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "لقد قيّمت هذا المنتج مسبقاً | You have already reviewed this product",
          });
        }

        const [inserted] = await db.insert(reviews).values({
          reviewerId: ctx.user.id,
          revieweeId: product.sellerId,
          itemId: product.id,
          itemType: "product",
          rating: input.rating,
          commentAr: input.commentAr,
          commentEn: input.commentEn,
          isPublic: true,
        });

        const agg = await db
          .select({
            avgRating: sql<string>`COALESCE(AVG(${reviews.rating}), 0)`,
            count: sql<string>`COUNT(*)`,
          })
          .from(reviews)
          .where(and(eq(reviews.itemId, product.id), eq(reviews.itemType, "product")));
        await db
          .update(products)
          .set({
            rating: Math.round(Number(agg[0]?.avgRating ?? 0)),
            reviewsCount: Number(agg[0]?.count ?? 0),
          })
          .where(eq(products.id, product.id));

        return { reviewId: inserted.insertId };
      }),
  }),

  /* ----------------------------- Coupons ------------------------------ */
  coupons: router({
    create: protectedProcedure.input(couponCreateSchema).mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      if (input.validTo <= input.validFrom) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "تاريخ انتهاء الكود يجب أن يكون بعد تاريخ البدء | Coupon end date must be after its start date",
        });
      }
      if (input.discountType === "percentage" && input.discountValue > 100) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "نسبة الخصم لا يمكن أن تتجاوز 100% | Percentage discount cannot exceed 100%",
        });
      }

      const fullCode = `${sellerCouponPrefix(ctx.user.id)}${input.code.toUpperCase()}`;
      const existing = await db
        .select({ id: coupons.id })
        .from(coupons)
        .where(eq(coupons.code, fullCode))
        .limit(1);
      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "لديك كود خصم بنفس الاسم بالفعل | You already have a coupon with this code",
        });
      }

      const [inserted] = await db.insert(coupons).values({
        code: fullCode,
        descriptionAr: input.descriptionAr,
        descriptionEn: input.descriptionEn,
        discountType: input.discountType,
        discountValue: input.discountValue,
        minPurchase: input.minPurchase,
        maxDiscount: input.maxDiscount,
        usageLimit: input.usageLimit,
        validFrom: input.validFrom,
        validTo: input.validTo,
        applicableFor: "products",
        isActive: true,
      });
      return { couponId: inserted.insertId, code: fullCode };
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await requireDb();
      return db
        .select()
        .from(coupons)
        .where(like(coupons.code, `${sellerCouponPrefix(ctx.user.id)}%`))
        .orderBy(desc(coupons.createdAt));
    }),

    deactivate: protectedProcedure
      .input(z.object({ couponId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const rows = await db.select().from(coupons).where(eq(coupons.id, input.couponId)).limit(1);
        if (rows.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "كود الخصم غير موجود | Coupon not found" });
        }
        if (couponOwnerSellerId(rows[0].code) !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "هذا الكود لا يخصك | This coupon does not belong to you",
          });
        }
        await db.update(coupons).set({ isActive: false }).where(eq(coupons.id, input.couponId));
        return { success: true } as const;
      }),
  }),

  /* ----------------------------- Bundles ------------------------------ */
  bundles: router({
    create: protectedProcedure.input(bundleCreateSchema).mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const uniqueIds = Array.from(new Set(input.productIds));
      const owned = await db
        .select()
        .from(products)
        .where(and(inArray(products.id, uniqueIds), eq(products.sellerId, ctx.user.id)));
      if (owned.length !== uniqueIds.length) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "يمكنك فقط تجميع منتجاتك الخاصة في حزمة | You can only bundle your own products",
        });
      }

      const originalPrice = owned.reduce((sum, p) => sum + p.price, 0);
      if (input.bundlePrice >= originalPrice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "سعر الحزمة يجب أن يكون أقل من مجموع أسعار المنتجات | Bundle price must be lower than the products' total price",
        });
      }
      if (input.bundlePrice < uniqueIds.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "سعر الحزمة منخفض جداً (ر.س واحد لكل منتج على الأقل) | Bundle price too low (at least 1 SAR per product)",
        });
      }

      const discount = Math.round(((originalPrice - input.bundlePrice) / originalPrice) * 100);
      const [inserted] = await db.insert(productBundles).values({
        sellerId: ctx.user.id,
        titleAr: input.titleAr,
        titleEn: input.titleEn,
        descriptionAr: input.descriptionAr,
        descriptionEn: input.descriptionEn,
        coverImage: input.coverImage,
        originalPrice,
        bundlePrice: input.bundlePrice,
        discount,
        currency: "SAR",
        productIds: JSON.stringify(uniqueIds),
        status: "active",
      });
      return { bundleId: inserted.insertId, originalPrice, discount };
    }),

    myBundles: protectedProcedure.query(async ({ ctx }) => {
      const db = await requireDb();
      return db
        .select()
        .from(productBundles)
        .where(eq(productBundles.sellerId, ctx.user.id))
        .orderBy(desc(productBundles.createdAt));
    }),

    deactivate: protectedProcedure
      .input(z.object({ bundleId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const rows = await db
          .select()
          .from(productBundles)
          .where(eq(productBundles.id, input.bundleId))
          .limit(1);
        if (rows.length === 0 || rows[0].sellerId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "هذه الحزمة لا تخصك | This bundle does not belong to you",
          });
        }
        await db.update(productBundles).set({ status: "inactive" }).where(eq(productBundles.id, input.bundleId));
        return { success: true } as const;
      }),

    list: publicProcedure.query(async () => {
      const db = await requireDb();
      return db
        .select()
        .from(productBundles)
        .where(eq(productBundles.status, "active"))
        .orderBy(desc(productBundles.createdAt));
    }),

    getById: publicProcedure
      .input(z.object({ bundleId: z.number().int().positive() }))
      .query(async ({ input }) => {
        const db = await requireDb();
        const rows = await db
          .select()
          .from(productBundles)
          .where(eq(productBundles.id, input.bundleId))
          .limit(1);
        if (rows.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "الحزمة غير موجودة | Bundle not found" });
        }
        const bundle = rows[0];
        let productIds: number[] = [];
        try {
          productIds = z.array(z.number()).parse(JSON.parse(bundle.productIds));
        } catch {
          productIds = [];
        }
        const bundleProducts =
          productIds.length > 0 ? await db.select().from(products).where(inArray(products.id, productIds)) : [];
        return { ...bundle, products: bundleProducts };
      }),
  }),

  /* ------------------------------ Public ------------------------------ */
  public: router({
    // Product details page: increments views, returns product + seller public
    // profile + public reviews (with reviewer names).
    productDetails: publicProcedure
      .input(z.object({ productId: z.number().int().positive() }))
      .query(async ({ input }) => {
        const db = await requireDb();
        const product = await getProductOrThrow(input.productId);

        await db
          .update(products)
          .set({ views: sql`${products.views} + 1` })
          .where(eq(products.id, product.id));

        const sellerRows = await db
          .select({ id: users.id, name: users.name, userType: users.userType, createdAt: users.createdAt })
          .from(users)
          .where(eq(users.id, product.sellerId))
          .limit(1);
        const sellerProfileRows = await db
          .select({
            companyName: sellerProfiles.companyName,
            companyLogo: sellerProfiles.companyLogo,
            companyDescription: sellerProfiles.companyDescription,
            isVerified: sellerProfiles.isVerified,
            rating: sellerProfiles.rating,
            totalSales: sellerProfiles.totalSales,
          })
          .from(sellerProfiles)
          .where(eq(sellerProfiles.userId, product.sellerId))
          .limit(1);

        const reviewRows = await db
          .select({ review: reviews, reviewerName: users.name })
          .from(reviews)
          .leftJoin(users, eq(reviews.reviewerId, users.id))
          .where(and(eq(reviews.itemId, product.id), eq(reviews.itemType, "product"), eq(reviews.isPublic, true)))
          .orderBy(desc(reviews.createdAt));

        return {
          product: { ...product, views: product.views + 1 },
          seller: {
            ...(sellerRows[0] ?? { id: product.sellerId, name: null, userType: "individual", createdAt: null }),
            profile: sellerProfileRows[0] ?? null,
          },
          reviews: reviewRows.map(r => ({
            id: r.review.id,
            rating: r.review.rating,
            commentAr: r.review.commentAr,
            commentEn: r.review.commentEn,
            reviewerName: r.reviewerName,
            createdAt: r.review.createdAt,
          })),
        };
      }),
  }),
});
