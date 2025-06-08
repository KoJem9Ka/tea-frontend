import { useMutation } from '@tanstack/react-query';
import { TagsApi } from '@/features/tags/tags.api';
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';


export function useTagUpsertMutation() {
  return useMutation({
    mutationKey: MUTATION_KEYS.TAG.UPSERT(),
    mutationFn: TagsApi.upsert,
    meta: {
      // TODO: tags in teas must be updated too, but it can break inputs if tea upsert interface opened
      invalidateQueries: [
        QUERY_KEYS.TAG.LIST(),
        QUERY_KEYS.TEA.ROOT(),
      ],
    },
  });
}
