import { zodResolver } from '@hookform/resolvers/zod';
import { cloneDeep, merge } from 'lodash-es';
import { type PropsWithChildren, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod/v4';
import { useTagUpsertMutation } from '@/features/tags/hooks/useTagUpsertMutation';
import { TagUpsertReqBody } from '@/features/tags/tags.api';
import type { Tag } from '@/shared/backbone/backend/model/tag';
import { ColorPickerField } from '@/shared/components/ColorPicker';
import { FormTextInput } from '@/shared/components/form/FormTextInput.tsx';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { ResponsiveDialog } from '@/shared/components/ResponsiveDialog';
import { TeaTag } from '@/shared/components/TeaTag';
import { Button } from '@/shared/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '@/shared/components/ui/form'
import { useAbortController } from '@/shared/hooks/useAbortSignal.ts';
import { getFieldPlaceholder } from '@/shared/lib/zod/field-utils.ts';


type OnSuccessFn = (tagId: string) => void | PromiseLike<void>;

export function ModalTagUpsert({
  children,
  onSuccess,
  defaultValues,
}: PropsWithChildren<{
  onSuccess?: OnSuccessFn;
  defaultValues?: Tag;
}>) {
  const [successUpsertSignal, onSuccessUpsert] = useAbortController();

  const _onSuccess: OnSuccessFn = async tagId => {
    onSuccessUpsert();
    await onSuccess?.(tagId);
  };

  return (
    <ResponsiveDialog
      signal={successUpsertSignal}
      title={defaultValues ? 'Изменение тега' : 'Новый тег'}
      triggerSlot={children}
      formSlot={<TagUpsertForm defaultValues={defaultValues} onSuccess={_onSuccess} />}
    />
  );
}


const FormSchema = TagUpsertReqBody;
type FormSchema = z.infer<typeof FormSchema>;

function TagUpsertForm({ onSuccess, defaultValues: defaultValuesRaw }: {
  onSuccess?: OnSuccessFn;
  defaultValues?: Tag;
}) {
  const mutation = useTagUpsertMutation();

  const defaultValues = useMemo(() => merge(cloneDeep(DEFAULT_VALUES), defaultValuesRaw), [defaultValuesRaw]);

  const form = useForm<FormSchema>({ resolver: zodResolver(FormSchema), defaultValues });

  const handleSubmit = form.handleSubmit(async (data: FormSchema) => {
    const res = await mutation.mutateAsync(data);
    await onSuccess?.(res.id);
  }) as VoidFunction;

  return (
    <FormProvider {...form}>
      <form className='space-y-4'>
        <div className='grid grid-cols-2 rounded-md overflow-hidden border'>
          <div className='dark flex justify-center items-center bg-background text-foreground p-4 overflow-hidden *:text-wrap *:max-w-full *:break-all'>
            <TeaTagVisualized control={form.control} />
          </div>
          <div className='light flex justify-center items-center bg-background text-foreground p-4 overflow-hidden *:text-wrap *:max-w-full *:break-all'>
            <TeaTagVisualized control={form.control} />
          </div>
        </div>

        <FormTextInput
          control={form.control}
          name='name'
          label='Название'
          placeholder={getFieldPlaceholder(FormSchema, 'name')}
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

        <div className='grid grid-cols-2 gap-4'>
          <Button
            className='w-full'
            disabled={mutation.isPending || !form.formState.isDirty}
            onClick={() => form.reset()}
            variant='secondary'
          ><Iconify icon={Icon.ResetUndo} />Сброс</Button>

          <Button
            type='submit'
            className='w-full'
            disabled={!form.formState.isDirty}
            isLoading={mutation.isPending}
            onClick={handleSubmit}
          >
            {mutation.isPending ? <Iconify icon={Icon.LoadingSpinner} /> : <Iconify icon={Icon.SaveDiskette} />}
            {mutation.isPending ?
              defaultValues.id ? 'Сохранение...' : 'Создание...' :
              defaultValues.id ? 'Сохранить' : 'Создать'
            }
          </Button>
        </div>
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

const DEFAULT_VALUES: FormSchema = {
  name: '',
  color: '#3B82F6',
};
