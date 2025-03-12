/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: NextRequest, context: any) {
  try {
    const id = context.params.id;

    // Get the image URL before deleting it
    const variantImage = await prisma.variantImage.findUnique({
      where: {
        id,
      },
      select: {
        url: true,
      },
    });

    if (!variantImage) {
      return NextResponse.json({ error: 'Variant image not found' }, { status: 404 });
    }

    // Extract storage path from URL
    let filePath = null;

    if (variantImage.url.includes('storage/v1/object/public/car-images/')) {
      filePath = variantImage.url.split('storage/v1/object/public/car-images/')[1];
    } else if (variantImage.url.includes('.supabase.co')) {
      const pathMatch = variantImage.url.match(/car-images\/(.+)/);
      filePath = pathMatch ? pathMatch[1] : null;
    }

    // Delete file from Supabase storage
    if (filePath) {
      const { error } = await supabase.storage.from('car-images').remove([filePath]);

      if (error) {
        console.error('Error deleting file from Supabase:', error);
      }
    }

    // Delete the record from the database
    await prisma.variantImage.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting variant image:', error);
    return NextResponse.json({ error: 'Failed to delete variant image' }, { status: 500 });
  }
}
