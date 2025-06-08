import { merge } from 'lodash-es';
import { z } from 'zod/v4';


const env = z.object({
  // VITE_BACKEND_ORIGIN: z.url().optional(),
  VITE_TELEGRAM_BOT_NAME: z.string().min(1),
  VITE_TELEGRAM_BOT_ID: z.string().min(1),
}).transform((data) => ({
  // backendOrigin: data.VITE_BACKEND_ORIGIN ? new URL(data.VITE_BACKEND_ORIGIN) : new URL(location.origin),
  telegramBotName: data.VITE_TELEGRAM_BOT_NAME,
  telegramBotId: data.VITE_TELEGRAM_BOT_ID,
})).safeParse({
  // VITE_BACKEND_ORIGIN: import.meta.env.VITE_BACKEND_ORIGIN,
  VITE_TELEGRAM_BOT_NAME: import.meta.env.VITE_TELEGRAM_BOT_NAME,
  VITE_TELEGRAM_BOT_ID: import.meta.env.VITE_TELEGRAM_BOT_ID,
});

if (!env.success) {
  const error = `Environment incorrect:\n${env.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(';\n')}.`;
  alert(error);
  console.error(error);
  throw new Error(error);
}

export const config = merge({
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
  isTest: import.meta.env.TEST,
  isClient: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
  backendOrigin: new URL(location.origin),
}, env.data);
