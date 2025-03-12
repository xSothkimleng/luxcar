/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single car by ID
export async function GET(request: NextRequest, context: any) {
  try {
    const carId = context.params.carId;

    const car = await prisma.car.findUnique({
      where: {
        id: carId,
      },
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

// PATCH - Update a specific car
export async function PATCH(request: NextRequest, context: any) {
  try {
    const carId = context.params.carId;
    const data = await request.json();

    // Update the car
    const updatedCar = await prisma.car.update({
      where: { id: carId },
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

// DELETE - Remove a specific car
export async function DELETE(request: NextRequest, context: any) {
  try {
    const carId = context.params.carId;

    // First, delete related variant images to avoid foreign key constraint violations
    await prisma.variantImage.deleteMany({
      where: { carId },
    });

    // Then delete the car
    await prisma.car.delete({
      where: { id: carId },
    });

    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}
