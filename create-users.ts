import { db } from './server/db';
import { users } from './drizzle/schema';
import bcrypt from 'bcryptjs';

async function createUsers() {
  // تشفير كلمات المرور
  const userPassword = await bcrypt.hash('User@123', 10);
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  // إنشاء المستخدم العادي
  await db.insert(users).values({
    name: 'مستخدم تجريبي',
    email: 'user@osdm.sa',
    password: userPassword,
    role: 'user',
    loginMethod: 'email',
  });

  // إنشاء المدير
  await db.insert(users).values({
    name: 'مدير المنصة',
    email: 'admin@osdm.sa',
    password: adminPassword,
    role: 'admin',
    loginMethod: 'email',
  });

  console.log('✅ تم إنشاء الحسابات بنجاح!');
  console.log('');
  console.log('حساب المستخدم العادي:');
  console.log('Email: user@osdm.sa');
  console.log('Password: User@123');
  console.log('');
  console.log('حساب المدير:');
  console.log('Email: admin@osdm.sa');
  console.log('Password: Admin@123');
  
  process.exit(0);
}

createUsers().catch(console.error);
