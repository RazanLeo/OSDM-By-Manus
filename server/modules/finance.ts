/**
 * OSDM Financial Core — النواة المالية للمنصة
 *
 * المحفظة (رصيد متاح / محجوز ضمان / سحب معلّق) + الضمان (Escrow) الإلزامي في الأسواق الثلاثة
 * + عمولة المنصة 25% ورسوم بوابة الدفع 5% (من config/revenue.json، قابلة للتعديل من الأدمن)
 * + رسوم إدارية ثابتة 5 ر.س عند الاسترداد + طلبات السحب وموافقة الأدمن.
 *
 * All money values are integers in whole SAR (matching the existing schema).
 * Escrow references are recorded in `transactions` as:
 *   type='purchase', status='pending', referenceType='escrow_<market>', referenceId=<orderId>
 * and settled to 'completed' (release) or 'cancelled' (refund).
 */
import fs from "fs";
import path from "path";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "../db";
import { disputes, transactions, wallets, withdrawals } from "../../drizzle/schema";
import { adminProcedure, protectedProcedure, router } from "../_core/trpc";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type EscrowMarket = "product" | "service" | "job";

export interface EscrowRef {
  market: EscrowMarket;
  orderId: number;
}

export interface RevenueConfig {
  platformCommissionPct: number;
  paymentGatewayFeePct: number;
  refundAdminFeeSAR: number;
  currency: string;
}

export interface FeeBreakdown {
  gross: number;
  platformFee: number;
  gatewayFee: number;
  totalFees: number;
  sellerNet: number;
}

export interface WalletSummary {
  userId: number;
  available: number;
  escrowHeld: number;
  pendingWithdrawal: number;
  totalEarnings: number;
  totalWithdrawals: number;
  currency: string;
}

/* ------------------------------------------------------------------ */
/* Revenue config (config/revenue.json)                                */
/* ------------------------------------------------------------------ */

const revenueConfigSchema = z.object({
  platformCommissionPct: z.number().min(0).max(100),
  paymentGatewayFeePct: z.number().min(0).max(100),
  refundAdminFeeSAR: z.number().int().min(0),
  currency: z.string().min(1).max(10),
});

const DEFAULT_REVENUE_CONFIG: RevenueConfig = {
  platformCommissionPct: 25,
  paymentGatewayFeePct: 5,
  refundAdminFeeSAR: 5,
  currency: "SAR",
};

function revenueConfigPath(): string {
  return path.resolve(process.cwd(), "config", "revenue.json");
}

/** Reads config/revenue.json; falls back to the constitution defaults (25% + 5% + 5 SAR). */
export function readRevenueConfig(): RevenueConfig {
  try {
    const raw = fs.readFileSync(revenueConfigPath(), "utf-8");
    return revenueConfigSchema.parse(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_REVENUE_CONFIG };
  }
}

/** Validates and persists the revenue config. Callers MUST be admin-only. */
export function writeRevenueConfig(config: RevenueConfig): RevenueConfig {
  const parsed = revenueConfigSchema.parse(config);
  const file = revenueConfigPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(parsed, null, 2) + "\n", "utf-8");
  return parsed;
}

/** Computes platform commission (25%) + gateway fee (5%) and the seller net for a gross amount. */
export function computeFees(gross: number, config: RevenueConfig = readRevenueConfig()): FeeBreakdown {
  const platformFee = Math.round((gross * config.platformCommissionPct) / 100);
  const gatewayFee = Math.round((gross * config.paymentGatewayFeePct) / 100);
  const totalFees = platformFee + gatewayFee;
  return { gross, platformFee, gatewayFee, totalFees, sellerNet: gross - totalFees };
}

/* ------------------------------------------------------------------ */
/* Payment gateway adapters (sandbox-ready structure)                  */
/* ------------------------------------------------------------------ */

export interface GatewayPaymentResult {
  ok: boolean;
  gatewayRef?: string;
  redirectUrl?: string;
  error?: string;
}

export interface PaymentGatewayAdapter {
  name: "paytabs" | "moyasar" | "stcpay" | "sandbox";
  isConfigured(): boolean;
  createPayment(amountSAR: number, currency: string, description: string): Promise<GatewayPaymentResult>;
  verifyPayment(gatewayRef: string): Promise<GatewayPaymentResult>;
}

