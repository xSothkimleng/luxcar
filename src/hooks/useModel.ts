'use client';
import axios from 'axios';
import { Model } from '@/types/model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadModelImage, deleteModelImage } from '@/services/modelService';

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

// Create a new model with image
export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ modelData, imageFile }: { modelData: Omit<Model, 'id'>; imageFile: File | null }) => {
      let imageUrl: string | undefined;

      // Upload image if provided
      if (imageFile) {
        const uploadResult = await uploadModelImage(imageFile);
        imageUrl = uploadResult.url;
      }

      // Create model with image URL if available
      const { data } = await axios.post<Model>('/api/models', {
        ...modelData,
        imageUrl,
      });

      return data;
    },
    onSuccess: () => {
      // Invalidate the models list query to refetch it
      queryClient.invalidateQueries({ queryKey: [modelQueryKeys.models] });
    },
    onError: (error, variables) => {
      console.error('Error creating model:', error);
      // If there was an error and we uploaded an image, we should clean it up
      if (variables.imageFile && variables.modelData.imageUrl) {
        deleteModelImage(variables.modelData.imageUrl).catch(err => {
          console.error('Error cleaning up image after failed model creation:', err);
        });
      }
    },
  });
}

// Update an existing model with image
export function useUpdateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      modelData,
      imageFile,
      deleteCurrentImage,
    }: {
      id: string;
      modelData: Partial<Model>;
      imageFile?: File | null;
      deleteCurrentImage?: boolean;
    }) => {
      let imageUrl: string | undefined = modelData.imageUrl;

      // Handle image update
      if (deleteCurrentImage && modelData.imageUrl) {
        // Delete the current image if requested
        await deleteModelImage(modelData.imageUrl);
        imageUrl = undefined;
      }

      // Upload new image if provided
      if (imageFile) {
        const uploadResult = await uploadModelImage(imageFile);
        imageUrl = uploadResult.url;
      }

      // Update model with new data
      const { data } = await axios.patch<Model>('/api/models', {
        id,
        ...modelData,
        imageUrl,
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
    mutationFn: async (model: Model) => {
      // Delete the model's image if it exists
      if (model.imageUrl) {
        await deleteModelImage(model.imageUrl);
      }

      // Delete the model from the database
      await axios.delete('/api/models', {
        data: { id: model.id },
      });

      return model.id;
    },
    onSuccess: id => {
      // Invalidate the models list query
      queryClient.invalidateQueries({ queryKey: [modelQueryKeys.models] });
      // Remove this specific model from the cache
      queryClient.removeQueries({ queryKey: modelQueryKeys.model(id) });
    },
  });
}
