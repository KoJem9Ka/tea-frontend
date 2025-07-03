import type { SelectProps } from '@radix-ui/react-select';
import { AuthStore } from '@/features/auth';
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


export function TeaFavouriteSelect() {
  useSignals();

  if (!AuthStore.isAuthorized) return null;

  const options = [
    { value: JSON.stringify(null), label: 'Все' },
    { value: JSON.stringify(true), label: 'Да' },
    { value: JSON.stringify(false), label: 'Нет' },
  ];

  const currentValue = JSON.stringify(TeaFiltersStore.filter.isOnlyFavourite ?? null);

  const handleSelectChange: SelectProps['onValueChange'] = value => {
    TeaFiltersStore.setIsOnlyFavourite(JSON.parse(value) as null | boolean);
  };

  return (
    <>
      <TypographySmall>Избранное</TypographySmall>
      <Select value={currentValue} onValueChange={handleSelectChange} defaultValue={allKey}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Избранное' />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

const allKey = 'all';
