import { readableColor } from 'color2k';
import { Fragment } from 'react';
import { useTagsQuery, tagsQueryOptions } from '@/features/tags';
import { TeaFiltersStore } from '@/features/tea/tea-filters.store';
import { useSignals } from '@/shared/backbone/signals';
import { MultiSelect, type MultiSelectProps } from '@/shared/components/ui/multi-select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { TypographySmall } from '@/shared/components/ui/typography/TypographySmall';


type TeaTagsMultiSelectProps = Omit<MultiSelectProps, 'options' | 'onValueChange' | 'value'>;

// TODO: catch query error
export function TeaTagsMultiSelect(props: TeaTagsMultiSelectProps) {
  useSignals();
  const tagsQuery = useTagsQuery();
  const tags = tagsQuery.data || tagsQueryOptions.placeholderData;

  const multiSelectOptions: MultiSelectProps['options'] = tags.map(tag => ({
    label: tag.name,
    value: tag.id,
    color: tag.color,
    colorForeground: readableColor(tag.color),
  }));
  const handleMultiSelectChange: MultiSelectProps['onValueChange'] = (selectedValues) => {
    TeaFiltersStore.setTags(selectedValues);
  };

  const Wrapper = tagsQuery.isPlaceholderData ? Skeleton : Fragment;

  return (
    <>
      <TypographySmall>Теги</TypographySmall>
      <Wrapper>
        <MultiSelect
          value={TeaFiltersStore.filter.tags || []}
          placeholder='Любые'
          options={multiSelectOptions}
          onValueChange={handleMultiSelectChange}
          {...props}
        />
      </Wrapper>
    </>
  );
}
