import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { 
  products, 
  productCategories,
  services,
  serviceCategories,
  servicePackages,
  jobs,
  jobCategories,
  users,
  sellerProfiles
} from "./drizzle/schema";

// Load environment variables
import { config } from 'dotenv';
config();

const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL,
});

const db = drizzle(connection);

async function seedRealData() {
  console.log("🚀 بدء إضافة البيانات الحقيقية...");

  // إضافة مستخدمين بائعين
  console.log("👤 إضافة بائعين...");
  
  const seller1 = await db.insert(users).values({
    openId: "seller1_" + Date.now(),
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: "user",
    userType: "individual",
  });

  const seller2 = await db.insert(users).values({
    openId: "seller2_" + Date.now(),
    name: "شركة التقنية الحديثة",
    email: "tech@example.com",
    role: "user",
    userType: "company",
  });

  const seller3 = await db.insert(users).values({
    openId: "seller3_" + Date.now(),
    name: "سارة أحمد",
    email: "sara@example.com",
    role: "user",
    userType: "individual",
  });

  // إضافة ملفات بائعين
  await db.insert(sellerProfiles).values({
    userId: seller1[0].insertId,
    companyName: "أحمد للتصميم",
    isVerified: true,
    rating: 5,
    totalSales: 150,
    totalEarnings: 75000,
  });

  await db.insert(sellerProfiles).values({
    userId: seller2[0].insertId,
    companyName: "شركة التقنية الحديثة",
    isVerified: true,
    rating: 5,
    totalSales: 300,
    totalEarnings: 250000,
  });

  await db.insert(sellerProfiles).values({
    userId: seller3[0].insertId,
    companyName: "سارة للترجمة",
    isVerified: true,
    rating: 5,
    totalSales: 200,
    totalEarnings: 100000,
  });

  // إضافة منتجات رقمية حقيقية
  console.log("📦 إضافة منتجات رقمية...");
  
  // قوالب WordPress
  await db.insert(products).values({
    sellerId: seller2[0].insertId,
    categoryId: 1, // سيتم تحديثه
    titleAr: "قالب ووردبريس متجر إلكتروني احترافي",
    titleEn: "Professional E-commerce WordPress Theme",
    descriptionAr: "قالب ووردبريس احترافي للمتاجر الإلكترونية مع تصميم عصري وسريع الاستجابة",
    descriptionEn: "Professional WordPress theme for e-commerce with modern responsive design",
    price: 299,
    currency: "SAR",
    coverImage: "/images/products/wp-theme-1.jpg",
    fileUrl: "/files/wp-theme-1.zip",
    fileSize: 15000000,
    fileType: "application/zip",
    downloads: 450,
    views: 2300,
    rating: 5,
    reviewsCount: 89,
    status: "active",
    isActive: true,
  });

  // كتب إلكترونية
  await db.insert(products).values({
    sellerId: seller1[0].insertId,
    categoryId: 1,
    titleAr: "كتاب تعلم البرمجة من الصفر",
    titleEn: "Learn Programming from Scratch Book",
    descriptionAr: "كتاب شامل لتعلم البرمجة من الصفر حتى الاحتراف",
    descriptionEn: "Comprehensive book to learn programming from scratch to professional",
    price: 99,
    currency: "SAR",
    coverImage: "/images/products/book-1.jpg",
    fileUrl: "/files/book-1.pdf",
    fileSize: 5000000,
    fileType: "application/pdf",
    downloads: 1200,
    views: 5600,
    rating: 5,
    reviewsCount: 234,
    status: "active",
    isActive: true,
  });

  // تصاميم جرافيك
  await db.insert(products).values({
    sellerId: seller1[0].insertId,
    categoryId: 1,
    titleAr: "حزمة قوالب سوشيال ميديا - 100 تصميم",
    titleEn: "Social Media Templates Bundle - 100 Designs",
    descriptionAr: "حزمة شاملة تحتوي على 100 تصميم جاهز لمنصات التواصل الاجتماعي",
    descriptionEn: "Comprehensive bundle with 100 ready-made designs for social media",
    price: 199,
    currency: "SAR",
    coverImage: "/images/products/social-bundle.jpg",
    fileUrl: "/files/social-bundle.zip",
    fileSize: 250000000,
    fileType: "application/zip",
    downloads: 890,
    views: 4200,
    rating: 5,
    reviewsCount: 167,
    status: "active",
    isActive: true,
  });

  // إضافة خدمات مصغرة حقيقية
  console.log("🛠️ إضافة خدمات مصغرة...");
  
  // خدمة تصميم شعار
  const logoService = await db.insert(services).values({
    sellerId: seller1[0].insertId,
    categoryId: 1,
    titleAr: "تصميم شعار احترافي لعلامتك التجارية",
    titleEn: "Professional Logo Design for Your Brand",
    descriptionAr: "سأصمم لك شعار احترافي يعبر عن هوية علامتك التجارية",
    descriptionEn: "I will design a professional logo that represents your brand identity",
    startingPrice: 150,
    currency: "SAR",
    coverImage: "/images/services/logo-design.jpg",
    deliveryTime: 3,
    rating: 5,
    reviewsCount: 145,
    ordersCount: 320,
    status: "active",
    isActive: true,
  });

  // إضافة باقات للخدمة
  await db.insert(servicePackages).values([
    {
      serviceId: logoService[0].insertId,
      nameAr: "الباقة الأساسية",
      nameEn: "Basic Package",
      descriptionAr: "شعار واحد + 3 مراجعات",
      descriptionEn: "1 logo + 3 revisions",
      price: 150,
      currency: "SAR",
      deliveryTime: 3,
      order: 1,
    },
    {
      serviceId: logoService[0].insertId,
      nameAr: "الباقة المتقدمة",
      nameEn: "Standard Package",
      descriptionAr: "3 شعارات + 5 مراجعات + ملفات مفتوحة",
      descriptionEn: "3 logos + 5 revisions + source files",
      price: 300,
      currency: "SAR",
      deliveryTime: 5,
      order: 2,
    },
    {
      serviceId: logoService[0].insertId,
      nameAr: "الباقة الاحترافية",
      nameEn: "Premium Package",
      descriptionAr: "5 شعارات + مراجعات غير محدودة + دليل استخدام",
      descriptionEn: "5 logos + unlimited revisions + brand guide",
      price: 500,
      currency: "SAR",
      deliveryTime: 7,
      order: 3,
    },
  ]);

  // خدمة ترجمة
  const translationService = await db.insert(services).values({
    sellerId: seller3[0].insertId,
    categoryId: 2,
    titleAr: "ترجمة احترافية من العربية إلى الإنجليزية",
    titleEn: "Professional Arabic to English Translation",
    descriptionAr: "سأترجم لك أي نص من العربية إلى الإنجليزية بدقة واحترافية",
    descriptionEn: "I will translate any text from Arabic to English accurately and professionally",
    startingPrice: 50,
    currency: "SAR",
    coverImage: "/images/services/translation.jpg",
    deliveryTime: 2,
    rating: 5,
    reviewsCount: 289,
    ordersCount: 650,
    status: "active",
    isActive: true,
  });

  await db.insert(servicePackages).values([
    {
      serviceId: translationService[0].insertId,
      nameAr: "الباقة الأساسية",
      nameEn: "Basic Package",
      descriptionAr: "ترجمة 500 كلمة",
      descriptionEn: "Translate 500 words",
      price: 50,
      currency: "SAR",
      deliveryTime: 2,
      order: 1,
    },
    {
      serviceId: translationService[0].insertId,
      nameAr: "الباقة المتقدمة",
      nameEn: "Standard Package",
      descriptionAr: "ترجمة 1500 كلمة + مراجعة",
      descriptionEn: "Translate 1500 words + proofreading",
      price: 120,
      currency: "SAR",
      deliveryTime: 4,
      order: 2,
    },
    {
      serviceId: translationService[0].insertId,
      nameAr: "الباقة الاحترافية",
      nameEn: "Premium Package",
      descriptionAr: "ترجمة 3000 كلمة + مراجعة + تدقيق لغوي",
      descriptionEn: "Translate 3000 words + proofreading + editing",
      price: 200,
      currency: "SAR",
      deliveryTime: 7,
      order: 3,
    },
  ]);

  // خدمة برمجة
  const codingService = await db.insert(services).values({
    sellerId: seller2[0].insertId,
    categoryId: 3,
    titleAr: "تطوير موقع ووردبريس كامل",
    titleEn: "Complete WordPress Website Development",
    descriptionAr: "سأطور لك موقع ووردبريس كامل بتصميم احترافي",
    descriptionEn: "I will develop a complete WordPress website with professional design",
    startingPrice: 800,
    currency: "SAR",
    coverImage: "/images/services/wordpress-dev.jpg",
    deliveryTime: 10,
    rating: 5,
    reviewsCount: 78,
    ordersCount: 120,
    status: "active",
    isActive: true,
  });

  await db.insert(servicePackages).values([
    {
      serviceId: codingService[0].insertId,
      nameAr: "الباقة الأساسية",
      nameEn: "Basic Package",
      descriptionAr: "موقع 5 صفحات + تصميم بسيط",
      descriptionEn: "5-page website + simple design",
      price: 800,
      currency: "SAR",
      deliveryTime: 10,
      order: 1,
    },
    {
      serviceId: codingService[0].insertId,
      nameAr: "الباقة المتقدمة",
      nameEn: "Standard Package",
      descriptionAr: "موقع 10 صفحات + تصميم متقدم + SEO",
      descriptionEn: "10-page website + advanced design + SEO",
      price: 1500,
      currency: "SAR",
      deliveryTime: 15,
      order: 2,
    },
    {
      serviceId: codingService[0].insertId,
      nameAr: "الباقة الاحترافية",
      nameEn: "Premium Package",
      descriptionAr: "موقع كامل + متجر إلكتروني + SEO + سنة استضافة",
      descriptionEn: "Complete website + e-commerce + SEO + 1 year hosting",
      price: 3000,
      currency: "SAR",
      deliveryTime: 30,
      order: 3,
    },
  ]);

  // إضافة مشاريع حقيقية
  console.log("💼 إضافة مشاريع...");
  
  await db.insert(jobs).values({
    employerId: seller2[0].insertId,
    categoryId: 1,
    titleAr: "تطوير تطبيق جوال للتجارة الإلكترونية",
    titleEn: "E-commerce Mobile App Development",
    descriptionAr: "نبحث عن مطور محترف لتطوير تطبيق جوال للتجارة الإلكترونية على iOS و Android",
    descriptionEn: "Looking for a professional developer to build an e-commerce mobile app for iOS and Android",
    budget: 15000,
    currency: "SAR",
    duration: 60,
    skillsRequired: "React Native, Node.js, MongoDB, Payment Integration",
    status: "open",
    isActive: true,
  });

  await db.insert(jobs).values({
    employerId: seller1[0].insertId,
    categoryId: 2,
    titleAr: "تصميم هوية بصرية كاملة لشركة ناشئة",
    titleEn: "Complete Brand Identity Design for Startup",
    descriptionAr: "نحتاج مصمم محترف لتصميم هوية بصرية كاملة تشمل الشعار والألوان والخطوط",
    descriptionEn: "Need a professional designer for complete brand identity including logo, colors, and fonts",
    budget: 5000,
    currency: "SAR",
    duration: 30,
    skillsRequired: "Adobe Illustrator, Photoshop, Brand Design",
    status: "open",
    isActive: true,
  });

  await db.insert(jobs).values({
    employerId: seller3[0].insertId,
    categoryId: 3,
    titleAr: "كتابة محتوى تسويقي لموقع إلكتروني",
    titleEn: "Marketing Content Writing for Website",
    descriptionAr: "نبحث عن كاتب محتوى محترف لكتابة محتوى تسويقي لموقعنا الإلكتروني",
    descriptionEn: "Looking for a professional content writer for marketing content for our website",
    budget: 2000,
    currency: "SAR",
    duration: 15,
    skillsRequired: "Content Writing, SEO, Marketing",
    status: "open",
    isActive: true,
  });

  console.log("✅ تم إضافة البيانات الحقيقية بنجاح!");
  
  await connection.end();
}

seedRealData().catch(console.error);

