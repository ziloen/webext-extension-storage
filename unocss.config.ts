import presetWebFonts from '@unocss/preset-web-fonts'
import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives
} from 'unocss'
import { presetZiloen } from 'unocss-preset-ziloen'

export default defineConfig({
  presets: [
    presetUno(),
    presetZiloen(),
    presetWebFonts({
      provider: "google",
      fonts: {
        mono: ["Fira Code", "JetBrains Mono"]
      }
    }),
    presetIcons(),
  ],
  transformers: [
    transformerDirectives()
  ]
})