const notConfigured = (name: string): GatewayPaymentResult => ({
  ok: false,
  error: `بوابة الدفع ${name} غير مهيأة (مفاتيح البيئة مفقودة) | Payment gateway ${name} is not configured (missing env keys)`,
});

export const payTabsAdapter: PaymentGatewayAdapter = {
  name: "paytabs",
  isConfigured: () => Boolean(process.env.PAYTABS_PROFILE_ID && process.env.PAYTABS_SERVER_KEY),
  async createPayment() {
    // TODO real PayTabs API call once PAYTABS_PROFILE_ID / PAYTABS_SERVER_KEY are set
    return notConfigured("PayTabs");
  },
  async verifyPayment() {
    return notConfigured("PayTabs");
  },
};

export const moyasarAdapter: PaymentGatewayAdapter = {
  name: "moyasar",
  isConfigured: () => Boolean(process.env.MOYASAR_API_KEY),
  async createPayment() {
    // TODO real Moyasar API call once MOYASAR_API_KEY is set
    return notConfigured("Moyasar");
  },
  async verifyPayment() {
    return notConfigured("Moyasar");
  },
};

export const stcPayAdapter: PaymentGatewayAdapter = {
  name: "stcpay",
  isConfigured: () => Boolean(process.env.STCPAY_MERCHANT_ID && process.env.STCPAY_API_KEY),
  async createPayment() {
    // TODO real STC Pay API call once STCPAY_MERCHANT_ID / STCPAY_API_KEY are set
    return notConfigured("STC Pay");
  },
  async verifyPayment() {
    return notConfigured("STC Pay");
  },
};

/** Simulated gateway — always succeeds, used for sandbox top-ups until real keys exist. */
export const sandboxAdapter: PaymentGatewayAdapter = {
  name: "sandbox",
  isConfigured: () => true,
  async createPayment(amountSAR, currency) {
    return { ok: true, gatewayRef: `sandbox_${Date.now()}_${amountSAR}${currency}` };
  },
  async verifyPayment(gatewayRef) {
    return { ok: true, gatewayRef };
  },
};

export function getPaymentGateway(name: PaymentGatewayAdapter["name"]): PaymentGatewayAdapter {
  switch (name) {
    case "paytabs":
      return payTabsAdapter;
    case "moyasar":
      return moyasarAdapter;
    case "stcpay":
      return stcPayAdapter;
    default:
      return sandboxAdapter;
  }
}

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

function assertPositiveInt(amount: number, label = "amount") {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `المبلغ غير صالح | Invalid ${label}: must be a positive integer (whole SAR)`,
    });
  }
}

export function escrowReferenceType(market: EscrowMarket): string {
  return `escrow_${market}`;
}

interface TxRecord {
  userId: number;
  type: "deposit" | "withdrawal" | "purchase" | "sale" | "refund" | "commission";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  descriptionAr: string;
  descriptionEn: string;
  referenceId?: string;
  referenceType?: string;
  status: "pending" | "completed" | "failed" | "cancelled";
}

async function recordTransaction(tx: TxRecord): Promise<number> {
  const db = await requireDb();
  const [result] = await db.insert(transactions).values({ ...tx, currency: "SAR" });
  return result.insertId;
}

/* ------------------------------------------------------------------ */
/* Wallet                                                              */
/* ------------------------------------------------------------------ */

export async function getOrCreateWallet(userId: number) {
  const db = await requireDb();
  const existing = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  await db.insert(wallets).values({ userId, balance: 0, currency: "SAR" });
  const created = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  if (created.length === 0) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "فشل إنشاء المحفظة | Failed to create wallet" });
  }
  return created[0];
}

export async function getWalletSummary(userId: number): Promise<WalletSummary> {
  const wallet = await getOrCreateWallet(userId);
  return {
    userId,
    available: wallet.balance,
    escrowHeld: wallet.escrowHeld,
    pendingWithdrawal: wallet.pendingWithdrawal,
    totalEarnings: wallet.totalEarnings,
    totalWithdrawals: wallet.totalWithdrawals,
    currency: wallet.currency,
  };
}

