import { createFileRoute } from '@tanstack/react-router';
import { categoriesQueryOptions } from '@/features/categories';
import { tagsQueryOptions } from '@/features/tags';
import {
  TeaCards,
  TeaFiltersPanel,
  TeaFiltersSheet,
  TeaFiltersStore,
  teaInfiniteQueryOptions,
  TeaSearchByName
} from '@/features/tea'
import { Container } from '@/shared/components/Container';
import { usePageHeightScreen } from '@/shared/hooks/usePageHeightScreen';
import { staleTimeMin } from '@/shared/lib/staleTimeMin.ts';


export const Route = createFileRoute('/')({
  component: HomePageComponent,
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(categoriesQueryOptions()),
      queryClient.ensureQueryData(tagsQueryOptions()),
      queryClient.ensureInfiniteQueryData(teaInfiniteQueryOptions(TeaFiltersStore.filterDebounced)),
    ]);
  },
  staleTime: staleTimeMin(categoriesQueryOptions().staleTime, tagsQueryOptions().staleTime, teaInfiniteQueryOptions().staleTime),
});

function HomePageComponent() {
  usePageHeightScreen();

  // Cards container must have fixed-height for scroll restoration to work
  // screenHeight - headerHeight - searchHeight - 3*gaps
  const cardsContainerHeight = 'h-[calc(100vh-56px-36px-var(--spacing)*4*3)]';

  return (
    <Container className='grid gap-4 grid-cols-[1fr_auto] md:grid-cols-[auto_1fr] grid-rows-[auto_1fr]'>
      <TeaFiltersPanel className='row-span-full place-self-start max-md:hidden' />

      <TeaSearchByName />

      <TeaFiltersSheet className='md:hidden' />

      <TeaCards
        data-scroll-restoration-id='scroll-container'
        className={`col-span-full md:col-start-2 min-h-0 overflow-y-auto max-md:px-4 max-md:-mx-4 ${cardsContainerHeight}`}
      />
    </Container>
  );
}
