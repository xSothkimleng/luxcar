/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/cars/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      include: {
        color: true,
        brand: true,
        model: true,
        thumbnailImage: true,
        variantImages: true,
      },
    });

    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const car = await prisma.car.create({
      data,
      include: {
        color: true,
        brand: true,
        model: true,
      },
    });

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}
