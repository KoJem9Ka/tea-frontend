import { createFileRoute, useRouter } from '@tanstack/react-router';
import { categoriesQueryOptions } from '@/features/categories';
import { useBackHeaderButton } from '@/features/header';
import { tagsQueryOptions } from '@/features/tags';
import { TeaUpsertForm } from '@/features/tea';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES.ts';
import { Container } from '@/shared/components/Container';


export const Route = createFileRoute('/admin/tea/create')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => Promise.all([
    queryClient.ensureQueryData(categoriesQueryOptions()),
    queryClient.ensureQueryData(tagsQueryOptions()),
  ]),
});

function RouteComponent() {
  const router = useRouter();
  useBackHeaderButton({ fallback: ROUTES.ADMIN_TEAS });

  const openCreatedTea = (teaId: string) => router.navigate(ROUTES.TEA_DETAILS(teaId));

  return (
    <Container isSmall>
      <TeaUpsertForm onSuccess={openCreatedTea} />
    </Container>
  );
}