/** Sandbox/gateway top-up: credits available balance and records a 'deposit' transaction. */
export async function topUpWallet(userId: number, amount: number, gatewayRef?: string): Promise<WalletSummary> {
  assertPositiveInt(amount);
  const db = await requireDb();
  const wallet = await getOrCreateWallet(userId);
  await db
    .update(wallets)
    .set({ balance: wallet.balance + amount })
    .where(eq(wallets.userId, userId));
  await recordTransaction({
    userId,
    type: "deposit",
    amount,
    balanceBefore: wallet.balance,
    balanceAfter: wallet.balance + amount,
    descriptionAr: "شحن رصيد المحفظة",
    descriptionEn: "Wallet top-up",
    referenceId: gatewayRef ?? "sandbox",
    referenceType: "gateway",
    status: "completed",
  });
  return getWalletSummary(userId);
}

/* ------------------------------------------------------------------ */
/* Escrow                                                              */
/* ------------------------------------------------------------------ */

/** Returns the active (pending) escrow-hold transaction for a ref, or null. */
export async function findActiveEscrowHold(ref: EscrowRef) {
  const db = await requireDb();
  const rows = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.type, "purchase"),
        eq(transactions.status, "pending"),
        eq(transactions.referenceType, escrowReferenceType(ref.market)),
        eq(transactions.referenceId, String(ref.orderId)),
      ),
    )
    .orderBy(desc(transactions.createdAt))
    .limit(1);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Finds the escrow transaction for a ref whose money was ALREADY released to the
 * seller (status 'completed'). Ready digital products release escrow instantly on
 * purchase, so their post-delivery disputes reference a released — not active — hold.
 */
export async function findReleasedEscrow(ref: EscrowRef) {
  const db = await requireDb();
  const rows = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.type, "purchase"),
        eq(transactions.status, "completed"),
        eq(transactions.referenceType, escrowReferenceType(ref.market)),
        eq(transactions.referenceId, String(ref.orderId)),
      ),
    )
    .orderBy(desc(transactions.createdAt))
    .limit(1);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Admin refund AFTER escrow was already released to the seller (instant-delivery
 * products). Claws the net earnings back from the seller and refunds the buyer the
 * gross amount minus the fixed 5 SAR admin fee (per the OSDM constitution); the
 * platform returns its commission as part of making the buyer whole.
 */
export async function escrowRefundAfterRelease(
  ref: EscrowRef,
  buyerId: number,
  sellerId: number,
  grossAmount: number,
): Promise<{ refunded: number; adminFee: number; sellerDebited: number }> {
  const db = await requireDb();
  const config = readRevenueConfig();
  const fees = computeFees(grossAmount);
  const adminFee = Math.min(config.refundAdminFeeSAR, grossAmount);
  const refunded = grossAmount - adminFee;

  // 1) Claw the net sale earnings back from the seller (balance may go negative = debt)
  const sellerWallet = await getOrCreateWallet(sellerId);
  await db
    .update(wallets)
    .set({
      balance: sellerWallet.balance - fees.sellerNet,
      totalEarnings: Math.max(0, sellerWallet.totalEarnings - fees.sellerNet),
    })
    .where(eq(wallets.userId, sellerId));
  await recordTransaction({
    userId: sellerId,
    type: "refund",
    amount: fees.sellerNet,
    balanceBefore: sellerWallet.balance,
    balanceAfter: sellerWallet.balance - fees.sellerNet,
    descriptionAr: "استرجاع أرباح بيع بعد قرار نزاع لصالح المشتري",
    descriptionEn: "Sale earnings reversed after dispute resolved for the buyer",
    referenceId: String(ref.orderId),
    referenceType: escrowReferenceType(ref.market),
    status: "completed",
  });

  // 2) Refund the buyer (gross minus the fixed admin fee)
  const buyerWallet = await getOrCreateWallet(buyerId);
  await db
    .update(wallets)
    .set({ balance: buyerWallet.balance + refunded })
    .where(eq(wallets.userId, buyerId));
  await recordTransaction({
    userId: buyerId,
    type: "refund",
    amount: refunded,
    balanceBefore: buyerWallet.balance,
    balanceAfter: buyerWallet.balance + refunded,
    descriptionAr: `استرداد مبلغ بعد خصم رسوم إدارية ${adminFee} ر.س (قرار نزاع)`,
    descriptionEn: `Refund after ${adminFee} SAR admin fee (dispute decision)`,
    referenceId: String(ref.orderId),
    referenceType: escrowReferenceType(ref.market),
    status: "completed",
  });

  return { refunded, adminFee, sellerDebited: fees.sellerNet };
}

