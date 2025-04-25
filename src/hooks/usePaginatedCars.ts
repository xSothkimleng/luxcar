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
  // Create a clean params object with default values
  const queryParams: PaginatedCarsParams = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    sort: params.sort ?? 'price',
    order: (params.order ?? 'asc') as 'asc' | 'desc',
    search: params.search,
    brandId: params.brandId,
    colorId: params.colorId,
    modelId: params.modelId,
    statusId: params.statusId,
  };

  return useQuery({
    queryKey: paginatedCarsQueryKeys.paginated(queryParams),
    queryFn: async () => {
      console.log('Fetching start...');

      const urlParams = new URLSearchParams();

      urlParams.append('page', queryParams.page.toString());
      urlParams.append('limit', queryParams.limit.toString());

      if (queryParams.sort) {
        urlParams.append('sort', queryParams.sort);
      }

      if (queryParams.order) {
        urlParams.append('order', queryParams.order);
      }

      if (queryParams.search) {
        urlParams.append('search', queryParams.search);
      }

      if (queryParams.brandId) {
        urlParams.append('brandId', queryParams.brandId);
      }

      if (queryParams.colorId) {
        urlParams.append('colorId', queryParams.colorId);
      }

      if (queryParams.modelId) {
        urlParams.append('modelId', queryParams.modelId);
      }

      if (queryParams.statusId) {
        urlParams.append('statusId', queryParams.statusId);
      }

      const { data } = await axios.get<PaginatedResponse<Car>>(`/api/cars/paginated?${urlParams.toString()}`);
      console.log('Fetched data:', data);
      return data;
    },

    staleTime: determineStaleTime(queryParams),
    placeholderData: previousData => previousData,
    refetchOnWindowFocus: !queryParams.search,
  });
}

function determineStaleTime(params: PaginatedCarsParams): number {
  if (params.search) {
    return 1000 * 60 * 1; // 1 minute for search results
  }

  if (
    (params.page === 1 || params.page === undefined) &&
    (params.sort === 'price' || params.sort === undefined) &&
    (params.order === 'asc' || params.order === undefined)
  ) {
    return 1000 * 60 * 5; // 5 minutes for default sorting (price ascending)
  }

  return 1000 * 60 * 3; // 3 minutes for other queries
}
