// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUserByEmail) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
    }

    if (existingUserByUsername) {
      return NextResponse.json({ message: 'Username already taken' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'USER', // Default role
      },
    });

    // Return user without password
    return NextResponse.json(
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
