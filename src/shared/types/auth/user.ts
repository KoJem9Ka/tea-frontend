import { z } from 'zod/v4';
import { AccessTokenDecoded } from '@/shared/backbone/backend/backend-client.ts';
import { TelegramUserDataFromWidget } from '@/shared/types/auth/telegram-user-data-from-widget.ts';


export const User = z.object({
  telegram: TelegramUserDataFromWidget,
  accessToken: z.string(),
  accessTokenDecoded: AccessTokenDecoded,
});
export type User = z.infer<typeof User>;
