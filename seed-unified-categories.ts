import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { productCategories, serviceCategories, jobCategories } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

/**
 * تصنيفات المنتجات الرقمية (Picalica + Gumroad)
 */
const productCategoriesData = [
  // من Picalica
  { nameAr: "التصميم الجرافيكي", nameEn: "Graphic Design", icon: "🎨", order: 1 },
  { nameAr: "تطوير الويب", nameEn: "Web Development", icon: "💻", order: 2 },
  { nameAr: "تطوير التطبيقات", nameEn: "App Development", icon: "📱", order: 3 },
  { nameAr: "التصوير الفوتوغرافي", nameEn: "Photography", icon: "📸", order: 4 },
  { nameAr: "الفيديو والأنيميشن", nameEn: "Video & Animation", icon: "🎬", order: 5 },
  { nameAr: "الموسيقى والصوتيات", nameEn: "Music & Audio", icon: "🎵", order: 6 },
  { nameAr: "الكتابة والترجمة", nameEn: "Writing & Translation", icon: "✍️", order: 7 },
  { nameAr: "التسويق الرقمي", nameEn: "Digital Marketing", icon: "📊", order: 8 },
  { nameAr: "الأعمال والاستشارات", nameEn: "Business & Consulting", icon: "💼", order: 9 },
  { nameAr: "البرمجة والتقنية", nameEn: "Programming & Tech", icon: "⚙️", order: 10 },
  { nameAr: "التعليم والتدريب", nameEn: "Education & Training", icon: "🎓", order: 11 },
  { nameAr: "أسلوب الحياة", nameEn: "Lifestyle", icon: "🌟", order: 12 },
  
  // من Gumroad
  { nameAr: "الرسم والتلوين", nameEn: "Drawing & Painting", icon: "🖌️", order: 13 },
  { nameAr: "التصميم ثلاثي الأبعاد", nameEn: "3D Design", icon: "🎲", order: 14 },
  { nameAr: "الخطوط والأيقونات", nameEn: "Fonts & Icons", icon: "🔤", order: 15 },
  { nameAr: "القوالب والثيمات", nameEn: "Templates & Themes", icon: "📄", order: 16 },
  { nameAr: "الكتب الإلكترونية", nameEn: "E-books", icon: "📚", order: 17 },
  { nameAr: "الدورات التدريبية", nameEn: "Online Courses", icon: "🎯", order: 18 },
  { nameAr: "البرمجيات والإضافات", nameEn: "Software & Plugins", icon: "🔌", order: 19 },
  { nameAr: "الألعاب والترفيه", nameEn: "Games & Entertainment", icon: "🎮", order: 20 },
];

/**
 * تصنيفات الخدمات المصغرة (Khamsat)
 */
const serviceCategoriesData = [
  // التصنيفات الرئيسية من Khamsat
  { nameAr: "تصميم", nameEn: "Design", icon: "🎨", order: 1 },
  { nameAr: "كتابة وترجمة", nameEn: "Writing & Translation", icon: "✍️", order: 2 },
  { nameAr: "تسويق رقمي", nameEn: "Digital Marketing", icon: "📊", order: 3 },
  { nameAr: "برمجة وتطوير", nameEn: "Programming & Development", icon: "💻", order: 4 },
  { nameAr: "فيديو وأنيميشن", nameEn: "Video & Animation", icon: "🎬", order: 5 },
  { nameAr: "هندسة وعمارة", nameEn: "Engineering & Architecture", icon: "🏗️", order: 6 },
  { nameAr: "أعمال", nameEn: "Business", icon: "💼", order: 7 },
  { nameAr: "صوتيات", nameEn: "Audio", icon: "🎵", order: 8 },
  { nameAr: "تعليم عن بعد", nameEn: "Online Education", icon: "🎓", order: 9 },
  { nameAr: "بيانات", nameEn: "Data", icon: "📈", order: 10 },
  { nameAr: "أسلوب حياة", nameEn: "Lifestyle", icon: "🌟", order: 11 },
  { nameAr: "ألعاب", nameEn: "Gaming", icon: "🎮", order: 12 },
];

