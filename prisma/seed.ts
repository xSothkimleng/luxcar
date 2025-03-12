import { PrismaClient } from '@prisma/client';
import { randomBytes, scryptSync } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Generate password hash
  const password = 'password123'; // You can change this to your desired password
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  const passwordWithSalt = `${hash}:${salt}`;

  // Create admin user
  try {
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password: passwordWithSalt,
        role: 'ADMIN',
      },
    });

    console.log(`Created admin user with id: ${admin.id}`);
    console.log('Admin credentials:');
    console.log('Username: admin');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 'P2002') {
      console.log('Admin user already exists');
    } else {
      throw error;
    }
  }
}

main()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
