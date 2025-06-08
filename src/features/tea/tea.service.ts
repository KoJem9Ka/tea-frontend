import { type InfiniteData } from '@tanstack/react-query';
import type { SetRequired } from 'type-fest';
import type { TeaOneResBody, TeasListResBody } from '@/features/tea/tea.api';
import type { TeaWithRating } from '@/shared/backbone/backend/model/tea';
import { queryClient } from '@/shared/backbone/tanstack-query/query-client';
import { QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';


type TeaService = {
  cacheUpdate: (tea: SetRequired<Partial<TeaWithRating>, 'id'>) => void,
}

export const TeaService: TeaService = {
  cacheUpdate(tea) {
    queryClient.setQueriesData<InfiniteData<TeasListResBody>>({ queryKey: QUERY_KEYS.TEA.LIST() }, (input) => (
      input ? {
        ...input,
        pages: input.pages.map(page => ({
          ...page,
          items: page.items.map(teaElement => (
            teaElement.id === tea.id
              ? { ...teaElement, ...tea }
              : teaElement
          )),
        })),
      } : input
    ));

    queryClient.setQueryData<TeaOneResBody>(QUERY_KEYS.TEA.ONE({ id: tea.id }), (input) => (
      input ? { ...input, ...tea } : input
    ));
  },
};
