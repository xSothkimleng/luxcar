/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE - Delete a banner image
export async function DELETE(request: NextRequest, context: any) {
  try {
    const id = context.params.id;

    // Check if the image exists
    const image = await prisma.bannerImage.findUnique({
      where: { id },
      include: {
        mainImageForSlides: true,
        bgImageForSlides: true,
      },
    });

    if (!image) {
      return NextResponse.json({ error: 'Banner image not found' }, { status: 404 });
    }

    // Check if the image is being used by any slides
    if (image.mainImageForSlides.length > 0 || image.bgImageForSlides.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete banner image as it is being used by banner slides',
          slides: [
            ...image.mainImageForSlides.map(slide => ({ id: slide.id, title: slide.title, usage: 'main' })),
            ...image.bgImageForSlides.map(slide => ({ id: slide.id, title: slide.title, usage: 'background' })),
          ],
        },
        { status: 400 },
      );
    }

    // Delete the banner image
    await prisma.bannerImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting banner image:', error);
    return NextResponse.json({ error: 'Failed to delete banner image' }, { status: 500 });
  }
}
