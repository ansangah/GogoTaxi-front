<template>
  <section class="find-room">
    <div class="map-area">
      <RoomMap :rooms="rooms" :selected-room="selectedRoom" />
    </div>

    <section
      class="sheet"
      :class="{
        'sheet--dragging': isDragging,
        'sheet--expanded': sheetHeight === MAX_SHEET,
        'sheet--collapsed': isCollapsed,
      }"
      :style="sheetStyle"
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

      <div
        class="sheet__list"
        :class="{ 'sheet__list--collapsed': isCollapsed }"
      >
        <article
          v-for="room in rooms"
          :key="room.id"
          class="room-card"
          :class="{ 'room-card--active': selectedRoom?.id === room.id }"
          @click="selectRoom(room)"
        >
          <header class="room-card__header">
            <h2>{{ room.title }}</h2>
            <span class="room-card__seats">{{ room.seats }}자리 남음</span>
          </header>
          <dl class="room-card__meta">
            <div>
              <dt>출발지</dt>
              <dd>{{ room.departure.label }}</dd>
            </div>
            <div>
              <dt>도착지</dt>
              <dd>{{ room.arrival.label }}</dd>
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
import { computed, onBeforeUnmount, ref } from 'vue'
import RoomMap from '@/components/RoomMap.vue'
import type { RoomPreview } from '@/types/rooms'
import { loadRooms, ROOMS_STORAGE_KEY } from '@/data/roomsStore'

const COLLAPSED_SHEET = 22
const MID_SHEET = 60
const MAX_SHEET = 100
const SHEET_STATES = [COLLAPSED_SHEET, MID_SHEET, MAX_SHEET] as const
const SNAP_THRESHOLD = 6

const rooms = ref<RoomPreview[]>(loadRooms())

function refreshRooms() {
  rooms.value = loadRooms()
}

function handleRoomsStorage(event: StorageEvent) {
  if (event.key === ROOMS_STORAGE_KEY) {
    refreshRooms()
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', handleRoomsStorage)
}


const sheetHeight = ref<number>(MID_SHEET)
const isDragging = ref(false)
const selectedRoom = ref<RoomPreview | null>(null)
const isCollapsed = computed(() => !isDragging.value && sheetHeight.value === COLLAPSED_SHEET)
const sheetStyle = computed(() =>
  isCollapsed.value
    ? { height: 'auto', minHeight: '140px' }
    : { height: `${sheetHeight.value}vh` },
)

let startY = 0
let startHeight = MID_SHEET

function clamp(value: number) {
  return Math.min(MAX_SHEET, Math.max(COLLAPSED_SHEET, value))
}

function closestStateIndex(value: number) {
  let nearestIndex = 0
  let minDiff = Number.POSITIVE_INFINITY
  SHEET_STATES.forEach((state, idx) => {
    const diff = Math.abs(state - value)
    if (diff < minDiff) {
      minDiff = diff
      nearestIndex = idx
    }
  })
  return nearestIndex
}

function stateValueAt(index: number) {
  const clampedIndex = Math.min(SHEET_STATES.length - 1, Math.max(0, index))
  return SHEET_STATES[clampedIndex] ?? MID_SHEET
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

  const clamped = clamp(sheetHeight.value)
  sheetHeight.value = clamped
  const delta = clamped - startHeight
  const absDelta = Math.abs(delta)

  if (absDelta < SNAP_THRESHOLD) {
    sheetHeight.value = stateValueAt(closestStateIndex(startHeight))
    return
  }

  const startIdx = closestStateIndex(startHeight)
  const targetIdx = closestStateIndex(clamped)

  if (targetIdx === startIdx && absDelta >= SNAP_THRESHOLD) {
    const direction = delta > 0 ? 1 : -1
    sheetHeight.value = stateValueAt(startIdx + direction)
    return
  }

  sheetHeight.value = stateValueAt(targetIdx)
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
  sheetHeight.value = sheetHeight.value === MAX_SHEET ? MID_SHEET : MAX_SHEET
}

function selectRoom(room: RoomPreview) {
  selectedRoom.value = selectedRoom.value?.id === room.id ? null : room
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerCancel)
  if (typeof window !== 'undefined') {
    window.removeEventListener('storage', handleRoomsStorage)
  }
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
  z-index: 0;
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
  z-index: 1;
}

.sheet--collapsed {
  border-radius: 28px 28px 0 0;
  box-shadow: 0 -18px 40px rgba(15, 23, 42, 0.12);
}

.sheet--dragging {
  transition: none;
}

.sheet__header {
  position: relative;
  padding: clamp(12px, 2.6vw, 16px) clamp(18px, 4vw, 26px) clamp(10px, 2.4vw, 14px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(12px, 3.6vw, 18px);
  cursor: grab;
  user-select: none;
  flex-wrap: wrap;
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
  margin: 4px 0 0;
  font-size: clamp(16px, 3.4vw, 20px);
}

.sheet__header p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.35;
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
  padding: clamp(6px, 1.6vw, 10px) clamp(18px, 4vw, 26px) clamp(18px, 3.6vw, 26px);
  display: grid;
  gap: clamp(12px, 2.6vw, 18px);
}

.sheet__list--collapsed {
  max-height: clamp(96px, 22vh, 140px);
  padding-bottom: clamp(10px, 2.4vw, 16px);
  margin-top: clamp(6px, 1.8vw, 10px);
  overflow: hidden;
  pointer-events: none;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0));
}

.room-card {
  padding: clamp(16px, 3.4vw, 20px) clamp(16px, 3.4vw, 22px);
  border-radius: 20px;
  border: 1px solid rgba(37, 99, 235, 0.14);
  background: rgba(248, 250, 255, 0.86);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
}

.room-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(15, 23, 42, 0.14);
}

.room-card--active {
  border-color: rgba(37, 99, 235, 0.4);
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.18);
  background: rgba(219, 234, 254, 0.9);
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
