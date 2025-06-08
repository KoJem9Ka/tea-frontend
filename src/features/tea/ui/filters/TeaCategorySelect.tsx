import { Fragment } from 'react';
import { useCategoriesQuery } from '@/features/categories';
import { TeaFiltersStore } from '@/features/tea/tea-filters.store';
import { useSignals } from '@/shared/backbone/signals';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'
import { Skeleton } from '@/shared/components/ui/skeleton';
import { TypographySmall } from '@/shared/components/ui/typography/TypographySmall';


export function TeaCategorySelect() {
  useSignals();
  const categoriesQuery = useCategoriesQuery();

  const selectedValue = TeaFiltersStore.filter.categoryId || allKey;

  const selectOptions = categoriesQuery.data?.map(category => ({
    label: category.name,
    value: category.id,
  })) || [];

  const handleSelectChange = (value: string) => {
    TeaFiltersStore.setCategoryId(value === allKey ? null : value);
  };

  const Wrapper = categoriesQuery.isPlaceholderData ? Skeleton : Fragment;

  return (
    <>
      <TypographySmall>Категория</TypographySmall>
      <Wrapper>
        <Select value={selectedValue} onValueChange={handleSelectChange}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Категория' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allKey}>Все категории</SelectItem>
            {selectOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Wrapper>
    </>
  );
}

const allKey = 'all';
