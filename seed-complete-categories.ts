import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { productCategories, serviceCategories, jobCategories } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

/**
 * تصنيفات المنتجات الرقمية - دمج كامل من جميع المصادر
 * المصادر: البرومبت + المستند التنفيذي + Picalica + Gumroad
 */
const completeProductCategories = [
  // === من Picalica ===
  {
    nameAr: "قوالب",
    nameEn: "Templates",
    icon: "📄",
    order: 1,
    subcategories: [
      { nameAr: "ووردبريس", nameEn: "WordPress", order: 1 },
      { nameAr: "شوبيفاي", nameEn: "Shopify", order: 2 },
      { nameAr: "لوحات تحكم", nameEn: "Dashboards", order: 3 },
      { nameAr: "صفحات هبوط", nameEn: "Landing Pages", order: 4 },
      { nameAr: "بريد إلكتروني", nameEn: "Email Templates", order: 5 },
      { nameAr: "HTML/CSS", nameEn: "HTML/CSS", order: 6 },
      { nameAr: "React", nameEn: "React", order: 7 },
      { nameAr: "Vue.js", nameEn: "Vue.js", order: 8 },
      { nameAr: "قوالب أخرى", nameEn: "Other Templates", order: 9 },
    ]
  },
  {
    nameAr: "تصاميم",
    nameEn: "Designs",
    icon: "🎨",
    order: 2,
    subcategories: [
      { nameAr: "واجهات استخدام UI/UX", nameEn: "UI/UX Design", order: 1 },
      { nameAr: "شبكات اجتماعية", nameEn: "Social Media", order: 2 },
      { nameAr: "فلاير وبروشور", nameEn: "Flyers & Brochures", order: 3 },
      { nameAr: "رسومات", nameEn: "Graphics", order: 4 },
      { nameAr: "قوائم طعام", nameEn: "Menus", order: 5 },
      { nameAr: "Mockups", nameEn: "Mockups", order: 6 },
      { nameAr: "هويات بصرية", nameEn: "Brand Identity", order: 7 },
      { nameAr: "شعارات", nameEn: "Logos", order: 8 },
      { nameAr: "بطاقات عمل", nameEn: "Business Cards", order: 9 },
      { nameAr: "تصاميم أخرى", nameEn: "Other Designs", order: 10 },
    ]
  },
  {
    nameAr: "مستندات",
    nameEn: "Documents",
    icon: "📋",
    order: 3,
    subcategories: [
      { nameAr: "عروض تقديمية", nameEn: "Presentations", order: 1 },
      { nameAr: "سير ذاتية", nameEn: "CVs/Resumes", order: 2 },
      { nameAr: "مال وأعمال", nameEn: "Finance & Business", order: 3 },
      { nameAr: "فواتير", nameEn: "Invoices", order: 4 },
      { nameAr: "عقود", nameEn: "Contracts", order: 5 },
      { nameAr: "تقارير", nameEn: "Reports", order: 6 },
      { nameAr: "مستندات أخرى", nameEn: "Other Documents", order: 7 },
    ]
  },
  {
    nameAr: "تطبيقات",
    nameEn: "Applications",
    icon: "📱",
    order: 4,
    subcategories: [
      { nameAr: "تطبيقات ويب", nameEn: "Web Apps", order: 1 },
      { nameAr: "تطبيقات جوال", nameEn: "Mobile Apps", order: 2 },
      { nameAr: "إضافات", nameEn: "Plugins/Extensions", order: 3 },
      { nameAr: "سكريبتات", nameEn: "Scripts", order: 4 },
    ]
  },
  
  // === من Gumroad ===
  {
    nameAr: "الرسم والتلوين",
    nameEn: "Drawing & Painting",
    icon: "🖌️",
    order: 5,
    subcategories: [
      { nameAr: "جميع الرسم والتلوين", nameEn: "All Drawing & Painting", order: 1 },
      { nameAr: "أعمال فنية وعمولات", nameEn: "Artwork & Commissions", order: 2 },
      { nameAr: "رسم رقمي", nameEn: "Digital Illustration", order: 3 },
      { nameAr: "فن تقليدي", nameEn: "Traditional Art", order: 4 },
    ]
  },
  {
    nameAr: "تصميم ثلاثي الأبعاد",
    nameEn: "3D",
    icon: "🎲",
    order: 6,
    subcategories: [
      { nameAr: "جميع 3D", nameEn: "All 3D", order: 1 },
      { nameAr: "أصول ثلاثية الأبعاد", nameEn: "3D Assets", order: 2 },
      { nameAr: "نمذجة ثلاثية الأبعاد", nameEn: "3D Modeling", order: 3 },
      { nameAr: "تحريك", nameEn: "Animating", order: 4 },
      { nameAr: "الواقع المعزز/الافتراضي", nameEn: "AR/VR", order: 5 },
      { nameAr: "صور رمزية", nameEn: "Avatars", order: 6 },
      { nameAr: "تصميم شخصيات", nameEn: "Character Design", order: 7 },
      { nameAr: "تجهيز الشخصيات", nameEn: "Rigging", order: 8 },
      { nameAr: "نسيج", nameEn: "Textures", order: 9 },
      { nameAr: "VRChat", nameEn: "VRChat", order: 10 },
    ]
  },
  {
    nameAr: "التصميم",
    nameEn: "Design",
    icon: "✨",
    order: 7,
    subcategories: [
      { nameAr: "جميع التصميم", nameEn: "All Design", order: 1 },
      { nameAr: "عمارة", nameEn: "Architecture", order: 2 },
      { nameAr: "هوية تجارية", nameEn: "Branding", order: 3 },
      { nameAr: "تصميم ترفيهي", nameEn: "Entertainment Design", order: 4 },
      { nameAr: "تصميم أزياء", nameEn: "Fashion Design", order: 5 },
      { nameAr: "خطوط", nameEn: "Fonts", order: 6 },
      { nameAr: "رسومات", nameEn: "Graphics", order: 7 },
      { nameAr: "أيقونات", nameEn: "Icons", order: 8 },
      { nameAr: "تصميم صناعي", nameEn: "Industrial Design", order: 9 },
      { nameAr: "تصميم داخلي", nameEn: "Interior Design", order: 10 },
      { nameAr: "طباعة وتغليف", nameEn: "Print & Packaging", order: 11 },
      { nameAr: "واجهات ومواقع", nameEn: "UI & Web", order: 12 },
      { nameAr: "خلفيات", nameEn: "Wallpapers", order: 13 },
    ]
  },
  {
    nameAr: "الموسيقى والصوت",
    nameEn: "Music & Sound Design",
    icon: "🎵",
    order: 8,
    subcategories: [
      { nameAr: "جميع الموسيقى والصوت", nameEn: "All Music & Sound Design", order: 1 },
      { nameAr: "رقص ومسرح", nameEn: "Dance & Theater", order: 2 },
      { nameAr: "آلات موسيقية", nameEn: "Instruments", order: 3 },
      { nameAr: "تصميم صوتي", nameEn: "Sound Design", order: 4 },
      { nameAr: "غناء", nameEn: "Vocal", order: 5 },
    ]
  },
  {
    nameAr: "أفلام",
    nameEn: "Films",
    icon: "🎬",
    order: 9,
    subcategories: [
      { nameAr: "جميع الأفلام", nameEn: "All Films", order: 1 },
      { nameAr: "كوميديا", nameEn: "Comedy", order: 2 },
      { nameAr: "رقص", nameEn: "Dance", order: 3 },
      { nameAr: "وثائقي", nameEn: "Documentary", order: 4 },
      { nameAr: "أفلام", nameEn: "Movie", order: 5 },
      { nameAr: "أداء", nameEn: "Performance", order: 6 },
      { nameAr: "أفلام قصيرة", nameEn: "Short Film", order: 7 },
      { nameAr: "أحداث رياضية", nameEn: "Sports Events", order: 8 },
      { nameAr: "مسرح", nameEn: "Theater", order: 9 },
      { nameAr: "إنتاج وتحرير فيديو", nameEn: "Video Production & Editing", order: 10 },
      { nameAr: "تصوير فيديو", nameEn: "Videography", order: 11 },
    ]
  },
  {
    nameAr: "تطوير الذات",
    nameEn: "Self Improvement",
    icon: "🌟",
    order: 10,
    subcategories: [
      { nameAr: "جميع تطوير الذات", nameEn: "All Self Improvement", order: 1 },
      { nameAr: "طبخ", nameEn: "Cooking", order: 2 },
      { nameAr: "حرف يدوية", nameEn: "Crafts & DIY", order: 3 },
      { nameAr: "مواعدة وعلاقات", nameEn: "Dating & Relationships", order: 4 },
      { nameAr: "أنشطة خارجية", nameEn: "Outdoors", order: 5 },
      { nameAr: "فلسفة", nameEn: "Philosophy", order: 6 },
      { nameAr: "إنتاجية", nameEn: "Productivity", order: 7 },
      { nameAr: "علم نفس", nameEn: "Psychology", order: 8 },
      { nameAr: "روحانيات", nameEn: "Spirituality", order: 9 },
      { nameAr: "سفر", nameEn: "Travel", order: 10 },
      { nameAr: "أعراس", nameEn: "Weddings", order: 11 },
      { nameAr: "صحة", nameEn: "Wellness", order: 12 },
    ]
  },
  {
    nameAr: "تطوير البرمجيات",
    nameEn: "Software Development",
    icon: "💻",
    order: 11,
    subcategories: [
      { nameAr: "جميع تطوير البرمجيات", nameEn: "All Software Development", order: 1 },
      { nameAr: "تطوير تطبيقات", nameEn: "App Development", order: 2 },
      { nameAr: "عتاد", nameEn: "Hardware", order: 3 },
      { nameAr: "برمجة", nameEn: "Programming", order: 4 },
      { nameAr: "برامج وإضافات", nameEn: "Software & Plugins", order: 5 },
      { nameAr: "تطوير ويب", nameEn: "Web Development", order: 6 },
    ]
  },
  {
    nameAr: "التعليم",
    nameEn: "Education",
    icon: "🎓",
    order: 12,
    subcategories: [
      { nameAr: "جميع التعليم", nameEn: "All Education", order: 1 },
      { nameAr: "فصول دراسية", nameEn: "Classroom", order: 2 },
      { nameAr: "إنجليزي", nameEn: "English", order: 3 },
      { nameAr: "تاريخ", nameEn: "History", order: 4 },
      { nameAr: "رياضيات", nameEn: "Math", order: 5 },
      { nameAr: "علوم", nameEn: "Science", order: 6 },
      { nameAr: "دراسات اجتماعية", nameEn: "Social Studies", order: 7 },
      { nameAr: "تخصصات", nameEn: "Specialties", order: 8 },
      { nameAr: "تحضير اختبارات", nameEn: "Test Prep", order: 9 },
    ]
  },
  {
    nameAr: "الأعمال والمال",
    nameEn: "Business & Money",
    icon: "💼",
    order: 13,
    subcategories: [
      { nameAr: "ريادة الأعمال", nameEn: "Entrepreneurship", order: 1 },
      { nameAr: "التسويق", nameEn: "Marketing", order: 2 },
      { nameAr: "المبيعات", nameEn: "Sales", order: 3 },
      { nameAr: "المحاسبة", nameEn: "Accounting", order: 4 },
      { nameAr: "الاستثمار", nameEn: "Investment", order: 5 },
      { nameAr: "العملات الرقمية", nameEn: "Cryptocurrency", order: 6 },
    ]
  },
  {
    nameAr: "الألعاب",
    nameEn: "Gaming",
    icon: "🎮",
    order: 14,
    subcategories: [
      { nameAr: "أصول ألعاب", nameEn: "Game Assets", order: 1 },
      { nameAr: "محركات ألعاب", nameEn: "Game Engines", order: 2 },
      { nameAr: "تطوير ألعاب", nameEn: "Game Development", order: 3 },
      { nameAr: "ألعاب جاهزة", nameEn: "Ready Games", order: 4 },
    ]
  },
  {
    nameAr: "التصوير الفوتوغرافي",
    nameEn: "Photography",
    icon: "📸",
    order: 15,
    subcategories: [
      { nameAr: "صور مخزنة", nameEn: "Stock Photos", order: 1 },
      { nameAr: "بريسيتات Lightroom", nameEn: "Lightroom Presets", order: 2 },
      { nameAr: "أكشنات Photoshop", nameEn: "Photoshop Actions", order: 3 },
      { nameAr: "دروس تصوير", nameEn: "Photography Tutorials", order: 4 },
    ]
  },
  {
    nameAr: "الكتابة والنشر",
    nameEn: "Writing & Publishing",
    icon: "✍️",
    order: 16,
    subcategories: [
      { nameAr: "قصص مصورة وروايات مصورة", nameEn: "Comics & Graphic Novels", order: 1 },
      { nameAr: "كتب خيالية", nameEn: "Fiction Books", order: 2 },
      { nameAr: "كتب غير خيالية", nameEn: "Non-Fiction Books", order: 3 },
      { nameAr: "شعر", nameEn: "Poetry", order: 4 },
      { nameAr: "مجلات", nameEn: "Magazines", order: 5 },
    ]
  },
  {
    nameAr: "اللياقة والصحة",
    nameEn: "Fitness & Health",
    icon: "💪",
    order: 17,
    subcategories: [
      { nameAr: "برامج تمارين", nameEn: "Workout Programs", order: 1 },
      { nameAr: "خطط تغذية", nameEn: "Nutrition Plans", order: 2 },
      { nameAr: "يوغا", nameEn: "Yoga", order: 3 },
      { nameAr: "تأمل", nameEn: "Meditation", order: 4 },
    ]
  },
  {
    nameAr: "الصوتيات",
    nameEn: "Audio",
    icon: "🔊",
    order: 18,
    subcategories: [
      { nameAr: "موسيقى مسجلة", nameEn: "Recorded Music", order: 1 },
      { nameAr: "مؤثرات صوتية", nameEn: "Sound Effects", order: 2 },
      { nameAr: "كتب صوتية", nameEn: "Audiobooks", order: 3 },
      { nameAr: "بودكاست", nameEn: "Podcasts", order: 4 },
    ]
  },
  {
    nameAr: "أخرى",
    nameEn: "Other",
    icon: "📦",
    order: 19,
    subcategories: [
      { nameAr: "متنوعات", nameEn: "Miscellaneous", order: 1 },
    ]
  },
];

