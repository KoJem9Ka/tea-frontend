import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TeaApi, type TeaEvaluationDeleteReqArgs } from '@/features/tea/tea.api.ts';
import { TeaService } from '@/features/tea/tea.service.ts';
import { useSignals } from '@/shared/backbone/signals.ts';
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys.ts';


export function useTeaEvaluationDeleteMutation() {
  useSignals();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.TEA.EVALUATION_DELETE(),
    mutationFn: async (args: TeaEvaluationDeleteReqArgs) => {
      await TeaApi.evaluationDelete(args);
      return args;
    },
    onSuccess: async (args) => {
      TeaService.cacheUpdate({ ...args, rating: undefined, note: undefined });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEA.ROOT() });
    },
  });
}
