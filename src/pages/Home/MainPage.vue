<!-- src/pages/Home/MainPage.vue -->
<template>
  <section class="main">
    <div class="hero">
      <svg
        class="forest-bg"
        viewBox="0 0 360 720"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="forest-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0f3316" />
            <stop offset="35%" stop-color="#1c4a1f" />
            <stop offset="100%" stop-color="#2e612b" />
          </linearGradient>
          <linearGradient id="forest-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,230,0.55)" />
            <stop offset="45%" stop-color="rgba(255,255,230,0.2)" />
            <stop offset="100%" stop-color="rgba(255,255,230,0)" />
          </linearGradient>
          <linearGradient id="path-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#b7733d" />
            <stop offset="45%" stop-color="#8d5529" />
            <stop offset="100%" stop-color="#5d3b1e" />
          </linearGradient>
          <linearGradient id="path-inner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f1c58b" stop-opacity="0.85" />
            <stop offset="70%" stop-color="rgba(255,239,210,0.25)" />
            <stop offset="100%" stop-color="rgba(255,239,210,0)" />
          </linearGradient>
          <filter id="grainy">
            <feTurbulence baseFrequency="0.8" numOctaves="2" type="fractalNoise" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0 0.04 0" />
            </feComponentTransfer>
          </filter>
        </defs>

        <rect width="360" height="720" fill="url(#forest-base)" />
        <rect width="360" height="720" fill="url(#forest-light)" />

        <path
          d="
            M 110 740
            C 30 610 250 540 150 420
            C 60 320 270 300 200 200
            C 140 120 250 100 210 20
            C 190 -20 170 -40 185 -60
            L 255 -60
            C 230 -10 280 30 275 120
            C 270 210 160 250 225 350
            C 290 450 180 520 250 650
            C 265 680 260 710 255 740
            Z"
          fill="url(#path-base)"
        />

        <path
          d="
            M 150 730
            C 80 610 220 560 140 430
            C 80 330 240 290 185 210
            C 140 140 220 110 200 40
            C 190 0 190 -20 200 -40
            L 225 -40
            C 210 20 255 70 250 140
            C 245 220 155 250 215 340
            C 275 430 185 500 240 610
            C 255 640 245 700 240 730
            Z"
          fill="url(#path-inner)"
        />

        <path
          d="
            M 115 735
            C 35 610 245 545 155 420
            C 70 300 260 300 195 205
            C 130 115 250 105 205 15"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          stroke-width="18"
          stroke-linecap="round"
        />
        <path
          d="
            M 245 15
            C 220 80 285 140 270 230
            C 255 320 165 360 220 445
            C 275 530 190 580 260 700"
          fill="none"
          stroke="rgba(0,0,0,0.16)"
          stroke-width="18"
          stroke-linecap="round"
        />

        <rect width="360" height="720" filter="url(#grainy)" />
      </svg>

      <button class="path-pin pin-make" @click="goCreate" aria-label="방 만들기">
        <img :src="logoMake" alt="" />
        <span>방 만들기</span>
      </button>
      <button class="path-pin pin-find" @click="goSearch" aria-label="방 찾기">
        <img :src="logoFind" alt="" />
        <span>방 찾기</span>
      </button>
      <button
        class="path-pin pin-myrooms path-pin--cutout"
        @click="goMyRooms"
        aria-label="나의 방"
      >
        <img :src="logoMy" alt="" />
        <span>나의 방</span>
      </button>
      <div class="info-panel">
        <BlockRow title="공지" subtitle="새 소식과 안내" icon="📢" @click="goNotice" />
        <BlockRow title="결제 수단" subtitle="카드 / 계좌 관리" icon="💳" @click="goPayment" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import logoMake from '@/assets/logo_make.png'
import logoFind from '@/assets/logo_find.png'
import logoMy from '@/assets/logo_my.png'

const router = useRouter()

function goCreate() {
  router.push({ name: 'create-room' })
}
function goSearch() {
  router.push({ name: 'find-room' })
}
function goMyRooms() {
  router.push({ name: 'my-rooms' })
}
function goNotice() {
  router.push({ name: 'notice' })
}
function goPayment() {
  router.push({ name: 'payment-methods' })
}

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
  `,
})
</script>

<style scoped>
.main {
  min-height: calc(100dvh - var(--tab-h));
  padding-bottom: var(--tab-h);
}

.hero {
  position: relative;
  width: 100%;
  min-height: clamp(1100px, 165dvh, 1800px);
  padding-bottom: clamp(180px, 12vh, 260px);
  overflow: hidden;
  border-bottom-left-radius: 50% 6%;
  border-bottom-right-radius: 50% 6%;
  box-shadow: inset 0 -80px 140px rgba(0, 0, 0, 0.4);
}

.forest-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.path-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 0;
  cursor: pointer;
  z-index: 1;
}

.path-pin img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: transparent;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  border-radius: 26px;
  padding: 6px;
}

.path-pin span {
  font-weight: 700;
  font-size: 15px;
  color: #111;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.85);
}

.path-pin--cutout img {
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  mix-blend-mode: multiply;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35));
}

.pin-make {
  left: 20%;
  top: 30%;
}
.pin-find {
  left: 76%;
  top: 20%;
}
.pin-myrooms {
  left: 18%;
  top: 44%;
}

@media (min-width: 769px) {
  .path-pin img {
    width: 140px;
    height: 140px;
  }
  .pin-make {
    left: 26%;
    top: 32%;
  }
  .pin-find {
    left: 72%;
    top: 20%;
  }
  .pin-myrooms {
    left: 24%;
    top: 46%;
  }
}

@media (max-width: 520px) {
  .path-pin {
    transform: translate(-50%, -30%);
  }
  .pin-make {
    left: 45%;
    top: 22%;
  }
  .pin-find {
    left: 55%;
    top: 36%;
  }
  .pin-myrooms {
    left: 45%;
    top: 56%;
  }
}

.info-panel {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: clamp(32px, 8vh, 120px);
  width: min(90%, 960px);
  display: grid;
  gap: 12px;
}
@media (max-width: 520px) {
  .info-panel {
    width: calc(100% - 32px);
  }
}
.block-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}
.block-row .ic {
  font-size: 20px;
}
.block-row .txt {
  flex: 1;
}
.block-row .title {
  font-weight: 700;
  color: #111;
}
.block-row .sub {
  color: #666;
  font-size: 12px;
}
.block-row .chev {
  font-size: 18px;
  color: #bbb;
}
</style>
