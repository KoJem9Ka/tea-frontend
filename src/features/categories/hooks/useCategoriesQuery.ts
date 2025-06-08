import { queryOptions, useQuery } from '@tanstack/react-query';
import { CategoriesApi } from '@/features/categories/categories.api';
import { queryClient } from '@/shared/backbone/tanstack-query/query-client';
import { QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';
import { Ms } from '@/shared/lib/independent/ms';


const PLACEHOLDER_DATA = [] as never[];

export function categoriesListQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.CATEGORY.LIST(),
    queryFn: CategoriesApi.list,
    staleTime: Ms.minute(10),
    placeholderData: PLACEHOLDER_DATA,
  });
}

export function useCategoriesQuery() {
  return useQuery(categoriesListQueryOptions());
}

export function useCategorySharedQuery(id: string) {
  return useQuery({ ...categoriesListQueryOptions(), enabled: !!id });
}

categoriesListQueryOptions.invalidateROOT = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORY.ROOT() });
categoriesListQueryOptions.prefetch = () => queryClient.prefetchQuery(categoriesListQueryOptions());
categoriesListQueryOptions.getData = function() {
  return queryClient.getQueryData(categoriesListQueryOptions().queryKey);
};
categoriesListQueryOptions.getState = function() {
  return queryClient.getQueryState(categoriesListQueryOptions().queryKey);
};
