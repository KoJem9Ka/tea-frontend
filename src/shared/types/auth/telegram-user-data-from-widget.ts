import { z } from 'zod/v4';


export const TelegramUserDataFromWidget = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.number(),
  hash: z.string(),
});
export type TelegramUserDataFromWidget = z.infer<typeof TelegramUserDataFromWidget>;
