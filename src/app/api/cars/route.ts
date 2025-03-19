// app/api/cars/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, unauthorized } from '@/lib/apiAuth';

// GET all cars
export async function GET() {
  try {
    const cars = await prisma.car.findMany({
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
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

// POST - Create a new car
export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return unauthorized();
  }

  try {
    const body = await request.json();

    // Extract nested data for variant images if present
    const { variantImages, ...carData } = body;

    // Create car with all its relations
    const car = await prisma.car.create({
      data: {
        ...carData,
        // If variant images are provided, create them
        ...(variantImages && {
          variantImages: {
            create: variantImages,
          },
        }),
      },
      include: {
        color: true,
        brand: true,
        model: true,
        thumbnailImage: true,
        variantImages: true,
      },
    });

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}

// PATCH - Update an existing car
export async function PATCH(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return unauthorized();
  }

  try {
    const { id, variantImages, ...data } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    // Handle variant images if provided
    if (variantImages) {
      // First, delete existing variant images if needed
      // This is optional - you could choose to append instead
      await prisma.variantImage.deleteMany({
        where: { carId: id },
      });

      // Create new variant images
      await prisma.variantImage.createMany({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: variantImages.map((image: any) => ({
          ...image,
          carId: id,
        })),
      });
    }

    // Update the car
    const updatedCar = await prisma.car.update({
      where: { id },
      data,
      include: {
        color: true,
        brand: true,
        model: true,
        thumbnailImage: true,
        variantImages: true,
      },
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

// DELETE - Remove a car
export async function DELETE(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }

  try {
    // For DELETE requests, we'll extract the ID from the URL params or request body
    // Here we're assuming it's in the request body
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    // First, delete related variant images to avoid foreign key constraint violations
    await prisma.variantImage.deleteMany({
      where: { carId: id },
    });

    // Then delete the car
    await prisma.car.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}
