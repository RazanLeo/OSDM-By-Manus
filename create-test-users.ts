import { db } from './server/db';
import { users } from './server/db/schema';
import bcrypt from 'bcryptjs';

async function createTestUsers() {
  console.log('Creating test users...');

  const testUsers = [
    {
      email: 'admin@osdm.sa',
      username: 'admin',
      password: await bcrypt.hash('admin@123456', 10),
      fullName: 'Admin User',
      role: 'admin',
      isActive: true,
      emailVerified: true,
    },
    {
      email: 'guest@osdm.sa',
      username: 'Guest',
      password: await bcrypt.hash('guest@123456', 10),
      fullName: 'Guest User',
      role: 'user',
      isActive: true,
      emailVerified: true,
    },
    {
      email: 'razan@osdm.sa',
      username: 'Razan@OSDM',
      password: await bcrypt.hash('RazanOSDM@056300', 10),
      fullName: 'Razan Ahmed Tawfiq',
      role: 'owner',
      isActive: true,
      emailVerified: true,
    },
  ];

  for (const user of testUsers) {
    try {
      await db.insert(users).values(user).onConflictDoNothing();
      console.log(`✓ Created user: ${user.email}`);
    } catch (error) {
      console.log(`User ${user.email} already exists or error:`, error);
    }
  }

  console.log('Test users created successfully!');
  process.exit(0);
}

createTestUsers().catch(console.error);
