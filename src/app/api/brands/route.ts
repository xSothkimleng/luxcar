/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/brands/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        cars: true,
      },
    });

    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Create brand with image URL if provided
    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl || null,
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}

// For PATCH/PUT and DELETE operations
export async function PATCH(request: Request) {
  try {
    const { id, ...data } = await request.json();

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}
