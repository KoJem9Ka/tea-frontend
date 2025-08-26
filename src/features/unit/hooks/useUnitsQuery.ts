import { queryOptions, useQuery } from '@tanstack/react-query';
import { UnitApi } from '@/features/unit/unit.api.ts';
import { QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';
import { Ms } from '@/shared/lib/independent/ms';
import type { AdditionalQueryOptions } from '@/shared/types/types.ts';


const DEFAULT_OPTIONS = queryOptions({
  queryKey: QUERY_KEYS.TEA_UNIT.LIST(),
  queryFn: UnitApi.list,
  staleTime: Ms.minute(3),
});

export function unitsQueryOptions() {
  return queryOptions(DEFAULT_OPTIONS);
}

export function useUnitsQuery() {
  return useQuery(unitsQueryOptions());
}

export function useUnitSharedQuery(args: { id: string }, options?: AdditionalQueryOptions<typeof DEFAULT_OPTIONS>) {
  return useQuery({
    ...unitsQueryOptions(),
    ...options,
    select: data => data.find(unit => unit.id === args.id)!,
  });
}
