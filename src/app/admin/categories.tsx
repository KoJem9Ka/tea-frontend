import { createFileRoute } from '@tanstack/react-router';
import { categoriesQueryOptions, ModalCategoryDelete, ModalCategoryUpsert, useCategoriesQuery } from '@/features/categories';
import { useBackHeaderButton } from '@/features/header';
import type { Category } from '@/shared/backbone/backend/model/category';
import { useSignals } from '@/shared/backbone/signals';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES';
import { Container } from '@/shared/components/Container';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/ui/table'
import { usePageHeightScreen } from '@/shared/hooks/usePageHeightScreen.ts';


export const Route = createFileRoute('/admin/categories')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(categoriesQueryOptions());
  },
  pendingComponent: CategoriesPageSkeleton,
});

function RouteComponent() {
  usePageHeightScreen();
  useBackHeaderButton({ fallback: ROUTES.HOME });
  const categoriesQuery = useCategoriesQuery();

  if (categoriesQuery.isPending || categoriesQuery.isPlaceholderData) return <CategoriesPageSkeleton />;

  return (
    <Container>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Категории</h1>

        <ModalCategoryUpsert>
          <Button size='icon'><Iconify icon={Icon.AddPlus} /></Button>
        </ModalCategoryUpsert>
      </div>

      <Table containerClassName='border rounded-lg'>
        <TableHeader>
          <TableRow className='sticky bg-background top-0 z-10 border-none after:absolute after:left-0 after:w-full after:bottom-0 after:h-px after:bg-border'>
            <TableHead className='max-lg:w-full'>Название</TableHead>
            <TableHead className='max-lg:hidden w-full'>Описание</TableHead>
            <TableHead align='center'>Действия</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categoriesQuery.data?.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

function CategoryRow({ category }: { category: Category }) {
  useSignals();

  return (
    <TableRow>
      <TableCell className='font-medium'>{category.name}</TableCell>

      <TableCell className='max-lg:hidden'>{category.description || '—'}</TableCell>

      <TableCell>
        <div className='flex gap-1'>
          <ModalCategoryUpsert defaultValues={category}>
            <Button size='icon' variant='outline'><Iconify icon={Icon.EditPen} /></Button>
          </ModalCategoryUpsert>

          <ModalCategoryDelete id={category.id} name={category.name}>
            <Button size='icon' variant='outline'><Iconify icon={Icon.DeleteTrashCan} /></Button>
          </ModalCategoryDelete>
        </div>
      </TableCell>
    </TableRow>
  );
}

function CategoriesPageSkeleton() {
  return (
    <Container>
      <div className='flex justify-between items-center'>
        <Skeleton className='h-8 w-32' />
        <Skeleton className='size-9' />
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead className='w-[100px]'>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                <TableCell><Skeleton className='h-4 w-48' /></TableCell>
                <TableCell>
                  <div className='flex gap-1'>
                    <Skeleton className='h-8 w-8' />
                    <Skeleton className='h-8 w-8' />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
