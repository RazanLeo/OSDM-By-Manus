import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * جداول المستخدمين والحسابات
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  password: varchar("password", { length: 255 }),
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



/**
 * جداول إضافية للسوق الأول: المنتجات الرقمية
 */

// نظام الاشتراكات (Gumroad Style)
export const productSubscriptions = mysqlTable("product_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  planType: mysqlEnum("planType", ["monthly", "yearly"]).notNull(),
  price: int("price").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "expired"]).default("active").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate").notNull(),
  autoRenew: boolean("autoRenew").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// نظام الحزم (Bundles)
export const productBundles = mysqlTable("product_bundles", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  titleAr: varchar("titleAr", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  coverImage: text("coverImage").notNull(),
  originalPrice: int("originalPrice").notNull(),
  bundlePrice: int("bundlePrice").notNull(),
  discount: int("discount").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  productIds: text("productIds").notNull(), // JSON array of product IDs
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// نظام التراخيص
export const productLicenses = mysqlTable("product_licenses", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  purchaseId: int("purchaseId").notNull(),
  userId: int("userId").notNull(),
  licenseKey: varchar("licenseKey", { length: 255 }).notNull().unique(),
  licenseType: mysqlEnum("licenseType", ["personal", "commercial", "extended"]).notNull(),
  activationLimit: int("activationLimit").default(1).notNull(),
  activationCount: int("activationCount").default(0).notNull(),
  expiryDate: timestamp("expiryDate"),
  status: mysqlEnum("status", ["active", "suspended", "expired"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * جداول إضافية للسوق الثاني: الخدمات حسب الطلب
 */

// نظام الإضافات (Add-ons)
export const serviceAddons = mysqlTable("service_addons", {
  id: int("id").autoincrement().primaryKey(),
  serviceId: int("serviceId").notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  price: int("price").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  deliveryTime: int("deliveryTime").notNull(), // in days
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// تقييمات البائعين المفصلة
export const sellerRatings = mysqlTable("seller_ratings", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  buyerId: int("buyerId").notNull(),
  orderId: int("orderId").notNull(),
  communicationRating: int("communicationRating").notNull(), // 1-5
  qualityRating: int("qualityRating").notNull(), // 1-5
  deliveryRating: int("deliveryRating").notNull(), // 1-5
  overallRating: int("overallRating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * جداول إضافية للسوق الثالث: فرص العمل الحر
 */

// نظام العروض (Proposals)
export const jobProposals = mysqlTable("job_proposals", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  freelancerId: int("freelancerId").notNull(),
  bidId: int("bidId"), // Link to bid if converted from bid
  coverLetterAr: text("coverLetterAr").notNull(),
  coverLetterEn: text("coverLetterEn").notNull(),
  proposedAmount: int("proposedAmount").notNull(),
  proposedDeliveryTime: int("proposedDeliveryTime").notNull(),
  milestones: text("milestones"), // JSON array of milestones
  attachments: text("attachments"), // JSON array of file URLs
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "withdrawn"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// نظام المعالم (Milestones)
export const contractMilestones = mysqlTable("contract_milestones", {
  id: int("id").autoincrement().primaryKey(),
  contractId: int("contractId").notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  dueDate: timestamp("dueDate"),
  order: int("order").default(0).notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "paid"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// نظام التسليمات
export const deliveries = mysqlTable("deliveries", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId"),
  contractId: int("contractId"),
  milestoneId: int("milestoneId"),
  deliveryType: mysqlEnum("deliveryType", ["service_order", "contract", "milestone"]).notNull(),
  deliveredBy: int("deliveredBy").notNull(),
  deliveredTo: int("deliveredTo").notNull(),
  messageAr: text("messageAr"),
  messageEn: text("messageEn"),
  files: text("files"), // JSON array of file URLs
  status: mysqlEnum("status", ["pending_review", "revision_requested", "accepted", "rejected"]).default("pending_review").notNull(),
  revisionCount: int("revisionCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * أنظمة داعمة مشتركة
 */

// نظام قائمة الأمنيات
export const wishlists = mysqlTable("wishlists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  itemId: int("itemId").notNull(),
  itemType: mysqlEnum("itemType", ["product", "service", "bundle"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// نظام البائعين المفضلين
export const favoriteSellers = mysqlTable("favorite_sellers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sellerId: int("sellerId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// نظام الكوبونات
export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
  discountValue: int("discountValue").notNull(),
  minPurchase: int("minPurchase").default(0).notNull(),
  maxDiscount: int("maxDiscount"),
  usageLimit: int("usageLimit"),
  usedCount: int("usedCount").default(0).notNull(),
  validFrom: timestamp("validFrom").notNull(),
  validTo: timestamp("validTo").notNull(),
  applicableFor: mysqlEnum("applicableFor", ["all", "products", "services", "jobs"]).default("all").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const couponUsages = mysqlTable("coupon_usages", {
  id: int("id").autoincrement().primaryKey(),
  couponId: int("couponId").notNull(),
  userId: int("userId").notNull(),
  orderId: int("orderId").notNull(),
  discountAmount: int("discountAmount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// نظام المحادثات
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  participant1: int("participant1").notNull(),
  participant2: int("participant2").notNull(),
  lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const conversationMessages = mysqlTable("conversation_messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  message: text("message").notNull(),
  attachments: text("attachments"), // JSON array
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// نظام النزاعات
export const disputes = mysqlTable("disputes", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId"),
  contractId: int("contractId"),
  disputeType: mysqlEnum("disputeType", ["service_order", "contract"]).notNull(),
  raisedBy: int("raisedBy").notNull(),
  againstUserId: int("againstUserId").notNull(),
  reason: text("reason").notNull(),
  description: text("description").notNull(),
  evidence: text("evidence"), // JSON array of file URLs
  status: mysqlEnum("status", ["open", "under_review", "resolved", "closed"]).default("open").notNull(),
  resolution: text("resolution"),
  resolvedBy: int("resolvedBy"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// نظام الدعم الفني
export const supportTickets = mysqlTable("support_tickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  category: mysqlEnum("category", ["technical", "billing", "account", "general"]).notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  description: text("description").notNull(),
  attachments: text("attachments"), // JSON array
  status: mysqlEnum("status", ["open", "in_progress", "waiting_response", "resolved", "closed"]).default("open").notNull(),
  assignedTo: int("assignedTo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const ticketReplies = mysqlTable("ticket_replies", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  userId: int("userId").notNull(),
  message: text("message").notNull(),
  attachments: text("attachments"), // JSON array
  isStaffReply: boolean("isStaffReply").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// نظام معرض الأعمال (Portfolio)
export const portfolioItems = mysqlTable("portfolio_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  coverImage: text("coverImage").notNull(),
  images: text("images"), // JSON array
  projectUrl: text("projectUrl"),
  tags: text("tags"), // JSON array
  displayOrder: int("displayOrder").default(0).notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// نظام المهارات
export const userSkills = mysqlTable("user_skills", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  skillNameAr: varchar("skillNameAr", { length: 100 }).notNull(),
  skillNameEn: varchar("skillNameEn", { length: 100 }).notNull(),
  proficiencyLevel: mysqlEnum("proficiencyLevel", ["beginner", "intermediate", "advanced", "expert"]).notNull(),
  yearsOfExperience: int("yearsOfExperience").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// نظام الشهادات
export const userCertifications = mysqlTable("user_certifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  issuer: varchar("issuer", { length: 255 }).notNull(),
  issueDate: timestamp("issueDate").notNull(),
  expiryDate: timestamp("expiryDate"),
  credentialId: varchar("credentialId", { length: 255 }),
  credentialUrl: text("credentialUrl"),
  certificateFile: text("certificateFile"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});



