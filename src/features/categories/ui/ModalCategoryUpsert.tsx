import { zodResolver } from '@hookform/resolvers/zod';
import { cloneDeep, merge } from 'lodash-es';
import { type PropsWithChildren, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod/v4';
import { CategoryUpsertReqBody } from '@/features/categories/categories.api';
import { useCategoryUpsertMutation } from '@/features/categories/hooks/useCategoryUpsertMutation';
import type { Category } from '@/shared/backbone/backend/model/category';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { ResponsiveDialog } from '@/shared/components/ResponsiveDialog';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert.tsx';
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
import { Textarea } from '@/shared/components/ui/textarea';
import { DEFAULT_ERROR_MESSAGE } from '@/shared/constants.ts';
import { useAbortController } from '@/shared/hooks/useAbortSignal.ts';


type OnSuccessFn = (categoryId: string) => void | PromiseLike<void>;

export function ModalCategoryUpsert({ children, onSuccess, defaultValues }: PropsWithChildren<{
  onSuccess?: OnSuccessFn;
  defaultValues?: Category;
}>) {
  const [successUpsertSignal, onSuccessUpsert] = useAbortController();

  const _onSuccess: OnSuccessFn = async (categoryId) => {
    onSuccessUpsert();
    await onSuccess?.(categoryId);
  };

  return (
    <ResponsiveDialog
      signal={successUpsertSignal}
      title={defaultValues ? 'Редактирование категории' : 'Новая категория'}
      triggerSlot={children}
      formSlot={<CategoryUpsertForm defaultValues={defaultValues} onSuccess={_onSuccess} />}
    />
  );
}


const FormSchema = CategoryUpsertReqBody;
type FormSchema = z.infer<typeof FormSchema>;

function CategoryUpsertForm({ onSuccess, defaultValues: defaultValuesRaw }: {
  onSuccess?: OnSuccessFn;
  defaultValues?: Category;
}) {
  const m = useCategoryUpsertMutation();

  const defaultValues = useMemo(() => merge(cloneDeep(DEFAULT_VALUES), defaultValuesRaw), [defaultValuesRaw]);

  const form = useForm<FormSchema>({ resolver: zodResolver(FormSchema), defaultValues });

  const handleSubmit = form.handleSubmit(async (data: FormSchema) => {
    const res = await m.mutateAsync(data);
    await onSuccess?.(res.id);
  }) as VoidFunction;

  return (
    <FormProvider {...form}>
      <form className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder='Название...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Описание...'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {m.isError ? (
          <Alert variant='destructive'>
            <Iconify icon={Icon.Danger} />
            <AlertTitle>Не удалось сохранить категорию</AlertTitle>
            <AlertDescription>
              <p>{DEFAULT_ERROR_MESSAGE}</p>
            </AlertDescription>
          </Alert>
        ) : null}

        <div className='grid grid-cols-2 gap-4'>
          <Button
            className='w-full'
            disabled={m.isPending || !form.formState.isDirty}
            onClick={() => form.reset()}
            variant='secondary'
          ><Iconify icon={Icon.ResetUndo} />Сброс</Button>

          <Button
            type='submit'
            className='w-full'
            disabled={!form.formState.isDirty}
            isLoading={m.isPending}
            onClick={handleSubmit}
          >
            {m.isPending ? <Iconify icon={Icon.LoadingSpinner} /> : <Iconify icon={Icon.SaveDiskette} />}
            {m.isPending ?
              defaultValues.id ? 'Сохранение...' : 'Создание...' :
              defaultValues.id ? 'Сохранить' : 'Создать'
            }
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

const DEFAULT_VALUES: FormSchema = {
  name: '',
  description: '',
};
