import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TeaApi } from '@/features/tea/tea.api';
import { TeaService } from '@/features/tea/tea.service';
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';


export function useTeaUpsertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.TEA.UPSERT(),
    mutationFn: TeaApi.upsert,
    onSuccess: async data => {
      TeaService.cacheUpdate(data);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEA.ROOT() });
    },
  });
}