/**
 * تصنيفات الخدمات المصغرة - دمج كامل من Khamsat + Fiverr
 */
const completeServiceCategories = [
  {
    nameAr: "تصميم",
    nameEn: "Design",
    icon: "🎨",
    order: 1,
    subcategories: [
      { nameAr: "تصاميم سوشيال ميديا", nameEn: "Social Media Designs", order: 1 },
      { nameAr: "تصميم مواقع وتطبيقات", nameEn: "Website & App Design", order: 2 },
      { nameAr: "تعديل وتحسين الصور", nameEn: "Photo Editing & Enhancement", order: 3 },
      { nameAr: "تصاميم العلامة التجارية", nameEn: "Brand Identity Designs", order: 4 },
      { nameAr: "تصاميم تسويقية", nameEn: "Marketing Designs", order: 5 },
      { nameAr: "تصميم شعار", nameEn: "Logo Design", order: 6 },
      { nameAr: "تصميم UI/UX", nameEn: "UI/UX Design", order: 7 },
      { nameAr: "تصميم بطاقات عمل", nameEn: "Business Card Design", order: 8 },
      { nameAr: "تصميم فلاير وبروشور", nameEn: "Flyer & Brochure Design", order: 9 },
      { nameAr: "تصميم عروض تقديمية", nameEn: "Presentation Design", order: 10 },
    ]
  },
  {
    nameAr: "كتابة وترجمة",
    nameEn: "Writing & Translation",
    icon: "✍️",
    order: 2,
    subcategories: [
      { nameAr: "ترجمة", nameEn: "Translation", order: 1 },
      { nameAr: "كتابة إبداعية", nameEn: "Creative Writing", order: 2 },
      { nameAr: "محتوى متخصص", nameEn: "Specialized Content", order: 3 },
      { nameAr: "محتوى مواقع", nameEn: "Website Content", order: 4 },
      { nameAr: "محتوى دراسي ومهني", nameEn: "Academic & Professional Content", order: 5 },
      { nameAr: "محتوى سوشيال ميديا", nameEn: "Social Media Content", order: 6 },
      { nameAr: "تدقيق لغوي", nameEn: "Proofreading", order: 7 },
      { nameAr: "كتابة مقالات", nameEn: "Article Writing", order: 8 },
      { nameAr: "كتابة تقنية", nameEn: "Technical Writing", order: 9 },
      { nameAr: "كتابة إعلانات", nameEn: "Copywriting", order: 10 },
    ]
  },
  {
    nameAr: "تسويق رقمي",
    nameEn: "Digital Marketing",
    icon: "📊",
    order: 3,
    subcategories: [
      { nameAr: "خطط تسويقية", nameEn: "Marketing Plans", order: 1 },
      { nameAr: "استشارات تسويقية", nameEn: "Marketing Consultations", order: 2 },
      { nameAr: "تحسين محركات البحث SEO", nameEn: "SEO", order: 3 },
      { nameAr: "إعلانات مواقع التواصل", nameEn: "Social Media Ads", order: 4 },
      { nameAr: "إدارة حسابات التواصل", nameEn: "Social Media Management", order: 5 },
      { nameAr: "التسويق عبر مواقع التواصل", nameEn: "Social Media Marketing", order: 6 },
      { nameAr: "إعلانات Google", nameEn: "Google Ads", order: 7 },
      { nameAr: "التسويق بالبريد الإلكتروني", nameEn: "Email Marketing", order: 8 },
      { nameAr: "التسويق بالمحتوى", nameEn: "Content Marketing", order: 9 },
      { nameAr: "التسويق بالعمولة", nameEn: "Affiliate Marketing", order: 10 },
    ]
  },
  {
    nameAr: "برمجة وتطوير",
    nameEn: "Programming & Development",
    icon: "💻",
    order: 4,
    subcategories: [
      { nameAr: "ووردبريس", nameEn: "WordPress", order: 1 },
      { nameAr: "تطوير مواقع", nameEn: "Web Development", order: 2 },
      { nameAr: "دعم فني تقني", nameEn: "Technical Support", order: 3 },
      { nameAr: "تطوير برمجيات", nameEn: "Software Development", order: 4 },
      { nameAr: "إنشاء متجر إلكتروني", nameEn: "E-commerce Store Creation", order: 5 },
      { nameAr: "برمجة تطبيقات جوال", nameEn: "Mobile App Development", order: 6 },
      { nameAr: "تطوير APIs", nameEn: "API Development", order: 7 },
      { nameAr: "قواعد بيانات", nameEn: "Database", order: 8 },
      { nameAr: "برمجة Python", nameEn: "Python Programming", order: 9 },
      { nameAr: "برمجة JavaScript", nameEn: "JavaScript Programming", order: 10 },
    ]
  },
  {
    nameAr: "فيديو وأنيميشن",
    nameEn: "Video & Animation",
    icon: "🎬",
    order: 5,
    subcategories: [
      { nameAr: "تصميم انترو", nameEn: "Intro Design", order: 1 },
      { nameAr: "مونتاج فيديو", nameEn: "Video Editing", order: 2 },
      { nameAr: "أنيميشن وموشن جرافيك", nameEn: "Animation & Motion Graphics", order: 3 },
      { nameAr: "إنتاج الفيديو", nameEn: "Video Production", order: 4 },
      { nameAr: "فيديوهات سوشيال ميديا", nameEn: "Social Media Videos", order: 5 },
      { nameAr: "فيديوهات إعلانية", nameEn: "Commercial Videos", order: 6 },
      { nameAr: "فيديوهات تعليمية", nameEn: "Educational Videos", order: 7 },
      { nameAr: "أنيميشن 2D", nameEn: "2D Animation", order: 8 },
      { nameAr: "أنيميشن 3D", nameEn: "3D Animation", order: 9 },
      { nameAr: "Whiteboard Animation", nameEn: "Whiteboard Animation", order: 10 },
    ]
  },
  {
    nameAr: "هندسة وعمارة",
    nameEn: "Engineering & Architecture",
    icon: "🏗️",
    order: 6,
    subcategories: [
      { nameAr: "هندسة معمارية", nameEn: "Architectural Engineering", order: 1 },
      { nameAr: "هندسة مدنية وإنشائية", nameEn: "Civil & Structural Engineering", order: 2 },
      { nameAr: "هندسة ميكانيكية", nameEn: "Mechanical Engineering", order: 3 },
      { nameAr: "هندسة إلكترونيات", nameEn: "Electronics Engineering", order: 4 },
      { nameAr: "هندسة كهربائية", nameEn: "Electrical Engineering", order: 5 },
      { nameAr: "استشارات هندسية", nameEn: "Engineering Consultations", order: 6 },
      { nameAr: "تصميم داخلي", nameEn: "Interior Design", order: 7 },
      { nameAr: "تصميم خارجي", nameEn: "Exterior Design", order: 8 },
    ]
  },
  {
    nameAr: "أعمال",
    nameEn: "Business",
    icon: "💼",
    order: 7,
    subcategories: [
      { nameAr: "تخطيط أعمال", nameEn: "Business Planning", order: 1 },
      { nameAr: "تجارة إلكترونية", nameEn: "E-commerce", order: 2 },
      { nameAr: "استشارات أعمال", nameEn: "Business Consultations", order: 3 },
      { nameAr: "إدارة موارد بشرية", nameEn: "Human Resources Management", order: 4 },
      { nameAr: "خدمات مالية ومحاسبية", nameEn: "Financial & Accounting Services", order: 5 },
      { nameAr: "خدمات قانونية", nameEn: "Legal Services", order: 6 },
      { nameAr: "دراسات جدوى", nameEn: "Feasibility Studies", order: 7 },
      { nameAr: "خطط أعمال", nameEn: "Business Plans", order: 8 },
    ]
  },
  {
    nameAr: "صوتيات",
    nameEn: "Audio",
    icon: "🎵",
    order: 8,
    subcategories: [
      { nameAr: "غناء", nameEn: "Singing", order: 1 },
      { nameAr: "تعليق صوتي", nameEn: "Voice Over", order: 2 },
      { nameAr: "رد آلي IVR", nameEn: "IVR", order: 3 },
      { nameAr: "إنتاج كتب صوتية", nameEn: "Audiobook Production", order: 4 },
      { nameAr: "هندسة صوتية", nameEn: "Audio Engineering", order: 5 },
      { nameAr: "إنتاج وتلحين موسيقي", nameEn: "Music Production & Composition", order: 6 },
      { nameAr: "مؤثرات صوتية", nameEn: "Sound Effects", order: 7 },
      { nameAr: "مزج وماسترينج", nameEn: "Mixing & Mastering", order: 8 },
    ]
  },
  {
    nameAr: "تعليم عن بعد",
    nameEn: "Online Education",
    icon: "🎓",
    order: 9,
    subcategories: [
      { nameAr: "تعلم اللغات", nameEn: "Language Learning", order: 1 },
      { nameAr: "تعلم البرمجة", nameEn: "Programming Learning", order: 2 },
      { nameAr: "تعلم تصميم الجرافيك", nameEn: "Graphic Design Learning", order: 3 },
      { nameAr: "تعلم التسويق الرقمي", nameEn: "Digital Marketing Learning", order: 4 },
      { nameAr: "تعلم القرآن الكريم", nameEn: "Quran Learning", order: 5 },
      { nameAr: "تدريب وحل واجبات", nameEn: "Training & Homework Help", order: 6 },
      { nameAr: "دروس خصوصية", nameEn: "Private Lessons", order: 7 },
      { nameAr: "استشارات تعليمية", nameEn: "Educational Consultations", order: 8 },
    ]
  },
  {
    nameAr: "بيانات",
    nameEn: "Data",
    icon: "📈",
    order: 10,
    subcategories: [
      { nameAr: "علم البيانات وتعلم الآلة", nameEn: "Data Science & Machine Learning", order: 1 },
      { nameAr: "إدخال بيانات", nameEn: "Data Entry", order: 2 },
      { nameAr: "استخراج بيانات", nameEn: "Data Extraction", order: 3 },
      { nameAr: "تحليل بيانات", nameEn: "Data Analysis", order: 4 },
      { nameAr: "معالجة بيانات", nameEn: "Data Processing", order: 5 },
      { nameAr: "قواعد بيانات", nameEn: "Databases", order: 6 },
      { nameAr: "تنظيف بيانات", nameEn: "Data Cleaning", order: 7 },
      { nameAr: "تصور بيانات", nameEn: "Data Visualization", order: 8 },
    ]
  },
  {
    nameAr: "أسلوب حياة",
    nameEn: "Lifestyle",
    icon: "🌟",
    order: 11,
    subcategories: [
      { nameAr: "استشارات شخصية", nameEn: "Personal Consultations", order: 1 },
      { nameAr: "توجيه وإرشاد مهني", nameEn: "Career Guidance & Counseling", order: 2 },
      { nameAr: "لياقة بدنية", nameEn: "Fitness", order: 3 },
      { nameAr: "تعليم الطبخ", nameEn: "Cooking Lessons", order: 4 },
      { nameAr: "صحة وتغذية", nameEn: "Health & Nutrition", order: 5 },
      { nameAr: "تنمية بشرية", nameEn: "Personal Development", order: 6 },
      { nameAr: "استشارات أسرية", nameEn: "Family Consultations", order: 7 },
    ]
  },
  {
    nameAr: "ألعاب",
    nameEn: "Gaming",
    icon: "🎮",
    order: 12,
    subcategories: [
      { nameAr: "تطوير ألعاب", nameEn: "Game Development", order: 1 },
      { nameAr: "تصميم ألعاب", nameEn: "Game Design", order: 2 },
      { nameAr: "أصول ألعاب", nameEn: "Game Assets", order: 3 },
      { nameAr: "اختبار ألعاب", nameEn: "Game Testing", order: 4 },
    ]
  },
];

