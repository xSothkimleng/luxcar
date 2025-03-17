import { supabase } from '@/lib/supabase';

interface UploadResponse {
  success: boolean;
  url: string;
  id?: string;
}

/**
 * Uploads a brand image file to the server
 * @param file The file to upload
 * @returns Promise with the upload response containing url
 */
export async function uploadBrandImage(file: File): Promise<UploadResponse> {
  try {
    // Generate a unique filename
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const filePath = `brands/${fileName}`;

    // Convert file to buffer for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.storage.from('car-images').upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error('Failed to upload to Supabase');
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from('car-images').getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('Error uploading brand image:', error);
    throw error;
  }
}

/**
 * Extracts the file path from a Supabase URL
 * @param url The full Supabase URL
 * @returns The storage path that can be used with Supabase storage
 */
export function extractFilePathFromUrl(url: string): string | null {
  // For URLs that contain the storage path
  if (url.includes('storage/v1/object/public/car-images/')) {
    return url.split('storage/v1/object/public/car-images/')[1];
  }

  // For the standard storage.supabase.co URLs
  if (url.includes('.supabase.co')) {
    const pathMatch = url.match(/car-images\/(.+)/);
    return pathMatch ? pathMatch[1] : null;
  }

  return null;
}

/**
 * Deletes a brand image from storage
 * @param url URL of the image to delete
 */
export async function deleteBrandImage(url: string): Promise<void> {
  try {
    if (!url) return;

    const filePath = extractFilePathFromUrl(url);
    if (filePath) {
      const { error } = await supabase.storage.from('car-images').remove([filePath]);

      if (error) {
        console.error('Error deleting file from Supabase:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error deleting brand image:', error);
    throw error;
  }
}
