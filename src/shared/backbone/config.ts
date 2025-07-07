import { z } from 'zod/v4';


declare global {
  interface ImportMetaEnv {
    VITE_TELEGRAM_BOT_ID?: string;
    VITE_TELEGRAM_BOT_NAME?: string;
  }
}

const env = z.object({
  // VITE_BACKEND_ORIGIN: z.url().optional(),
  VITE_TELEGRAM_BOT_ID: z.string().nonempty(),
  VITE_TELEGRAM_BOT_NAME: z.string().nonempty(),
}).transform((data) => ({
  // backendOrigin: data.VITE_BACKEND_ORIGIN ? new URL(data.VITE_BACKEND_ORIGIN) : new URL(location.origin),
  telegramBotId: data.VITE_TELEGRAM_BOT_ID,
  telegramBotName: data.VITE_TELEGRAM_BOT_NAME,
})).safeParse({
  // VITE_BACKEND_ORIGIN: import.meta.env.VITE_BACKEND_ORIGIN,
  VITE_TELEGRAM_BOT_ID: clearEnvSubst(import.meta.env.VITE_TELEGRAM_BOT_ID),
  VITE_TELEGRAM_BOT_NAME: clearEnvSubst(import.meta.env.VITE_TELEGRAM_BOT_NAME),
});

function clearEnvSubst(value?: string) {
  return value?.startsWith('${') ? undefined : value;
}

if (!env.success) {
  const error = `Environment incorrect:\n${env.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(';\n')}.`;
  alert(error);
  console.error(error);
  throw new Error(error);
}

export const config = Object.assign({
  appUniqueId: '__TEA_FRONTEND_APP__',
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
  isTest: import.meta.env.TEST,
  isClient: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
  backendOrigin: new URL(location.origin),
}, env.data);
