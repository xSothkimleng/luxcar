/* eslint-disable @typescript-eslint/no-require-imports */
// update-admin-password.js
const { PrismaClient } = require('@prisma/client');
const { randomBytes, scryptSync } = require('crypto');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    // Get the current admin user
    const admin = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    if (!admin) {
      console.error('Admin user not found');
      return;
    }

    console.log('Found admin user:', admin.username);
    console.log('Current password format:', admin.password);

    // Generate new password hash in the correct format
    const password = 'password123';
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    const passwordWithSalt = `${hash}:${salt}`;

    console.log('New password format will be: [hash]:[salt]');

    // Update the admin user with the new formatted password
    const updatedAdmin = await prisma.user.update({
      where: { id: admin.id },
      data: {
        password: passwordWithSalt,
      },
    });

    console.log('Admin password updated successfully!');
    console.log('New password format verification:', updatedAdmin.password.includes(':') ? 'Correct' : 'Incorrect');
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword()
  .then(() => console.log('Done!'))
  .catch(err => console.error('Script error:', err));