/**
 * تصنيفات المشاريع والعمل الحر (Mostaql)
 */
const jobCategoriesData = [
  { nameAr: "أعمال وخدمات استشارية", nameEn: "Business & Consulting Services", icon: "💼", order: 1 },
  { nameAr: "برمجة، تطوير المواقع والتطبيقات", nameEn: "Programming, Web & App Development", icon: "💻", order: 2 },
  { nameAr: "هندسة، عمارة وتصميم داخلي", nameEn: "Engineering, Architecture & Interior Design", icon: "🏗️", order: 3 },
  { nameAr: "تصميم، فيديو وصوتيات", nameEn: "Design, Video & Audio", icon: "🎨", order: 4 },
  { nameAr: "تسويق إلكتروني ومبيعات", nameEn: "Digital Marketing & Sales", icon: "📊", order: 5 },
  { nameAr: "كتابة، تحرير، ترجمة ولغات", nameEn: "Writing, Editing, Translation & Languages", icon: "✍️", order: 6 },
  { nameAr: "دعم، مساعدة وإدخال بيانات", nameEn: "Support, Assistance & Data Entry", icon: "🆘", order: 7 },
  { nameAr: "تدريب وتعليم عن بعد", nameEn: "Training & Online Education", icon: "🎓", order: 8 },
];

/**
 * التصنيفات الفرعية للمنتجات
 */
