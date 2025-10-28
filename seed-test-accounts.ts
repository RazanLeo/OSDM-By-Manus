import * as db from './server/db';
import { users } from './drizzle/schema';

async function seedTestAccounts() {
  console.log('🌱 إضافة الحسابات التجريبية...');

  const testAccounts = [
    {
      openId: 'admin_osdm',
      name: 'مدير المنصة',
      email: 'admin@osdm.com',
      loginMethod: 'email',
      role: 'admin',
      isVerified: true,
    },
    {
      openId: 'mustaqil_test',
      name: 'مستقل',
      email: 'mustaqil@test.com',
      loginMethod: 'email',
      role: 'seller',
      isVerified: true,
    },
    {
      openId: 'khamsat_test',
      name: 'خمسات',
      email: 'khamsat@test.com',
      loginMethod: 'email',
      role: 'seller',
      isVerified: true,
    },
    {
      openId: 'picalica_test',
      name: 'بيكاليكا',
      email: 'picalica@test.com',
      loginMethod: 'email',
      role: 'seller',
      isVerified: true,
    },
    {
      openId: 'syndian_test',
      name: 'سنديان',
      email: 'syndian@test.com',
      loginMethod: 'email',
      role: 'seller',
      isVerified: true,
    },
    {
      openId: 'ana_test',
      name: 'أنا',
      email: 'ana@test.com',
      loginMethod: 'email',
      role: 'buyer',
      isVerified: true,
    },
    {
      openId: 'baeed_test',
      name: 'بعيد',
      email: 'baeed@test.com',
      loginMethod: 'email',
      role: 'seller',
      isVerified: true,
    },
    {
      openId: 'zaitoon_test',
      name: 'زيتون',
      email: 'zaitoon@test.com',
      loginMethod: 'email',
      role: 'seller',
      isVerified: true,
    },
    {
      openId: 'academya_test',
      name: 'أكاديمية خسوب',
      email: 'academya@test.com',
      loginMethod: 'email',
      role: 'seller',
      isVerified: true,
    },
    {
      openId: 'khassoub_test',
      name: 'خسوب',
      email: 'khassoub@test.com',
      loginMethod: 'email',
      role: 'seller',
      isVerified: true,
    },
    {
      openId: 'mosoua_test',
      name: 'موسوعة خسوب',
      email: 'mosoua@test.com',
      loginMethod: 'email',
      role: 'seller',
      isVerified: true,
    },
  ];

  for (const account of testAccounts) {
    try {
      await db.upsertUser({
        openId: account.openId,
        name: account.name,
        email: account.email,
        loginMethod: account.loginMethod,
        lastSignedIn: new Date(),
      });
      console.log(`✅ تم إضافة: ${account.name} (${account.email})`);
    } catch (error) {
      console.error(`❌ خطأ في إضافة ${account.name}:`, error);
    }
  }

  console.log('✅ تم إضافة جميع الحسابات التجريبية بنجاح!');
  process.exit(0);
}

seedTestAccounts().catch((error) => {
  console.error('❌ خطأ في إضافة الحسابات:', error);
  process.exit(1);
});

