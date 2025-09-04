import { queryOptions, useQuery } from '@tanstack/react-query';
import { teaInfiniteQueryOptions } from '@/features/tea/hooks/useTeaInfiniteQuery';
import { TeaFiltersStore } from '@/features/tea/tea-filters.store';
import { TeaApi, type TeaOneReqParams } from '@/features/tea/tea.api';
import { useSignals } from '@/shared/backbone/signals';
import { queryClient } from '@/shared/backbone/tanstack-query/query-client';
import { QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';
import { Ms } from '@/shared/lib/independent/ms';


const DEFAULT_OPTIONS = queryOptions({
  queryKey: QUERY_KEYS.TEA.ONE({ id: '' }),
  queryFn: ({ queryKey: { 3: args } }) => TeaApi.one(args),
  staleTime: Ms.minute(3),
});

export function teaQueryOptions(args: TeaOneReqParams) {
  return queryOptions({
    ...DEFAULT_OPTIONS,
    queryKey: QUERY_KEYS.TEA.ONE(args),
    initialData: () => teaInfiniteQueryOptions.getData(TeaFiltersStore.filterDebounced)
      ?.pages.flatMap(page => page.items)
      .find(tea => tea.id === args.id),
    initialDataUpdatedAt: () => teaInfiniteQueryOptions.getState(TeaFiltersStore.filterDebounced)
      ?.dataUpdatedAt,
  });
}

export function useTeaQuery(args: TeaOneReqParams) {
  useSignals();
  return useQuery(teaQueryOptions(args));
}

teaQueryOptions.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
teaQueryOptions.invalidateROOT = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEA.ROOT() });
teaQueryOptions.prefetch = (...args: Parameters<typeof teaQueryOptions>) => queryClient.prefetchQuery(teaQueryOptions(...args));
