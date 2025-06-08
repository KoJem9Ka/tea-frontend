import type { ComponentProps } from 'react';
import { TeaFiltersStore } from '@/features/tea/tea-filters.store';
import { TeaFilters } from '@/features/tea/ui/filters/TeaFilters';
import { useSignals } from '@/shared/backbone/signals';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils';


export function TeaFiltersPanel({ className, ...props }: ComponentProps<'div'>) {
  useSignals();

  return (
    <Card className={cn('min-h-0 max-h-full', className)} {...props}>
      <CardHeader><CardTitle>Фильтры</CardTitle></CardHeader>
      <CardContent className='min-h-0 overflow-y-auto'>
        <TeaFilters tagsSelectClassName='max-w-[200px] min-h-9 h-auto' />
      </CardContent>
      <CardFooter>
        <Button
          disabled={TeaFiltersStore.isFilterEmpty}
          className='w-full'
          variant='secondary'
          size='sm'
          onClick={TeaFiltersStore.clear}
        >Сброс</Button>
      </CardFooter>
    </Card>
  );
}
