<template>
  <section class="create-room">
    <div class="create-room__placeholder">
      <h1>방 만들기</h1>
      <p>조만간 이곳에서 새 방을 만들 수 있어요.</p>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.create-room {
  min-height: calc(100vh - var(--header-h) - var(--tab-h));
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}
.create-room__placeholder {
  text-align: center;
  color: #475569;
}
.create-room__placeholder h1 {
  margin: 0 0 12px;
  font-size: 24px;
  color: #0f172a;
}
.create-room__placeholder p {
  margin: 0;
  font-size: 14px;
}
</style>
