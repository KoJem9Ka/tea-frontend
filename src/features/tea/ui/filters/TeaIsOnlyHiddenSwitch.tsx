import { useId } from 'react';
import { TeaFiltersStore } from '@/features/tea/tea-filters.store';
import { useSignals } from '@/shared/backbone/signals.ts';
import { Label } from '@/shared/components/ui/label.tsx';
import { Switch } from '@/shared/components/ui/switch.tsx';


export function TeaIsOnlyHiddenSwitch() {
  useSignals();
  const id = useId();

  const isChecked = TeaFiltersStore.filter.isOnlyHidden ?? false;
  const onCheckedChange = (value: boolean) => TeaFiltersStore.setIsOnlyHidden(value || null);

  return (
    <Label htmlFor={id} className='border flex flex-row items-center justify-between rounded-md shadow-xs px-3 py-2 cursor-pointer'>
      <span>Показать скрытые</span>
      <Switch
        id={id}
        checked={isChecked}
        onCheckedChange={onCheckedChange}
      />
    </Label>
  );
}
