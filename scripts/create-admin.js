const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@bikeplatform.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@bikeplatform.com');
      console.log('Password: admin123');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@bikeplatform.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@bikeplatform.com');
    console.log('Password: admin123');
    console.log('User ID:', admin.id);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();