/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/colors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, unauthorized } from '@/lib/apiAuth';

export async function GET() {
  try {
    const colors = await prisma.color.findMany({
      include: {
        cars: true,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch colors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }
  try {
    const data = await request.json();

    const color = await prisma.color.create({
      data,
    });

    return NextResponse.json(color, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create color' }, { status: 500 });
  }
}

// For PATCH/PUT and DELETE operations
export async function PATCH(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }
  try {
    const { id, ...data } = await request.json();

    const color = await prisma.color.update({
      where: { id },
      data,
    });

    return NextResponse.json(color);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update color' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }
  try {
    const { id } = await request.json();

    await prisma.color.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Color deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete color' }, { status: 500 });
  }
}
