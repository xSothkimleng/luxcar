// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase, getPublicUrl } from '@/lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    console.log('Upload request received');

    // Parse the multipart form data
    const formData = await request.formData();
    console.log('Form data parsed', {
      type: formData.get('type'),
      imageCategory: formData.get('imageCategory'),
      hasFile: !!formData.get('file'),
      carId: formData.get('carId'),
    });

    // Get the category of image (car or banner)
    const imageCategory = (formData.get('imageCategory') as string) || 'car';

    // Get the type of upload based on category
    const type = formData.get('type') as string;

    // Validate type based on category
    if (imageCategory === 'car') {
      if (!type || (type !== 'thumbnail' && type !== 'variant')) {
        return NextResponse.json({ error: 'Invalid upload type for car. Must be "thumbnail" or "variant"' }, { status: 400 });
      }
    } else if (imageCategory === 'banner') {
      if (!type || (type !== 'main' && type !== 'background')) {
        return NextResponse.json({ error: 'Invalid upload type for banner. Must be "main" or "background"' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid image category. Must be "car" or "banner"' }, { status: 400 });
    }

    // Get the file from form data
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('File received', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are supported.' }, { status: 400 });
    }

    // Generate a unique filename
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

    // Create the storage path based on category and type
    let uploadDir;

    if (imageCategory === 'car') {
      uploadDir = type === 'thumbnail' ? 'thumbnails' : 'variants';
    } else if (imageCategory === 'banner') {
      uploadDir = type === 'main' ? 'banner/main' : 'banner/background';
    }

    // For variant images, we need the carId in the path
    const carId = formData.get('carId') as string;
    let filePath;

    if (imageCategory === 'car' && type === 'variant' && carId) {
      filePath = `${uploadDir}/${carId}/${fileName}`;
    } else {
      filePath = `${uploadDir}/${fileName}`;
    }

    console.log('Preparing upload to Supabase', {
      bucket: 'car-images',
      filePath,
      fileType: file.type,
    });

    // Convert file to buffer for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('File converted to buffer, size:', buffer.length);

    // Upload to Supabase Storage
    try {
      const { data, error } = await supabase.storage.from('car-images').upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

      if (error) {
        console.error('Supabase upload error:', error);
        return NextResponse.json(
          {
            error: 'Failed to upload to Supabase',
            details: error,
          },
          { status: 500 },
        );
      }

      console.log('Supabase upload successful', data);

      // Get the public URL for the uploaded file
      const url = getPublicUrl(filePath);
      console.log('Generated public URL:', url);

      // Create a record in the database based on the image category and type
      let result;
      try {
        if (imageCategory === 'car') {
          if (type === 'thumbnail') {
            result = await prisma.thumbnailImage.create({
              data: { url },
            });
            console.log('Created thumbnail record in database', result);
          } else {
            // For variant images, we need the carId which should be in the formData
            if (!carId) {
              return NextResponse.json({ error: 'carId is required for variant images' }, { status: 400 });
            }

            result = await prisma.variantImage.create({
              data: {
                url,
                carId,
              },
            });
            console.log('Created variant image record in database', result);
          }
        } else if (imageCategory === 'banner') {
          // For banner images, we create a record in the BannerImage table
          const bannerImageType = type === 'main' ? 'MAIN' : 'BACKGROUND';

          result = await prisma.bannerImage.create({
            data: {
              url,
              type: bannerImageType,
            },
          });
          console.log('Created banner image record in database', result);
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          {
            error: 'Database operation failed',
            details: dbError instanceof Error ? dbError.message : String(dbError),
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        url,
        id: result?.id,
      });
    } catch (uploadError) {
      console.error('Error during Supabase upload:', uploadError);
      return NextResponse.json(
        {
          error: 'Supabase upload operation failed',
          details: uploadError instanceof Error ? uploadError.message : String(uploadError),
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error in upload API:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
