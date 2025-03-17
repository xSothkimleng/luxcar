'use client';
import axios from 'axios';
import { Brand } from '@/types/brand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadBrandImage, deleteBrandImage } from '@/services/brandService';

// Query keys for better cache management
export const brandQueryKeys = {
  brands: 'brands',
  brand: (id: string) => ['brand', id],
};

// Fetch all brands
export function useBrands() {
  return useQuery({
    queryKey: [brandQueryKeys.brands],
    queryFn: async () => {
      const { data } = await axios.get<Brand[]>('/api/brands');
      return data;
    },
  });
}

// Create a new brand with image
export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ brandData, imageFile }: { brandData: Omit<Brand, 'id'>; imageFile: File | null }) => {
      let imageUrl: string | undefined;

      // Upload image if provided
      if (imageFile) {
        const uploadResult = await uploadBrandImage(imageFile);
        imageUrl = uploadResult.url;
      }

      // Create brand with image URL if available
      const { data } = await axios.post<Brand>('/api/brands', {
        ...brandData,
        imageUrl,
      });

      return data;
    },
    onSuccess: () => {
      // Invalidate the brands list query to refetch it
      queryClient.invalidateQueries({ queryKey: [brandQueryKeys.brands] });
    },
    onError: (error, variables) => {
      console.error('Error creating brand:', error);
      // If there was an error and we uploaded an image, we should clean it up
      if (variables.imageFile && variables.brandData.imageUrl) {
        deleteBrandImage(variables.brandData.imageUrl).catch(err => {
          console.error('Error cleaning up image after failed brand creation:', err);
        });
      }
    },
  });
}

// Update an existing brand with image
export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      brandData,
      imageFile,
      deleteCurrentImage,
    }: {
      id: string;
      brandData: Partial<Brand>;
      imageFile?: File | null;
      deleteCurrentImage?: boolean;
    }) => {
      let imageUrl: string | undefined = brandData.imageUrl;

      // Handle image update
      if (deleteCurrentImage && brandData.imageUrl) {
        // Delete the current image if requested
        await deleteBrandImage(brandData.imageUrl);
        imageUrl = undefined; // Changed from null to undefined to match the type
      }

      // Upload new image if provided
      if (imageFile) {
        const uploadResult = await uploadBrandImage(imageFile);
        imageUrl = uploadResult.url;
      }

      // Update brand with new data
      const { data } = await axios.patch<Brand>('/api/brands', {
        id,
        ...brandData,
        imageUrl,
      });

      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the individual brand
      queryClient.invalidateQueries({ queryKey: [brandQueryKeys.brands] });
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.brand(variables.id) });
    },
  });
}

// Delete a brand
export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brand: Brand) => {
      // Delete the brand's image if it exists
      if (brand.imageUrl) {
        await deleteBrandImage(brand.imageUrl);
      }

      // Delete the brand from the database
      await axios.delete('/api/brands', {
        data: { id: brand.id },
      });

      return brand.id;
    },
    onSuccess: id => {
      // Invalidate the brands list query
      queryClient.invalidateQueries({ queryKey: [brandQueryKeys.brands] });
      // Remove this specific brand from the cache
      queryClient.removeQueries({ queryKey: brandQueryKeys.brand(id) });
    },
  });
}
