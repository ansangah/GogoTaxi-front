<template>
<header class="header">
<div class="header-inner">
<img class="logo" src="@/assets/logo.png" alt="GogoTaxi" />
</div>
</header>
</template>


<script setup lang="ts">
</script>


<style scoped>
.header {
position: fixed;
top: 0; left: 0; right: 0;
height: var(--header-h);
background: #ffffffcc; /* 살짝 투명 */
backdrop-filter: saturate(180%) blur(8px);
border-bottom: 1px solid #eee;
z-index: 10;
}
.header-inner {
height: 100%;
display: flex;
align-items: center;
justify-content: center;
}
.logo {
height: 28px;
object-fit: contain;
}
</style>
