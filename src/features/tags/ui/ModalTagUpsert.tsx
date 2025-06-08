import { zodResolver } from '@hookform/resolvers/zod';
import { type PropsWithChildren, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod/v4';
import { useTagUpsertMutation } from '@/features/tags/hooks/useTagUpsertMutation';
import { TagUpsertReqBody } from '@/features/tags/tags.api';
import { ColorPickerField } from '@/shared/components/ColorPicker';
import { ResponsiveDialog, type ResponsiveDialogControlRef } from '@/shared/components/ResponsiveDialog';
import { TeaTag } from '@/shared/components/TeaTag.tsx';
import { Button } from '@/shared/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input';


type OnSuccessFn = (tagId: string) => void | PromiseLike<void>;

export function ModalTagUpsert({ id, children, onSuccess }: PropsWithChildren<{ id?: string, onSuccess?: OnSuccessFn }>) {
  const ref = useRef<ResponsiveDialogControlRef>(null);

  const _onSuccess: OnSuccessFn = async tagId => {
    ref.current?.close();
    await onSuccess?.(tagId);
  };

  return (
    <ResponsiveDialog
      controlRef={ref}
      title={id ? 'Изменение тега' : 'Новый тег'}
      triggerSlot={children}
      formSlot={<TagUpsertForm id={id} onSuccess={_onSuccess} />}
    />
  );
}


const FormSchema = TagUpsertReqBody;
type FormSchema = z.infer<typeof FormSchema>;

function TagUpsertForm({ onSuccess }: {
  id?: string,
  onSuccess?: OnSuccessFn;
}) {
  const mutation = useTagUpsertMutation();

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      color: '#3B82F6',
    },
  });

  const handleSubmit = form.handleSubmit(async (data: FormSchema) => {
    const res = await mutation.mutateAsync(data);
    form.reset();
    await onSuccess?.(res.id);
  });

  return (
    <FormProvider {...form}>
      <form className='space-y-4' onSubmit={handleSubmit as VoidFunction}>
        <div className='grid grid-cols-2 rounded-md overflow-hidden border'>
          <div className='dark flex justify-center items-center bg-background text-foreground p-4 overflow-hidden *:text-wrap *:max-w-full *:break-all'>
            <TeaTagVisualized control={form.control} />
          </div>
          <div className='light flex justify-center items-center bg-background text-foreground p-4 overflow-hidden *:text-wrap *:max-w-full *:break-all'>
            <TeaTagVisualized control={form.control} />
          </div>
        </div>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder='Название тега...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='color'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Цвет</FormLabel>
              <FormControl>
                <ColorPickerField {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full'
          disabled={mutation.isPending}
          isLoading={mutation.isPending}
        >
          {mutation.isPending ? 'Создание...' : 'Создать'}
        </Button>
      </form>
    </FormProvider>
  );
}

function TeaTagVisualized({ control }: {
  control: ReturnType<typeof useForm<FormSchema>>['control'];
}) {
  const name = useWatch({ control, name: 'name' }) || 'Без названия';
  const color = useWatch({ control, name: 'color' });

  return <TeaTag name={name} color={color} />;
}
