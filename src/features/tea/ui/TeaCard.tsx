import { isEqual } from 'lodash-es';
import { type ComponentProps, memo } from 'react';
import { useCategoryQuery } from '@/features/categories';
import { TeaFavouriteButton } from '@/features/tea/ui/TeaFavouriteButton';
import type { TeaWithRating } from '@/shared/backbone/backend/model/tea';
import { useSignals } from '@/shared/backbone/signals';
import { Stars } from '@/shared/components/Stars';
import { TeaTag } from '@/shared/components/TeaTag';
import { Card, CardContent, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { formatterCurrencyRU } from '@/shared/lib/independent/formatter-currency-ru';
import { cn } from '@/shared/lib/utils';


type TeaCardProps = ComponentProps<'div'> & {
  tea: TeaWithRating;
};

export const TeaCard = memo(({ tea, ...divProps }: TeaCardProps) => {
  useSignals();
  const categoryQuery = useCategoryQuery({ id: tea.categoryId });

  return (
    <Card
      {...divProps}
      className={cn(tea.isHidden && 'border border-destructive/50 bg-destructive/5', divProps.className)}
    >
      <CardContent className='grow flex flex-col justify-around gap-2'>
        <CardTitle>
          {tea.name}
        </CardTitle>

        {categoryQuery.isPlaceholderData || categoryQuery.isPending ? (
          <Skeleton className='w-fit text-transparent'>Категория</Skeleton>
        ) : (
          <p className='text-sm text-muted-foreground'>{categoryQuery.data?.name}</p>
        )}

        {tea.rating && <Stars value={tea.rating} />}

        <div className='flex flex-wrap gap-2'>
          {tea.tags?.map(tag => <TeaTag {...tag} key={tag.id} />)}
        </div>

        <div className='flex justify-between items-end'>
          <span className='font-bold'>{formatterCurrencyRU.format(tea.servePrice)}</span>

          <TeaFavouriteButton id={tea.id} isFavourite={tea.isFavourite} />
        </div>
      </CardContent>
    </Card>
  );
}, isEqual);

TeaCard.displayName = 'TeaCard';
