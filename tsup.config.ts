import { defineConfig } from 'tsup'

export default defineConfig([
  {
    dts: true,
    clean: true,
    format: ['esm', 'cjs'],
    entry: {
      index: './src/index.ts',
      class: './src/class.ts',
    },
    external: ['vite', 'esbuild'],
    outDir: 'dist',
  },
  {
    format: ['esm'],
    entry: {
      'index.min': './src/index.ts',
      'class.min': './src/class.ts',
    },
    minify: true,
    splitting: false,
    external: ['vite', 'esbuild'],
    outDir: 'dist',
  },
])
