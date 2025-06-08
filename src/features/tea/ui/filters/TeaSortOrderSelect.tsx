import { TeaFiltersStore } from '@/features/tea/tea-filters.store';
import { useSignals } from '@/shared/backbone/signals';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'
import { TypographySmall } from '@/shared/components/ui/typography/TypographySmall';


export function TeaSortOrderSelect() {
  useSignals();
  const defaultValue = 'asc';
  const value = TeaFiltersStore.filter.isAsc ? 'asc' : 'desc';

  const orderOptions = [
    { label: 'По возрастанию', value: 'asc' },
    { label: 'По убыванию', value: 'desc' },
  ];

  const handleOrderChange = (value: string) => TeaFiltersStore.setIsAsc(value === 'asc');

  return (
    <>
      <TypographySmall>Порядок сортировки</TypographySmall>
      <Select value={value} onValueChange={handleOrderChange} defaultValue={defaultValue}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Порядок' />
        </SelectTrigger>
        <SelectContent>
          {orderOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
