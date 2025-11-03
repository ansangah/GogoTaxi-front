// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/pages/Home/MainPage.vue'

const routes = [
  { path: '/', name: 'home', component: MainPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
