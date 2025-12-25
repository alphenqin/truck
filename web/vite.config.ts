import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

const prefix = `monaco-editor/esm/vs`;

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes(`${prefix}/language/typescript/ts.worker`)) return 'tsWorker';
          if (id.includes(`${prefix}/editor/editor.worker`)) return 'editorWorker';
          if (id.includes('/src/pages/Login')) return 'route-login';
          if (id.includes('/src/LayOut')) return 'route-layout';
          if (id.includes('/src/pages/NotFond')) return 'route-notfound';
          return undefined;
        },
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
      },
      plugins: [viteCompression()],
    },
    target: ['esnext'],
    terserOptions: {
      enclose: false,
      compress: true,
      sourceMap: false,
    },
  },
  server: {
    proxy: {
      '/cms': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  preview: {
    proxy: {
      '/cms': {
        target: 'http://127.124.28.77:8081',
        changeOrigin: true,
      },
    },
  },
});
