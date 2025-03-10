// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { scryptSync } from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log(`Login attempt for username: ${username}`);

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log(`User not found: ${username}`);
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    console.log(`User found: ${username}, checking password`);

    // Check if the password is in the expected format (hash:salt)
    if (!user.password.includes(':')) {
      console.error('Password is not in the expected format');
      return NextResponse.json({ message: 'Invalid password format' }, { status: 500 });
    }

    // Split stored hash and salt
    const [storedHash, salt] = user.password.split(':');

    // Hash the input password with the same salt
    const inputHash = scryptSync(password, salt, 64).toString('hex');

    // Compare the hashes directly
    const isPasswordValid = inputHash === storedHash;

    console.log(`Password validation result for ${username}: ${isPasswordValid}`);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ message: 'An error occurred during authentication' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
