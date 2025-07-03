import type { PropsWithChildren } from 'react';
import { useCategoryDeleteMutation } from '@/features/categories/hooks/useCategoryDeleteMutation';
import type { Category } from '@/shared/backbone/backend/model/category';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { ResponsiveDialog } from '@/shared/components/ResponsiveDialog.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { DEFAULT_ERROR_MESSAGE } from '@/shared/constants';
import { useAbortController } from '@/shared/hooks/useAbortSignal.ts';


type OnSuccess = () => void | PromiseLike<void>;

type CategoryDeleteFormProps = Pick<Category, 'id' | 'name'> & {
  onSuccess?: OnSuccess,
};


export function ModalCategoryDelete({ children, onSuccess: _onSuccess, ...category }: PropsWithChildren<CategoryDeleteFormProps>) {
  const [successDeleteSignal, onSuccessDelete] = useAbortController();

  const onSuccess = () => {
    onSuccessDelete();
    _onSuccess?.();
  };

  return (
    <ResponsiveDialog
      title='Удаление категории'
      signal={successDeleteSignal}
      triggerSlot={children}
      formSlot={<CategoryDeleteForm {...category} onSuccess={onSuccess} />}
    />
  );
}


function CategoryDeleteForm({ onSuccess, ...category }: CategoryDeleteFormProps) {
  const m = useCategoryDeleteMutation();

  const handleSubmit = (async () => {
    await m.mutateAsync({ id: category.id });
    await onSuccess?.();
  }) as VoidFunction;

  return (
    <div className='grid gap-2 text-balance'>
      <p className='text-center'>Вы уверены что хотите удалить категорию «{category.name}»?</p>

      {m.isError ? (
        <Alert variant='destructive'>
          <Iconify icon={Icon.Danger} />
          <AlertTitle>Не удалось удалить категорию</AlertTitle>
          <AlertDescription>
            <p>{DEFAULT_ERROR_MESSAGE}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <Button
        variant='destructive'
        isLoading={m.isPending}
        onClick={handleSubmit}
      >
        {m.isPending ? <Iconify icon={Icon.LoadingSpinner} /> : <Iconify icon={Icon.DeleteTrashCan} />}
        Удалить
      </Button>
    </div>
  );
}
