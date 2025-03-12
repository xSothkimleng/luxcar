import axios from 'axios';
import { supabase } from '@/lib/supabase';

interface UploadResponse {
  success: boolean;
  url: string;
  id: string;
}

/**
 * Uploads an image file to the server
 * @param file The file to upload
 * @param type Either 'thumbnail' or 'variant'
 * @param carId Required for variant images, to associate them with a car
 * @returns Promise with the upload response containing id and url
 */
export async function uploadImage(file: File, type: 'thumbnail' | 'variant', carId?: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  if (type === 'variant' && carId) {
    formData.append('carId', carId);
  }

  const { data } = await axios.post<UploadResponse>('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
}

/**
 * Extracts the file path from a Supabase URL
 * @param url The full Supabase URL
 * @returns The storage path that can be used with Supabase storage
 */
function extractFilePathFromUrl(url: string): string | null {
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
 * Deletes a variant image by ID
 * @param id ID of the variant image to delete
 * @param url URL of the image (needed for Supabase deletion)
 */
export async function deleteVariantImage(id: string, url: string): Promise<void> {
  try {
    // First, delete from database via API
    await axios.delete(`/api/variant-images/${id}`);

    // Also delete the file from Supabase
    if (url) {
      const filePath = extractFilePathFromUrl(url);
      if (filePath) {
        const { error } = await supabase.storage.from('car-images').remove([filePath]);

        if (error) {
          console.error('Error deleting file from Supabase:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error deleting variant image:', error);
    throw error;
  }
}

/**
 * Deletes all variant images for a car
 * @param carId ID of the car whose variant images should be deleted
 */
export async function deleteAllVariantImages(carId: string): Promise<void> {
  try {
    // Get all variant images for this car first
    const { data: variantImages } = await axios.get(`/api/cars/${carId}/variants`);

    // Delete files from Supabase storage
    if (variantImages?.length) {
      const filePaths = variantImages.map((image: { url: string }) => extractFilePathFromUrl(image.url)).filter(Boolean);

      if (filePaths.length) {
        const { error } = await supabase.storage.from('car-images').remove(filePaths as string[]);

        if (error) {
          console.error('Error deleting files from Supabase:', error);
        }
      }
    }

    // Delete all variant images from the database
    await axios.delete(`/api/cars/${carId}/variants`);
  } catch (error) {
    console.error('Error deleting all variant images:', error);
    throw error;
  }
}
