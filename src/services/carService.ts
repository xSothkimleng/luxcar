import axios from 'axios';

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
 * Deletes a variant image by ID
 * @param id ID of the variant image to delete
 */
export async function deleteVariantImage(id: string): Promise<void> {
  await axios.delete(`/api/variant-images/${id}`);
}

/**
 * Deletes all variant images for a car
 * @param carId ID of the car whose variant images should be deleted
 */
export async function deleteAllVariantImages(carId: string): Promise<void> {
  await axios.delete(`/api/cars/${carId}/variants`);
}
