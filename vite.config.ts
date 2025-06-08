import { defineConfig, loadEnv } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { resolve } from 'node:path';


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const isDev = mode === 'development';
  const backendOrigin = env.BACKEND_ORIGIN;

  const errors: string[] = [];
  if (isDev && !backendOrigin) errors.push('BACKEND_ORIGIN must be provided for DEV environment');
  if (!env.VITE_TELEGRAM_BOT_ID) errors.push('VITE_TELEGRAM_BOT_ID must be provided');
  if (!env.VITE_TELEGRAM_BOT_NAME) errors.push('VITE_TELEGRAM_BOT_NAME must be provided');
  if (errors.length) throw new Error(`ENV incorrect:\n${errors.join('\n')}`);

  return {
    plugins: [
      tanstackRouter({
        autoCodeSplitting: true,
        routesDirectory: 'src/app',
      }),
      viteReact(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        // '@telegram-apps/sdk': resolve('node_modules/@telegram-apps/sdk/src'),
      },
    },
    server: {
      allowedHosts: ['.ngrok-free.app', '.pinggy.link', '.serveo.net'],
      proxy: {
        '/api': {
          target: backendOrigin,
          changeOrigin: true,
          secure: false,
          ws: true,
          // configure: (proxy, _options) => {
          //   proxy.on('error', (err, _req, _res) => {
          //     console.log('proxy error', err);
          //   });
          //   proxy.on('proxyReq', (_, req, _res) => {
          //     console.log('Sending Request to the Target:', req.method, req.url);
          //   });
          //   proxy.on('proxyRes', (proxyRes, req, _res) => {
          //     console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          //   });
          // },
        },
      },
    },
  };
});
