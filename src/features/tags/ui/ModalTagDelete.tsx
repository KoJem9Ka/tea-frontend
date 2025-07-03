import type { PropsWithChildren } from 'react';
import { useTagDeleteMutation } from '@/features/tags/hooks/useTagDeleteMutation';
import type { Tag } from '@/shared/backbone/backend/model/tag';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { ResponsiveDialog } from '@/shared/components/ResponsiveDialog.tsx';
import { TeaTag } from '@/shared/components/TeaTag';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { DEFAULT_ERROR_MESSAGE } from '@/shared/constants';
import { useAbortController } from '@/shared/hooks/useAbortSignal.ts';


type OnSuccess = () => void | PromiseLike<void>;

type TagDeleteFormProps = Tag & {
  onSuccess?: OnSuccess,
};


export function ModalTagDelete({ children, onSuccess: _onSuccess, ...tag }: PropsWithChildren<TagDeleteFormProps>) {
  const [successDeleteSignal, onSuccessDelete] = useAbortController();

  const onSuccess = () => {
    onSuccessDelete();
    _onSuccess?.();
  };

  return (
    <ResponsiveDialog
      title='Удаление тега'
      signal={successDeleteSignal}
      triggerSlot={children}
      formSlot={<TagDeleteForm {...tag} onSuccess={onSuccess} />}
    />
  );
}


function TagDeleteForm({ onSuccess, ...tag }: TagDeleteFormProps) {
  const m = useTagDeleteMutation();

  const handleSubmit = (async () => {
    await m.mutateAsync({ id: tag.id });
    await onSuccess?.();
  }) as VoidFunction;

  return (
    <div className='grid gap-2 text-balance'>
      <p className='text-center'>Вы уверены что хотите удалить тег?</p>

      <div className='flex justify-center'>
        <TeaTag name={tag.name} color={tag.color} />
      </div>

      {m.isError ? (
        <Alert variant='destructive'>
          <Iconify icon={Icon.Danger} />
          <AlertTitle>Не удалось удалить тег</AlertTitle>
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
