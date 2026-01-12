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
  optimizeDeps: {
    // 预构建更多常用依赖，加速首次加载
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      '@ant-design/icons',
      'ahooks',
      'axios',
      'dayjs',
      'classnames',
      'react-redux',
      '@reduxjs/toolkit',
      'echarts',
      'echarts-for-react',
      'react-transition-group',
    ],
    // 排除不需要预构建的大型依赖
    exclude: ['monaco-editor'],
  },
  build: {
    // 关闭 modulepreload，避免跨 chunk 的预加载助手形成循环依赖
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Monaco Editor 分块
          if (id.includes(`${prefix}/language/typescript/ts.worker`)) return 'tsWorker';
          if (id.includes(`${prefix}/editor/editor.worker`)) return 'editorWorker';
          // Monaco Editor
          if (id.includes('node_modules/monaco-editor')) return 'vendor-monaco';
          // ECharts 单独分块
          if (id.includes('node_modules/echarts')) return 'vendor-echarts';
          // AntV 图表相关单独分块，避免与入口 chunk 形成循环依赖
          if (
            id.includes('/node_modules/@antv/') ||
            id.includes('/node_modules/@ant-design/plots/') ||
            id.includes('/node_modules/@ant-design/charts/')
          ) {
            return 'vendor-charts';
          }
          // 其余第三方统一合并，避免 vendor 之间互相引用造成循环依赖
          if (id.includes('node_modules')) return 'vendor-core';
          // 路由页面分块
          if (id.includes('/src/pages/Login')) return 'route-login';
          if (id.includes('/src/LayOut')) return 'route-layout';
          if (id.includes('/src/pages/NotFond')) return 'route-notfound';
          return undefined;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
      },
      plugins: [viteCompression()],
    },
    target: ['esnext'],
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 设置 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      enclose: false,
      compress: true,
      sourceMap: false,
    },
  },
  server: {
    // 预热更多文件，加速首次加载
    warmup: {
      clientFiles: [
        '/src/main.tsx',
        '/src/App.tsx',
        '/src/router/index.tsx',
        '/src/pages/Login/index.tsx',
        '/src/LayOut/index.tsx',
        '/src/store/index.ts',
        '/src/styles/index.css',
      ],
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/cms': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  // CSS 配置
  css: {
    devSourcemap: false, // 开发环境禁用 CSS sourcemap 提升速度
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
