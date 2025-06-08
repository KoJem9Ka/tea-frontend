import { deepSignal } from '@/shared/backbone/signals';


type FiltersDropdownStoreRaw = {
  isDropdownOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: VoidFunction;
};
type FiltersDropdownStore = Readonly<FiltersDropdownStoreRaw>

function createFiltersDropdownStore(): FiltersDropdownStore {
  const store = deepSignal<FiltersDropdownStoreRaw>({
    isDropdownOpen: false,
    setIsOpen(isOpen: boolean) {
      store.isDropdownOpen = isOpen;
    },
    toggle() {
      store.isDropdownOpen = !store.isDropdownOpen;
    },
  }, 'FiltersDropdownStore');

  return store;
}

export const FiltersDropdownStore = createFiltersDropdownStore();