const productSubCategories = [
  // التصميم الجرافيكي
  { nameAr: "تصميم شعارات", nameEn: "Logo Design", parentName: "التصميم الجرافيكي", order: 1 },
  { nameAr: "هوية بصرية", nameEn: "Brand Identity", parentName: "التصميم الجرافيكي", order: 2 },
  { nameAr: "تصميم سوشيال ميديا", nameEn: "Social Media Design", parentName: "التصميم الجرافيكي", order: 3 },
  { nameAr: "تصميم إعلانات", nameEn: "Advertisement Design", parentName: "التصميم الجرافيكي", order: 4 },
  { nameAr: "تصميم بطاقات", nameEn: "Card Design", parentName: "التصميم الجرافيكي", order: 5 },
  
  // تطوير الويب
  { nameAr: "مواقع ووردبريس", nameEn: "WordPress Sites", parentName: "تطوير الويب", order: 1 },
  { nameAr: "متاجر إلكترونية", nameEn: "E-commerce Stores", parentName: "تطوير الويب", order: 2 },
  { nameAr: "صفحات هبوط", nameEn: "Landing Pages", parentName: "تطوير الويب", order: 3 },
  { nameAr: "قوالب HTML/CSS", nameEn: "HTML/CSS Templates", parentName: "تطوير الويب", order: 4 },
  
  // تطوير التطبيقات
  { nameAr: "تطبيقات iOS", nameEn: "iOS Apps", parentName: "تطوير التطبيقات", order: 1 },
  { nameAr: "تطبيقات Android", nameEn: "Android Apps", parentName: "تطوير التطبيقات", order: 2 },
  { nameAr: "تطبيقات React Native", nameEn: "React Native Apps", parentName: "تطوير التطبيقات", order: 3 },
  { nameAr: "تطبيقات Flutter", nameEn: "Flutter Apps", parentName: "تطوير التطبيقات", order: 4 },
  
  // الفيديو والأنيميشن
  { nameAr: "مونتاج فيديو", nameEn: "Video Editing", parentName: "الفيديو والأنيميشن", order: 1 },
  { nameAr: "موشن جرافيك", nameEn: "Motion Graphics", parentName: "الفيديو والأنيميشن", order: 2 },
  { nameAr: "أنيميشن 2D", nameEn: "2D Animation", parentName: "الفيديو والأنيميشن", order: 3 },
  { nameAr: "أنيميشن 3D", nameEn: "3D Animation", parentName: "الفيديو والأنيميشن", order: 4 },
  { nameAr: "انترو وأوترو", nameEn: "Intro & Outro", parentName: "الفيديو والأنيميشن", order: 5 },
  
  // الموسيقى والصوتيات
  { nameAr: "تعليق صوتي", nameEn: "Voice Over", parentName: "الموسيقى والصوتيات", order: 1 },
  { nameAr: "إنتاج موسيقي", nameEn: "Music Production", parentName: "الموسيقى والصوتيات", order: 2 },
  { nameAr: "مؤثرات صوتية", nameEn: "Sound Effects", parentName: "الموسيقى والصوتيات", order: 3 },
  { nameAr: "هندسة صوتية", nameEn: "Audio Engineering", parentName: "الموسيقى والصوتيات", order: 4 },
  
  // الكتابة والترجمة
  { nameAr: "كتابة محتوى", nameEn: "Content Writing", parentName: "الكتابة والترجمة", order: 1 },
  { nameAr: "ترجمة", nameEn: "Translation", parentName: "الكتابة والترجمة", order: 2 },
  { nameAr: "تدقيق لغوي", nameEn: "Proofreading", parentName: "الكتابة والترجمة", order: 3 },
  { nameAr: "كتابة إبداعية", nameEn: "Creative Writing", parentName: "الكتابة والترجمة", order: 4 },
  { nameAr: "كتابة تقنية", nameEn: "Technical Writing", parentName: "الكتابة والترجمة", order: 5 },
  
  // التسويق الرقمي
  { nameAr: "SEO", nameEn: "SEO", parentName: "التسويق الرقمي", order: 1 },
  { nameAr: "إعلانات Google", nameEn: "Google Ads", parentName: "التسويق الرقمي", order: 2 },
  { nameAr: "إعلانات Facebook", nameEn: "Facebook Ads", parentName: "التسويق الرقمي", order: 3 },
  { nameAr: "إدارة سوشيال ميديا", nameEn: "Social Media Management", parentName: "التسويق الرقمي", order: 4 },
  { nameAr: "التسويق بالمحتوى", nameEn: "Content Marketing", parentName: "التسويق الرقمي", order: 5 },
  { nameAr: "التسويق بالبريد الإلكتروني", nameEn: "Email Marketing", parentName: "التسويق الرقمي", order: 6 },
];

/**
 * التصنيفات الفرعية للخدمات
 */
const serviceSubCategories = [
  // تصميم
  { nameAr: "تصاميم سوشيال ميديا", nameEn: "Social Media Designs", parentName: "تصميم", order: 1 },
  { nameAr: "تصميم مواقع وتطبيقات", nameEn: "Website & App Design", parentName: "تصميم", order: 2 },
  { nameAr: "تعديل وتحسين الصور", nameEn: "Photo Editing & Enhancement", parentName: "تصميم", order: 3 },
  { nameAr: "تصاميم العلامة التجارية", nameEn: "Brand Identity Designs", parentName: "تصميم", order: 4 },
  { nameAr: "تصاميم تسويقية", nameEn: "Marketing Designs", parentName: "تصميم", order: 5 },
  { nameAr: "تصميم شعار", nameEn: "Logo Design", parentName: "تصميم", order: 6 },
  
  // برمجة وتطوير
  { nameAr: "ووردبريس", nameEn: "WordPress", parentName: "برمجة وتطوير", order: 1 },
  { nameAr: "تطوير مواقع", nameEn: "Web Development", parentName: "برمجة وتطوير", order: 2 },
  { nameAr: "دعم فني تقني", nameEn: "Technical Support", parentName: "برمجة وتطوير", order: 3 },
  { nameAr: "تطوير برمجيات", nameEn: "Software Development", parentName: "برمجة وتطوير", order: 4 },
  { nameAr: "إنشاء متجر إلكتروني", nameEn: "E-commerce Store Creation", parentName: "برمجة وتطوير", order: 5 },
  { nameAr: "برمجة تطبيقات جوال", nameEn: "Mobile App Development", parentName: "برمجة وتطوير", order: 6 },
  
  // فيديو وأنيميشن
  { nameAr: "تصميم انترو", nameEn: "Intro Design", parentName: "فيديو وأنيميشن", order: 1 },
  { nameAr: "مونتاج فيديو", nameEn: "Video Editing", parentName: "فيديو وأنيميشن", order: 2 },
  { nameAr: "أنيميشن وموشن جرافيك", nameEn: "Animation & Motion Graphics", parentName: "فيديو وأنيميشن", order: 3 },
  { nameAr: "إنتاج الفيديو", nameEn: "Video Production", parentName: "فيديو وأنيميشن", order: 4 },
  { nameAr: "فيديوهات سوشيال ميديا", nameEn: "Social Media Videos", parentName: "فيديو وأنيميشن", order: 5 },
];

