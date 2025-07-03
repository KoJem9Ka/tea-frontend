import type { ComponentProps } from 'react';
import { FiltersDropdownStore } from '@/features/tea/filters-dropdown.store';
import { TeaFiltersStore } from '@/features/tea/tea-filters.store';
import { TeaFilters } from '@/features/tea/ui/filters/TeaFilters';
import { useSignals } from '@/shared/backbone/signals';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Button } from '@/shared/components/ui/button';
import { Drawer, DrawerContent, DrawerFooter, DrawerTitle } from '@/shared/components/ui/drawer';
import { cn } from '@/shared/lib/utils';


export function TeaFiltersDrawer() {
  useSignals();

  return (
    <Drawer
      open={FiltersDropdownStore.isDropdownOpen}
      onOpenChange={FiltersDropdownStore.setIsOpen}
      direction='bottom'
    >
      <DrawerContent className='px-4'>
        <DrawerFooter className='gap-[unset]'>
          <DrawerTitle className='text-center'>Фильтры</DrawerTitle>
          <TeaFilters />
          <div className='grid grid-cols-2 gap-4 mt-6 mb-2'>
            <Button
              disabled={TeaFiltersStore.isFilterEmpty}
              variant='secondary'
              onClick={TeaFiltersStore.clear}
              className='w-full'
            ><Iconify icon={Icon.ResetUndo} />Сброс</Button>
            <Button
              variant='secondary'
              onClick={FiltersDropdownStore.toggle}
              className='w-full'
            >Закрыть</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function TeaFilterDrawerButton({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      variant='outline'
      onClick={FiltersDropdownStore.toggle}
      className={cn(className)}
      {...props}
    >
      Фильтры
    </Button>
  );
}
