import { eq, desc, and, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  products, 
  productCategories,
  services,
  serviceCategories,
  servicePackages,
  serviceOrders,
  jobs,
  jobCategories,
  jobBids,
  contracts,
  reviews,
  messages,
  notifications,
  wallets,
  transactions,
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

