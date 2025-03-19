'use client';
import axios from 'axios';
import { Status } from '@/types/status';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query keys for better cache management
export const statusQueryKeys = {
  statuses: 'statuses',
  status: (id: string) => ['status', id],
};

// Fetch all statuses
export function useStatuses() {
  return useQuery({
    queryKey: [statusQueryKeys.statuses],
    queryFn: async () => {
      const { data } = await axios.get<Status[]>('/api/status');
      return data;
    },
  });
}

// Create a new status
export function useCreateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newStatus: Omit<Status, 'id'>) => {
      const { data } = await axios.post<Status>('/api/status', newStatus);
      return data;
    },
    onSuccess: () => {
      // Invalidate the statuses list query to refetch it
      queryClient.invalidateQueries({ queryKey: [statusQueryKeys.statuses] });
    },
  });
}

// Update an existing status
export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<Status>) => {
      const { data } = await axios.patch<Status>('/api/status', {
        id,
        ...updateData,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the individual status
      queryClient.invalidateQueries({ queryKey: [statusQueryKeys.statuses] });
      queryClient.invalidateQueries({ queryKey: statusQueryKeys.status(variables.id) });
    },
  });
}

// Delete a status
export function useDeleteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete('/api/status', {
        data: { id },
      });
      return id;
    },
    onSuccess: id => {
      // Invalidate the statuses list query
      queryClient.invalidateQueries({ queryKey: [statusQueryKeys.statuses] });
      // Remove this specific status from the cache
      queryClient.removeQueries({ queryKey: statusQueryKeys.status(id) });
    },
  });
}
