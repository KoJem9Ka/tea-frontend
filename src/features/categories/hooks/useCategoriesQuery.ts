import { queryOptions, useQuery } from '@tanstack/react-query';
import { CategoriesApi } from '@/features/categories/categories.api';
import { queryClient } from '@/shared/backbone/tanstack-query/query-client';
import { QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';
import { Ms } from '@/shared/lib/independent/ms';
import type { AdditionalQueryOptions } from '@/shared/types/types.ts';


const PLACEHOLDER_DATA = [] as never[];

export function categoriesQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.CATEGORY.LIST(),
    queryFn: CategoriesApi.list,
    staleTime: Ms.minute(10),
    placeholderData: PLACEHOLDER_DATA,
  });
}

export function useCategoriesQuery(options?: AdditionalQueryOptions<ReturnType<typeof categoriesQueryOptions>>) {
  return useQuery({ ...categoriesQueryOptions(), ...options });
}

categoriesQueryOptions.invalidateROOT = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORY.ROOT() });
categoriesQueryOptions.prefetch = () => queryClient.prefetchQuery(categoriesQueryOptions());
categoriesQueryOptions.getData = function() {
  return queryClient.getQueryData(categoriesQueryOptions().queryKey);
};
categoriesQueryOptions.getState = function() {
  return queryClient.getQueryState(categoriesQueryOptions().queryKey);
};