/** Throws if an open/under-review dispute exists for the ref (escrow freeze law). */
export async function assertEscrowNotFrozen(ref: EscrowRef): Promise<void> {
  const db = await requireDb();
  const disputeType = ref.market === "job" ? "contract" : ref.market === "service" ? "service_order" : "product_order";
  const idColumn = ref.market === "job" ? disputes.contractId : disputes.orderId;
  const open = await db
    .select({ id: disputes.id })
    .from(disputes)
    .where(
      and(
        eq(disputes.disputeType, disputeType),
        eq(idColumn, ref.orderId),
        inArray(disputes.status, ["open", "under_review"]),
      ),
    )
    .limit(1);
  if (open.length > 0) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "المبلغ مجمّد بسبب نزاع مفتوح — لا يمكن الإفراج عنه حتى يُحسم النزاع | Escrow is frozen by an open dispute and cannot be released until it is resolved",
    });
  }
}

/**
 * Buyer pays upfront: moves `amount` from buyer available balance into escrow.
 * Throws INSUFFICIENT balance / duplicate hold.
 */
export async function escrowHold(buyerId: number, amount: number, ref: EscrowRef): Promise<{ transactionId: number }> {
  assertPositiveInt(amount);
  const db = await requireDb();

  const existing = await findActiveEscrowHold(ref);
  if (existing) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "يوجد مبلغ محجوز بالفعل لهذا الطلب | An escrow hold already exists for this order",
    });
  }

  const wallet = await getOrCreateWallet(buyerId);
  if (wallet.balance < amount) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "الرصيد غير كافٍ — يرجى شحن المحفظة أولاً | Insufficient balance — please top up your wallet first",
    });
  }

  await db
    .update(wallets)
    .set({ balance: wallet.balance - amount, escrowHeld: wallet.escrowHeld + amount })
    .where(eq(wallets.userId, buyerId));

  const transactionId = await recordTransaction({
    userId: buyerId,
    type: "purchase",
    amount,
    balanceBefore: wallet.balance,
    balanceAfter: wallet.balance - amount,
    descriptionAr: "حجز مبلغ في الضمان (Escrow)",
    descriptionEn: "Amount held in escrow",
    referenceId: String(ref.orderId),
    referenceType: escrowReferenceType(ref.market),
    status: "pending",
  });

  return { transactionId };
}

/**
 * Delivery accepted: releases escrow to the seller minus platform commission (25%)
 * and gateway fee (5%). Records 'sale' + 'commission' transactions. Blocked while a
 * dispute for the ref is open.
 */
export async function escrowRelease(ref: EscrowRef, sellerId: number): Promise<FeeBreakdown> {
  const db = await requireDb();
  const hold = await findActiveEscrowHold(ref);
  if (!hold) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "لا يوجد مبلغ محجوز في الضمان لهذا الطلب | No active escrow hold for this order",
    });
  }
  await assertEscrowNotFrozen(ref);

  const fees = computeFees(hold.amount);

  // 1) Clear the buyer's escrow hold
  const buyerWallet = await getOrCreateWallet(hold.userId);
  await db
    .update(wallets)
    .set({ escrowHeld: Math.max(0, buyerWallet.escrowHeld - hold.amount) })
    .where(eq(wallets.userId, hold.userId));
  await db.update(transactions).set({ status: "completed" }).where(eq(transactions.id, hold.id));

  // 2) Credit the seller with the net amount
  const sellerWallet = await getOrCreateWallet(sellerId);
  await db
    .update(wallets)
    .set({
      balance: sellerWallet.balance + fees.sellerNet,
      totalEarnings: sellerWallet.totalEarnings + fees.sellerNet,
    })
    .where(eq(wallets.userId, sellerId));
  await recordTransaction({
    userId: sellerId,
    type: "sale",
    amount: fees.sellerNet,
    balanceBefore: sellerWallet.balance,
    balanceAfter: sellerWallet.balance + fees.sellerNet,
    descriptionAr: "أرباح بيع بعد خصم العمولة",
    descriptionEn: "Sale earnings after commission",
    referenceId: String(ref.orderId),
    referenceType: escrowReferenceType(ref.market),
    status: "completed",
  });

  // 3) Record platform revenue (commission + gateway fee)
  await recordTransaction({
    userId: sellerId,
    type: "commission",
    amount: fees.totalFees,
    balanceBefore: sellerWallet.balance + fees.sellerNet,
    balanceAfter: sellerWallet.balance + fees.sellerNet,
    descriptionAr: "عمولة المنصة 25% + رسوم بوابة الدفع 5%",
    descriptionEn: "Platform commission 25% + payment gateway fee 5%",
    referenceId: String(ref.orderId),
    referenceType: escrowReferenceType(ref.market),
    status: "completed",
  });

  return fees;
}

