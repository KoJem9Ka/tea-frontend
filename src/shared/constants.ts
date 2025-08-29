import type { SetValueConfig } from 'react-hook-form';


// TODO: Make errors more informative and create FriendlyError class
export const DEFAULT_ERROR_MESSAGE = 'Попробуйте обновить страницу или повторите позднее';


export const SET_VALUE_DEFAULT_OPTIONS = { shouldDirty: true, shouldValidate: true, shouldTouch: true } satisfies SetValueConfig;
