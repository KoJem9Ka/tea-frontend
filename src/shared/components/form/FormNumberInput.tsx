import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input';


export function FormNumberInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
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
            <Input
              {...field}
              value={Number.isFinite(field.value) ? `${field.value}` : undefined}
              onChange={e => {
                const value = e.currentTarget.value;
                const isEmpty = !value.length;
                const isDecimalStarted = value.endsWith('.');
                if (isEmpty || isDecimalStarted) return field.onChange(NaN);
                field.onChange(+value);
              }}
              inputMode='decimal'
              type='text'
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
