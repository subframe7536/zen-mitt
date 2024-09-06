import { defineConfig } from 'tsup'

export default defineConfig({
  dts: true,
  clean: true,
  format: ['esm', 'cjs'],
  entry: {
    index: './src/index.ts',
    class: './src/class.ts',
  },
  external: ['vite', 'esbuild'],
  outDir: 'dist',
})
