import { type InvalidateQueryFilters, MutationCache, QueryClient, type QueryKey } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import type { MutationKeys, QueryKeys } from '@/shared/backbone/tanstack-query/query-keys';
import { Ms } from '@/shared/lib/independent/ms';


declare module '@tanstack/react-query' {
  interface Register {
    queryKey: QueryKeys,
    mutationKey: MutationKeys,
    defaultError: HTTPError,
    // queryMeta: MyMeta;
    mutationMeta: {
      invalidateQuery?: QueryKey,
      invalidateQueries?: QueryKey[],
      invalidateFilters?: InvalidateQueryFilters,
      // successMessage?: string;
      // errorMessage?: string;
    },
  }
}


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // experimental_prefetchInRender: true,
      staleTime: 0,
      gcTime: Ms.day(1),
      retry: 0, // Retries handled by ky client
    },
    mutations: {
      gcTime: 0,
      retry: 0, // Mutations should not retry by default
    },
  },
  mutationCache: new MutationCache({
    onSettled: async (_data, _error, _variables, _context, mutation) => {
      if (mutation.meta?.invalidateQueries || mutation.meta?.invalidateQuery) {
        const queryKeys = [...(mutation.meta.invalidateQueries || [])];
        if (mutation.meta.invalidateQuery) queryKeys.push(mutation.meta.invalidateQuery);
        await Promise.all(queryKeys.map(
          queryKey => queryClient.invalidateQueries({ queryKey }),
        ).concat(
          mutation.meta.invalidateFilters ? queryClient.invalidateQueries(mutation.meta.invalidateFilters) : [],
        ));
      }
    },
  }),
});
