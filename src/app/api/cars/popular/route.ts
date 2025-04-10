// src/app/api/cars/popular/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch only what you need in a single query
    const cars = await prisma.car.findMany({
      take: 12,
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        name: true,
        price: true,
        variantImages: true,
        thumbnailImage: {
          select: {
            url: true,
          },
        },
        brand: {
          select: {
            name: true,
          },
        },
        model: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching popular cars:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
