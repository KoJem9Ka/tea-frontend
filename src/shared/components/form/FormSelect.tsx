import { type FC, Fragment, type PropsWithChildren, type ReactNode } from 'react';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'


export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  options,
  placeholder,
  rightSlot,
  formControlWrapper: FormControlWrapper = Fragment,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  label?: string;
  options: { label: string, value: string }[];
  placeholder?: string;
  rightSlot?: ReactNode;
  formControlWrapper?: FC<PropsWithChildren>;
}) {
  return (
    <FormField
      {...props}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControlWrapper>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger aria-invalid={fieldState.invalid} className='w-full'>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            {rightSlot}
          </FormControlWrapper>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
