// src/hooks/usePaginatedCars.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';
import { Car } from '@/types/car';

// Define the pagination parameters interface
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Define the filter parameters interface
export interface FilterParams {
  search?: string;
  brandId?: string;
  colorId?: string;
  modelId?: string;
  statusId?: string;
}

// Combined parameters type
export type PaginatedCarsParams = PaginationParams & FilterParams;

// Define the paginated response type
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    filteredCount: number;
  };
}

// Define the cars query key for better cache management
export const paginatedCarsQueryKeys = {
  all: ['paginatedCars'] as const,
  paginated: (params: PaginatedCarsParams) => [...paginatedCarsQueryKeys.all, params] as const,
};

// The main hook for fetching paginated cars with enhanced caching
export function usePaginatedCars(params: PaginatedCarsParams): UseQueryResult<PaginatedResponse<Car>, Error> {
  return useQuery({
    queryKey: paginatedCarsQueryKeys.paginated(params),
    queryFn: async () => {
      console.log('Fetching start...');
      // Build the query string
      const queryParams = new URLSearchParams();

      // Add pagination params
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());

      if (params.sort) {
        queryParams.append('sort', params.sort);
      }

      if (params.order) {
        queryParams.append('order', params.order);
      }

      // Add filter params
      if (params.search) {
        queryParams.append('search', params.search);
      }

      if (params.brandId) {
        queryParams.append('brandId', params.brandId);
      }

      if (params.colorId) {
        queryParams.append('colorId', params.colorId);
      }

      if (params.modelId) {
        queryParams.append('modelId', params.modelId);
      }

      if (params.statusId) {
        queryParams.append('statusId', params.statusId);
      }

      // Fetch the data with caching headers respected
      const { data } = await axios.get<PaginatedResponse<Car>>(`/api/cars/paginated?${queryParams.toString()}`);
      console.log('Fetched data:', data);
      return data;
    },
    // Add caching strategies to React Query
    staleTime: determineStaleTime(params), // Time until query is considered stale
    placeholderData: previousData => previousData, // Show previous data while fetching new page
    refetchOnWindowFocus: !params.search, // Don't refetch searches on window focus
  });
}

// Helper function to determine appropriate stale time based on parameters
function determineStaleTime(params: PaginatedCarsParams): number {
  // Search queries should be fresher
  if (params.search) {
    return 1000 * 60 * 1; // 1 minute
  }

  // First page with default sorting is cached longer
  if (params.page === 1 && params.sort === 'createdAt' && params.order === 'desc') {
    return 1000 * 60 * 5; // 5 minutes
  }

  // Default stale time
  return 1000 * 60 * 3; // 3 minutes
}
