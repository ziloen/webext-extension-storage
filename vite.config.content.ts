import glob from 'fast-glob'
import { sep } from 'node:path'
import { defineConfig } from 'vite'
import packageJson from './package.json'
import { isDev, r } from './scripts/utils'
import { sharedConfig } from './vite.config'

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  define: {
    __DEV__: isDev,
    // https://github.com/vitejs/vite/issues/9320
    // https://github.com/vitejs/vite/issues/9186
    'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production')
  },
  build: {
    watch: null,
    outDir: r('extension/dist/contentScripts'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: glob.sync(r('src/contentScripts', '*.ts').replaceAll(sep, '/')),
      name: packageJson.name,
      formats: ['es']
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      }
    }
  }
})
