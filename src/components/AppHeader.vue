<template>
  <header class="header">
    <div class="header-inner">
      <img class="logo" src="@/assets/logo.png" alt="GogoTaxi" />
      <button type="button" class="logout-btn" @click="handleLogout">로그아웃</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { logout } from '@/services/auth'

const router = useRouter()

function handleLogout() {
  logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-h);
  background: #fdd651;
  border-bottom: 1px solid #f0b400;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  z-index: 10;
}
.header-inner {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo {
  height: 46px;
  object-fit: contain;
}
.logout-btn {
  position: absolute;
  right: 16px;
  padding: 6px 14px;
  border-radius: 999px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: #6a4b00;
  background: #ffe27a;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}
.logout-btn:active {
  transform: translateY(1px);
}
</style>
