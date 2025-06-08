import { useMutation } from '@tanstack/react-query';
import { CategoriesApi } from '@/features/categories/categories.api';
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';


export function useCategoryUpsertMutation() {
  return useMutation({
    mutationKey: MUTATION_KEYS.CATEGORY.UPSERT(),
    mutationFn: CategoriesApi.upsert,
    meta: {
      invalidateQueries: [
        QUERY_KEYS.CATEGORY.ROOT(),
      ],
    },
  });
}
