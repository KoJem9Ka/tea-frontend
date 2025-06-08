import type { MutationState } from '@tanstack/query-core';
import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import { TeaApi, type TeaSetFavouriteReqArgs } from '@/features/tea/tea.api';
import { TeaService } from '@/features/tea/tea.service';
import { useSignals } from '@/shared/backbone/signals';
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';


export function useSetFavouriteMutation() {
  useSignals();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.TEA.SET_FAVOURITE(),
    mutationFn: TeaApi.setFavourite,
    onSuccess: async (...{ 1: requestArgs }) => {
      TeaService.cacheUpdate(requestArgs);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEA.ROOT() });
    },
  });
}

export function useSetFavouriteMutationState() {
  return useMutationState<MutationState<unknown, unknown, TeaSetFavouriteReqArgs>>({
    filters: { mutationKey: MUTATION_KEYS.TEA.SET_FAVOURITE() },
  }).at(-1);
}