/**
 * تصنيفات المشاريع والعمل الحر - من Mostaql + Bahr + Upwork
 */
const completeJobCategories = [
  {
    nameAr: "أعمال وخدمات استشارية",
    nameEn: "Business & Consulting Services",
    icon: "💼",
    order: 1,
    subcategories: [
      { nameAr: "استشارات أعمال", nameEn: "Business Consulting", order: 1 },
      { nameAr: "استشارات إدارية", nameEn: "Management Consulting", order: 2 },
      { nameAr: "استشارات مالية", nameEn: "Financial Consulting", order: 3 },
      { nameAr: "استشارات قانونية", nameEn: "Legal Consulting", order: 4 },
      { nameAr: "خطط أعمال", nameEn: "Business Plans", order: 5 },
      { nameAr: "دراسات جدوى", nameEn: "Feasibility Studies", order: 6 },
    ]
  },
  {
    nameAr: "برمجة، تطوير المواقع والتطبيقات",
    nameEn: "Programming, Web & App Development",
    icon: "💻",
    order: 2,
    subcategories: [
      { nameAr: "تطوير مواقع", nameEn: "Web Development", order: 1 },
      { nameAr: "تطوير تطبيقات جوال", nameEn: "Mobile App Development", order: 2 },
      { nameAr: "برمجة سكريبتات", nameEn: "Script Programming", order: 3 },
      { nameAr: "ووردبريس", nameEn: "WordPress", order: 4 },
      { nameAr: "متاجر إلكترونية", nameEn: "E-commerce", order: 5 },
      { nameAr: "تطوير برمجيات", nameEn: "Software Development", order: 6 },
      { nameAr: "قواعد بيانات", nameEn: "Databases", order: 7 },
      { nameAr: "تطوير APIs", nameEn: "API Development", order: 8 },
    ]
  },
  {
    nameAr: "هندسة، عمارة وتصميم داخلي",
    nameEn: "Engineering, Architecture & Interior Design",
    icon: "🏗️",
    order: 3,
    subcategories: [
      { nameAr: "هندسة معمارية", nameEn: "Architectural Engineering", order: 1 },
      { nameAr: "هندسة مدنية", nameEn: "Civil Engineering", order: 2 },
      { nameAr: "هندسة ميكانيكية", nameEn: "Mechanical Engineering", order: 3 },
      { nameAr: "هندسة كهربائية", nameEn: "Electrical Engineering", order: 4 },
      { nameAr: "تصميم داخلي", nameEn: "Interior Design", order: 5 },
      { nameAr: "تصميم خارجي", nameEn: "Exterior Design", order: 6 },
    ]
  },
  {
    nameAr: "تصميم، فيديو وصوتيات",
    nameEn: "Design, Video & Audio",
    icon: "🎨",
    order: 4,
    subcategories: [
      { nameAr: "تصميم جرافيك", nameEn: "Graphic Design", order: 1 },
      { nameAr: "تصميم شعارات", nameEn: "Logo Design", order: 2 },
      { nameAr: "هوية بصرية", nameEn: "Brand Identity", order: 3 },
      { nameAr: "تصميم UI/UX", nameEn: "UI/UX Design", order: 4 },
      { nameAr: "مونتاج فيديو", nameEn: "Video Editing", order: 5 },
      { nameAr: "موشن جرافيك", nameEn: "Motion Graphics", order: 6 },
      { nameAr: "تعليق صوتي", nameEn: "Voice Over", order: 7 },
      { nameAr: "إنتاج صوتي", nameEn: "Audio Production", order: 8 },
    ]
  },
  {
    nameAr: "تسويق إلكتروني ومبيعات",
    nameEn: "Digital Marketing & Sales",
    icon: "📊",
    order: 5,
    subcategories: [
      { nameAr: "SEO", nameEn: "SEO", order: 1 },
      { nameAr: "إعلانات Google", nameEn: "Google Ads", order: 2 },
      { nameAr: "إعلانات Facebook", nameEn: "Facebook Ads", order: 3 },
      { nameAr: "إدارة سوشيال ميديا", nameEn: "Social Media Management", order: 4 },
      { nameAr: "كتابة إعلانات", nameEn: "Copywriting", order: 5 },
      { nameAr: "استشارات تسويقية", nameEn: "Marketing Consulting", order: 6 },
      { nameAr: "خطط تسويقية", nameEn: "Marketing Plans", order: 7 },
    ]
  },
  {
    nameAr: "كتابة، تحرير، ترجمة ولغات",
    nameEn: "Writing, Editing, Translation & Languages",
    icon: "✍️",
    order: 6,
    subcategories: [
      { nameAr: "كتابة محتوى", nameEn: "Content Writing", order: 1 },
      { nameAr: "ترجمة", nameEn: "Translation", order: 2 },
      { nameAr: "تدقيق لغوي", nameEn: "Proofreading", order: 3 },
      { nameAr: "كتابة إبداعية", nameEn: "Creative Writing", order: 4 },
      { nameAr: "كتابة تقنية", nameEn: "Technical Writing", order: 5 },
      { nameAr: "محتوى سوشيال ميديا", nameEn: "Social Media Content", order: 6 },
    ]
  },
  {
    nameAr: "دعم، مساعدة وإدخال بيانات",
    nameEn: "Support, Assistance & Data Entry",
    icon: "🆘",
    order: 7,
    subcategories: [
      { nameAr: "إدخال بيانات", nameEn: "Data Entry", order: 1 },
      { nameAr: "دعم فني", nameEn: "Technical Support", order: 2 },
      { nameAr: "مساعدة افتراضية", nameEn: "Virtual Assistant", order: 3 },
      { nameAr: "خدمة عملاء", nameEn: "Customer Service", order: 4 },
      { nameAr: "معالجة بيانات", nameEn: "Data Processing", order: 5 },
    ]
  },
  {
    nameAr: "تدريب وتعليم عن بعد",
    nameEn: "Training & Online Education",
    icon: "🎓",
    order: 8,
    subcategories: [
      { nameAr: "تدريب برمجة", nameEn: "Programming Training", order: 1 },
      { nameAr: "تدريب تصميم", nameEn: "Design Training", order: 2 },
      { nameAr: "تدريب تسويق", nameEn: "Marketing Training", order: 3 },
      { nameAr: "تعليم لغات", nameEn: "Language Teaching", order: 4 },
      { nameAr: "دورات تدريبية", nameEn: "Training Courses", order: 5 },
    ]
  },
];

