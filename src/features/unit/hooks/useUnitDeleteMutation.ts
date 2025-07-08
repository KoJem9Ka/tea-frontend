import { useMutation } from '@tanstack/react-query';
import { UnitApi } from '@/features/unit/unit.api.ts';
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';


export function useUnitDeleteMutation() {
  return useMutation({
    mutationKey: MUTATION_KEYS.TEA_UNIT.DELETE(),
    mutationFn: UnitApi.delete,
    meta: {
      invalidateQuery: QUERY_KEYS.TEA_UNIT.ROOT(),
    },
  });
}
