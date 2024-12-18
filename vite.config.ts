import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  ssr: {
    noExternal:
      process.env.NODE_ENV === 'production'
        ? [
            /^\@radix-ui/,
            'pino',
            'pino-pretty',
            '@logtail/pino',
            /^pino$/,
            /^pino\-pretty$/,
            /^@logtail\/pino$/,
            'colorette',
            'dateformat',
            'fast-copy',
            'fast-safe-stringify',
            'help-me',
            'joycon',
            'minimist',
            'on-exit-leak-free',
            'pino-abstract-transport',
            'pump',
            'readable-stream',
            'secure-json-parse',
            'sonic-boom',
            'strip-json-comments',
            'posthog-js',
            '@radix-ui/react-compose-refs',
            'react-dropzone',
            'react-currency-input-field',
            'vaul',
            '@project-serum/anchor',
          ]
        : [
            '@radix-ui/react-compose-refs',
            /^\@radix-ui/,
            'react-dropzone',
            'react-currency-input-field',
            'vaul',
            '@project-serum/anchor',
          ],
  },
  plugins: [
    nodePolyfills({ include: ['buffer'] }),
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
  build: {
    target: 'esnext',
  },
  esbuild: {
    supported: {
      'top-level-await': true, //browsers can handle top-level-await features
    },
  },
});
