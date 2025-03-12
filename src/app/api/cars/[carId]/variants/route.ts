import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

// GET handler to retrieve all variant images for a car
export async function GET(request: Request, { params }: { params: { carId: string } }) {
  try {
    const carId = params.carId;

    const variantImages = await prisma.variantImage.findMany({
      where: {
        carId,
      },
      select: {
        id: true,
        url: true,
      },
    });

    return NextResponse.json(variantImages);
  } catch (error) {
    console.error('Error fetching variant images:', error);
    return NextResponse.json({ error: 'Failed to fetch variant images' }, { status: 500 });
  }
}

// DELETE handler to remove all variant images for a car
export async function DELETE(request: Request, { params }: { params: { carId: string } }) {
  try {
    const carId = params.carId;

    // Get all variant images for this car to delete from storage
    const variantImages = await prisma.variantImage.findMany({
      where: {
        carId,
      },
      select: {
        url: true,
      },
    });

    // Extract file paths from URLs for Supabase deletion
    const filePaths = variantImages
      .map(image => {
        if (image.url.includes('storage/v1/object/public/car-images/')) {
          return image.url.split('storage/v1/object/public/car-images/')[1];
        }

        if (image.url.includes('.supabase.co')) {
          const pathMatch = image.url.match(/car-images\/(.+)/);
          return pathMatch ? pathMatch[1] : null;
        }

        return null;
      })
      .filter(Boolean) as string[];

    // Delete files from Supabase storage
    if (filePaths.length > 0) {
      const { error } = await supabase.storage.from('car-images').remove(filePaths);

      if (error) {
        console.error('Error deleting files from Supabase:', error);
      }
    }

    // Delete records from the database
    await prisma.variantImage.deleteMany({
      where: {
        carId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting variant images:', error);
    return NextResponse.json({ error: 'Failed to delete variant images' }, { status: 500 });
  }
}
