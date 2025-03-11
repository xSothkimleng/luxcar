// app/api/variant-images/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

// DELETE a variant image by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Find the image to get its URL before deletion
    const image = await prisma.variantImage.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ error: 'Variant image not found' }, { status: 404 });
    }

    // Delete the image from the database
    await prisma.variantImage.delete({
      where: { id },
    });

    // Attempt to delete the physical file
    // Skip error handling as this shouldn't prevent API success
    try {
      // Extract the file path from the URL
      // URL format is typically "/uploads/variants/filename.jpg"
      const filePath = image.url.replace(/^\/uploads/, '');
      const fullPath = join(process.cwd(), 'public', 'uploads', filePath);

      await unlink(fullPath);
      console.log(`Deleted file: ${fullPath}`);
    } catch (fileError) {
      // Log but don't throw error if file deletion fails
      console.warn(`Could not delete file for image ${id}:`, fileError);
    }

    return NextResponse.json({
      success: true,
      message: 'Variant image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting variant image:', error);
    return NextResponse.json({ error: 'Failed to delete variant image' }, { status: 500 });
  }
}
