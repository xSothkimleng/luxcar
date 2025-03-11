'use client';
import axios from 'axios';
import { Brand } from '@/types/brand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

// Create a new brand
export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBrand: Omit<Brand, 'id'>) => {
      const { data } = await axios.post<Brand>('/api/brands', newBrand);
      return data;
    },
    onSuccess: () => {
      // Invalidate the brands list query to refetch it
      queryClient.invalidateQueries({ queryKey: [brandQueryKeys.brands] });
    },
  });
}

// Update an existing brand
export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<Brand>) => {
      const { data } = await axios.patch<Brand>('/api/brands', {
        id,
        ...updateData,
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
    mutationFn: async (id: string) => {
      await axios.delete('/api/brands', {
        data: { id },
      });
      return id;
    },
    onSuccess: id => {
      // Invalidate the brands list query
      queryClient.invalidateQueries({ queryKey: [brandQueryKeys.brands] });
      // Remove this specific brand from the cache
      queryClient.removeQueries({ queryKey: brandQueryKeys.brand(id) });
    },
  });
}
