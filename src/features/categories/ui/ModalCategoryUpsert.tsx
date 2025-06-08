import { zodResolver } from '@hookform/resolvers/zod';
import { type PropsWithChildren, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod/v4';
import { CategoryUpsertReqBody } from '@/features/categories/categories.api';
import { useCategoryUpsertMutation } from '@/features/categories/hooks/useCategoryUpsertMutation';
import { ResponsiveDialog, type ResponsiveDialogControlRef } from '@/shared/components/ResponsiveDialog';
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


type OnSuccessFn = (categoryId: string) => void | PromiseLike<void>;

export function ModalCategoryUpsert({ children, onSuccess }: PropsWithChildren<{ onSuccess?: OnSuccessFn }>) {
  const ref = useRef<ResponsiveDialogControlRef>(null);

  const _onSuccess: OnSuccessFn = async (categoryId) => {
    ref.current?.close();
    await onSuccess?.(categoryId);
  };

  return (
    <ResponsiveDialog
      controlRef={ref}
      title='Новая категория'
      triggerSlot={children}
      formSlot={<CategoryUpsertForm onSuccess={_onSuccess} />}
    />
  );
}


const FormSchema = CategoryUpsertReqBody;
type FormSchema = z.infer<typeof FormSchema>;

function CategoryUpsertForm({ onSuccess }: {
  onSuccess?: OnSuccessFn;
}) {
  const mutation = useCategoryUpsertMutation();

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
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
