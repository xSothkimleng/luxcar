// src/app/api/homepage-cars/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, unauthorized } from '@/lib/apiAuth';

// GET - Get all homepage cars
export async function GET() {
  try {
    const homepageCars = await prisma.homepageCar.findMany({
      include: {
        car: {
          include: {
            color: true,
            brand: true,
            model: true,
            status: true,
            thumbnailImage: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(homepageCars);
  } catch (error) {
    console.error('Error fetching homepage cars:', error);
    return NextResponse.json({ error: 'Failed to fetch homepage cars' }, { status: 500 });
  }
}

// POST - Add a car to homepage
export async function POST(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const { carId } = body;

    if (!carId) {
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    // Find the highest current order value
    const highestOrder = await prisma.homepageCar.findFirst({
      orderBy: {
        order: 'desc',
      },
      select: {
        order: true,
      },
    });

    const nextOrder = highestOrder ? highestOrder.order + 1 : 1;

    // Create the homepage car entry
    const homepageCar = await prisma.homepageCar.create({
      data: {
        carId,
        order: nextOrder,
      },
      include: {
        car: {
          include: {
            color: true,
            brand: true,
            model: true,
            status: true,
            thumbnailImage: true,
          },
        },
      },
    });

    return NextResponse.json(homepageCar, { status: 201 });
  } catch (error) {
    console.error('Error adding car to homepage:', error);
    return NextResponse.json({ error: 'Failed to add car to homepage' }, { status: 500 });
  }
}

// PUT - Update order of homepage cars
export async function PUT(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    // Update order of each item
    const updates = items.map((item, index) =>
      prisma.homepageCar.update({
        where: { id: item.id },
        data: { order: index + 1 },
      }),
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating homepage car order:', error);
    return NextResponse.json({ error: 'Failed to update homepage car order' }, { status: 500 });
  }
}

// DELETE - Remove a car from homepage
export async function DELETE(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Homepage car ID is required' }, { status: 400 });
    }

    // Delete the homepage car entry
    await prisma.homepageCar.delete({
      where: { id },
    });

    // Reorder remaining items
    const remainingItems = await prisma.homepageCar.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    // Update order of each item
    const updates = remainingItems.map((item, index) =>
      prisma.homepageCar.update({
        where: { id: item.id },
        data: { order: index + 1 },
      }),
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing car from homepage:', error);
    return NextResponse.json({ error: 'Failed to remove car from homepage' }, { status: 500 });
  }
}
