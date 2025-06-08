import { AuthStore } from '@/features/auth';
import { TeaFiltersStore } from '@/features/tea/tea-filters.store';
import type { TeasListFilterSortBy } from '@/features/tea/tea.api';
import { useSignals } from '@/shared/backbone/signals';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'
import { TypographySmall } from '@/shared/components/ui/typography/TypographySmall';


export function TeaSortBySelect() {
  useSignals();
  const sortByOptions = [
    { label: 'По названию', value: 'name' },
    { label: 'По цене', value: 'servePrice' },
    ...(AuthStore.isAuthorized ? [{ label: 'По рейтингу', value: 'rating' }] as const : []),
  ] as const satisfies { label: string, value: TeasListFilterSortBy }[];

  return (
    <>
      <TypographySmall>Сортировка</TypographySmall>
      <Select value={TeaFiltersStore.filter.sortBy} onValueChange={TeaFiltersStore.setSortBy as VoidFunction}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Сортировать по' />
        </SelectTrigger>
        <SelectContent>
          {sortByOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
