import { useMutation } from '@tanstack/react-query';
import { TeaApi } from '@/features/tea/tea.api';
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';


export function useTeaDeleteMutation() {
  return useMutation({
    mutationKey: MUTATION_KEYS.TEA.DELETE(),
    mutationFn: TeaApi.delete,
    meta: {
      invalidateQueries: [
        QUERY_KEYS.TEA.ROOT(),
      ],
    },
  });
}
