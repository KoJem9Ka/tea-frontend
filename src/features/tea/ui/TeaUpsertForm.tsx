import { zodResolver } from '@hookform/resolvers/zod';
import { readableColor } from 'color2k';
import { cloneDeep, merge } from 'lodash-es';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod/v4';
import { ModalCategoryUpsert, useCategoriesQuery } from '@/features/categories';
import { ModalTagUpsert, useTagsQuery } from '@/features/tags';
import { useTeaUpsertMutation } from '@/features/tea/hooks/useTeaUpsertMutation';
import { TeaUpsert } from '@/shared/backbone/backend/model/tea';
import { FormCurrencyRubblesInput } from '@/shared/components/form/FormCurrencyRubblesInput.tsx';
import { FormSwitch } from '@/shared/components/form/FormSwitch.tsx';
import { FormTextarea } from '@/shared/components/form/FormTextarea';
import { FormTextInput } from '@/shared/components/form/FormTextInput';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Button } from '@/shared/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '@/shared/components/ui/form'
import { MultiSelect } from '@/shared/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'


const FormSchema = TeaUpsert;
type FormSchema = z.infer<typeof FormSchema>;

export function TeaUpsertForm({ onSuccess, defaultValues: defaultValuesRaw }: {
  onSuccess?: (teaId: string) => void | PromiseLike<void>;
  defaultValues?: FormSchema;
}) {
  const mutation = useTeaUpsertMutation();
  const categoriesQuery = useCategoriesQuery();
  const tagsQuery = useTagsQuery();
  const tagsOptions = tagsQuery.data?.map(tag => ({
    label: tag.name,
    value: tag.id,
    color: tag.color,
    colorForeground: readableColor(tag.color),
  })) || [];

  const defaultValues = useMemo(() => merge(cloneDeep(DEFAULT_VALUES), defaultValuesRaw), [defaultValuesRaw]);

  const form = useForm<FormSchema>({ resolver: zodResolver(FormSchema), defaultValues });

  const handleSubmit = form.handleSubmit(async data => {
    const res = await mutation.mutateAsync(data);
    await onSuccess?.(res.id);
  }) as VoidFunction;

  return (
    <FormProvider {...form}>
      <form className='space-y-4'>
        <FormTextInput
          control={form.control}
          name='name'
          label='Название'
          placeholder='Название...'
        />

        <FormTextarea
          control={form.control}
          name='description'
          label='Описание'
          placeholder='Описание...'
        />

        <FormCurrencyRubblesInput
          control={form.control}
          name='servePrice'
          label='Стоимость подачи'
        />

        <FormCurrencyRubblesInput
          control={form.control}
          name='weightPrice'
          label='Стоимость за 100 г.'
        />

        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem className='grow'>
              <FormLabel>Категория</FormLabel>

              <div className='flex items-center space-x-3'>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Категория' />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesQuery.data?.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <ModalCategoryUpsert
                  onSuccess={categoryId => {
                    // FIXME: idk why it immediately resets without scheduling on next macro task??? (but tags select works without it)
                    setTimeout(() => form.setValue('categoryId', categoryId));
                  }}
                >
                  <Button size='icon' variant='outline'>
                    <Iconify icon={Icon.AddPlus} />
                  </Button>
                </ModalCategoryUpsert>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='tagIds'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Теги</FormLabel>

              <div className='max-w-full flex items-center space-x-3'>
                <FormControl>
                  <MultiSelect
                    className='shrink-[unset]'
                    value={field.value}
                    options={tagsOptions}
                    onValueChange={field.onChange}
                    placeholder='Теги'
                  />
                </FormControl>

                <ModalTagUpsert onSuccess={tagId => form.setValue('tagIds', (field.value || []).concat(tagId))}>
                  <Button size='icon' variant='outline'>
                    <Iconify icon={Icon.AddPlus} />
                  </Button>
                </ModalTagUpsert>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormSwitch
          control={form.control}
          name='isHidden'
          label='Виден в ассортименте'
          description='Можно временно скрыть без удаления'
          isReverse
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

const DEFAULT_VALUES: FormSchema = {
  name: '',
  servePrice: 0,
  weightPrice: 0,
  description: '',
  categoryId: '',
  tagIds: [],
  isHidden: false,
};