/**
 * Refunds the escrowed amount to the buyer minus the fixed 5 SAR admin fee
 * (per the OSDM constitution). Cancels the hold transaction.
 */
export async function escrowRefund(ref: EscrowRef): Promise<{ refunded: number; adminFee: number }> {
  const db = await requireDb();
  const hold = await findActiveEscrowHold(ref);
  if (!hold) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "لا يوجد مبلغ محجوز في الضمان لهذا الطلب | No active escrow hold for this order",
    });
  }

  const config = readRevenueConfig();
  const adminFee = Math.min(config.refundAdminFeeSAR, hold.amount);
  const refunded = hold.amount - adminFee;

  const buyerWallet = await getOrCreateWallet(hold.userId);
  await db
    .update(wallets)
    .set({
      escrowHeld: Math.max(0, buyerWallet.escrowHeld - hold.amount),
      balance: buyerWallet.balance + refunded,
    })
    .where(eq(wallets.userId, hold.userId));
  await db.update(transactions).set({ status: "cancelled" }).where(eq(transactions.id, hold.id));

  await recordTransaction({
    userId: hold.userId,
    type: "refund",
    amount: refunded,
    balanceBefore: buyerWallet.balance,
    balanceAfter: buyerWallet.balance + refunded,
    descriptionAr: `استرداد مبلغ بعد خصم رسوم إدارية ${adminFee} ر.س`,
    descriptionEn: `Refund after ${adminFee} SAR admin fee`,
    referenceId: String(ref.orderId),
    referenceType: escrowReferenceType(ref.market),
    status: "completed",
  });

  if (adminFee > 0) {
    await recordTransaction({
      userId: hold.userId,
      type: "commission",
      amount: adminFee,
      balanceBefore: buyerWallet.balance + refunded,
      balanceAfter: buyerWallet.balance + refunded,
      descriptionAr: "رسوم إدارية ثابتة للاسترداد (5 ر.س)",
      descriptionEn: "Fixed refund admin fee (5 SAR)",
      referenceId: String(ref.orderId),
      referenceType: escrowReferenceType(ref.market),
      status: "completed",
    });
  }

  return { refunded, adminFee };
}

/* ------------------------------------------------------------------ */
/* Withdrawals                                                         */
/* ------------------------------------------------------------------ */

export interface WithdrawalDetails {
  bankName?: string;
  bankAccountNumber?: string;
  iban?: string;
  paypalEmail?: string;
  notes?: string;
}

export async function requestWithdrawal(
  userId: number,
  amount: number,
  method: "bank_transfer" | "paypal" | "stripe",
  details: WithdrawalDetails = {},
): Promise<{ withdrawalId: number }> {
  assertPositiveInt(amount);
  const db = await requireDb();
  const wallet = await getOrCreateWallet(userId);
  if (wallet.balance < amount) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "الرصيد المتاح غير كافٍ لطلب السحب | Insufficient available balance for withdrawal",
    });
  }

  await db
    .update(wallets)
    .set({
      balance: wallet.balance - amount,
      pendingWithdrawal: wallet.pendingWithdrawal + amount,
    })
    .where(eq(wallets.userId, userId));

  const [result] = await db.insert(withdrawals).values({
    userId,
    amount,
    currency: "SAR",
    method,
    bankName: details.bankName,
    bankAccountNumber: details.bankAccountNumber,
    iban: details.iban,
    paypalEmail: details.paypalEmail,
    notes: details.notes,
    status: "pending",
  });
  const withdrawalId = result.insertId;

  await recordTransaction({
    userId,
    type: "withdrawal",
    amount,
    balanceBefore: wallet.balance,
    balanceAfter: wallet.balance - amount,
    descriptionAr: "طلب سحب رصيد",
    descriptionEn: "Withdrawal request",
    referenceId: String(withdrawalId),
    referenceType: "withdrawal",
    status: "pending",
  });

  return { withdrawalId };
}

