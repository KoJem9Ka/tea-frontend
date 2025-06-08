import { type ComponentProps, useState } from 'react';
import { TeaFiltersStore } from '@/features/tea/tea-filters.store';
import { TeaFilters } from '@/features/tea/ui/filters/TeaFilters.tsx';
import { useSignals } from '@/shared/backbone/signals.ts';
import { Button } from '@/shared/components/ui/button.tsx';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/shared/components/ui/sheet.tsx'
import { cn } from '@/shared/lib/utils.ts';


export function TeaFiltersSheet({ className, ...props }: ComponentProps<typeof Button>) {
  useSignals();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' className={cn(className)}{...props}>
          Фильтры
        </Button>
      </SheetTrigger>

      <SheetContent side='bottom'>
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
        </SheetHeader>

        <TeaFilters className='-mx-4 px-4 min-h-0 overflow-y-auto' />

        <SheetFooter>
          <div className='grid grid-cols-2 gap-4'>
            <Button
              disabled={TeaFiltersStore.isFilterEmpty}
              variant='secondary'
              onClick={TeaFiltersStore.clear}
              className='w-full'
            >Сброс</Button>

            <Button
              variant='secondary'
              onClick={close}
              className='w-full'
            >Закрыть</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
