// src/hooks/useHomepageCars.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Query keys
const queryKeys = {
  homepageCars: 'homepageCars',
};

// Get all homepage cars
export function useHomepageCars() {
  return useQuery({
    queryKey: [queryKeys.homepageCars],
    queryFn: async () => {
      const { data } = await axios.get('/api/homepage-cars');
      return data;
    },
  });
}

// Add a car to homepage
export function useAddHomepageCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carId: string) => {
      const { data } = await axios.post('/api/homepage-cars', { carId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.homepageCars] });
    },
  });
}

// Update order of homepage cars
export function useUpdateHomepageCarOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (items: any[]) => {
      const { data } = await axios.put('/api/homepage-cars', { items });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.homepageCars] });
    },
  });
}

// Remove a car from homepage
export function useRemoveHomepageCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete('/api/homepage-cars', { data: { id } });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.homepageCars] });
    },
  });
}
