import { useTeaDeleteMutation } from '@/features/tea/hooks/useTeaDeleteMutation.ts';
import type { Tea } from '@/shared/backbone/backend/model/tea.ts';
import { Icon, Iconify } from '@/shared/components/Iconify.tsx';
import { Button } from '@/shared/components/ui/button.tsx';


type OnSuccess = () => void | PromiseLike<void>;

type TeaDeleteFormProps = Pick<Tea, 'id' | 'name'> & {
  onSuccess?: OnSuccess,
};

export function TeaDeleteForm({ onSuccess, ...tea }: TeaDeleteFormProps) {
  const m = useTeaDeleteMutation();

  const handleSubmit = (async () => {
    await m.mutateAsync({ id: tea.id });
    await onSuccess?.();
  }) as VoidFunction;

  return (
    <div className='grid gap-2'>
      <p>Вы уверены что хотите удалить {tea.name}?</p>
      <Button
        variant='destructive'
        isLoading={m.isPending}
        onClick={handleSubmit}
      >
        {m.isPending && <Iconify icon={Icon.LoadingSpinner} />}
        Удалить
      </Button>
    </div>
  );
}
