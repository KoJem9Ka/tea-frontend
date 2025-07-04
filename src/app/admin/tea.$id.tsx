import { createFileRoute, notFound } from '@tanstack/react-router';
import { categoriesQueryOptions } from '@/features/categories';
import { useBackHeaderButton } from '@/features/header';
import { tagsQueryOptions } from '@/features/tags';
import { teaQueryOptions, TeaUpsertForm, useTeaQuery } from '@/features/tea';
import { teaToInput } from '@/shared/backbone/backend/model/tea';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES';
import { Container } from '@/shared/components/Container';
import { ErrorRouteComponent } from '@/shared/components/routes/ErrorRouteComponent';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { isNotFound } from '@/shared/lib/independent/http';
import { throwErr } from '@/shared/lib/independent/throw';


export const Route = createFileRoute('/admin/tea/$id')({
  component: TeaUpdatePageComponent,
  loader: async ({ context: { queryClient }, params }) => Promise.all([
    queryClient.ensureQueryData(teaQueryOptions(params)),
    queryClient.ensureQueryData(categoriesQueryOptions()),
    queryClient.ensureQueryData(tagsQueryOptions()),
  ]).catch((error: unknown) => throwErr(isNotFound(error) ? notFound() : error)),
  pendingComponent: TeaUpdatePageSkeleton,
});

function TeaUpdatePageComponent() {
  const params = Route.useParams();
  const teaQuery = useTeaQuery(params);
  const { goBack } = useBackHeaderButton({ fallback: ROUTES.ADMIN_TEAS });

  if (teaQuery.isPending) return <TeaUpdatePageSkeleton />;
  if (teaQuery.isError) return <ErrorRouteComponent error={teaQuery.error} reset={teaQuery.refetch as VoidFunction} />;

  return (
    <Container isSmall>
      <TeaUpsertForm defaultValues={teaToInput(teaQuery.data)} onSuccess={goBack} />
    </Container>
  );
}

function TeaUpdatePageSkeleton() {
  return (
    <Container isSmall>
      <div className='space-y-2'>
        <Skeleton className='w-1/2 h-5' />
        <Skeleton className='w-1/3 h-4' />
        <Skeleton className='w-3/4 h-4' />
        <Skeleton className='w-2/3 h-4' />
        <Skeleton className='w-1/2 h-4' />
      </div>
    </Container>
  );
}
