<template>
  <section class="main">
    <!-- Hero 영역: 배경과 큰 카드 3개 -->
    <div class="hero" :style="bgStyle">
      <div class="hero-overlay">
        <div class="quick-grid">
          <HeroCard title="방 만들기" icon="🪄" desc="같이 탈 사람 구하기" @click="goCreate" />
          <HeroCard title="방 찾기" icon="🔎" desc="참여할 방 탐색" @click="goSearch" />
          <HeroCard title="나의 방" icon="🗂️" desc="내가 만든/참여 방" @click="goMyRooms" />
        </div>
      </div>
    </div>

    <!-- 아래로 스크롤 시 노출되는 블록들 -->
    <div class="blocks">
      <BlockRow title="공지" subtitle="새 소식과 안내" icon="📢" @click="goNotice" />
      <BlockRow title="결제수단" subtitle="카드/계좌 관리" icon="💳" @click="goPayment" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

// 라우터 이동
const router = useRouter()
const bgStyle = computed(() => ({
  backgroundImage: `url(${new URL('@/assets/path-bg.jpg', import.meta.url).href})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

function goCreate() { router.push({ name: 'create-room' }) }
function goSearch() { router.push({ name: 'find-room' }) }
function goMyRooms() { router.push({ name: 'my-rooms' }) }
function goNotice() { router.push({ name: 'notice' }) }
function goPayment() { router.push({ name: 'payment-methods' }) }

// 내부 재사용 컴포넌트 정의 (간단 버전)
const HeroCard = defineComponent({
  props: { title: String, icon: String, desc: String },
  emits: ['click'],
  template: `
    <div class="hero-card" @click="$emit('click')">
      <div class="ic">{{ icon }}</div>
      <div class="txt">
        <div class="tt">{{ title }}</div>
        <div class="dd">{{ desc }}</div>
      </div>
    </div>
  `
})

const BlockRow = defineComponent({
  props: { title: String, subtitle: String, icon: String },
  emits: ['click'],
  template: `
    <div class="block-row" @click="$emit('click')">
      <div class="ic">{{ icon }}</div>
      <div class="txt">
        <div class="title">{{ title }}</div>
        <div class="sub">{{ subtitle }}</div>
      </div>
      <div class="chev">›</div>
    </div>
  `
})
</script>

<style scoped>
.main { min-height: 100%; }

.hero {
  position: relative;
  width: 100%;
  height: 100vh;                  /* 기본: 화면 전체 채우기 */
  background-image: url('@/assets/path-bg.jpg');
  background-size: cover;         /* 비율 유지하며 꽉 채움 */
  background-position: center;    /* 중앙 기준 정렬 */
  background-repeat: no-repeat;
}
.hero-overlay {
  width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.35));
  display: flex; align-items: flex-end; justify-content: center;
  padding: 16px;
}
.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
@media (max-width: 720px) {
  .quick-grid {
    grid-template-columns: 1fr;
  }
}

.hero-card {
  background: #ffffffee; backdrop-filter: blur(6px);
  border-radius: 16px; padding: 16px;
  display: flex; gap: 12px; align-items: center;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  transition: transform .12s ease, box-shadow .12s ease;
}
.hero-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0,0,0,0.12);
}
.hero-card .ic { font-size: 22px; }
.hero-card .tt { font-weight: 700; color: #111; font-size: 16px; }
.hero-card .dd { color: #666; font-size: 12px; }

@media (max-width: 768px) {
  .hero {
    height: 100vh; /* 모바일: 화면 꽉 채움 */
  }
}

@media (min-width: 769px) {
  .hero {
    height: 80vh;  /* 태블릿/데스크탑: 약간 줄임 */
  }
}

.blocks {
  padding: 16px;
  display: grid; gap: 12px;
  max-width: 960px; margin: 0 auto;
}
.block-row {
  display: flex; align-items: center; gap: 12px;
  background: #fff; border: 1px solid #eee; border-radius: 14px;
  padding: 14px 16px; cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.block-row .ic { font-size: 20px; }
.block-row .txt { flex: 1; }
.block-row .title { font-weight: 700; color: #111; }
.block-row .sub { color: #666; font-size: 12px; }
.block-row .chev { font-size: 18px; color: #bbb; }
</style>
