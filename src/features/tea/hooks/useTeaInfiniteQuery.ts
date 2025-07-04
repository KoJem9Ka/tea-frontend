import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { TeaApi, type TeasListReqQueryFilters, type TeasListReqQueryPagination } from '@/features/tea/tea.api';
import { useSignals } from '@/shared/backbone/signals';
import { queryClient } from '@/shared/backbone/tanstack-query/query-client';
import { QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';
import { Ms } from '@/shared/lib/independent/ms';


const DEFAULT_OPTIONS = infiniteQueryOptions({
  queryKey: QUERY_KEYS.TEA.LIST(),
  queryFn: ({ pageParam: pagination, queryKey: { 3: args }, signal }) => TeaApi.list({ ...args, ...pagination }, signal),
  initialPageParam: { page: 1, limit: 25 } satisfies TeasListReqQueryPagination,
  getNextPageParam: (lastPage, _, lastPageParam) => {
    const isEnded = lastPageParam.page * lastPageParam.limit >= lastPage.total;
    return isEnded ? null : { page: lastPageParam.page + 1, limit: lastPageParam.limit };
  },
  select: data => data.pages.flatMap(page => page.items),
  staleTime: Ms.minute(10),
});

export function teaInfiniteQueryOptions(query: TeasListReqQueryFilters = {}) {
  return infiniteQueryOptions({
    ...DEFAULT_OPTIONS,
    queryKey: QUERY_KEYS.TEA.LIST(query),
  });
}

export function useTeaInfiniteQuery(query: TeasListReqQueryFilters = {}) {
  useSignals();
  return useInfiniteQuery(teaInfiniteQueryOptions(query));
}

teaInfiniteQueryOptions.invalidateROOT = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEA.ROOT() });
teaInfiniteQueryOptions.getData = function(...args: Parameters<typeof teaInfiniteQueryOptions>) {
  return queryClient.getQueryData(teaInfiniteQueryOptions(...args).queryKey);
};
teaInfiniteQueryOptions.getState = function(...args: Parameters<typeof teaInfiniteQueryOptions>) {
  return queryClient.getQueryState(teaInfiniteQueryOptions(...args).queryKey);
};
