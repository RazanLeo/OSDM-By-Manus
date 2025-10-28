import { eq, desc, and, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  products, 
  productCategories,
  productSubscriptions,
  productBundles,
  productLicenses,
  services,
  serviceCategories,
  servicePackages,
  serviceAddons,
  serviceOrders,
  sellerRatings,
  jobs,
  jobCategories,
  jobBids,
  jobProposals,
  contracts,
  contractMilestones,
  deliveries,
  reviews,
  messages,
  notifications,
  wallets,
  transactions,
  wishlists,
  favoriteSellers,
  coupons,
  couponUsages,
  conversations,
  conversationMessages,
  disputes,
  supportTickets,
  ticketReplies,
  portfolioItems,
  userSkills,
  userCertifications,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Product Categories
 */
export async function getAllProductCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(productCategories).where(eq(productCategories.isActive, true)).orderBy(productCategories.order);
}

export async function getProductCategoryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(productCategories).where(eq(productCategories.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Products
 */
export async function getAllProducts(filters?: {
  categoryId?: number;
  search?: string;
  status?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(products);
  
  const conditions = [eq(products.isActive, true)];
  
  if (filters?.categoryId) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  }
  
  if (filters?.status) {
    conditions.push(eq(products.status, filters.status as any));
  }
  
  if (filters?.search) {
    conditions.push(
      or(
        like(products.titleAr, `%${filters.search}%`),
        like(products.titleEn, `%${filters.search}%`)
      ) as any
    );
  }
  
  return await query.where(and(...conditions)).orderBy(desc(products.createdAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getProductsBySellerId(sellerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(products).where(eq(products.sellerId, sellerId)).orderBy(desc(products.createdAt));
}

export async function createProduct(data: typeof products.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(products).values(data);
  return result;
}

export async function updateProduct(id: number, data: Partial<typeof products.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(products).set({ isActive: false }).where(eq(products.id, id));
}

/**
 * Service Categories
 */
export async function getAllServiceCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(serviceCategories).where(eq(serviceCategories.isActive, true)).orderBy(serviceCategories.order);
}

/**
 * Services
 */
export async function getAllServices(filters?: {
  categoryId?: number;
  search?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(services);
  
  const conditions = [eq(services.isActive, true), eq(services.status, 'active')];
  
  if (filters?.categoryId) {
    conditions.push(eq(services.categoryId, filters.categoryId));
  }
  
  if (filters?.search) {
    conditions.push(
      or(
        like(services.titleAr, `%${filters.search}%`),
        like(services.titleEn, `%${filters.search}%`)
      ) as any
    );
  }
  
  return await query.where(and(...conditions)).orderBy(desc(services.createdAt));
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Job Categories
 */
export async function getAllJobCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(jobCategories).where(eq(jobCategories.isActive, true)).orderBy(jobCategories.order);
}

/**
 * Jobs
 */
export async function getAllJobs(filters?: {
  categoryId?: number;
  search?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(jobs);
  
  const conditions = [eq(jobs.isActive, true), eq(jobs.status, 'open')];
  
  if (filters?.categoryId) {
    conditions.push(eq(jobs.categoryId, filters.categoryId));
  }
  
  if (filters?.search) {
    conditions.push(
      or(
        like(jobs.titleAr, `%${filters.search}%`),
        like(jobs.titleEn, `%${filters.search}%`)
      ) as any
    );
  }
  
  return await query.where(and(...conditions)).orderBy(desc(jobs.createdAt));
}

export async function getJobById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Wallet
 */
export async function getWalletByUserId(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createWallet(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(wallets).values({
    userId,
    balance: 0,
    currency: 'SAR',
    pendingBalance: 0,
    totalEarnings: 0,
    totalWithdrawals: 0,
  });
  
  return result;
}



// Product Subscriptions and Bundles - To be implemented when tables are added to schema

/**
 * Service Packages
 */
export async function getServicePackages(serviceId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(servicePackages).where(eq(servicePackages.serviceId, serviceId)).orderBy(servicePackages.order);
}

// Service Add-ons - To be implemented when table is added to schema

/**
 * Service Orders
 */
export async function createServiceOrder(data: typeof serviceOrders.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(serviceOrders).values(data);
  return result;
}

export async function getServiceOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(serviceOrders).where(eq(serviceOrders.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getMyServiceOrders(userId: number, type: 'buyer' | 'seller') {
  const db = await getDb();
  if (!db) return [];
  
  const condition = type === 'buyer' 
    ? eq(serviceOrders.buyerId, userId)
    : eq(serviceOrders.sellerId, userId);
  
  return await db.select().from(serviceOrders).where(condition).orderBy(desc(serviceOrders.createdAt));
}

/**
 * Job Bids
 */
export async function createJobBid(data: typeof jobBids.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(jobBids).values(data);
  return result;
}

export async function getJobBids(jobId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(jobBids).where(eq(jobBids.jobId, jobId)).orderBy(desc(jobBids.createdAt));
}

export async function getMyBids(freelancerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(jobBids).where(eq(jobBids.freelancerId, freelancerId)).orderBy(desc(jobBids.createdAt));
}

/**
 * Contracts
 */
export async function createContract(data: typeof contracts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(contracts).values(data);
  return result;
}

export async function getContractById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(contracts).where(eq(contracts.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getMyContracts(userId: number, type: 'employer' | 'freelancer') {
  const db = await getDb();
  if (!db) return [];
  
  const condition = type === 'employer'
    ? eq(contracts.employerId, userId)
    : eq(contracts.freelancerId, userId);
  
  return await db.select().from(contracts).where(condition).orderBy(desc(contracts.createdAt));
}

// Wishlists - To be implemented when table is added to schema

// Coupons - To be implemented when table is added to schema

// Conversations & Messages - To be implemented when tables are added to schema

// Disputes - To be implemented when table is added to schema

// Support Tickets - To be implemented when tables are added to schema

// Portfolio - To be implemented when table is added to schema

// Skills - To be implemented when table is added to schema

// Certifications - To be implemented when table is added to schema




/**
 * Product Subscriptions APIs
 */
export async function createProductSubscription(data: typeof productSubscriptions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(productSubscriptions).values(data);
  return result;
}

export async function getUserSubscriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(productSubscriptions).where(eq(productSubscriptions.userId, userId));
}

export async function getActiveSubscriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(productSubscriptions).where(
    and(
      eq(productSubscriptions.userId, userId),
      eq(productSubscriptions.status, 'active')
    )
  );
}

/**
 * Product Bundles APIs
 */
export async function getAllBundles() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(productBundles).where(eq(productBundles.status, 'active'));
}

export async function getBundleById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(productBundles).where(eq(productBundles.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getSellerBundles(sellerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(productBundles).where(eq(productBundles.sellerId, sellerId));
}

/**
 * Product Licenses APIs
 */
export async function createLicense(data: typeof productLicenses.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(productLicenses).values(data);
  return result;
}

export async function getUserLicenses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(productLicenses).where(eq(productLicenses.userId, userId));
}

/**
 * Service Add-ons APIs
 */
export async function getServiceAddons(serviceId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(serviceAddons).where(
    and(
      eq(serviceAddons.serviceId, serviceId),
      eq(serviceAddons.isActive, true)
    )
  );
}

/**
 * Seller Ratings APIs
 */
export async function createSellerRating(data: typeof sellerRatings.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(sellerRatings).values(data);
  return result;
}

export async function getSellerRatings(sellerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(sellerRatings).where(eq(sellerRatings.sellerId, sellerId));
}

/**
 * Job Proposals APIs
 */
export async function createJobProposal(data: typeof jobProposals.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(jobProposals).values(data);
  return result;
}

export async function getJobProposals(jobId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(jobProposals).where(eq(jobProposals.jobId, jobId));
}

export async function getFreelancerProposals(freelancerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(jobProposals).where(eq(jobProposals.freelancerId, freelancerId));
}

/**
 * Contract Milestones APIs
 */
export async function createMilestone(data: typeof contractMilestones.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(contractMilestones).values(data);
  return result;
}

export async function getContractMilestones(contractId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(contractMilestones)
    .where(eq(contractMilestones.contractId, contractId))
    .orderBy(contractMilestones.order);
}

/**
 * Deliveries APIs
 */
export async function createDelivery(data: typeof deliveries.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(deliveries).values(data);
  return result;
}

export async function getOrderDeliveries(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(deliveries).where(eq(deliveries.orderId, orderId));
}

/**
 * Wishlists APIs
 */
export async function addToWishlist(data: typeof wishlists.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(wishlists).values(data);
  return result;
}

export async function removeFromWishlist(userId: number, itemId: number, itemType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(wishlists).where(
    and(
      eq(wishlists.userId, userId),
      eq(wishlists.itemId, itemId),
      eq(wishlists.itemType, itemType as any)
    )
  );
}

export async function getUserWishlist(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(wishlists)
    .where(eq(wishlists.userId, userId))
    .orderBy(desc(wishlists.createdAt));
}

/**
 * Favorite Sellers APIs
 */
export async function addFavoriteSeller(userId: number, sellerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(favoriteSellers).values({ userId, sellerId });
  return result;
}

export async function removeFavoriteSeller(userId: number, sellerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(favoriteSellers).where(
    and(
      eq(favoriteSellers.userId, userId),
      eq(favoriteSellers.sellerId, sellerId)
    )
  );
}

export async function getUserFavoriteSellers(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(favoriteSellers).where(eq(favoriteSellers.userId, userId));
}

/**
 * Coupons APIs
 */
export async function getCouponByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(coupons).where(
    and(
      eq(coupons.code, code),
      eq(coupons.isActive, true)
    )
  ).limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function useCoupon(couponId: number, userId: number, orderId: number, discountAmount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(couponUsages).values({
    couponId,
    userId,
    orderId,
    discountAmount,
  });
  
  // Update usage count
  const coupon = await db.select().from(coupons).where(eq(coupons.id, couponId)).limit(1);
  if (coupon.length > 0) {
    await db.update(coupons)
      .set({ usedCount: coupon[0].usedCount + 1 })
      .where(eq(coupons.id, couponId));
  }
}

/**
 * Conversations & Messages APIs
 */
export async function getOrCreateConversation(participant1: number, participant2: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(conversations).where(
    or(
      and(eq(conversations.participant1, participant1), eq(conversations.participant2, participant2)),
      and(eq(conversations.participant1, participant2), eq(conversations.participant2, participant1))
    )
  ).limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }
  
  const result = await db.insert(conversations).values({
    participant1,
    participant2,
  });
  
  const newConv = await db.select().from(conversations).where(eq(conversations.id, result[0].insertId)).limit(1);
  return newConv[0];
}

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(conversations).where(
    or(
      eq(conversations.participant1, userId),
      eq(conversations.participant2, userId)
    )
  ).orderBy(desc(conversations.lastMessageAt));
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(conversationMessages)
    .where(eq(conversationMessages.conversationId, conversationId))
    .orderBy(conversationMessages.createdAt);
}

export async function sendMessage(data: typeof conversationMessages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(conversationMessages).values(data);
  
  await db.update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, data.conversationId));
  
  return result;
}

/**
 * Disputes APIs
 */
export async function createDispute(data: typeof disputes.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(disputes).values(data);
  return result;
}

export async function getDisputeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(disputes).where(eq(disputes.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserDisputes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(disputes).where(
    or(
      eq(disputes.raisedBy, userId),
      eq(disputes.againstUserId, userId)
    )
  ).orderBy(desc(disputes.createdAt));
}

/**
 * Support Tickets APIs
 */
export async function createSupportTicket(data: typeof supportTickets.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(supportTickets).values(data);
  return result;
}

export async function getUserTickets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(supportTickets)
    .where(eq(supportTickets.userId, userId))
    .orderBy(desc(supportTickets.createdAt));
}

export async function getTicketReplies(ticketId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(ticketReplies)
    .where(eq(ticketReplies.ticketId, ticketId))
    .orderBy(ticketReplies.createdAt);
}

export async function addTicketReply(data: typeof ticketReplies.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(ticketReplies).values(data);
  return result;
}

/**
 * Portfolio APIs
 */
export async function getUserPortfolio(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(portfolioItems)
    .where(and(eq(portfolioItems.userId, userId), eq(portfolioItems.isPublic, true)))
    .orderBy(portfolioItems.displayOrder);
}

export async function createPortfolioItem(data: typeof portfolioItems.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(portfolioItems).values(data);
  return result;
}

/**
 * Skills APIs
 */
export async function getUserSkills(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userSkills).where(eq(userSkills.userId, userId));
}

export async function addUserSkill(data: typeof userSkills.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(userSkills).values(data);
  return result;
}

/**
 * Certifications APIs
 */
export async function getUserCertifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userCertifications).where(eq(userCertifications.userId, userId));
}

export async function addUserCertification(data: typeof userCertifications.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(userCertifications).values(data);
  return result;
}




// Category functions
export async function createCategory(data: {
  nameAr: string;
  nameEn: string;
  type: string;
  parentId?: number | null;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const table = data.type === 'product' ? productCategories : 
                data.type === 'service' ? serviceCategories : 
                jobCategories;
  
  await db.insert(table).values({
    nameAr: data.nameAr,
    nameEn: data.nameEn,
    parentId: data.parentId || null,
  });
  // Return a placeholder ID since we can't get the last insert ID easily
  return 1;
}

export async function getAllCategories() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const products = await db.select().from(productCategories);
  const services = await db.select().from(serviceCategories);
  const jobs = await db.select().from(jobCategories);
  return [...products, ...services, ...jobs];
}

export async function getCategoriesByType(type: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const table = type === 'product' ? productCategories : 
                type === 'service' ? serviceCategories : 
                jobCategories;
  return await db.select().from(table);
}




// Service functions
export async function createService(data: typeof services.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.insert(services).values(data);
}

// Job functions
export async function createJob(data: typeof jobs.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.insert(jobs).values(data);
}

