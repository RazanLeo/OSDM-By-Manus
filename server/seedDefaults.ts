import { sql } from "drizzle-orm";
import {
  productCategories,
  serviceCategories,
  jobCategories,
} from "../drizzle/schema";
import { getDb } from "./db";

const productCats = [
  { nameAr: "تطبيقات الجوال", nameEn: "Mobile Apps", icon: "📱", order: 1 },
  { nameAr: "قوالب المواقع", nameEn: "Website Templates", icon: "🌐", order: 2 },
  { nameAr: "ملفات التصميم", nameEn: "Design Files", icon: "🎨", order: 3 },
  { nameAr: "الكتب الإلكترونية", nameEn: "E-books", icon: "📚", order: 4 },
  { nameAr: "الدورات التدريبية", nameEn: "Online Courses", icon: "🎓", order: 5 },
  { nameAr: "البرمجيات والأدوات", nameEn: "Software & Tools", icon: "⚙️", order: 6 },
  { nameAr: "الموسيقى والصوتيات", nameEn: "Music & Audio", icon: "🎵", order: 7 },
  { nameAr: "الفيديو والرسوم المتحركة", nameEn: "Video & Animation", icon: "🎬", order: 8 },
];

const serviceCats = [
  { nameAr: "البرمجة والتطوير", nameEn: "Programming & Development", icon: "💻", order: 1 },
  { nameAr: "التصميم والجرافيك", nameEn: "Design & Graphics", icon: "🎨", order: 2 },
  { nameAr: "الكتابة والترجمة", nameEn: "Writing & Translation", icon: "✍️", order: 3 },
  { nameAr: "التسويق الرقمي", nameEn: "Digital Marketing", icon: "📈", order: 4 },
  { nameAr: "الفيديو والمونتاج", nameEn: "Video & Editing", icon: "🎥", order: 5 },
  { nameAr: "الأعمال والاستشارات", nameEn: "Business & Consulting", icon: "💼", order: 6 },
];

const jobCats = [
  { nameAr: "تطوير الويب", nameEn: "Web Development", icon: "🌐", order: 1 },
  { nameAr: "تطوير التطبيقات", nameEn: "App Development", icon: "📱", order: 2 },
  { nameAr: "التصميم الجرافيكي", nameEn: "Graphic Design", icon: "🎨", order: 3 },
  { nameAr: "كتابة المحتوى", nameEn: "Content Writing", icon: "✍️", order: 4 },
  { nameAr: "التسويق الإلكتروني", nameEn: "Digital Marketing", icon: "📊", order: 5 },
  { nameAr: "إدارة المشاريع", nameEn: "Project Management", icon: "📋", order: 6 },
];

// Idempotent boot-time seeding: only fills a category table when it is empty,
// so a fresh database gets working content without manual console access.
export async function seedDefaultsIfEmpty(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Seed] Database unavailable, skipping default seeding");
    return;
  }

  const tables = [
    { table: productCategories, rows: productCats, label: "product categories" },
    { table: serviceCategories, rows: serviceCats, label: "service categories" },
    { table: jobCategories, rows: jobCats, label: "job categories" },
  ] as const;

  for (const { table, rows, label } of tables) {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(table);

    if (Number(count) > 0) continue;

    for (const cat of rows) {
      await db.insert(table).values({
        ...cat,
        descriptionAr: `تصنيف ${cat.nameAr}`,
        descriptionEn: `${cat.nameEn} category`,
        isActive: true,
      });
    }
    console.log(`[Seed] Inserted ${rows.length} default ${label}`);
  }
}
