/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/models/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      include: {
        cars: true,
      },
    });

    return NextResponse.json(models);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const model = await prisma.model.create({
      data,
    });

    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create model' }, { status: 500 });
  }
}

// For PATCH/PUT and DELETE operations
export async function PATCH(request: Request) {
  try {
    const { id, ...data } = await request.json();

    const model = await prisma.model.update({
      where: { id },
      data,
    });

    return NextResponse.json(model);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update model' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await prisma.model.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Model deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete model' }, { status: 500 });
  }
}
