<template>
<nav class="tabbar">
<button :class="btnClass('home')" @click="go('home')">
<span class="icon">🏠</span>
<span class="label">홈</span>
</button>
<button :class="btnClass('find-room')" @click="go('find-room')">
<span class="icon">🔎</span>
<span class="label">방찾기</span>
</button>
<button :class="btnClass('my-rooms')" @click="go('my-rooms')">
<span class="icon">🗂️</span>
<span class="label">나의 방</span>
</button>
<button :class="btnClass('mypage')" @click="go('mypage')">
<span class="icon">👤</span>
<span class="label">마이페이지</span>
</button>
</nav>
</template>


<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()


function go(name: string){ router.push({ name }) }
function btnClass(name: string){
return {
'tab-btn': true,
active: route.name === name
}
}
</script>


<style scoped>
.tabbar {
position: fixed;
left: 0; right: 0; bottom: 0;
height: var(--tab-h);
display: grid;
grid-template-columns: repeat(4, 1fr);
background: #fff;
border-top: 1px solid #eee;
z-index: 10000;
}
.tab-btn {
appearance: none; border: 0; background: none;
display: flex; flex-direction: column; align-items: center; justify-content: center;
font-size: 12px; color: #666;
}
.tab-btn .icon { font-size: 18px; line-height: 1; }
.tab-btn.active { color: #111; font-weight: 600; }
</style>
