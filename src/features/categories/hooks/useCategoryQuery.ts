import { queryOptions, useQuery } from '@tanstack/react-query';
import { CategoriesApi, type CategoryOneReqParams } from '@/features/categories/categories.api';
import { categoriesListQueryOptions } from '@/features/categories/hooks/useCategoriesQuery';
import { queryClient } from '@/shared/backbone/tanstack-query/query-client';
import { QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';
import { Ms } from '@/shared/lib/independent/ms';
import type { AdditionalQueryOptions } from '@/shared/types/types';


const DEFAULT_OPTIONS = queryOptions({
  queryKey: QUERY_KEYS.CATEGORY.ONE({ id: '' }),
  queryFn: ({ queryKey: { 2: params } }) => CategoriesApi.one(params),
  staleTime: Ms.minute(10),
  initialDataUpdatedAt: () => categoriesListQueryOptions.getState()
    ?.dataUpdatedAt,
});

export function categoryQueryOptions(params: CategoryOneReqParams) {
  return queryOptions({
    ...DEFAULT_OPTIONS,
    queryKey: QUERY_KEYS.CATEGORY.ONE(params),
    initialData: () => categoriesListQueryOptions.getData()
      ?.find(c => c.id === params.id),
  });
}

export function useCategoryQuery(
  params: CategoryOneReqParams,
  options?: AdditionalQueryOptions<typeof DEFAULT_OPTIONS>,
) {
  return useQuery({ ...categoryQueryOptions(params), ...options });
}

categoryQueryOptions.invalidateROOT = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORY.ROOT() });
categoryQueryOptions.prefetch = (params: CategoryOneReqParams) => queryClient.prefetchQuery(categoryQueryOptions(params));

// interface MakeHands<T extends VoidFunction, QueryFn extends VoidFunction, R = Awaited<ReturnType<QueryFn>>> {
//   (fn: T): T;
//   invalidateROOT: () => Promise<void>;
//   prefetch: () => Promise<void>;
//   getData: () => R | undefined;
// }
//
// function makeHands<
//   T extends VoidFunction,
//   QueryFn extends VoidFunction,
//   R = Awaited<ReturnType<QueryFn>>
// >(optionsFn: T, rootKey: QueryKey): MakeHands<T, QueryFn, R> {
//   const options = optionsFn as MakeHands<T, QueryFn, R>;
//   options.invalidateROOT = () => queryClient.invalidateQueries({ queryKey: rootKey });
//   options.prefetch = () => queryClient.prefetchQuery(options);
//   options.getData = () => queryClient.getQueryData(options.queryKey) as R | undefined;
//   return options;
// }
