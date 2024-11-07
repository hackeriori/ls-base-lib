import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

export default defineConfig({
  server: {
    open: true
  },
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'out/index.ts'),
      name: 'LsBaseLib',
      fileName: (format) => `lsBaseLib.${format}.js`,
      formats: ['es', 'umd'],
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ]
})
