import { type PropsWithChildren } from 'react';
import { useTeaDeleteMutation } from '@/features/tea/hooks/useTeaDeleteMutation.ts';
import type { Tea } from '@/shared/backbone/backend/model/tea.ts';
import { Icon, Iconify } from '@/shared/components/Iconify.tsx';
import { ResponsiveDialog } from '@/shared/components/ResponsiveDialog.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { DEFAULT_ERROR_MESSAGE } from '@/shared/constants.ts';
import { useAbortController } from '@/shared/hooks/useAbortSignal.ts';
import type { MaybePromise } from '@/shared/types/types.ts';


type OnSuccess = () => MaybePromise;

type TeaDeleteFormProps = Pick<Tea, 'id' | 'name'> & {
  onSuccess?: OnSuccess,
};


export function ModalTeaDelete({ children, onSuccess: _onSuccess, ...tea }: PropsWithChildren<TeaDeleteFormProps>) {
  const [successDeleteSignal, onSuccessDelete] = useAbortController();

  const onSuccess = async () => {
    await _onSuccess?.();
    onSuccessDelete();
  };

  return (
    <ResponsiveDialog
      title='Удаление чая'
      signal={successDeleteSignal}
      triggerSlot={children}
      formSlot={<TeaDeleteForm {...tea} onSuccess={onSuccess} />}
    />
  );
}


function TeaDeleteForm({ onSuccess, ...tea }: TeaDeleteFormProps) {
  const [m, onSuccessInvalidate] = useTeaDeleteMutation({ isAutoInvalidate: false });

  const handleSubmit = (async () => {
    await m.mutateAsync({ id: tea.id });
    await onSuccess?.();
    await onSuccessInvalidate();
  }) as VoidFunction;

  return (
    <div className='grid gap-2 text-balance'>
      <p className='text-center'>Вы уверены что хотите удалить «{tea.name}»?</p>

      {m.isError ? (
        <Alert variant='destructive'>
          <Iconify icon={Icon.Danger} />
          <AlertTitle>Не удалось удалить чай</AlertTitle>
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
