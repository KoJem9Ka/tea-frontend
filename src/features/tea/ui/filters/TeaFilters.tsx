import type { ComponentProps } from 'react';
import { AuthStore } from '@/features/auth';
import { TeaCategorySelect } from '@/features/tea/ui/filters/TeaCategorySelect';
import { TeaIsOnlyFavouriteSwitch } from '@/features/tea/ui/filters/TeaIsOnlyFavouriteSwitch.tsx';
import { TeaIsOnlyHiddenSwitch } from '@/features/tea/ui/filters/TeaIsOnlyHiddenSwitch.tsx';
import { TeaPriceRange } from '@/features/tea/ui/filters/TeaPriceRange';
import { TeaSortBySelect } from '@/features/tea/ui/filters/TeaSortBySelect';
import { TeaSortOrderSelect } from '@/features/tea/ui/filters/TeaSortOrderSelect';
import { TeaTagsMultiSelect } from '@/features/tea/ui/filters/TeaTagsMultiSelect';
import { cn } from '@/shared/lib/utils';


type TeaFiltersProps = ComponentProps<'div'> & {
  tagsSelectClassName?: string;
};

export function TeaFilters({ className, tagsSelectClassName, ...props }: TeaFiltersProps) {
  return (
    <div className={cn('flex flex-col space-y-4 min-w-[180px]', className)} {...props}>
      <TeaCategorySelect />
      <TeaTagsMultiSelect className={tagsSelectClassName} />
      {AuthStore.isAuthorized ? (
        <TeaIsOnlyFavouriteSwitch />
      ) : null}
      <TeaPriceRange />
      <TeaSortBySelect />
      <TeaSortOrderSelect />
      {AuthStore.isAdmin ? (
        <TeaIsOnlyHiddenSwitch />
      ) : null}
    </div>
  );
}
