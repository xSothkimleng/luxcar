// hooks/useBanner.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getBannerSlides,
  getBannerSlide,
  createBannerSlide,
  updateBannerSlide,
  deleteBannerSlide,
  deleteBannerImage,
} from '@/services/bannerService';
import { BannerSlide, CreateBannerSlideData, UpdateBannerSlideData } from '@/types/banner';

// Define query keys
const queryKeys = {
  bannerSlides: 'bannerSlides',
  bannerSlide: (id: string) => ['bannerSlide', id],
};

// Get all banner slides
export function useBannerSlides() {
  return useQuery<BannerSlide[], Error>({
    queryKey: [queryKeys.bannerSlides],
    queryFn: getBannerSlides,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

// Get a specific banner slide
export function useBannerSlide(id: string) {
  return useQuery<BannerSlide, Error>({
    queryKey: queryKeys.bannerSlide(id),
    queryFn: () => getBannerSlide(id),
    enabled: !!id,
  });
}

// Create a new banner slide
export function useCreateBannerSlide() {
  const queryClient = useQueryClient();

  return useMutation<BannerSlide, Error, CreateBannerSlideData>({
    mutationFn: createBannerSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.bannerSlides] });
    },
  });
}

// Update an existing banner slide
export function useUpdateBannerSlide() {
  const queryClient = useQueryClient();

  type UpdateParams = UpdateBannerSlideData & { id: string };

  return useMutation<BannerSlide, Error, UpdateParams>({
    mutationFn: ({ id, ...data }: UpdateParams) => updateBannerSlide(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.bannerSlides] });
      queryClient.invalidateQueries({ queryKey: queryKeys.bannerSlide(variables.id) });
    },
  });
}

// Delete a banner slide
export function useDeleteBannerSlide() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: deleteBannerSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.bannerSlides] });
    },
  });
}

// Delete a banner image
export function useDeleteBannerImage() {
  const queryClient = useQueryClient();

  interface DeleteBannerImageParams {
    id: string;
    url: string;
  }

  return useMutation<void, Error, DeleteBannerImageParams>({
    mutationFn: ({ id, url }: DeleteBannerImageParams) => deleteBannerImage(id, url),
    onSuccess: () => {
      // When deleting an image, we invalidate the slides query since it contains image data
      queryClient.invalidateQueries({ queryKey: [queryKeys.bannerSlides] });
    },
  });
}
