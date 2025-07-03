import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { TeaApi } from '@/features/tea/tea.api';
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';


export function useTeaDeleteMutation({ isAutoInvalidate = true }: { isAutoInvalidate?: boolean } = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: MUTATION_KEYS.TEA.DELETE(),
    mutationFn: TeaApi.delete,
    meta: isAutoInvalidate ? {
      invalidateQuery: QUERY_KEYS.TEA.ROOT(),
    } : undefined,
  });

  const invalidate = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEA.ROOT() });
  }, [queryClient]);

  return [mutation, invalidate] as const;
}
