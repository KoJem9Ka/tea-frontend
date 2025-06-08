import { Link } from '@tanstack/react-router';
import { useInViewport } from 'ahooks';
import { type ReactNode, useRef } from 'react';
import { useTeaInfiniteQuery } from '@/features/tea/hooks/useTeaInfiniteQuery';
import { TeaFiltersStore } from '@/features/tea/tea-filters.store';
import { TeaCard } from '@/features/tea/ui/TeaCard';
import { useSignals } from '@/shared/backbone/signals';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';


export function TeaCards(props: { className?: string }) {
  useSignals();
  const teasInfiniteQuery = useTeaInfiniteQuery(TeaFiltersStore.filterDebounced);
  const loaderRef = useRef<HTMLDivElement>(null);
  useInViewport(loaderRef, {
    callback: entry => {
      const { hasNextPage, isFetching, fetchNextPage } = teasInfiniteQuery;
      if (entry.isIntersecting && hasNextPage && !isFetching) void (fetchNextPage());
    },
  });

  let mainSlot: ReactNode;
  if (teasInfiniteQuery.status === 'pending')
    mainSlot = <SkeletonView />;
  else if (teasInfiniteQuery.status === 'error')
    mainSlot = <ErrorView className='col-span-full' retry={teasInfiniteQuery.refetch as VoidFunction} />;
  else if (teasInfiniteQuery.data.length)
    mainSlot = teasInfiniteQuery.data.map(tea => (
      <Link key={tea.id} {...ROUTES.TEA_DETAILS(tea.id)}>
        <TeaCard tea={tea} className='size-full' />
      </Link>
    ));
  else mainSlot = <NotFoundView className='col-span-full' />;

  return (
    <div className='space-y-4' {...props}>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4'>
        {mainSlot}
      </div>

      {teasInfiniteQuery.hasNextPage && (
        <div className='flex pt-4' ref={loaderRef}>
          <Iconify icon={Icon.LoadingSpinner} className='mx-auto size-14' />
        </div>
      )}
    </div>
  );
}

function SkeletonView() {
  return (<>
    {Array.from({ length: 25 }).map((_, i) => (
      <Skeleton key={i}>
        <div className='min-h-[170px] w-full' />
      </Skeleton>
    ))}
  </>);
}

function ErrorView(props: { className?: string, retry?: VoidFunction }) {
  return (
    <Card className={cn('text-balance', props.className)}>
      <CardHeader>
        <CardTitle className='text-destructive'>
          Ошибка загрузки ассортимента
        </CardTitle>
        <CardDescription className='text-destructive'>
          Попробуйте обновить страницу или зайдите позже
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant='outline' className='' onClick={props.retry}>
          Повторить
        </Button>
      </CardFooter>
    </Card>
  );
}

function NotFoundView({ className }: { className?: string }) {
  return (
    <Card className={cn('text-center text-muted-foreground', className)}>
      Ничего не найдено
    </Card>
  );
}
