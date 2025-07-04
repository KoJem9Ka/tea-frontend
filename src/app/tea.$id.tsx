import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { AuthStore, TelegramLoginCustomButton } from '@/features/auth';
import { categoriesQueryOptions, useCategoryQuery } from '@/features/categories';
import { useBackHeaderButton } from '@/features/header';
import { ModalTeaDelete, TeaEvaluationForm, teaQueryOptions, useTeaQuery } from '@/features/tea';
import { useSignals } from '@/shared/backbone/signals';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES';
import { Container } from '@/shared/components/Container';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { ErrorRouteComponent } from '@/shared/components/routes/ErrorRouteComponent';
import { TeaTag } from '@/shared/components/TeaTag';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton';
import { formatterCurrencyRU } from '@/shared/lib/independent/formatter-currency-ru';
import { isNotFound } from '@/shared/lib/independent/http';
import { throwErr } from '@/shared/lib/independent/throw';
import type { MaybePromise } from '@/shared/types/types.ts';


export const Route = createFileRoute('/tea/$id')({
  component: TeaPageComponent,
  loader: async ({ context: { queryClient }, params }) => {
    await Promise.all([
      queryClient.ensureQueryData(categoriesQueryOptions()),
      // FIXME: backend overload, because of "Preload: 'viewport'" on router config
      queryClient.ensureQueryData(teaQueryOptions(params)),
    ]).catch((error: unknown) => throwErr(isNotFound(error) ? notFound() : error));
  },
  pendingComponent: TeaPageSkeleton,
});

function TeaPageComponent() {
  useSignals();
  const { goBack } = useBackHeaderButton({ route: ROUTES.HOME });
  const params = Route.useParams();
  const teaQuery = useTeaQuery(params);
  const categoryQuery = useCategoryQuery(
    { id: teaQuery.data?.categoryId as string },
    { enabled: !!teaQuery.data?.categoryId },
  );

  if (teaQuery.isPending || categoryQuery.isPending) return <TeaPageSkeleton />;

  const error = teaQuery.error || categoryQuery.error;
  if (error) {
    const refetch = () => Promise.all([
      categoryQuery.isError ? categoryQuery.refetch() : undefined,
      teaQuery.isError ? teaQuery.refetch() : undefined,
    ]);
    return <ErrorRouteComponent error={error} reset={refetch as VoidFunction} />;
  }

  return <TeaPage tea={teaQuery.data} category={categoryQuery.data} goBack={goBack} />;
}

type TeaPageProps = {
  tea: NonNullable<ReturnType<typeof useTeaQuery>['data']>,
  category: NonNullable<ReturnType<typeof useCategoryQuery>['data']>,
  goBack: () => MaybePromise,
}

function TeaPage({ tea, category, goBack }: TeaPageProps) {
  useSignals();

  return (
    <Container isSmall>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>{tea.name}</CardTitle>
          <p className='text-lg text-muted-foreground'>{category.name}</p>
        </CardHeader>
        <CardContent className='space-y-2'>
          {tea.description && (
            <p>{tea.description}</p>
          )}

          {tea.tags && tea.tags.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {tea.tags.map(tag => <TeaTag key={tag.id} {...tag} />)}
            </div>
          )}
        </CardContent>

        <CardFooter className='flex-col items-start'>
          <div>
            <strong className='text-xl'>{formatterCurrencyRU.format(tea.servePrice)}</strong>
            <span className='text-muted-foreground'>{' / порция'}</span>
          </div>

          <div>
            <strong className='text-xl'>{formatterCurrencyRU.format(tea.weightPrice)}</strong>
            <span className='text-muted-foreground'>{' / 100 г.'}</span>
          </div>
        </CardFooter>
      </Card>

      {AuthStore.isAuthorized ? (
        <TeaEvaluationForm tea={tea} />
      ) : (
        <Card>
          <CardContent className='text-center text-muted-foreground space-y-3 text-balance'>
            <p>Войдите, чтобы оставить заметку</p>
            <TelegramLoginCustomButton />
          </CardContent>
        </Card>
      )}

      {AuthStore.isAdmin ? (<>
        {tea.isHidden ? <Button variant='destructive' disabled>Скрыт из ассортимента</Button> : null}

        <div className='grid grid-cols-2 gap-3'>
          <ModalTeaDelete onSuccess={goBack} id={tea.id} name={tea.name}>
            <Button variant='outline'><Iconify icon={Icon.DeleteTrashCan} />Удалить</Button>
          </ModalTeaDelete>

          <Button asChild variant='outline'>
            <Link {...ROUTES.ADMIN_TEA_EDIT(tea.id)}>
              <Iconify icon={Icon.EditPen} />
              Редактировать
            </Link>
          </Button>
        </div>
      </>) : null}
    </Container>
  );
}


function TeaPageSkeleton() {
  return (
    <Container isSmall>
      <Card className='w-lg max-w-full'>
        <CardHeader>
          <Skeleton className='w-1/2 h-5' />
          <Skeleton className='w-1/3 h-4' />
        </CardHeader>
        <CardContent className='space-y-2'>
          <Skeleton className='w-3/4 h-4' />
          <Skeleton className='w-2/3 h-4' />
          <Skeleton className='w-1/2 h-4' />
        </CardContent>
      </Card>
      <Card className='w-lg max-w-full'>
        <CardContent className='space-y-2'>
          <Skeleton className='w-3/4 h-4' />
          <Skeleton className='w-2/3 h-4' />
          <Skeleton className='w-1/2 h-4' />
        </CardContent>
      </Card>
    </Container>
  );
}
