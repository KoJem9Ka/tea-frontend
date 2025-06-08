import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import type { IMaskMixinProps } from 'react-imask/mixin';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/components/ui/form'
import { inputCva } from '@/shared/components/ui/input';


export function FormCurrencyRubblesInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ label, placeholder, ...props }: Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  label?: string;
  placeholder?: string;
}) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <IMaskInput
              className={inputCva()}
              placeholder={placeholder}
              {...field}
              value={`${field.value}`}
              onChange={undefined}
              ref={field.ref}
              {...imaskConfig}
              inputMode='decimal'
              onAccept={(value) => field.onChange(+value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const imaskConfig = {
  unmask: true,
  mask: 'num ₽',
  lazy: false,
  normalizeZeros: true,
  blocks: {
    num: {
      mask: Number,
      thousandsSeparator: ' ',
    },
  },
} satisfies IMaskMixinProps<HTMLInputElement>;
