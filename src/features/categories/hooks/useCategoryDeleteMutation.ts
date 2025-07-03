import { useMutation } from '@tanstack/react-query';
import { CategoriesApi } from '@/features/categories/categories.api';
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';


export function useCategoryDeleteMutation() {
  return useMutation({
    mutationKey: MUTATION_KEYS.CATEGORY.DELETE(),
    mutationFn: CategoriesApi.delete,
    meta: {
      invalidateQuery: QUERY_KEYS.CATEGORY.LIST(),
    },
  });
}
