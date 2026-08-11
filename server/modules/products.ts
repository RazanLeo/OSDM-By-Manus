/**
 * TODO — Market 1: Ready Digital Products (Gumroad + Picalica clone)
 *
 * To be implemented by the products market agent:
 * - purchase flow (finance.escrowHold -> productPurchases row -> download link/license)
 * - escrow release per-order on download/acceptance (finance.escrowRelease)
 * - versions, licenses (productLicenses), bundles, subscriptions
 * - coupons at checkout (coupons/couponUsages), reviews, seller sales analytics
 *
 * Financial core is in ./finance (escrowHold/escrowRelease/escrowRefund, computeFees).
 * Keep every existing procedure in server/routers.ts untouched — extend here only.
 */
import { router } from "../_core/trpc";

export const productsExtRouter = router({});
