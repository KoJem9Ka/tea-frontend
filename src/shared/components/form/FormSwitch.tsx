import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from '@/shared/components/ui/form.tsx'
import { Switch } from '@/shared/components/ui/switch.tsx';


export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label, description,
  isReverse,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  label?: string,
  description?: string,
  isReverse?: boolean,
}) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='border flex flex-row items-center justify-between rounded-md shadow-xs px-3 py-2 cursor-pointer'>
            <div>
              <span>{label}</span>
              {description ? <FormDescription>{description}</FormDescription> : null}
            </div>

            <FormControl>
              <Switch
                checked={isReverse ? !field.value : !!field.value}
                onCheckedChange={isReverse ? (value) => field.onChange(!value) : field.onChange}
              />
            </FormControl>
          </FormLabel>
        </FormItem>
      )}
    />
  );
}
