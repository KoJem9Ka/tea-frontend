import { isEqual } from 'lodash-es';
import { minMaxPricesQuery, useMinMaxPricesQuery } from '@/features/tea/hooks/useMinMaxPricesQuery';
import { TeaFiltersStore } from '@/features/tea/tea-filters.store';
import { useSignals } from '@/shared/backbone/signals';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Slider } from '@/shared/components/ui/slider';
import { TypographySmall } from '@/shared/components/ui/typography/TypographySmall';
import { formatterCurrencyRU } from '@/shared/lib/independent/formatter-currency-ru';


// TODO: catch query error
export function TeaPriceRange() {
  useSignals();
  const pricesQuery = useMinMaxPricesQuery();
  const response = pricesQuery.data || minMaxPricesQuery.placeholderData;
  const sliderDefaultValue = [response.minServePrice, response.maxServePrice] as const;
  const sliderValue = TeaFiltersStore.filter.servePrice
    ? [TeaFiltersStore.filter.servePrice.min, TeaFiltersStore.filter.servePrice.max] as const
    : sliderDefaultValue;
  const [minServePriceFmt, maxServePriceFmt] = sliderValue.map(
    value => formatterCurrencyRU.format(value),
  ) as [string, string];

  const onChange = ([min, max]: [number, number]) => {
    const isDefault = isEqual([min, max], sliderDefaultValue);
    TeaFiltersStore.setServePrice(isDefault ? null : { min, max });
  };

  return (
    <>
      <TypographySmall>Цена за порцию (₽)</TypographySmall>
      <div className='pt-2'>
        {pricesQuery.isPlaceholderData ? <Skeleton className='h-2 w-full' /> : (
          <Slider
            min={response.minServePrice}
            max={response.maxServePrice}
            step={1}
            onValueChange={onChange}
            value={sliderValue}
            defaultValue={sliderDefaultValue}
          />
        )}
        <div className='flex justify-between mt-2 text-sm text-muted-foreground'>
          {pricesQuery.isPlaceholderData ? <Skeleton className='h-4 w-10' /> : <div>{minServePriceFmt}</div>}
          {pricesQuery.isPlaceholderData ? <Skeleton className='h-4 w-10' /> : <div>{maxServePriceFmt}</div>}
        </div>
      </div>
    </>
  );
}
