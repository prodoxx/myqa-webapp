import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { installGlobals } from '@remix-run/node';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

installGlobals();

export default defineConfig({
  ssr: {
    noExternal: process.env.NODE_ENV === 'production' ? true : [],
  },
  resolve: {
    alias: {
      'msw/native': resolve(
        resolve(__dirname, './node_modules/msw/lib/native/index.mjs')
      ),
      'msw/browser': resolve(
        resolve(__dirname, './node_modules/msw/lib/browser/index.mjs')
      ),
    },
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [
    nodePolyfills({
      include:
        process.env.NODE_ENV === 'production'
          ? ['buffer']
          : ['buffer', 'process'],
      globals: {
        process: process.env.NODE_ENV === 'production' ? false : 'dev',
        Buffer: true,
        global: true,
      },
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
});
