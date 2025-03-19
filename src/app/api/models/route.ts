// app/api/models/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, unauthorized } from '@/lib/apiAuth';

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      include: {
        cars: true,
      },
    });

    return NextResponse.json(models);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }

  try {
    const data = await request.json();

    // Create model with image URL and order
    // Use 0 as default if order is not provided
    const model = await prisma.model.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl || null,
        order: data.order !== undefined ? data.order : 0, // Default to 0 if not provided
      },
    });

    return NextResponse.json(model, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create model' }, { status: 500 });
  }
}

// For PATCH/PUT and DELETE operations
// Update the PATCH method
export async function PATCH(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }
  try {
    const { id, ...data } = await request.json();

    const model = await prisma.model.update({
      where: { id },
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        order: data.order !== undefined ? data.order : undefined,
      },
    });

    return NextResponse.json(model);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update model' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }
  try {
    const { id } = await request.json();

    await prisma.model.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Model deleted successfully' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete model' }, { status: 500 });
  }
}
