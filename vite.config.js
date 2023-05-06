import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    Local: 'localhost', // 将 host 设置为 0.0.
    port: 8080, // 将运行端口设置为 8080
  },
})
