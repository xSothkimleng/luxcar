'use client';
import axios from 'axios';
import { Model } from '@/types/model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query keys for better cache management
export const modelQueryKeys = {
  models: 'models',
  model: (id: string) => ['model', id],
};

// Fetch all models
export function useModels() {
  return useQuery({
    queryKey: [modelQueryKeys.models],
    queryFn: async () => {
      const { data } = await axios.get<Model[]>('/api/models');
      return data;
    },
  });
}

// Create a new model
export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newModel: Omit<Model, 'id'>) => {
      const { data } = await axios.post<Model>('/api/models', newModel);
      return data;
    },
    onSuccess: () => {
      // Invalidate the models list query to refetch it
      queryClient.invalidateQueries({ queryKey: [modelQueryKeys.models] });
    },
  });
}

// Update an existing model
export function useUpdateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<Model>) => {
      const { data } = await axios.patch<Model>('/api/models', {
        id,
        ...updateData,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the individual model
      queryClient.invalidateQueries({ queryKey: [modelQueryKeys.models] });
      queryClient.invalidateQueries({ queryKey: modelQueryKeys.model(variables.id) });
    },
  });
}

// Delete a model
export function useDeleteModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete('/api/models', {
        data: { id },
      });
      return id;
    },
    onSuccess: id => {
      // Invalidate the models list query
      queryClient.invalidateQueries({ queryKey: [modelQueryKeys.models] });
      // Remove this specific model from the cache
      queryClient.removeQueries({ queryKey: modelQueryKeys.model(id) });
    },
  });
}
