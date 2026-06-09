import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// externals
const externals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@assets/selectors':
    'https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/@assets/selectors/index.js',
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: Object.keys(externals),
    },
  },
  plugins: [react()],
  server: {
    port: 8080,
  },
  define: {
    global: {},
  },
  resolve: {
    alias: {
      '@assets/selectors': externals['@assets/selectors'],
    },
  },
});
