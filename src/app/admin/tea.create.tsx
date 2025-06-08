import { createFileRoute, useRouter } from '@tanstack/react-router';
import { categoriesListQueryOptions } from '@/features/categories';
import { useBackHeaderButton } from '@/features/header';
import { tagsQueryOptions } from '@/features/tags';
import { TeaUpsertForm } from '@/features/tea';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES.ts';
import { Container } from '@/shared/components/Container';


export const Route = createFileRoute('/admin/tea/create')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => Promise.all([
    queryClient.ensureQueryData(categoriesListQueryOptions()),
    queryClient.ensureQueryData(tagsQueryOptions()),
  ]),
});

function RouteComponent() {
  const router = useRouter();
  useBackHeaderButton({ fallback: ROUTES.ADMIN_TEAS });

  const openCreatedTea = (teaId: string) => router.navigate(ROUTES.TEA_DETAILS(teaId));

  return (
    <Container className='sm:w-auto sm:min-w-md'>
      <TeaUpsertForm onSuccess={openCreatedTea} />
    </Container>
  );
}
