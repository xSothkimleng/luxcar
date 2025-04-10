import axios from 'axios';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Car } from '@/types/car';

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  brandId?: string;
  colorId?: string;
  modelId?: string;
  statusId?: string;
}

export type PaginatedCarsParams = PaginationParams & FilterParams;

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

export const paginatedCarsQueryKeys = {
  all: ['paginatedCars'] as const,
  paginated: (params: PaginatedCarsParams) => [...paginatedCarsQueryKeys.all, params] as const,
};

export function usePaginatedCars(params: PaginatedCarsParams): UseQueryResult<PaginatedResponse<Car>, Error> {
  return useQuery({
    queryKey: paginatedCarsQueryKeys.paginated(params),
    queryFn: async () => {
      console.log('Fetching start...');

      const queryParams = new URLSearchParams();

      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());

      if (params.sort) {
        queryParams.append('sort', params.sort);
      }

      if (params.order) {
        queryParams.append('order', params.order);
      }

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

      const { data } = await axios.get<PaginatedResponse<Car>>(`/api/cars/paginated?${queryParams.toString()}`);
      console.log('Fetched data:', data);
      return data;
    },

    staleTime: determineStaleTime(params),
    placeholderData: previousData => previousData,
    refetchOnWindowFocus: !params.search,
  });
}

function determineStaleTime(params: PaginatedCarsParams): number {
  if (params.search) {
    return 1000 * 60 * 1;
  }

  if (params.page === 1 && params.sort === 'createdAt' && params.order === 'desc') {
    return 1000 * 60 * 5;
  }

  return 1000 * 60 * 3;
}
