<template>
  <div id="app" class="app-shell">
    <AppHeader />
    <main class="app-content">
      <router-view />
    </main>
    <BottomTab />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import BottomTab from '@/components/BottomTab.vue'
</script>

<style>
:root {
  --header-h: 56px;
  --tab-h: 64px;
}
* { box-sizing: border-box; }
html, body, #app { height: 100%; margin: 0; }

.app-shell { position: relative; min-height: 100%; background: #fff; }
.app-content {
  padding-top: var(--header-h);
  padding-bottom: var(--tab-h);
  min-height: calc(100vh - var(--header-h) - var(--tab-h));
}
</style>
