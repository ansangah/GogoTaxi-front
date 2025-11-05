<template>
  <section class="find-room">
    <div class="map-area">
      <div class="map-placeholder">
        <strong>지도 영역</strong>
        <p>실제 지도 컴포넌트가 들어갈 자리입니다.</p>
      </div>
    </div>

    <section
      class="sheet"
      :class="{ 'sheet--dragging': isDragging, 'sheet--expanded': sheetHeight === MAX_SHEET }"
      :style="{ height: `${sheetHeight}vh` }"
    >
      <header
        class="sheet__header"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
      >
        <span class="sheet__grip" />
        <div>
          <h1>탐색 중인 방</h1>
          <p>{{ rooms.length }}개의 방을 찾았어요</p>
        </div>
        <button type="button" class="sheet__toggle" @click.stop="toggleSheet">
          {{ sheetHeight === MAX_SHEET ? '지도 보기' : '전체 보기' }}
        </button>
      </header>

      <div class="sheet__list">
        <article v-for="room in rooms" :key="room.id" class="room-card">
          <header class="room-card__header">
            <h2>{{ room.title }}</h2>
            <span class="room-card__seats">{{ room.seats }}자리 남음</span>
          </header>
          <dl class="room-card__meta">
            <div>
              <dt>출발지</dt>
              <dd>{{ room.departure }}</dd>
            </div>
            <div>
              <dt>출발 시간</dt>
              <dd>{{ room.time }}</dd>
            </div>
          </dl>
          <footer class="room-card__tags">
            <span v-for="tag in room.tags" :key="tag">#{{ tag }}</span>
          </footer>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

type RoomPreview = {
  id: string
  title: string
  departure: string
  time: string
  seats: number
  tags: string[]
}

const MIN_SHEET = 60
const MAX_SHEET = 100
const SNAP_THRESHOLD = 80

const rooms = ref<RoomPreview[]>([
  {
    id: 'room-101',
    title: '강남역 → 인천공항 새벽 합승',
    departure: '강남역 5번 출구',
    time: '오늘 23:30 출발',
    seats: 2,
    tags: ['야간', '공항', '편안한 분위기'],
  },
  {
    id: 'room-102',
    title: '신촌역 → 수원역 아침 출근',
    departure: '신촌역 2번 출구 앞',
    time: '내일 07:10 출발',
    seats: 1,
    tags: ['출근', '정시출발'],
  },
  {
    id: 'room-103',
    title: '홍대입구역 → 판교역',
    departure: '홍대입구역 9번 출구',
    time: '오늘 20:00 출발',
    seats: 3,
    tags: ['직장인', '음악조용히', '비흡연'],
  },
  {
    id: 'room-104',
    title: '부산 서면 → 해운대 야간',
    departure: '서면역 7번 출구 택시승강장',
    time: '오늘 22:10 출발',
    seats: 1,
    tags: ['야경투어', '편안한 분위기'],
  },
])

const sheetHeight = ref<number>(MIN_SHEET)
const isDragging = ref(false)

let startY = 0
let startHeight = MIN_SHEET

function clamp(value: number) {
  return Math.min(MAX_SHEET, Math.max(MIN_SHEET, value))
}

function onPointerDown(event: PointerEvent) {
  if (event.pointerType === 'mouse' && event.buttons !== 1) return
  event.preventDefault()
  isDragging.value = true
  startY = event.clientY
  startHeight = sheetHeight.value
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerCancel)
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value) return
  const deltaY = startY - event.clientY
  const deltaPercent = (deltaY / window.innerHeight) * 100
  sheetHeight.value = clamp(startHeight + deltaPercent)
}

function finishDrag() {
  if (!isDragging.value) return
  isDragging.value = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerCancel)

  sheetHeight.value = sheetHeight.value > SNAP_THRESHOLD ? MAX_SHEET : MIN_SHEET
}

function onPointerUp(event: PointerEvent) {
  if (isDragging.value) {
    onPointerMove(event)
    finishDrag()
  }
}

function onPointerCancel() {
  finishDrag()
}

function toggleSheet() {
  sheetHeight.value = sheetHeight.value === MAX_SHEET ? MIN_SHEET : MAX_SHEET
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerCancel)
})
</script>

<style scoped>
.find-room {
  position: relative;
  min-height: 100dvh;
  background: #f5f5f5;
  color: #1f2937;
  overflow: hidden;
}

.map-area {
  position: absolute;
  inset: 0;
  background: #ddeafc;
}

.map-placeholder {
  position: absolute;
  inset: clamp(24px, 6vw, 60px);
  border-radius: 24px;
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  color: #fff;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 8px;
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.28);
}

.sheet {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  background: #ffffff;
  border-radius: 28px 28px 0 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -18px 40px rgba(15, 23, 42, 0.12);
  transition: height 0.3s ease, border-radius 0.3s ease, box-shadow 0.3s ease;
  will-change: height;
  touch-action: none;
}

.sheet--expanded {
  border-radius: 0;
}

.sheet--dragging {
  transition: none;
}

.sheet__header {
  position: relative;
  padding: clamp(14px, 3vw, 18px) clamp(18px, 4vw, 28px) clamp(12px, 2.8vw, 16px);
  display: flex;
  align-items: center;
  gap: clamp(14px, 4vw, 22px);
  cursor: grab;
  user-select: none;
}

.sheet__header:active {
  cursor: grabbing;
}

.sheet__grip {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 48px;
  height: 5px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.12);
  transform: translateX(-50%);
}

.sheet__header h1 {
  margin: 4px 0 2px;
  font-size: clamp(16px, 3.6vw, 20px);
}

.sheet__header p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
}

.sheet__toggle {
  margin-left: auto;
  border: none;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.sheet__toggle:hover {
  background: rgba(37, 99, 235, 0.2);
  color: #1d4ed8;
}

.sheet__list {
  flex: 1;
  overflow-y: auto;
  padding: 0 clamp(18px, 4vw, 28px) clamp(20px, 4vw, 30px);
  display: grid;
  gap: clamp(16px, 3vw, 22px);
}

.room-card {
  padding: clamp(18px, 4vw, 24px);
  border-radius: 22px;
  border: 1px solid rgba(37, 99, 235, 0.14);
  background: rgba(248, 250, 255, 0.86);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 12px;
}

.room-card__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: baseline;
}

.room-card__header h2 {
  margin: 0;
  font-size: clamp(15px, 3.4vw, 18px);
  color: #1f2937;
}

.room-card__seats {
  font-size: 13px;
  font-weight: 600;
  color: #1d4ed8;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 999px;
  padding: 6px 12px;
}

.room-card__meta {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  margin: 0;
}

.room-card__meta div {
  display: grid;
  gap: 4px;
}

.room-card__meta dt {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.room-card__meta dd {
  margin: 0;
  font-size: 14px;
  color: #1f2937;
}

.room-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
}

.room-card__tags span {
  font-size: 12px;
  color: #2563eb;
  background: rgba(37, 99, 235, 0.12);
  padding: 6px 10px;
  border-radius: 999px;
}

@media (min-width: 960px) {
  .find-room {
    border-radius: 28px;
    overflow: hidden;
  }

  .sheet {
    margin-inline: auto;
    max-width: 860px;
  }
}
</style>
