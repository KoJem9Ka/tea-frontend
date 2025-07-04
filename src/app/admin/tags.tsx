import { createFileRoute } from '@tanstack/react-router';
import { useBackHeaderButton } from '@/features/header';
import { ModalTagDelete, ModalTagUpsert, tagsQueryOptions, useTagsQuery } from '@/features/tags';
import type { Tag } from '@/shared/backbone/backend/model/tag';
import { useSignals } from '@/shared/backbone/signals';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES';
import { Container } from '@/shared/components/Container';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { TeaTag } from '@/shared/components/TeaTag';
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
import { usePageHeightScreen } from '@/shared/hooks/usePageHeightScreen';


export const Route = createFileRoute('/admin/tags')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(tagsQueryOptions());
  },
  pendingComponent: TagsPageSkeleton,
});

function RouteComponent() {
  usePageHeightScreen();
  useBackHeaderButton({ fallback: ROUTES.HOME });
  const tagsQuery = useTagsQuery();

  if (tagsQuery.isPending || tagsQuery.isPlaceholderData) return <TagsPageSkeleton />;

  return (
    <Container isSmall>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Теги</h1>

        <ModalTagUpsert>
          <Button size='icon'><Iconify icon={Icon.AddPlus} /></Button>
        </ModalTagUpsert>
      </div>

      <Table containerClassName='border rounded-lg'>
        <TableHeader>
          <TableRow className='sticky bg-background top-0 z-10 border-none after:absolute after:left-0 after:w-full after:bottom-0 after:h-px after:bg-border'>
            <TableHead className='w-full'>Тег</TableHead>
            <TableHead align='center'>Действия</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tagsQuery.data?.map((tag) => (
            <TagRow key={tag.id} tag={tag} />
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

function TagRow({ tag }: { tag: Tag }) {
  useSignals();

  return (
    <TableRow>
      <TableCell>
        <TeaTag name={tag.name} color={tag.color} />
      </TableCell>

      <TableCell>
        <div className='flex gap-1'>
          <ModalTagUpsert defaultValues={tag}>
            <Button size='icon' variant='outline'><Iconify icon={Icon.EditPen} /></Button>
          </ModalTagUpsert>

          <ModalTagDelete {...tag}>
            <Button size='icon' variant='outline'><Iconify icon={Icon.DeleteTrashCan} /></Button>
          </ModalTagDelete>
        </div>
      </TableCell>
    </TableRow>
  );
}

function TagsPageSkeleton() {
  return (
    <Container isSmall>
      <div className='flex justify-between items-center'>
        <Skeleton className='h-8 w-32' />
        <Skeleton className='size-9' />
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Тег</TableHead>
              <TableHead className='w-[100px]'>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className='h-6 w-16' /></TableCell>
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
