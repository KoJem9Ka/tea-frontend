import { zodResolver } from '@hookform/resolvers/zod';
import { readableColor } from 'color2k';
import { cloneDeep, merge } from 'lodash-es';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod/v4';
import { ModalCategoryUpsert, useCategoriesQuery } from '@/features/categories';
import { ModalTagUpsert, useTagsQuery } from '@/features/tags';
import { useTeaUpsertMutation } from '@/features/tea/hooks/useTeaUpsertMutation';
import { ModalUnitUpsert, useUnitsQuery } from '@/features/unit';
import { TeaUpsert } from '@/shared/backbone/backend/model/tea';
import { unitPrettyPrint } from '@/shared/backbone/backend/model/unit.ts';
import { FormCurrencyRubblesInput } from '@/shared/components/form/FormCurrencyRubblesInput.tsx';
import { FormSelect } from '@/shared/components/form/FormSelect.tsx';
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
import { SET_VALUE_DEFAULT_OPTIONS } from '@/shared/constants.ts';
import { getFieldPlaceholder } from '@/shared/lib/zod/field-utils';
import type { MaybePromise } from '@/shared/types/types.ts';


const FormSchema = TeaUpsert;
type FormSchema = z.infer<typeof FormSchema>;


export function TeaUpsertForm({ onSuccess, defaultValues: defaultValuesRaw }: {
  onSuccess?: (teaId: string) => MaybePromise;
  defaultValues?: FormSchema;
}) {
  const mutation = useTeaUpsertMutation();
  const categoriesQuery = useCategoriesQuery();
  const tagsQuery = useTagsQuery();
  const unitsQuery = useUnitsQuery();
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
          placeholder={getFieldPlaceholder(FormSchema, 'name')}
        />

        <FormTextarea
          control={form.control}
          name='description'
          label='Описание'
          placeholder={getFieldPlaceholder(FormSchema, 'description')}
        />

        <FormCurrencyRubblesInput
          control={form.control}
          name='servePrice'
          label='Цена чаепития'
          placeholder={getFieldPlaceholder(FormSchema, 'servePrice')}
        />

        <div className='grid grid-cols-[1fr_auto] items-start gap-3'>
          <FormCurrencyRubblesInput
            control={form.control}
            name='unitPrice'
            label='Цена на развес'
            placeholder={getFieldPlaceholder(FormSchema, 'unitPrice')}
          />

          <FormSelect
            control={form.control}
            label='Ед. изм.'
            name='unitId'
            options={unitsQuery.data?.map(unit => ({
              label: unitPrettyPrint(unit),
              value: unit.id,
            })) || []}
            placeholder='Выбор'
            formControlWrapper={p => <div className='flex items-center gap-3' {...p} />}
            rightSlot={
              <ModalUnitUpsert onSuccess={unitId => void setTimeout(() => form.setValue('unitId', unitId, SET_VALUE_DEFAULT_OPTIONS))}>
                <Button size='icon' variant='outline'>
                  <Iconify icon={Icon.AddPlus} />
                </Button>
              </ModalUnitUpsert>
            }
          />
        </div>

        <FormSelect
          control={form.control}
          name='categoryId'
          options={categoriesQuery.data?.map(category => ({
            label: category.name,
            value: category.id,
          })) || []}
          placeholder={getFieldPlaceholder(FormSchema, 'categoryId')}
          label='Категория'
          formControlWrapper={p => <div className='flex items-center gap-3' {...p} />}
          rightSlot={
            <ModalCategoryUpsert onSuccess={categoryId => void setTimeout(() => form.setValue('categoryId', categoryId, SET_VALUE_DEFAULT_OPTIONS))}>
              <Button size='icon' variant='outline'>
                <Iconify icon={Icon.AddPlus} />
              </Button>
            </ModalCategoryUpsert>
          }
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
                    placeholder={getFieldPlaceholder(FormSchema, 'tagIds')}
                  />
                </FormControl>

                <ModalTagUpsert onSuccess={tagId => form.setValue('tagIds', (field.value || []).concat(tagId), SET_VALUE_DEFAULT_OPTIONS)}>
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
  unitPrice: 0,
  description: '',
  categoryId: '',
  tagIds: [],
  unitId: '',
  isHidden: false,
};
