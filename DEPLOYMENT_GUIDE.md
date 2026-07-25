# 🚀 دليل النشر على Vercel - OSDM Platform

## المرحلة الأولى: تحضير GitHub ✅

✅ **تم بالفعل:**
- المشروع موجود على: https://github.com/RazanLeo/OSDM-By-Manus
- جميع الملفات مرفوعة
- الملفات الكبيرة تم حذفها

---

## المرحلة الثانية: إعداد Vercel

### 1. تسجيل الدخول إلى Vercel
```bash
# اذهب إلى: https://vercel.com
# أو سجل الدخول مع GitHub
```

### 2. ربط المشروع بـ Vercel
**الطريقة الأولى (الموصى بها):**
1. اذهب إلى: https://vercel.com/dashboard
2. اضغط **"Add New"** → **"Project"**
3. اختر **"Import Git Repository"**
4. ابحث عن: `RazanLeo/OSDM-By-Manus`
5. اضغط **"Import"**

**الطريقة الثانية (من GitHub):**
1. اذهب إلى: https://github.com/apps/vercel
2. اضغط **"Install"**
3. اختر المستودع: `OSDM-By-Manus`
4. اضغط **"Install"**

---

## المرحلة الثالثة: متغيرات البيئة (Environment Variables)

### ⚠️ متغيرات البيئة المطلوبة:

#### 1. قاعدة البيانات
```
DATABASE_URL = mysql://user:password@host:3306/osdm_platform
```

**خيارات موثوقة:**
- **PlanetScale** (موصى به): https://planetscale.com
- **AWS RDS**: https://aws.amazon.com/rds/
- **DigitalOcean**: https://www.digitalocean.com/products/managed-databases/

#### 2. المصادقة والأمان
```
JWT_SECRET = your-jwt-secret-key-here-min-32-chars
```
**⚠️ استخدم مفتاح عشوائي قوي (32+ حرف)**

#### 3. OAuth - Manus
```
OAUTH_SERVER_URL = https://api.manus.im
VITE_OAUTH_PORTAL_URL = https://portal.manus.im
VITE_APP_ID = your-manus-app-id
OWNER_OPEN_ID = your-owner-open-id
OWNER_NAME = Owner Name
```

#### 4. Manus APIs
```
BUILT_IN_FORGE_API_URL = https://api.manus.im
BUILT_IN_FORGE_API_KEY = your-forge-api-key
```

#### 5. Analytics
```
VITE_ANALYTICS_ENDPOINT = https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID = your-website-id
```

#### 6. معلومات التطبيق
```
VITE_APP_TITLE = OSDM - السوق الرقمي ذو المحطة الواحدة
VITE_APP_LOGO = https://your-domain.com/logo.png
NODE_ENV = production
```

### خطوات إضافة المتغيرات في Vercel:

1. اذهب إلى **Project Settings** → **Environment Variables**
2. أضف كل متغير واحداً تلو الآخر:
   - **Key**: اسم المتغير (مثل: `DATABASE_URL`)
   - **Value**: القيمة
3. تأكد من تحديد الـ Environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (اختياري)
4. اضغط **"Save"**

---

## المرحلة الرابعة: إعدادات البناء

### في Vercel Dashboard:

1. اذهب إلى **Project Settings** → **Build & Development Settings**

2. **Build Command:**
   ```
   npm run build
   ```

3. **Output Directory:**
   ```
   dist
   ```

4. **Install Command:**
   ```
   npm install
   ```

5. **Node Version:**
   - تأكد من استخدام **Node 18.x أو أحدث**
   - اذهب إلى: **Project Settings** → **General** → **Node.js Version**

---

## المرحلة الخامسة: إعداد قاعدة البيانات

### الخيار 1: PlanetScale (الموصى به)

```
1. اذهب إلى: https://planetscale.com
2. أنشئ حساباً مجانياً
3. أنشئ قاعدة بيانات جديدة
4. اضغط "Connect"
5. اختر "Node.js"
6. انسخ connection string
7. أضفها في Vercel كـ DATABASE_URL
```

### الخيار 2: AWS RDS

```
1. اذهب إلى: https://aws.amazon.com/rds/
2. أنشئ MySQL instance
3. انتظر التهيئة (5-10 دقائق)
4. انسخ Endpoint
5. أنشئ connection string:
   mysql://user:password@endpoint:3306/osdm_platform
6. أضفها في Vercel
```

### الخيار 3: DigitalOcean

```
1. اذهب إلى: https://www.digitalocean.com
2. اذهب إلى: Managed Databases
3. أنشئ MySQL cluster
4. انسخ connection string
5. أضفها في Vercel
```

---

## المرحلة السادسة: النشر الأول

### 1. التحقق من الإعدادات
- ✅ جميع متغيرات البيئة مضافة
- ✅ قاعدة البيانات معدة
- ✅ Build settings صحيحة

### 2. بدء النشر
```
في Vercel Dashboard:
1. اذهب إلى: Deployments
2. اضغط "Deploy Now" أو انتظر الـ auto-deploy
3. شاهد السجلات
```

### 3. مراقبة البناء
```
في Vercel Dashboard:
- شاهد Build Logs
- تحقق من الأخطاء
- إذا فشل البناء، راجع الأخطاء وأصلحها
```

### 4. الموقع المباشر
```
بعد النشر الناجح، الموقع متاح على:
https://osdm-by-manus.vercel.app
```

---

## المرحلة السابعة: اختبار الموقع

### 1. اختبر الصفحة الرئيسية
```
https://your-vercel-domain.vercel.app
```

### 2. اختبر OAuth Login
```
1. اضغط "تسجيل الدخول"
2. تحقق من إعادة التوجيه إلى Manus
3. تحقق من العودة بعد تسجيل الدخول
```

