// src/app/api/cars/popular/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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
        status: {
          select: {
            name: true,
          },
        },
        scale: true,
        description: true,
        color: {
          select: {
            name: true,
            rgb: true,
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
