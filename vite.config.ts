/// <reference types="vitest" />

import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { dirname, relative } from 'node:path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import type { Plugin, UserConfig } from 'vite'
import { defineConfig } from 'vite'
import { isDev, port, r } from './scripts/utils'

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`
    }
  },

  define: {
    __DEV__: isDev
  },

  plugins: [
    Vue(),

    vueJsx({}),

    AutoImport({
      imports: [
        'vue',
        {
          'webextension-polyfill': [
            ['default', 'browser']
          ]
        }
      ],
      dts: r('src/types/auto-imports.d.ts'),
      ignoreDts: ['browser']
    }) as Plugin,

    // https://github.com/antfu/unplugin-icons
    Icons(),

    // https://github.com/unocss/unocss
    UnoCSS(),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
      }
    }
  ],
  optimizeDeps: {
    include: [
      'vue',
      '@vueuse/core',
      'webextension-polyfill'
    ]
  }
}

export default defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
  server: {
    port,
    strictPort: true,
    hmr: {
      host: 'localhost'
    }
  },
  build: {
    outDir: r('extension/dist'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false
    },
    rollupOptions: {
      input: {
        devtools: r('src/devtools/index.html'),
        panel: r('src/devtools/panel/index.html'),
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
}))
