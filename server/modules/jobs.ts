/**
 * TODO — Market 3: Freelance Jobs (Upwork + Mostaql + Bahr clone)
 *
 * To be implemented by the jobs market agent:
 * - accept bid -> contract funding via finance.escrowHold({market:'job', orderId: contractId})
 * - contract milestones (contractMilestones) with per-milestone escrow + progress tracking
 * - delivery/acceptance (deliveries) -> finance.escrowRelease on acceptance
 * - proposals negotiation (jobProposals), freelancer profiles + trust badges, reputation
 *
 * Financial core is in ./finance. Keep existing procedures in server/routers.ts untouched.
 */
import { router } from "../_core/trpc";

export const jobsExtRouter = router({});
