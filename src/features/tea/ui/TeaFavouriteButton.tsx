import { clsx } from 'clsx';
import type { MouseEventHandler } from 'react';
import { AuthStore } from '@/features/auth';
import { useSetFavouriteMutation } from '@/features/tea/hooks/useSetFavouriteMutation';
import type { TeaWithRating } from '@/shared/backbone/backend/model/tea';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Button } from '@/shared/components/ui/button';


export function TeaFavouriteButton(props: Pick<TeaWithRating, 'id' | 'isFavourite'>) {
  const setFavouriteMutation = useSetFavouriteMutation();
  if (!AuthStore.isAuthorized) return null;

  const onSetFavourite: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavouriteMutation.mutate({ id: props.id, isFavourite: !isFavourite });
  };
  const isFavourite = setFavouriteMutation.isPending && setFavouriteMutation.variables.id === props.id
    ? setFavouriteMutation.variables.isFavourite
    : props.isFavourite;


  return (
    <Button
      disabled={setFavouriteMutation.isPending}
      size='icon'
      variant='ghost'
      onClickCapture={onSetFavourite}
      className={clsx(
        isFavourite ? 'text-red-400 hover:text-red-500' : 'text-gray-500 hover:text-red-400',
      )}
    >
      <Iconify className='size-8' icon={isFavourite ? Icon.HeartFilled : Icon.HeartEmpty} />
    </Button>
  );
}
