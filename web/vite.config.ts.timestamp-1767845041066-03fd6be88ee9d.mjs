// vite.config.ts
import { defineConfig } from "file:///mnt/d/projects/truck/web/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/d/projects/truck/web/node_modules/@vitejs/plugin-react/dist/index.js";
import viteCompression from "file:///mnt/d/projects/truck/web/node_modules/vite-plugin-compression/dist/index.mjs";
var prefix = `monaco-editor/esm/vs`;
var vite_config_default = defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  optimizeDeps: {
    // 预构建更多常用依赖，加速首次加载
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "antd",
      "@ant-design/icons",
      "ahooks",
      "axios",
      "dayjs",
      "classnames",
      "react-redux",
      "@reduxjs/toolkit",
      "echarts",
      "echarts-for-react",
      "react-transition-group"
    ],
    // 排除不需要预构建的大型依赖
    exclude: ["monaco-editor"]
  },
  build: {
    // 关闭 modulepreload，避免跨 chunk 的预加载助手形成循环依赖
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes(`${prefix}/language/typescript/ts.worker`)) return "tsWorker";
          if (id.includes(`${prefix}/editor/editor.worker`)) return "editorWorker";
          if (id.includes("node_modules/monaco-editor")) return "vendor-monaco";
          if (id.includes("node_modules/echarts")) return "vendor-echarts";
          if (id.includes("/node_modules/@antv/") || id.includes("/node_modules/@ant-design/plots/") || id.includes("/node_modules/@ant-design/charts/")) {
            return "vendor-charts";
          }
          if (id.includes("node_modules")) return "vendor-core";
          if (id.includes("/src/pages/Login")) return "route-login";
          if (id.includes("/src/LayOut")) return "route-layout";
          if (id.includes("/src/pages/NotFond")) return "route-notfound";
          return void 0;
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "[ext]/[name]-[hash].[ext]"
      },
      plugins: [viteCompression()]
    },
    target: ["esnext"],
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 设置 chunk 大小警告阈值
    chunkSizeWarningLimit: 1e3,
    terserOptions: {
      enclose: false,
      compress: true,
      sourceMap: false
    }
  },
  server: {
    // 预热更多文件，加速首次加载
    warmup: {
      clientFiles: [
        "/src/main.tsx",
        "/src/App.tsx",
        "/src/router/index.tsx",
        "/src/pages/Login/index.tsx",
        "/src/LayOut/index.tsx",
        "/src/store/index.ts",
        "/src/styles/index.css"
      ]
    },
    proxy: {
      "/cms": {
        target: "http://localhost:8081",
        changeOrigin: true
      }
    }
  },
  // CSS 配置
  css: {
    devSourcemap: false
    // 开发环境禁用 CSS sourcemap 提升速度
  },
  preview: {
    proxy: {
      "/cms": {
        target: "http://127.124.28.77:8081",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2QvcHJvamVjdHMvdHJ1Y2svd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvbW50L2QvcHJvamVjdHMvdHJ1Y2svd2ViL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9tbnQvZC9wcm9qZWN0cy90cnVjay93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcblxuY29uc3QgcHJlZml4ID0gYG1vbmFjby1lZGl0b3IvZXNtL3ZzYDtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTogJy8nLFxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiAnL3NyYycsXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgLy8gXHU5ODg0XHU2Nzg0XHU1RUZBXHU2NkY0XHU1OTFBXHU1RTM4XHU3NTI4XHU0RjlEXHU4RDU2XHVGRjBDXHU1MkEwXHU5MDFGXHU5OTk2XHU2QjIxXHU1MkEwXHU4RjdEXG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3JlYWN0JyxcbiAgICAgICdyZWFjdC1kb20nLFxuICAgICAgJ3JlYWN0LXJvdXRlci1kb20nLFxuICAgICAgJ2FudGQnLFxuICAgICAgJ0BhbnQtZGVzaWduL2ljb25zJyxcbiAgICAgICdhaG9va3MnLFxuICAgICAgJ2F4aW9zJyxcbiAgICAgICdkYXlqcycsXG4gICAgICAnY2xhc3NuYW1lcycsXG4gICAgICAncmVhY3QtcmVkdXgnLFxuICAgICAgJ0ByZWR1eGpzL3Rvb2xraXQnLFxuICAgICAgJ2VjaGFydHMnLFxuICAgICAgJ2VjaGFydHMtZm9yLXJlYWN0JyxcbiAgICAgICdyZWFjdC10cmFuc2l0aW9uLWdyb3VwJyxcbiAgICBdLFxuICAgIC8vIFx1NjM5Mlx1OTY2NFx1NEUwRFx1OTcwMFx1ODk4MVx1OTg4NFx1Njc4NFx1NUVGQVx1NzY4NFx1NTkyN1x1NTc4Qlx1NEY5RFx1OEQ1NlxuICAgIGV4Y2x1ZGU6IFsnbW9uYWNvLWVkaXRvciddLFxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIFx1NTE3M1x1OTVFRCBtb2R1bGVwcmVsb2FkXHVGRjBDXHU5MDdGXHU1MTREXHU4REU4IGNodW5rIFx1NzY4NFx1OTg4NFx1NTJBMFx1OEY3RFx1NTJBOVx1NjI0Qlx1NUY2Mlx1NjIxMFx1NUZBQVx1NzNBRlx1NEY5RFx1OEQ1NlxuICAgIG1vZHVsZVByZWxvYWQ6IGZhbHNlLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IChpZCkgPT4ge1xuICAgICAgICAgIC8vIE1vbmFjbyBFZGl0b3IgXHU1MjA2XHU1NzU3XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKGAke3ByZWZpeH0vbGFuZ3VhZ2UvdHlwZXNjcmlwdC90cy53b3JrZXJgKSkgcmV0dXJuICd0c1dvcmtlcic7XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKGAke3ByZWZpeH0vZWRpdG9yL2VkaXRvci53b3JrZXJgKSkgcmV0dXJuICdlZGl0b3JXb3JrZXInO1xuICAgICAgICAgIC8vIE1vbmFjbyBFZGl0b3JcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yJykpIHJldHVybiAndmVuZG9yLW1vbmFjbyc7XG4gICAgICAgICAgLy8gRUNoYXJ0cyBcdTUzNTVcdTcyRUNcdTUyMDZcdTU3NTdcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9lY2hhcnRzJykpIHJldHVybiAndmVuZG9yLWVjaGFydHMnO1xuICAgICAgICAgIC8vIEFudFYgXHU1NkZFXHU4ODY4XHU3NkY4XHU1MTczXHU1MzU1XHU3MkVDXHU1MjA2XHU1NzU3XHVGRjBDXHU5MDdGXHU1MTREXHU0RTBFXHU1MTY1XHU1M0UzIGNodW5rIFx1NUY2Mlx1NjIxMFx1NUZBQVx1NzNBRlx1NEY5RFx1OEQ1NlxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGlkLmluY2x1ZGVzKCcvbm9kZV9tb2R1bGVzL0BhbnR2LycpIHx8XG4gICAgICAgICAgICBpZC5pbmNsdWRlcygnL25vZGVfbW9kdWxlcy9AYW50LWRlc2lnbi9wbG90cy8nKSB8fFxuICAgICAgICAgICAgaWQuaW5jbHVkZXMoJy9ub2RlX21vZHVsZXMvQGFudC1kZXNpZ24vY2hhcnRzLycpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1jaGFydHMnO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBcdTUxNzZcdTRGNTlcdTdCMkNcdTRFMDlcdTY1QjlcdTdFREZcdTRFMDBcdTU0MDhcdTVFNzZcdUZGMENcdTkwN0ZcdTUxNEQgdmVuZG9yIFx1NEU0Qlx1OTVGNFx1NEU5Mlx1NzZGOFx1NUYxNVx1NzUyOFx1OTAyMFx1NjIxMFx1NUZBQVx1NzNBRlx1NEY5RFx1OEQ1NlxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHJldHVybiAndmVuZG9yLWNvcmUnO1xuICAgICAgICAgIC8vIFx1OERFRlx1NzUzMVx1OTg3NVx1OTc2Mlx1NTIwNlx1NTc1N1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3NyYy9wYWdlcy9Mb2dpbicpKSByZXR1cm4gJ3JvdXRlLWxvZ2luJztcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9zcmMvTGF5T3V0JykpIHJldHVybiAncm91dGUtbGF5b3V0JztcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9zcmMvcGFnZXMvTm90Rm9uZCcpKSByZXR1cm4gJ3JvdXRlLW5vdGZvdW5kJztcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9LFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF0nLFxuICAgICAgfSxcbiAgICAgIHBsdWdpbnM6IFt2aXRlQ29tcHJlc3Npb24oKV0sXG4gICAgfSxcbiAgICB0YXJnZXQ6IFsnZXNuZXh0J10sXG4gICAgLy8gXHU1NDJGXHU3NTI4IENTUyBcdTRFRTNcdTc4MDFcdTUyMDZcdTUyNzJcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgLy8gXHU4QkJFXHU3RjZFIGNodW5rIFx1NTkyN1x1NUMwRlx1OEI2Nlx1NTQ0QVx1OTYwOFx1NTAzQ1xuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBlbmNsb3NlOiBmYWxzZSxcbiAgICAgIGNvbXByZXNzOiB0cnVlLFxuICAgICAgc291cmNlTWFwOiBmYWxzZSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICAvLyBcdTk4ODRcdTcwRURcdTY2RjRcdTU5MUFcdTY1ODdcdTRFRjZcdUZGMENcdTUyQTBcdTkwMUZcdTk5OTZcdTZCMjFcdTUyQTBcdThGN0RcbiAgICB3YXJtdXA6IHtcbiAgICAgIGNsaWVudEZpbGVzOiBbXG4gICAgICAgICcvc3JjL21haW4udHN4JyxcbiAgICAgICAgJy9zcmMvQXBwLnRzeCcsXG4gICAgICAgICcvc3JjL3JvdXRlci9pbmRleC50c3gnLFxuICAgICAgICAnL3NyYy9wYWdlcy9Mb2dpbi9pbmRleC50c3gnLFxuICAgICAgICAnL3NyYy9MYXlPdXQvaW5kZXgudHN4JyxcbiAgICAgICAgJy9zcmMvc3RvcmUvaW5kZXgudHMnLFxuICAgICAgICAnL3NyYy9zdHlsZXMvaW5kZXguY3NzJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBwcm94eToge1xuICAgICAgJy9jbXMnOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgLy8gQ1NTIFx1OTE0RFx1N0Y2RVxuICBjc3M6IHtcbiAgICBkZXZTb3VyY2VtYXA6IGZhbHNlLCAvLyBcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTc5ODFcdTc1MjggQ1NTIHNvdXJjZW1hcCBcdTYzRDBcdTUzNDdcdTkwMUZcdTVFQTZcbiAgfSxcbiAgcHJldmlldzoge1xuICAgIHByb3h5OiB7XG4gICAgICAnL2Ntcyc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzEyNy4xMjQuMjguNzc6ODA4MScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UCxTQUFTLG9CQUFvQjtBQUMxUixPQUFPLFdBQVc7QUFDbEIsT0FBTyxxQkFBcUI7QUFFNUIsSUFBTSxTQUFTO0FBRWYsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBO0FBQUEsSUFFWixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLFNBQVMsQ0FBQyxlQUFlO0FBQUEsRUFDM0I7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsZUFBZTtBQUFBLElBQ2YsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYyxDQUFDLE9BQU87QUFFcEIsY0FBSSxHQUFHLFNBQVMsR0FBRyxNQUFNLGdDQUFnQyxFQUFHLFFBQU87QUFDbkUsY0FBSSxHQUFHLFNBQVMsR0FBRyxNQUFNLHVCQUF1QixFQUFHLFFBQU87QUFFMUQsY0FBSSxHQUFHLFNBQVMsNEJBQTRCLEVBQUcsUUFBTztBQUV0RCxjQUFJLEdBQUcsU0FBUyxzQkFBc0IsRUFBRyxRQUFPO0FBRWhELGNBQ0UsR0FBRyxTQUFTLHNCQUFzQixLQUNsQyxHQUFHLFNBQVMsa0NBQWtDLEtBQzlDLEdBQUcsU0FBUyxtQ0FBbUMsR0FDL0M7QUFDQSxtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJLEdBQUcsU0FBUyxjQUFjLEVBQUcsUUFBTztBQUV4QyxjQUFJLEdBQUcsU0FBUyxrQkFBa0IsRUFBRyxRQUFPO0FBQzVDLGNBQUksR0FBRyxTQUFTLGFBQWEsRUFBRyxRQUFPO0FBQ3ZDLGNBQUksR0FBRyxTQUFTLG9CQUFvQixFQUFHLFFBQU87QUFDOUMsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLE1BQ0EsU0FBUyxDQUFDLGdCQUFnQixDQUFDO0FBQUEsSUFDN0I7QUFBQSxJQUNBLFFBQVEsQ0FBQyxRQUFRO0FBQUE7QUFBQSxJQUVqQixjQUFjO0FBQUE7QUFBQSxJQUVkLHVCQUF1QjtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNiLFNBQVM7QUFBQSxNQUNULFVBQVU7QUFBQSxNQUNWLFdBQVc7QUFBQSxJQUNiO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBO0FBQUEsSUFFTixRQUFRO0FBQUEsTUFDTixhQUFhO0FBQUEsUUFDWDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxLQUFLO0FBQUEsSUFDSCxjQUFjO0FBQUE7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