async function seedCategories() {
  console.log("🌱 بدء إضافة التصنيفات...");
  
  try {
    // إضافة تصنيفات المنتجات الرئيسية
    console.log("📦 إضافة تصنيفات المنتجات الرئيسية...");
    for (const cat of productCategoriesData) {
      await db.insert(productCategories).values({
        ...cat,
        isActive: true,
      }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
    }
    
    // إضافة التصنيفات الفرعية للمنتجات
    console.log("📦 إضافة التصنيفات الفرعية للمنتجات...");
    for (const subCat of productSubCategories) {
      const parent = await db.select().from(productCategories)
        .where(eq(productCategories.nameAr, subCat.parentName))
        .limit(1);
      
      if (parent.length > 0) {
        await db.insert(productCategories).values({
          nameAr: subCat.nameAr,
          nameEn: subCat.nameEn,
          parentId: parent[0].id,
          order: subCat.order,
          isActive: true,
        }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
      }
    }
    
    // إضافة تصنيفات الخدمات الرئيسية
    console.log("🛠️ إضافة تصنيفات الخدمات الرئيسية...");
    for (const cat of serviceCategoriesData) {
      await db.insert(serviceCategories).values({
        ...cat,
        isActive: true,
      }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
    }
    
    // إضافة التصنيفات الفرعية للخدمات
    console.log("🛠️ إضافة التصنيفات الفرعية للخدمات...");
    for (const subCat of serviceSubCategories) {
      const parent = await db.select().from(serviceCategories)
        .where(eq(serviceCategories.nameAr, subCat.parentName))
        .limit(1);
      
      if (parent.length > 0) {
        await db.insert(serviceCategories).values({
          nameAr: subCat.nameAr,
          nameEn: subCat.nameEn,
          parentId: parent[0].id,
          order: subCat.order,
          isActive: true,
        }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
      }
    }
    
    // إضافة تصنيفات المشاريع
    console.log("💼 إضافة تصنيفات المشاريع...");
    for (const cat of jobCategoriesData) {
      await db.insert(jobCategories).values({
        ...cat,
        isActive: true,
      }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
    }
    
    console.log("✅ تم إضافة جميع التصنيفات بنجاح!");
    console.log(`📦 ${productCategoriesData.length + productSubCategories.length} تصنيف منتج`);
    console.log(`🛠️ ${serviceCategoriesData.length + serviceSubCategories.length} تصنيف خدمة`);
    console.log(`💼 ${jobCategoriesData.length} تصنيف مشروع`);
    
  } catch (error) {
    console.error("❌ خطأ في إضافة التصنيفات:", error);
    throw error;
  }
}

// تشغيل السكريبت
seedCategories()
  .then(() => {
    console.log("🎉 اكتملت عملية إضافة التصنيفات!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 فشلت عملية إضافة التصنيفات:", error);
    process.exit(1);
  });

