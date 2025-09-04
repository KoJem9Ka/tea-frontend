import { createFileRoute } from '@tanstack/react-router';
import { useHeaderBackButton } from '@/features/header';
import { ModalUnitDelete, ModalUnitUpsert, unitsQueryOptions, useUnitsQuery } from '@/features/unit';
import { type Unit, unitPrettyPrint } from '@/shared/backbone/backend/model/unit';
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
import { staleTimeMin } from '@/shared/lib/staleTimeMin.ts';


export const Route = createFileRoute('/admin/units')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(unitsQueryOptions());
  },
  staleTime: staleTimeMin(unitsQueryOptions().staleTime),
  pendingComponent: UnitsPageSkeleton,
});

function RouteComponent() {
  usePageHeightScreen();
  useHeaderBackButton({ fallback: ROUTES.HOME });
  const unitsQuery = useUnitsQuery();

  if (unitsQuery.isPending || unitsQuery.isPlaceholderData) return <UnitsPageSkeleton />;

  return (
    <Container isSmall>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Ед. изм.</h1>

        <ModalUnitUpsert>
          <Button size='icon'><Iconify icon={Icon.AddPlus} /></Button>
        </ModalUnitUpsert>
      </div>

      <Table containerClassName='border rounded-lg'>
        <TableHeader>
          <TableRow className='sticky bg-background top-0 z-10 border-none after:absolute after:left-0 after:w-full after:bottom-0 after:h-px after:bg-border'>
            <TableHead className='w-full'>Количество</TableHead>
            <TableHead align='center'>Действия</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {unitsQuery.data?.map((unit) => (
            <UnitRow key={unit.id} unit={unit} />
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

function UnitRow({ unit }: { unit: Unit }) {
  useSignals();

  return (
    <TableRow>
      <TableCell>{unitPrettyPrint(unit)}</TableCell>

      <TableCell>
        <div className='flex gap-1'>
          <ModalUnitUpsert defaultValues={unit}>
            <Button size='icon' variant='outline'><Iconify icon={Icon.EditPen} /></Button>
          </ModalUnitUpsert>

          <ModalUnitDelete {...unit}>
            <Button size='icon' variant='outline'><Iconify icon={Icon.DeleteTrashCan} /></Button>
          </ModalUnitDelete>
        </div>
      </TableCell>
    </TableRow>
  );
}

function UnitsPageSkeleton() {
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
              <TableHead>Количество</TableHead>
              <TableHead className='w-[100px]'>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className='h-4 w-24' /></TableCell>
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