async function getWithdrawalOrThrow(withdrawalId: number) {
  const db = await requireDb();
  const rows = await db.select().from(withdrawals).where(eq(withdrawals.id, withdrawalId)).limit(1);
  if (rows.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "طلب السحب غير موجود | Withdrawal not found" });
  }
  return rows[0];
}

/** Admin approval: settles the pending withdrawal (money leaves the platform). */
export async function approveWithdrawal(withdrawalId: number, adminNotes?: string) {
  const db = await requireDb();
  const withdrawal = await getWithdrawalOrThrow(withdrawalId);
  if (withdrawal.status !== "pending" && withdrawal.status !== "processing") {
    throw new TRPCError({ code: "PRECONDITION_FAILED", message: "طلب السحب ليس قيد الانتظار | Withdrawal is not pending" });
  }

  const wallet = await getOrCreateWallet(withdrawal.userId);
  await db
    .update(wallets)
    .set({
      pendingWithdrawal: Math.max(0, wallet.pendingWithdrawal - withdrawal.amount),
      totalWithdrawals: wallet.totalWithdrawals + withdrawal.amount,
    })
    .where(eq(wallets.userId, withdrawal.userId));

  await db
    .update(withdrawals)
    .set({ status: "completed", processedAt: new Date(), notes: adminNotes ?? withdrawal.notes })
    .where(eq(withdrawals.id, withdrawalId));

  await db
    .update(transactions)
    .set({ status: "completed" })
    .where(
      and(
        eq(transactions.type, "withdrawal"),
        eq(transactions.referenceType, "withdrawal"),
        eq(transactions.referenceId, String(withdrawalId)),
      ),
    );

  return { success: true } as const;
}

/** Admin rejection: returns the held amount to the user's available balance. */
export async function rejectWithdrawal(withdrawalId: number, reason?: string) {
  const db = await requireDb();
  const withdrawal = await getWithdrawalOrThrow(withdrawalId);
  if (withdrawal.status !== "pending" && withdrawal.status !== "processing") {
    throw new TRPCError({ code: "PRECONDITION_FAILED", message: "طلب السحب ليس قيد الانتظار | Withdrawal is not pending" });
  }

  const wallet = await getOrCreateWallet(withdrawal.userId);
  await db
    .update(wallets)
    .set({
      pendingWithdrawal: Math.max(0, wallet.pendingWithdrawal - withdrawal.amount),
      balance: wallet.balance + withdrawal.amount,
    })
    .where(eq(wallets.userId, withdrawal.userId));

  await db
    .update(withdrawals)
    .set({ status: "rejected", processedAt: new Date(), notes: reason ?? withdrawal.notes })
    .where(eq(withdrawals.id, withdrawalId));

  await db
    .update(transactions)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(transactions.type, "withdrawal"),
        eq(transactions.referenceType, "withdrawal"),
        eq(transactions.referenceId, String(withdrawalId)),
      ),
    );

  return { success: true } as const;
}

/* ------------------------------------------------------------------ */
/* Listings & platform revenue                                         */
/* ------------------------------------------------------------------ */

export async function listTransactions(userId: number, limit = 50) {
  const db = await requireDb();
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}

export async function listUserWithdrawals(userId: number) {
  const db = await requireDb();
  return db.select().from(withdrawals).where(eq(withdrawals.userId, userId)).orderBy(desc(withdrawals.createdAt));
}

