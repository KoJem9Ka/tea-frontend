import { zodResolver } from '@hookform/resolvers/zod';
import { cloneDeep, merge } from 'lodash-es';
import { type PropsWithChildren, useMemo } from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { type z } from 'zod/v4';
import { useUnitUpsertMutation } from '@/features/unit/hooks/useUnitUpsertMutation';
import { UnitUpsertReqArgs } from '@/features/unit/unit.api';
import { type Unit, unitPrettyPrint, WeightUnitEnum, weightUnitPrettyPrintMap } from '@/shared/backbone/backend/model/unit';
import { FormNumberInput } from '@/shared/components/form/FormNumberInput.tsx';
import { FormSelect } from '@/shared/components/form/FormSelect.tsx';
import { FormSwitch } from '@/shared/components/form/FormSwitch.tsx';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { ResponsiveDialog } from '@/shared/components/ResponsiveDialog';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { FormProvider } from '@/shared/components/ui/form';
import { DEFAULT_ERROR_MESSAGE } from '@/shared/constants';
import { useAbortController } from '@/shared/hooks/useAbortSignal.ts';
import type { MaybePromise } from '@/shared/types/types.ts';


type OnSuccessFn = (unitId: string) => MaybePromise;

export function ModalUnitUpsert({
  children,
  onSuccess,
  defaultValues,
}: PropsWithChildren<{
  onSuccess?: OnSuccessFn;
  defaultValues?: Unit;
}>) {
  const [successUpsertSignal, onSuccessUpsert] = useAbortController();

  const _onSuccess: OnSuccessFn = async (unitId) => {
    onSuccessUpsert();
    await onSuccess?.(unitId);
  };

  return (
    <ResponsiveDialog
      signal={successUpsertSignal}
      title={defaultValues ? 'Редактирование ед. изм.' : 'Новая ед. изм.'}
      triggerSlot={children}
      formSlot={<UnitUpsertForm defaultValues={defaultValues} onSuccess={_onSuccess} />}
    />
  );
}


const FormSchema = UnitUpsertReqArgs;
type FormSchema = z.infer<typeof FormSchema>;

function UnitUpsertForm({ onSuccess, defaultValues: defaultValuesRaw }: {
  onSuccess?: OnSuccessFn;
  defaultValues?: Unit;
}) {
  const m = useUnitUpsertMutation();

  const defaultValues = useMemo(() => merge(cloneDeep(DEFAULT_VALUES), defaultValuesRaw), [defaultValuesRaw]);

  const form = useForm<FormSchema>({ resolver: zodResolver(FormSchema), defaultValues });

  const handleSubmit = form.handleSubmit(async (data: FormSchema) => {
    const res = await m.mutateAsync(data);
    await onSuccess?.(res.id);
  }) as VoidFunction;

  return (
    <FormProvider {...form}>
      <form className='space-y-4'>
        <UnitVisualized control={form.control} />

        <div className='grid grid-cols-[1fr_auto] items-start gap-3'>
          <FormNumberInput
            control={form.control}
            name='value'
            label='Вес'
          />

          <FormSelect
            control={form.control}
            name='weightUnit'
            label='Ед. изм.'
            options={Object.values(WeightUnitEnum).map(v => ({ label: weightUnitPrettyPrintMap[v], value: v }))}
          />
        </div>

        <FormSwitch
          control={form.control}
          name='isApiece'
          label='Поштучно'
        />

        {m.isError ? (
          <Alert variant='destructive'>
            <Iconify icon={Icon.Danger} />
            <AlertTitle>Не удалось сохранить ед. изм.</AlertTitle>
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
  isApiece: false,
  weightUnit: WeightUnitEnum.G,
  value: 0,
};

function UnitVisualized({ control }: {
  control: ReturnType<typeof useForm<FormSchema>>['control'];
}) {
  const unit = useWatch({ control }) as UnitUpsertReqArgs;
  const state = useFormState({ control });

  return (
    <div className='text-center'>
      {state.isValid ? unitPrettyPrint(unit)
        : state.isDirty ? 'Неверные данные'
          : 'Заполните форму'}
    </div>
  );
}
