const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME || 'Super Admin';

  if (!email || !password) {
    console.log('Skipping initial admin seed: SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD is not set.');
    return;
  }

  try {
    console.log(`Seeding initial admin user for: ${email}...`);
    
    // Hash the password using argon2 (matches backend authentication)
    const passwordHash = await argon2.hash(password);

    // Upsert ensures we don't create a duplicate if the script runs multiple times
    const admin = await prisma.admin.upsert({
      where: { email },
      update: {
        passwordHash,
        name,
        // Optional: Ensure it's active and has SUPER_ADMIN role if updating
        isActive: true,
        role: 'SUPER_ADMIN',
      },
      create: {
        email,
        name,
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    console.log(`✅ Admin user seeded successfully! [ID: ${admin.id}]`);
  } catch (error) {
    console.error('❌ Failed to seed initial admin user:');
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
