import { useMutation } from '@tanstack/react-query';
import { TagsApi } from '@/features/tags/tags.api';
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';


export function useTagDeleteMutation() {
  return useMutation({
    mutationKey: MUTATION_KEYS.TAG.DELETE(),
    mutationFn: TagsApi.delete,
    meta: {
      invalidateQueries: [
        QUERY_KEYS.TAG.LIST(),
        QUERY_KEYS.TEA.ROOT(),
      ],
    },
  });
}
