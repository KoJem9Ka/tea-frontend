import { type PropsWithChildren } from 'react';
import { useUnitDeleteMutation } from '@/features/unit/hooks/useUnitDeleteMutation.ts';
import { type Unit, unitPrettyPrint } from '@/shared/backbone/backend/model/unit.ts';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { ResponsiveDialog } from '@/shared/components/ResponsiveDialog.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { DEFAULT_ERROR_MESSAGE } from '@/shared/constants';
import { useAbortController } from '@/shared/hooks/useAbortSignal.ts';
import type { MaybePromise } from '@/shared/types/types.ts';


type OnSuccess = () => MaybePromise;
type UnitDeleteFormProps = Unit & {
  onSuccess?: OnSuccess,
};


export function ModalUnitDelete({ children, onSuccess: _onSuccess, ...unit }: PropsWithChildren<UnitDeleteFormProps>) {
  const [successDeleteSignal, onSuccessDelete] = useAbortController();

  const onSuccess = async () => {
    await _onSuccess?.();
    onSuccessDelete();
  };

  return (
    <ResponsiveDialog
      title='Удаление ед. изм.'
      signal={successDeleteSignal}
      triggerSlot={children}
      formSlot={<UnitDeleteForm {...unit} onSuccess={onSuccess} />}
    />
  );
}


function UnitDeleteForm({ onSuccess, ...unit }: UnitDeleteFormProps) {
  const m = useUnitDeleteMutation();

  const handleSubmit = (async () => {
    await m.mutateAsync({ id: unit.id });
    await onSuccess?.();
  }) as VoidFunction;

  return (
    <div className='grid gap-2 text-balance'>
      <p className='text-center'>Вы уверены что хотите удалить ед. изм. «{unitPrettyPrint(unit)}»?</p>

      {m.isError ? (
        <Alert variant='destructive'>
          <Iconify icon={Icon.Danger} />
          <AlertTitle>Не удалось удалить ед. изм.</AlertTitle>
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
