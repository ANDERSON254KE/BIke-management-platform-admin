const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bikerental.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@bikerental.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Created admin user:', admin);

  // Create a sample bike
  const bike = await prisma.bike.upsert({
    where: { id: 'sample-bike-1' },
    update: {},
    create: {
      id: 'sample-bike-1',
      name: 'Mountain Bike Pro',
      description: 'High-quality mountain bike perfect for trails',
      pricePerHour: 15.0,
      status: 'AVAILABLE'
    }
  });

  console.log('Created sample bike:', bike);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });