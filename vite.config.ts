import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import glsl from 'vite-plugin-glsl';
import alias from '@rollup/plugin-alias';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true }), glsl()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'ReactMeshGradient',
      fileName: (format) => `react-mesh-gradient.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'THREE'],
      plugins: [
        postcss({
          extract: true,
          modules: true,
          plugins: []
        }),
        alias({
          entries: [
            { find: 'THREE', replacement: './src/three-exports.ts' }
          ]
        })
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
});
