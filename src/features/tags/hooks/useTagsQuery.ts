import { queryOptions, useQuery } from '@tanstack/react-query';
import { TagsApi } from '@/features/tags/tags.api';
import { QUERY_KEYS } from '@/shared/backbone/tanstack-query/query-keys';
import { Ms } from '@/shared/lib/independent/ms';


tagsQueryOptions.placeholderData = [] as never[];

export function tagsQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.TAG.LIST(),
    queryFn: TagsApi.list,
    staleTime: Ms.minute(3),
    placeholderData: tagsQueryOptions.placeholderData,
  });
}

export function useTagsQuery() {
  return useQuery(tagsQueryOptions());
}
