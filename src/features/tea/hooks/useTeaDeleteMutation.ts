import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';
import { TeaApi } from '@/features/tea/tea.api';
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';


export function useTeaDeleteMutation({ isAutoInvalidate = true }: { isAutoInvalidate?: boolean } = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: MUTATION_KEYS.TEA.DELETE(),
    mutationFn: TeaApi.delete,
    meta: isAutoInvalidate ? {
      invalidateQuery: QUERY_KEYS.TEA.ROOT(),
    } : undefined,
  });

  const invalidate = useCallback(async (teaId: string) => void (await Promise.all([
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEA.ROOT() }),
    teaId && await router.invalidate({ filter: (r) => r.id.includes(teaId) }),
  ])), [queryClient, router]);

  return [mutation, invalidate] as const;
}