export async function adminListWithdrawals(status?: "pending" | "processing" | "completed" | "rejected" | "cancelled") {
  const db = await requireDb();
  if (status) {
    return db.select().from(withdrawals).where(eq(withdrawals.status, status)).orderBy(desc(withdrawals.createdAt));
  }
  return db.select().from(withdrawals).orderBy(desc(withdrawals.createdAt));
}

/** Total platform revenue = sum of completed 'commission' transactions. */
export async function getPlatformRevenue(): Promise<number> {
  const db = await requireDb();
  const rows = await db
    .select({ total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)` })
    .from(transactions)
    .where(and(eq(transactions.type, "commission"), eq(transactions.status, "completed")));
  return rows.length > 0 ? Number(rows[0].total) : 0;
}

/* ------------------------------------------------------------------ */
/* tRPC router                                                         */
/* ------------------------------------------------------------------ */

const withdrawalMethodSchema = z.enum(["bank_transfer", "paypal", "stripe"]);

export const financeRouter = router({
  // Wallet summary: available / escrowHeld / pendingWithdrawal
  wallet: protectedProcedure.query(async ({ ctx }) => {
    return getWalletSummary(ctx.user.id);
  }),

  // Sandbox gateway top-up (real gateways return 'not configured' until keys exist)
  topUp: protectedProcedure
    .input(
      z.object({
        amount: z.number().int().positive(),
        gateway: z.enum(["sandbox", "paytabs", "moyasar", "stcpay"]).default("sandbox"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const adapter = getPaymentGateway(input.gateway);
      const payment = await adapter.createPayment(input.amount, "SAR", `Wallet top-up user ${ctx.user.id}`);
      if (!payment.ok) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: payment.error ?? "Payment failed" });
      }
      return topUpWallet(ctx.user.id, input.amount, payment.gatewayRef);
    }),

  transactions: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(200).optional() }).optional())
    .query(async ({ ctx, input }) => {
      return listTransactions(ctx.user.id, input?.limit ?? 50);
    }),

  requestWithdrawal: protectedProcedure
    .input(
      z.object({
        amount: z.number().int().positive(),
        method: withdrawalMethodSchema,
        bankName: z.string().max(100).optional(),
        bankAccountNumber: z.string().max(50).optional(),
        iban: z.string().max(50).optional(),
        paypalEmail: z.string().email().optional(),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { amount, method, ...details } = input;
      return requestWithdrawal(ctx.user.id, amount, method, details);
    }),

  myWithdrawals: protectedProcedure.query(async ({ ctx }) => {
    return listUserWithdrawals(ctx.user.id);
  }),

  gateways: protectedProcedure.query(() => {
    return [payTabsAdapter, moyasarAdapter, stcPayAdapter, sandboxAdapter].map(a => ({
      name: a.name,
      configured: a.isConfigured(),
    }));
  }),

  // ---- Admin ----
  adminListWithdrawals: adminProcedure
    .input(
      z
        .object({ status: z.enum(["pending", "processing", "completed", "rejected", "cancelled"]).optional() })
        .optional(),
    )
    .query(async ({ input }) => {
      return adminListWithdrawals(input?.status);
    }),

  adminApproveWithdrawal: adminProcedure
    .input(z.object({ withdrawalId: z.number().int(), notes: z.string().max(1000).optional() }))
    .mutation(async ({ input }) => {
      return approveWithdrawal(input.withdrawalId, input.notes);
    }),

  adminRejectWithdrawal: adminProcedure
    .input(z.object({ withdrawalId: z.number().int(), reason: z.string().max(1000).optional() }))
    .mutation(async ({ input }) => {
      return rejectWithdrawal(input.withdrawalId, input.reason);
    }),

  getRevenueConfig: adminProcedure.query(() => readRevenueConfig()),

  updateRevenueConfig: adminProcedure
    .input(
      z.object({
        platformCommissionPct: z.number().min(0).max(100),
        paymentGatewayFeePct: z.number().min(0).max(100),
        refundAdminFeeSAR: z.number().int().min(0),
        currency: z.string().min(1).max(10),
      }),
    )
    .mutation(({ input }) => writeRevenueConfig(input)),

  adminPlatformRevenue: adminProcedure.query(async () => {
    return { totalRevenue: await getPlatformRevenue() };
  }),
});
