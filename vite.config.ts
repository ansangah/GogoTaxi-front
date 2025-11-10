// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/GogoTaxi-front/',   // ← 실제 저장소명으로 교체
  plugins: [vue()],
})
