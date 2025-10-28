import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * جداول المستخدمين والحسابات
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  userType: mysqlEnum("userType", ["individual", "company"]).default("individual").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  phone: varchar("phone", { length: 20 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  address: text("address"),
  website: varchar("website", { length: 255 }),
  facebook: varchar("facebook", { length: 255 }),
  twitter: varchar("twitter", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  instagram: varchar("instagram", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const sellerProfiles = mysqlTable("seller_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  companyName: text("companyName"),
  companyLogo: text("companyLogo"),
  companyDescription: text("companyDescription"),
  taxNumber: varchar("taxNumber", { length: 50 }),
  commercialRegister: varchar("commercialRegister", { length: 50 }),
  bankName: varchar("bankName", { length: 100 }),
  bankAccountNumber: varchar("bankAccountNumber", { length: 50 }),
  iban: varchar("iban", { length: 50 }),
  isVerified: boolean("isVerified").default(false).notNull(),
  rating: int("rating").default(0).notNull(),
  totalSales: int("totalSales").default(0).notNull(),
  totalEarnings: int("totalEarnings").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * السوق الأول: سوق المنتجات الرقمية الجاهزة
 */
export const productCategories = mysqlTable("product_categories", {
  id: int("id").autoincrement().primaryKey(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  icon: varchar("icon", { length: 255 }),
  parentId: int("parentId"),
  order: int("order").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  categoryId: int("categoryId").notNull(),
  titleAr: varchar("titleAr", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  price: int("price").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  coverImage: text("coverImage").notNull(),
  images: text("images"),
  demoUrl: text("demoUrl"),
  tags: text("tags"),
  fileUrl: text("fileUrl").notNull(),
  fileSize: int("fileSize"),
  fileType: varchar("fileType", { length: 100 }),
  downloads: int("downloads").default(0).notNull(),
  views: int("views").default(0).notNull(),
  rating: int("rating").default(0).notNull(),
  reviewsCount: int("reviewsCount").default(0).notNull(),
  status: mysqlEnum("status", ["draft", "pending", "active", "rejected", "suspended"]).default("draft").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const productPurchases = mysqlTable("product_purchases", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId").notNull(),
  price: int("price").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  transactionId: varchar("transactionId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "refunded", "cancelled"]).default("pending").notNull(),
  downloadCount: int("downloadCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * السوق الثاني: سوق الخدمات الرقمية المتخصصة حسب الطلب
 */
export const serviceCategories = mysqlTable("service_categories", {
  id: int("id").autoincrement().primaryKey(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  icon: varchar("icon", { length: 255 }),
  parentId: int("parentId"),
  order: int("order").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  categoryId: int("categoryId").notNull(),
  titleAr: varchar("titleAr", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  startingPrice: int("startingPrice").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  deliveryTime: int("deliveryTime").notNull(),
  deliveryTimeUnit: mysqlEnum("deliveryTimeUnit", ["hours", "days", "weeks"]).default("days").notNull(),
  coverImage: text("coverImage").notNull(),
  images: text("images"),
  tags: text("tags"),
  views: int("views").default(0).notNull(),
  ordersCount: int("ordersCount").default(0).notNull(),
  rating: int("rating").default(0).notNull(),
  reviewsCount: int("reviewsCount").default(0).notNull(),
  status: mysqlEnum("status", ["draft", "pending", "active", "rejected", "suspended"]).default("draft").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const servicePackages = mysqlTable("service_packages", {
  id: int("id").autoincrement().primaryKey(),
  serviceId: int("serviceId").notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  price: int("price").notNull(),
  deliveryTime: int("deliveryTime").notNull(),
  deliveryTimeUnit: mysqlEnum("deliveryTimeUnit", ["hours", "days", "weeks"]).default("days").notNull(),
  features: text("features"),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const serviceOrders = mysqlTable("service_orders", {
  id: int("id").autoincrement().primaryKey(),
  serviceId: int("serviceId").notNull(),
  packageId: int("packageId"),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId").notNull(),
  titleAr: varchar("titleAr", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  price: int("price").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  deliveryTime: int("deliveryTime").notNull(),
  deliveryTimeUnit: mysqlEnum("deliveryTimeUnit", ["hours", "days", "weeks"]).default("days").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "delivered", "revision", "completed", "cancelled", "disputed"]).default("pending").notNull(),
  transactionId: varchar("transactionId", { length: 255 }),
  startDate: timestamp("startDate"),
  deliveryDate: timestamp("deliveryDate"),
  completedDate: timestamp("completedDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const serviceMilestones = mysqlTable("service_milestones", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  amount: int("amount").notNull(),
  dueDate: timestamp("dueDate"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * السوق الثالث: سوق فرص العمل الحر الرقمي عن بعد
 */
export const jobCategories = mysqlTable("job_categories", {
  id: int("id").autoincrement().primaryKey(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  icon: varchar("icon", { length: 255 }),
  parentId: int("parentId"),
  order: int("order").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  employerId: int("employerId").notNull(),
  categoryId: int("categoryId").notNull(),
  titleAr: varchar("titleAr", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  budget: int("budget").notNull(),
  budgetType: mysqlEnum("budgetType", ["fixed", "hourly"]).default("fixed").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  duration: int("duration"),
  durationUnit: mysqlEnum("durationUnit", ["hours", "days", "weeks", "months"]).default("days").notNull(),
  experienceLevel: mysqlEnum("experienceLevel", ["beginner", "intermediate", "expert"]).default("intermediate").notNull(),
  skills: text("skills"),
  attachments: text("attachments"),
  views: int("views").default(0).notNull(),
  bidsCount: int("bidsCount").default(0).notNull(),
  status: mysqlEnum("status", ["draft", "open", "in_progress", "completed", "cancelled", "closed"]).default("draft").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  deadline: timestamp("deadline"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const jobBids = mysqlTable("job_bids", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  freelancerId: int("freelancerId").notNull(),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  deliveryTime: int("deliveryTime").notNull(),
  deliveryTimeUnit: mysqlEnum("deliveryTimeUnit", ["hours", "days", "weeks"]).default("days").notNull(),
  proposalAr: text("proposalAr").notNull(),
  proposalEn: text("proposalEn").notNull(),
  attachments: text("attachments"),
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "withdrawn"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const contracts = mysqlTable("contracts", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  bidId: int("bidId").notNull(),
  employerId: int("employerId").notNull(),
  freelancerId: int("freelancerId").notNull(),
  titleAr: varchar("titleAr", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  deliveryTime: int("deliveryTime").notNull(),
  deliveryTimeUnit: mysqlEnum("deliveryTimeUnit", ["hours", "days", "weeks"]).default("days").notNull(),
  status: mysqlEnum("status", ["active", "in_progress", "delivered", "completed", "cancelled", "disputed"]).default("active").notNull(),
  transactionId: varchar("transactionId", { length: 255 }),
  startDate: timestamp("startDate"),
  deliveryDate: timestamp("deliveryDate"),
  completedDate: timestamp("completedDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * جداول مشتركة
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  reviewerId: int("reviewerId").notNull(),
  revieweeId: int("revieweeId").notNull(),
  itemId: int("itemId").notNull(),
  itemType: mysqlEnum("itemType", ["product", "service", "job"]).notNull(),
  rating: int("rating").notNull(),
  commentAr: text("commentAr"),
  commentEn: text("commentEn"),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  receiverId: int("receiverId").notNull(),
  subject: varchar("subject", { length: 500 }),
  body: text("body").notNull(),
  attachments: text("attachments"),
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  bodyAr: text("bodyAr"),
  bodyEn: text("bodyEn"),
  type: mysqlEnum("type", ["info", "success", "warning", "error"]).default("info").notNull(),
  link: varchar("link", { length: 500 }),
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  balance: int("balance").default(0).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  pendingBalance: int("pendingBalance").default(0).notNull(),
  totalEarnings: int("totalEarnings").default(0).notNull(),
  totalWithdrawals: int("totalWithdrawals").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["deposit", "withdrawal", "purchase", "sale", "refund", "commission"]).notNull(),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  balanceBefore: int("balanceBefore").notNull(),
  balanceAfter: int("balanceAfter").notNull(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  referenceId: varchar("referenceId", { length: 255 }),
  referenceType: varchar("referenceType", { length: 50 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const withdrawals = mysqlTable("withdrawals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  method: mysqlEnum("method", ["bank_transfer", "paypal", "stripe"]).notNull(),
  bankName: varchar("bankName", { length: 100 }),
  bankAccountNumber: varchar("bankAccountNumber", { length: 50 }),
  iban: varchar("iban", { length: 50 }),
  paypalEmail: varchar("paypalEmail", { length: 320 }),
  status: mysqlEnum("status", ["pending", "processing", "completed", "rejected", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Types
 */
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type SellerProfile = typeof sellerProfiles.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;

