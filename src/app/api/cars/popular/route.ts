// src/app/api/cars/paginated/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const randomCars = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM "cars"
    ORDER BY RANDOM()
    LIMIT 12
  `;

    console.log('Random Cars:', randomCars);

    const ids = randomCars.map(car => car.id);

    const cars = await prisma.car.findMany({
      where: { id: { in: ids } },
      include: {
        color: true,
        brand: true,
        model: true,
        status: true,
        thumbnailImage: true,
        variantImages: true,
      },
    });

    return NextResponse.json(cars);
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
