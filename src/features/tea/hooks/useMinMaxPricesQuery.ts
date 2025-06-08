import { queryOptions, useQuery } from '@tanstack/react-query';
import { TeaApi } from '@/features/tea/tea.api';
import { queryClient } from '@/shared/backbone/tanstack-query/query-client';
import { QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';
import { Ms } from '@/shared/lib/independent/ms';


minMaxPricesQuery.placeholderData = {
  minServePrice: 0,
  maxServePrice: 0,
} as const;

export function minMaxPricesQuery() {
  return queryOptions({
    queryKey: QUERY_KEYS.TEA.MIN_MAX_PRICES(),
    queryFn: TeaApi.minMaxPrices,
    staleTime: Ms.minute(10),
    placeholderData: minMaxPricesQuery.placeholderData,
  });
}

export function useMinMaxPricesQuery() {
  return useQuery(minMaxPricesQuery());
}

minMaxPricesQuery.invalidateROOT = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEA.ROOT() });
minMaxPricesQuery.prefetch = () => queryClient.prefetchQuery(minMaxPricesQuery());
minMaxPricesQuery.getData = function() {
  return queryClient.getQueryData(minMaxPricesQuery().queryKey);
};
