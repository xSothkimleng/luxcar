'use client';
import axios from 'axios';
import { Car } from '@/types/car';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query keys for better cache management
export const queryKeys = {
  cars: 'cars',
  car: (id: string) => ['car', id],
};

// Fetch all cars
export function useCars() {
  return useQuery({
    queryKey: [queryKeys.cars],
    queryFn: async () => {
      const { data } = await axios.get<Car[]>('/api/cars');
      return data;
    },
  });
}

export function usePopularCars() {
  return useQuery({
    queryKey: ['popularCars'],
    queryFn: async () => {
      const { data } = await axios.get<Car[]>('/api/cars/popular');
      return data;
    },
  });
}

// Fetch a single car by ID
export function useCar(id: string) {
  return useQuery({
    queryKey: queryKeys.car(id),
    queryFn: async () => {
      const { data } = await axios.get<Car>(`/api/cars/${id}`);
      return data;
    },
    // Only fetch when id is provided
    enabled: !!id,
  });
}

// Create a new car
export function useCreateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCar: Omit<Car, 'id'>) => {
      const { data } = await axios.post<Car>('/api/cars', newCar);
      return data;
    },
    onSuccess: () => {
      // Invalidate the cars list query to refetch it
      queryClient.invalidateQueries({ queryKey: [queryKeys.cars] });
    },
  });
}

// Update an existing car
export function useUpdateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: { id: string } & Partial<Omit<Car, 'color' | 'brand' | 'model' | 'thumbnailImage' | 'variantImages'>>) => {
      const { data } = await axios.patch<Car>('/api/cars', {
        id,
        ...updateData,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the individual car
      queryClient.invalidateQueries({ queryKey: [queryKeys.cars] });
      queryClient.invalidateQueries({ queryKey: queryKeys.car(variables.id) });
    },
  });
}

// Delete a car
export function useDeleteCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete('/api/cars', {
        data: { id },
      });
      return id;
    },
    onSuccess: id => {
      // Invalidate the cars list query
      queryClient.invalidateQueries({ queryKey: [queryKeys.cars] });
      // Remove this specific car from the cache
      queryClient.removeQueries({ queryKey: queryKeys.car(id) });
    },
  });
}
