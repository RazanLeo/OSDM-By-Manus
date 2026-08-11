import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import {
  jobCategories,
  jobs,
  productCategories,
  products,
  serviceCategories,
  services,
  users,
} from "../drizzle/schema";
import { getDb } from "./db";
import {
  CatalogEntry,
  JOB_CATALOG,
  PRODUCT_CATALOG,
  SERVICE_CATALOG,
} from "./seedCatalog";

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;
type CategoryTable =
  | typeof productCategories
  | typeof serviceCategories
  | typeof jobCategories;

function countEntries(entries: CatalogEntry[]): number {
  let total = 0;
  for (const entry of entries) {
    total += 1 + (entry.children ? countEntries(entry.children) : 0);
  }
  return total;
}

async function insertTree(
  db: Db,
  table: CategoryTable,
  entries: CatalogEntry[],
  parentId: number | null
): Promise<void> {
  let order = 1;
  for (const entry of entries) {
    const [inserted] = await db
      .insert(table)
      .values({
        nameAr: entry.ar,
        nameEn: entry.en,
        descriptionAr: entry.descAr ?? null,
        descriptionEn: entry.descEn ?? null,
        icon: entry.icon ?? null,
        parentId,
        order: order++,
        isActive: true,
      })
      .$returningId();
    if (entry.children?.length) {
      await insertTree(db, table, entry.children, inserted.id);
    }
  }
}

async function syncCatalog(
  db: Db,
  table: CategoryTable,
  catalog: CatalogEntry[],
  label: string
): Promise<void> {
  const expected = countEntries(catalog);
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(table);

  if (Number(count) === expected) return;

  // الكتالوج تغيّر (أو كان مزروعاً بنسخة قديمة/خاطئة) → إعادة زرع كاملة
  await db.delete(table);
  await insertTree(db, table, catalog, null);
  console.log(`[Seed] Catalog "${label}" seeded with ${expected} entries`);
}

async function findCategoryId(
  db: Db,
  table: CategoryTable,
  nameAr: string
): Promise<number | null> {
  const rows = await db
    .select({ id: table.id })
    .from(table)
    .where(eq(table.nameAr, nameAr))
    .limit(1);
  return rows[0]?.id ?? null;
}

async function ensureUser(
  db: Db,
  data: {
    email: string;
    name: string;
    password: string;
    role: "user" | "admin";
  }
): Promise<number | null> {
  const existing = await db
    .select({ id: users.id, role: users.role, password: users.password })
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (existing[0]) {
    const passwordMatches = existing[0].password
      ? await bcrypt.compare(data.password, existing[0].password)
      : false;
    if (existing[0].role !== data.role || !passwordMatches) {
      await db
        .update(users)
        .set({
          role: data.role,
          password: await bcrypt.hash(data.password, 10),
          name: data.name,
        })
        .where(eq(users.id, existing[0].id));
    }
    return existing[0].id;
  }

  const hashed = await bcrypt.hash(data.password, 10);
  const [inserted] = await db
    .insert(users)
    .values({
      email: data.email,
      name: data.name,
      password: hashed,
      role: data.role,
      loginMethod: "email",
    })
    .$returningId();
  return inserted.id;
}

