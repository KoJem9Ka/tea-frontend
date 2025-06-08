import { TeaFiltersStore } from '@/features/tea/tea-filters.store';
import { useSignals } from '@/shared/backbone/signals.ts';
import { Input } from '@/shared/components/ui/input.tsx';


export function TeaSearchByName() {
  useSignals();

  return (
    <Input
      className='grow'
      value={TeaFiltersStore.filter.name || ''}
      onChange={e => TeaFiltersStore.setName(e.currentTarget.value)}
      placeholder='Поиск по названию'
    />
  );
}
