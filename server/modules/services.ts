/**
 * TODO — Market 2: Custom Services (Fiverr + Khamsat clone)
 *
 * To be implemented by the services market agent:
 * - fix serviceOrders.create (real sellerId from service, package pricing from servicePackages)
 * - order payment via finance.escrowHold({market:'service', orderId})
 * - milestones (serviceMilestones) with per-milestone escrow
 * - deliver/accept flow (deliveries) -> finance.escrowRelease on acceptance
 * - negotiation messages, digital contracts, mutual reviews, addons
 *
 * Financial core is in ./finance. Keep existing procedures in server/routers.ts untouched.
 */
import { router } from "../_core/trpc";

export const servicesExtRouter = router({});
