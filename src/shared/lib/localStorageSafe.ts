import { z } from 'zod/v4';
import { config } from '@/shared/backbone/config.ts';
import { makeLocalStorageSafe } from '@/shared/lib/independent/make-local-storage-safe.ts';
import { User } from '@/shared/types/auth/user.ts';
import { Theme } from '@/shared/types/theme.ts';


export const localStorageSafe = makeLocalStorageSafe(config.appUniqueId, {
  authErrorCloses: z.number().positive(),
  theme: Theme,
  user: User,
});
