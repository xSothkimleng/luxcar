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

// The main hook for fetching paginated cars
export function usePaginatedCars(params: PaginatedCarsParams): UseQueryResult<PaginatedResponse<Car>, Error> {
  return useQuery({
    queryKey: paginatedCarsQueryKeys.paginated(params),
    queryFn: async () => {
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

      // Fetch the data
      const { data } = await axios.get<PaginatedResponse<Car>>(`/api/cars/paginated?${queryParams.toString()}`);

      return data;
    },
  });
}