// عينة واحدة في كل سوق للتحقق من عمل الأسواق الثلاثة (كما طلبت المالكة)
async function seedSamples(db: Db, sellerId: number): Promise<void> {
  const [{ productCount }] = await db
    .select({ productCount: sql<number>`count(*)` })
    .from(products);
  if (Number(productCount) === 0) {
    const categoryId = await findCategoryId(
      db,
      productCategories,
      "كتب تطوير وتنمية الذات"
    );
    if (categoryId) {
      await db.insert(products).values({
        sellerId,
        categoryId,
        titleAr: "كتاب إلكتروني: عادات النجاح الرقمية",
        titleEn: "E-Book: Digital Success Habits",
        descriptionAr:
          "كتاب إلكتروني تجريبي في تطوير الذات يشرح بناء العادات الإنتاجية خطوة بخطوة. منتج تجريبي للتحقق من عمل سوق المنتجات الرقمية الجاهزة.",
        descriptionEn:
          "A sample self-development e-book explaining how to build productive habits step by step. Sample product to verify the ready-made digital products market.",
        price: 49,
        currency: "SAR",
        coverImage: "/logo.png",
        fileUrl: "/logo.png",
        fileType: "pdf",
        tags: "تطوير الذات,كتاب إلكتروني,عادات",
        status: "active",
        isActive: true,
      });
      console.log("[Seed] Sample product inserted");
    }
  }

  const [{ serviceCount }] = await db
    .select({ serviceCount: sql<number>`count(*)` })
    .from(services);
  if (Number(serviceCount) === 0) {
    const categoryId = await findCategoryId(db, serviceCategories, "تصميم الشعارات");
    if (categoryId) {
      await db.insert(services).values({
        sellerId,
        categoryId,
        titleAr: "خدمة تصميم شعار احترافي لهويتك التجارية",
        titleEn: "Professional Logo Design for Your Brand",
        descriptionAr:
          "خدمة تجريبية لتصميم شعار احترافي مع 3 مقترحات ومراجعتين مجانيتين وتسليم بصيغ متعددة. خدمة تجريبية للتحقق من عمل سوق الخدمات حسب الطلب.",
        descriptionEn:
          "A sample service for professional logo design with 3 concepts, 2 free revisions and multi-format delivery. Sample service to verify the custom services market.",
        startingPrice: 250,
        currency: "SAR",
        deliveryTime: 3,
        deliveryTimeUnit: "days",
        coverImage: "/logo.png",
        tags: "شعار,هوية بصرية,تصميم",
        status: "active",
        isActive: true,
      });
      console.log("[Seed] Sample service inserted");
    }
  }

  const [{ jobCount }] = await db
    .select({ jobCount: sql<number>`count(*)` })
    .from(jobs);
  if (Number(jobCount) === 0) {
    const categoryId = await findCategoryId(db, jobCategories, "تطوير مواقع الويب");
    if (categoryId) {
      await db.insert(jobs).values({
        employerId: sellerId,
        categoryId,
        titleAr: "مطلوب مطور ويب لبناء متجر إلكتروني",
        titleEn: "Web Developer Needed to Build an Online Store",
        descriptionAr:
          "مشروع تجريبي: بناء متجر إلكتروني متكامل بواجهة عربية وإنجليزية مع بوابة دفع. فرصة تجريبية للتحقق من عمل سوق فرص العمل الحر.",
        descriptionEn:
          "Sample project: build a complete online store with Arabic/English UI and a payment gateway. Sample opportunity to verify the freelance marketplace.",
        budget: 5000,
        budgetType: "fixed",
        currency: "SAR",
        duration: 30,
        durationUnit: "days",
        experienceLevel: "intermediate",
        skills: "React,Node.js,MySQL,تجارة إلكترونية",
        status: "open",
        isActive: true,
      });
      console.log("[Seed] Sample job inserted");
    }
  }
}

/**
 * زرع تلقائي عند الإقلاع:
 * 1) الكتالوج الكامل للتصنيفات من البرومبت (يُعاد زرعه إذا اختلف العدد عن المتوقع)
 * 2) حساب الإدارة + بائع تجريبي
 * 3) منتج/خدمة/وظيفة تجريبية واحدة في كل سوق (إذا كانت الجداول فارغة)
 */
export async function seedDefaultsIfEmpty(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Seed] Database unavailable, skipping seeding");
    return;
  }

  await syncCatalog(db, productCategories, PRODUCT_CATALOG, "products");
  await syncCatalog(db, serviceCategories, SERVICE_CATALOG, "services");
  await syncCatalog(db, jobCategories, JOB_CATALOG, "jobs");

  // الحسابات المنصوص عليها حرفياً في البرومبت
  await ensureUser(db, {
    email: "razan@osdm.sa",
    name: "Razan@OSDM",
    password: "RazanOSDM@056300",
    role: "admin",
  });

  await ensureUser(db, {
    email: "admin@osdm.sa",
    name: "admin",
    password: "admin@123456",
    role: "admin",
  });

  await ensureUser(db, {
    email: "Guest@osdm.sa",
    name: "Guest",
    password: "guest@123456",
    role: "user",
  });

  const sellerId = await ensureUser(db, {
    email: "seller@osdm.sa",
    name: "بائع تجريبي",
    password: "OSDM-Seller@2026",
    role: "user",
  });

  if (sellerId) {
    await seedSamples(db, sellerId);
  }
}