async function seedCompleteCategories() {
  console.log("🌱 بدء إضافة التصنيفات الكاملة الموحدة...");
  
  try {
    let productCount = 0;
    let serviceCount = 0;
    let jobCount = 0;
    
    // إضافة تصنيفات المنتجات
    console.log("📦 إضافة تصنيفات المنتجات...");
    for (const cat of completeProductCategories) {
      const result = await db.insert(productCategories).values({
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        icon: cat.icon,
        order: cat.order,
        isActive: true,
      }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
      
      productCount++;
      
      // إضافة التصنيفات الفرعية
      if (cat.subcategories && cat.subcategories.length > 0) {
        const parent = await db.select().from(productCategories)
          .where(eq(productCategories.nameAr, cat.nameAr))
          .limit(1);
        
        if (parent.length > 0) {
          for (const subCat of cat.subcategories) {
            await db.insert(productCategories).values({
              nameAr: subCat.nameAr,
              nameEn: subCat.nameEn,
              parentId: parent[0].id,
              order: subCat.order,
              isActive: true,
            }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
            productCount++;
          }
        }
      }
    }
    
    // إضافة تصنيفات الخدمات
    console.log("🛠️ إضافة تصنيفات الخدمات...");
    for (const cat of completeServiceCategories) {
      await db.insert(serviceCategories).values({
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        icon: cat.icon,
        order: cat.order,
        isActive: true,
      }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
      
      serviceCount++;
      
      // إضافة التصنيفات الفرعية
      if (cat.subcategories && cat.subcategories.length > 0) {
        const parent = await db.select().from(serviceCategories)
          .where(eq(serviceCategories.nameAr, cat.nameAr))
          .limit(1);
        
        if (parent.length > 0) {
          for (const subCat of cat.subcategories) {
            await db.insert(serviceCategories).values({
              nameAr: subCat.nameAr,
              nameEn: subCat.nameEn,
              parentId: parent[0].id,
              order: subCat.order,
              isActive: true,
            }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
            serviceCount++;
          }
        }
      }
    }
    
    // إضافة تصنيفات المشاريع
    console.log("💼 إضافة تصنيفات المشاريع...");
    for (const cat of completeJobCategories) {
      await db.insert(jobCategories).values({
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        icon: cat.icon,
        order: cat.order,
        isActive: true,
      }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
      
      jobCount++;
      
      // إضافة التصنيفات الفرعية
      if (cat.subcategories && cat.subcategories.length > 0) {
        const parent = await db.select().from(jobCategories)
          .where(eq(jobCategories.nameAr, cat.nameAr))
          .limit(1);
        
        if (parent.length > 0) {
          for (const subCat of cat.subcategories) {
            await db.insert(jobCategories).values({
              nameAr: subCat.nameAr,
              nameEn: subCat.nameEn,
              parentId: parent[0].id,
              order: subCat.order,
              isActive: true,
            }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
            jobCount++;
          }
        }
      }
    }
    
    console.log("✅ تم إضافة جميع التصنيفات بنجاح!");
    console.log(`📦 ${productCount} تصنيف منتج`);
    console.log(`🛠️ ${serviceCount} تصنيف خدمة`);
    console.log(`💼 ${jobCount} تصنيف مشروع`);
    console.log(`🎉 إجمالي: ${productCount + serviceCount + jobCount} تصنيف`);
    
  } catch (error) {
    console.error("❌ خطأ في إضافة التصنيفات:", error);
    throw error;
  }
}

// تشغيل السكريبت
seedCompleteCategories()
  .then(() => {
    console.log("🎉 اكتملت عملية إضافة التصنيفات الكاملة!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 فشلت عملية إضافة التصنيفات:", error);
    process.exit(1);
  });

