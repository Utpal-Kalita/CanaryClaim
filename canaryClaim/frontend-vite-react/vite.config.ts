import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import tailwindcss from "@tailwindcss/vite"
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
    'process.env': {},
    global: 'globalThis',
  },
  plugins: [
    TanStackRouterVite(),
    nodePolyfills({
      // To add only specific polyfills, add them here.
      // If no specific polyfills are needed, you can leave this empty.
      include: ['buffer', 'process'],
      globals: {
        Buffer: true,
        process: true,
      },
    }),
    wasm(),
    react(),
    // Exclude Spline from the CJS rewriter: its runtime has shader-builder
    // method calls named `require(...)` (e.g. e.require("irradiance")) that this
    // plugin otherwise mis-rewrites into broken `import from "irradiance"`.
    viteCommonjs({ exclude: ['@splinetool'] }),
    topLevelAwait(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Midnight's indexer client imports a named WebSocket export. The
      // isomorphic-ws browser fallback only exposes a default export.
      'isomorphic-ws': path.resolve(__dirname, './src/shims/isomorphic-ws.ts'),
      '@': path.resolve(__dirname, './src'),
      // Add any other aliases you need
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
    exclude: [
      "@midnight-ntwrk/onchain-runtime"
    ],
  },
  build: {
    // Midnight's browser bundle contains top-level await that cannot be
    // downlevelled by the plugin to Vite's legacy default targets.
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Ensure proper handling of Node.js built-ins
      external: [],
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up from the package root
      allow: ['..'],
    },
  },
}))
