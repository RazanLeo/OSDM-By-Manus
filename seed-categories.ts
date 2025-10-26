import { drizzle } from "drizzle-orm/mysql2";
import { productCategories, serviceCategories, jobCategories } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("Seeding product categories...");
  
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

  for (const cat of productCats) {
    await db.insert(productCategories).values({
      ...cat,
      descriptionAr: `تصنيف ${cat.nameAr}`,
      descriptionEn: `${cat.nameEn} category`,
      isActive: true,
    });
  }

  console.log("Seeding service categories...");
  
  const serviceCats = [
    { nameAr: "البرمجة والتطوير", nameEn: "Programming & Development", icon: "💻", order: 1 },
    { nameAr: "التصميم والجرافيك", nameEn: "Design & Graphics", icon: "🎨", order: 2 },
    { nameAr: "الكتابة والترجمة", nameEn: "Writing & Translation", icon: "✍️", order: 3 },
    { nameAr: "التسويق الرقمي", nameEn: "Digital Marketing", icon: "📈", order: 4 },
    { nameAr: "الفيديو والمونتاج", nameEn: "Video & Editing", icon: "🎥", order: 5 },
    { nameAr: "الأعمال والاستشارات", nameEn: "Business & Consulting", icon: "💼", order: 6 },
  ];

  for (const cat of serviceCats) {
    await db.insert(serviceCategories).values({
      ...cat,
      descriptionAr: `تصنيف ${cat.nameAr}`,
      descriptionEn: `${cat.nameEn} category`,
      isActive: true,
    });
  }

  console.log("Seeding job categories...");
  
  const jobCats = [
    { nameAr: "تطوير الويب", nameEn: "Web Development", icon: "🌐", order: 1 },
    { nameAr: "تطوير التطبيقات", nameEn: "App Development", icon: "📱", order: 2 },
    { nameAr: "التصميم الجرافيكي", nameEn: "Graphic Design", icon: "🎨", order: 3 },
    { nameAr: "كتابة المحتوى", nameEn: "Content Writing", icon: "✍️", order: 4 },
    { nameAr: "التسويق الإلكتروني", nameEn: "Digital Marketing", icon: "📊", order: 5 },
    { nameAr: "إدارة المشاريع", nameEn: "Project Management", icon: "📋", order: 6 },
  ];

  for (const cat of jobCats) {
    await db.insert(jobCategories).values({
      ...cat,
      descriptionAr: `تصنيف ${cat.nameAr}`,
      descriptionEn: `${cat.nameEn} category`,
      isActive: true,
    });
  }

  console.log("✅ Seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
