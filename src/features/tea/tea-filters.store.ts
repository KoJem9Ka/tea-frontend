import { type DeepSignal, shallow, type Shallow } from 'deepsignal/react';
import { cloneDeep, isEqual } from 'lodash-es';
import type { SetRequired } from 'type-fest';
import { AuthStore } from '@/features/auth';
import type { TeasListFilterServePrice, TeasListFilterSortBy, TeasListReqQueryFilters } from '@/features/tea/tea.api';
import { batch, deepSignal, effect } from '@/shared/backbone/signals';
import { Ms } from '@/shared/lib/independent/ms';


type TeaFiltersStoreRaw = {
  filter: SetRequired<TeasListReqQueryFilters, 'sortBy' | 'isAsc'>,
  filterDebounced: Shallow<TeasListReqQueryFilters>,
  // isFilterNameEmpty: boolean,
  isFilterEmpty: boolean,

  setName: (name: string | null) => void,
  setCategoryId: (categoryId: string | null) => void,
  setTags: (tagsIds: string[] | null) => void,
  setServePrice: (servePrice: TeasListFilterServePrice | null) => void,
  setSortBy: (sortBy: TeasListFilterSortBy | null) => void,
  setIsAsc: (isAsc: boolean | null) => void,
  setIsOnlyFavourite: (isOnlyFavourite: boolean | null) => void,
  setIsOnlyHidden: (isOnlyHidden: boolean | null) => void,

  clear: VoidFunction,
  dispose: VoidFunction,
};
type TeaFiltersStore = DeepSignal<Readonly<TeaFiltersStoreRaw>>


const DEFAULT_FILTER = {
  sortBy: 'name',
  isAsc: true,
} as const satisfies TeaFiltersStoreRaw['filter'];

const createDefaultFilter = (): TeaFiltersStoreRaw['filter'] => cloneDeep(DEFAULT_FILTER);


function createTeaFiltersStore(): TeaFiltersStore {
  let isDebounceEnabled = true;

  const store = deepSignal<TeaFiltersStoreRaw>({
    filter: createDefaultFilter(),
    filterDebounced: shallow(createDefaultFilter()),

    // get isFilterNameEmpty(): boolean {
    //   return !this.filter.name?.trim();
    // },
    get isFilterEmpty(): boolean {
      return isEqual(this.filter, DEFAULT_FILTER);
    },

    setName(name) {
      if (name) store.filter.name = name;
      else delete store.filter.name;
    },
    setCategoryId(categoryId) {
      if (categoryId) store.filter.categoryId = categoryId;
      else delete store.filter.categoryId;
    },
    setTags(tagsIds) {
      if (tagsIds && tagsIds.length > 0) store.filter.tags = tagsIds;
      else delete store.filter.tags;
    },
    setServePrice(servePrice) {
      if (servePrice) store.filter.servePrice = servePrice;
      else delete store.filter.servePrice;
    },
    setSortBy(sortBy) {
      batch(() => {
        if (sortBy) {
          store.filter.sortBy = sortBy;
          store.filter.isAsc = sortBy !== 'rating';
        } else {
          store.filter.sortBy = DEFAULT_FILTER.sortBy;
          store.filter.isAsc = DEFAULT_FILTER.isAsc;
        }
      });
    },
    setIsAsc(isAsc) {
      if (isAsc !== null) store.filter.isAsc = isAsc;
      else store.filter.isAsc = DEFAULT_FILTER.isAsc;
    },
    setIsOnlyFavourite(isFavourite) {
      if (isFavourite !== null) store.filter.isOnlyFavourite = isFavourite;
      else delete store.filter.isOnlyFavourite;
    },
    setIsOnlyHidden(isDeleted) {
      if (isDeleted !== null) store.filter.isOnlyHidden = isDeleted;
      else delete store.filter.isOnlyHidden;
    },

    clear() {
      isDebounceEnabled = false;
      batch(() => {
        store.filter = createDefaultFilter();
        store.filterDebounced = shallow(createDefaultFilter());
      });
      isDebounceEnabled = true;
    },
    dispose() {
      dispose1();
      dispose2();
    },
  }, 'TeaFiltersStore');

  const dispose1 = effect(() => {
    const cloned = cloneDeep(store.filter);
    if (!isDebounceEnabled) return;
    const timeout = setTimeout(() => store.filterDebounced = shallow(cloned), Ms.second(0.5));
    return () => clearTimeout(timeout);
  });

  const dispose2 = AuthStore.$isAuthorized!.subscribe(() => {
    if (store.isFilterEmpty) return;
    store.clear();
  });

  return store;
}

export const TeaFiltersStore = createTeaFiltersStore();
