/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, unauthorized } from '@/lib/apiAuth';

export async function GET() {
  try {
    const statuses = await prisma.status.findMany({
      include: {
        cars: true,
      },
    });

    return NextResponse.json(statuses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch statuses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }
  try {
    const data = await request.json();

    const status = await prisma.status.create({
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(status, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create status' }, { status: 500 });
  }
}

// For PATCH/PUT operations
export async function PATCH(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }
  try {
    const { id, ...data } = await request.json();

    const status = await prisma.status.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }
  try {
    const { id } = await request.json();

    await prisma.status.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Status deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete status' }, { status: 500 });
  }
}
