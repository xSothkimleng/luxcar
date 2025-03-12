/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { prisma } from '@/lib/prisma';

// Set a size limit for uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();

    // Get the type of upload (thumbnail or variant)
    const type = formData.get('type') as string;

    if (!type || (type !== 'thumbnail' && type !== 'variant')) {
      return NextResponse.json({ error: 'Invalid upload type. Must be "thumbnail" or "variant"' }, { status: 400 });
    }

    // Get the file from form data
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are supported.' }, { status: 400 });
    }

    // Generate a unique filename
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

    // Determine the upload directory based on type
    const uploadDir = type === 'thumbnail' ? 'thumbnails' : 'variants';
    const publicDir = join(process.cwd(), 'public', 'uploads', uploadDir);

    // Ensure directory exists
    try {
      await mkdir(publicDir, { recursive: true });
    } catch (err) {
      console.log('Directory already exists or cannot be created');
    }

    const filePath = join(publicDir, fileName);

    // Convert the file to an ArrayBuffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate the URL for the uploaded file
    const url = `/uploads/${uploadDir}/${fileName}`;

    // Create a record in the database based on the type
    let result;
    if (type === 'thumbnail') {
      result = await prisma.thumbnailImage.create({
        data: { url },
      });
    } else {
      // For variant images, we need the carId which should be in the formData
      const carId = formData.get('carId') as string;

      if (!carId) {
        return NextResponse.json({ error: 'carId is required for variant images' }, { status: 400 });
      }

      result = await prisma.variantImage.create({
        data: {
          url,
          carId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      url,
      id: result.id,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
