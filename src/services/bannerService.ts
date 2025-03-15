// services/bannerService.ts
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { BannerSlide, CreateBannerSlideData, UpdateBannerSlideData } from '@/types/banner';

interface UploadResponse {
  success: boolean;
  url: string;
  id: string;
}

/**
 * Uploads a banner image file to the server
 * @param file The file to upload
 * @param type Either 'main' or 'background'
 * @returns Promise with the upload response containing id and url
 */
export async function uploadBannerImage(file: File, type: 'main' | 'background'): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('imageCategory', 'banner'); // New field to differentiate from car uploads

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
 * Deletes a banner image by ID
 * @param id ID of the banner image to delete
 * @param url URL of the image (needed for Supabase deletion)
 */
export async function deleteBannerImage(id: string, url: string): Promise<void> {
  try {
    // First, delete from database via API
    await axios.delete(`/api/banner-images/${id}`);

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
    console.error('Error deleting banner image:', error);
    throw error;
  }
}

/**
 * Creates a new banner slide
 * @param slideData The banner slide data to create
 * @returns Promise with the created banner slide
 */
export async function createBannerSlide(slideData: CreateBannerSlideData): Promise<BannerSlide> {
  const { data } = await axios.post<BannerSlide>('/api/banner-slides', slideData);
  return data;
}

/**
 * Updates an existing banner slide
 * @param id The ID of the banner slide to update
 * @param slideData The updated banner slide data
 * @returns Promise with the updated banner slide
 */
export async function updateBannerSlide(id: string, slideData: UpdateBannerSlideData): Promise<BannerSlide> {
  const { data } = await axios.put<BannerSlide>(`/api/banner-slides/${id}`, slideData);
  return data;
}

/**
 * Gets all banner slides
 * @returns Promise with all banner slides
 */
export async function getBannerSlides(): Promise<BannerSlide[]> {
  const { data } = await axios.get<BannerSlide[]>('/api/banner-slides');
  return data;
}

/**
 * Gets a specific banner slide by ID
 * @param id The ID of the banner slide to get
 * @returns Promise with the banner slide
 */
export async function getBannerSlide(id: string): Promise<BannerSlide> {
  const { data } = await axios.get<BannerSlide>(`/api/banner-slides/${id}`);
  return data;
}

/**
 * Deletes a banner slide
 * @param id The ID of the banner slide to delete
 * @returns Promise indicating success
 */
export async function deleteBannerSlide(id: string): Promise<{ success: boolean }> {
  const { data } = await axios.delete<{ success: boolean }>(`/api/banner-slides/${id}`);
  return data;
}
