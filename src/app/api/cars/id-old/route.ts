import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET a single car by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        color: true,
        brand: true,
        model: true,
        thumbnailImage: true,
        variantImages: true,
      },
    });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
  }
}