### 3. اختبر الأسواق الثلاثة
```
1. سوق المنتجات الرقمية
2. سوق الخدمات الرقمية
3. سوق فرص العمل
```

### 4. اختبر قاعدة البيانات
```
1. تحقق من تحميل التصنيفات
2. تحقق من البحث والتصفية
3. تحقق من عرض المنتجات/الخدمات/الوظائف
```

---

## استكشاف الأخطاء والمشاكل الشائعة

### ❌ خطأ: "DATABASE_URL is not set"
**الحل:**
```
1. تحقق من Vercel Environment Variables
2. تأكد من أن DATABASE_URL موجود
3. أعد بناء المشروع: Deployments → Redeploy
```

### ❌ خطأ: "Cannot find module"
**الحل:**
```bash
# تأكد من تثبيت المكتبات محلياً
npm install
npm run build

# ثم ادفع إلى GitHub
git add .
git commit -m "fix: install dependencies"
git push
```

### ❌ خطأ: "CORS or OAuth issues"
**الحل:**
```
1. تحقق من VITE_APP_ID
2. تحقق من OAUTH_SERVER_URL
3. أضف Vercel domain إلى OAuth whitelist
4. أعد بناء المشروع
```

### ❌ خطأ: "Build timeout"
**الحل:**
```
1. تحقق من حجم المشروع
2. حذف node_modules المحلية
3. أعد بناء المشروع
4. ادفع إلى GitHub
```

### ❌ خطأ: "502 Bad Gateway"
**الحل:**
```
1. تحقق من قاعدة البيانات (هل متصلة؟)
2. تحقق من متغيرات البيئة
3. شاهد Vercel Function Logs
4. أعد بناء المشروع
```

---

## المرحلة الثامنة: إضافة نطاق مخصص (اختياري)

### 1. شراء نطاق
```
خيارات:
- GoDaddy: https://www.godaddy.com
- Namecheap: https://www.namecheap.com
- Google Domains: https://domains.google
```

### 2. ربط النطاق بـ Vercel
```
1. اذهب إلى: Project Settings → Domains
2. أضف نطاقك (مثل: osdm.sa)
3. انسخ Nameservers من Vercel
4. أضفها عند مسجل النطاق
5. انتظر التحقق (5-10 دقائق)
```

---

## المرحلة التاسعة: إعدادات الأمان

### 1. تفعيل HTTPS
✅ Vercel يفعل HTTPS تلقائياً

### 2. إضافة Security Headers
```
في Vercel Dashboard:
Project Settings → Security Headers
- تفعيل Strict-Transport-Security
- تفعيل X-Content-Type-Options
- تفعيل X-Frame-Options
```

### 3. تفعيل DDoS Protection
```
في Vercel Dashboard:
Project Settings → Security
- تفعيل DDoS Protection
```

---

## المرحلة العاشرة: المراقبة والصيانة

### 1. شاهد Analytics
```
في Vercel Dashboard:
Analytics → شاهد الزيارات والأداء
```

### 2. شاهد السجلات
```
في Vercel Dashboard:
Deployments → اختر deployment → Logs
```

### 3. إعدادات التنبيهات
```
في Vercel Dashboard:
Project Settings → Notifications
- تفعيل تنبيهات الأخطاء
- تفعيل تنبيهات النشر
```

---

## ملخص الخطوات السريعة

```bash
# 1. المشروع موجود على GitHub بالفعل ✅
# https://github.com/RazanLeo/OSDM-By-Manus

# 2. اذهب إلى Vercel
# https://vercel.com/dashboard

# 3. اضغط "Add New" → "Project"

# 4. اختر المستودع: RazanLeo/OSDM-By-Manus

# 5. أضف متغيرات البيئة (انظر أعلاه)

# 6. اضغط "Deploy"

# 7. انتظر النشر (عادة 3-5 دقائق)

# 8. اختبر الموقع
# https://osdm-by-manus.vercel.app
```

---

## قائمة التحقق النهائية ✅

- [ ] المشروع موجود على GitHub
- [ ] تم ربط المشروع بـ Vercel
- [ ] تم إضافة جميع متغيرات البيئة
- [ ] تم إعداد قاعدة البيانات
- [ ] تم النشر بنجاح على Vercel
- [ ] تم التحقق من الموقع المباشر
- [ ] تم اختبار OAuth login
- [ ] تم اختبار الأسواق الثلاثة
- [ ] تم اختبار قاعدة البيانات
- [ ] تم إضافة نطاق مخصص (اختياري)
- [ ] تم تفعيل HTTPS والأمان
- [ ] تم تفعيل المراقبة والتنبيهات

---

## الدعم والمساعدة

إذا واجهت أي مشاكل:

1. **شاهد Vercel Logs:**
   - https://vercel.com/dashboard → Deployments → Logs

2. **تحقق من متغيرات البيئة:**
   - Project Settings → Environment Variables

3. **أعد بناء المشروع:**
   - Deployments → اختر deployment → Redeploy

4. **تحقق من GitHub:**
   - https://github.com/RazanLeo/OSDM-By-Manus

5. **اتصل بـ Vercel Support:**
   - https://vercel.com/support

---

## معلومات مهمة

| المعلومة | القيمة |
|---------|--------|
| **مستودع GitHub** | https://github.com/RazanLeo/OSDM-By-Manus |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **الموقع المباشر** | https://osdm-by-manus.vercel.app |
| **Node Version** | 18.x أو أحدث |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Database** | MySQL (PlanetScale/AWS RDS/DigitalOcean) |

---

**آخر تحديث:** 2025-11-16
**الإصدار:** 1.0.0
**الحالة:** جاهز للنشر على Vercel ✅
