'use client';
import axios from 'axios';
import { Color } from '@/types/color';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query keys for better cache management
export const colorQueryKeys = {
  colors: 'colors',
  color: (id: string) => ['color', id],
};

// Fetch all colors
export function useColors() {
  return useQuery({
    queryKey: [colorQueryKeys.colors],
    queryFn: async () => {
      const { data } = await axios.get<Color[]>('/api/colors');

      // Sort colors by their order property
      return data.sort((a, b) => {
        // Handle null/undefined order values (place them at the end)
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;

        // Sort by order first
        if (orderA !== orderB) {
          return orderA - orderB;
        }

        // If orders are the same or null, sort by name
        return a.name.localeCompare(b.name);
      });
    },
  });
}

// Create a new color
export function useCreateColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newColor: Omit<Color, 'id'>) => {
      const { data } = await axios.post<Color>('/api/colors', newColor);
      return data;
    },
    onSuccess: () => {
      // Invalidate the colors list query to refetch it
      queryClient.invalidateQueries({ queryKey: [colorQueryKeys.colors] });
    },
  });
}

// Update an existing color
export function useUpdateColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<Color>) => {
      const { data } = await axios.patch<Color>('/api/colors', {
        id,
        ...updateData,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the individual color
      queryClient.invalidateQueries({ queryKey: [colorQueryKeys.colors] });
      queryClient.invalidateQueries({ queryKey: colorQueryKeys.color(variables.id) });
    },
  });
}

// Delete a color
export function useDeleteColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete('/api/colors', {
        data: { id },
      });
      return id;
    },
    onSuccess: id => {
      // Invalidate the colors list query
      queryClient.invalidateQueries({ queryKey: [colorQueryKeys.colors] });
      // Remove this specific color from the cache
      queryClient.removeQueries({ queryKey: colorQueryKeys.color(id) });
    },
  });
}
