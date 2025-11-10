<template>
  <section class="seat-select">
    <div class="seat-card">
      <header class="seat-card__header">
        <p class="seat-card__sub">배차 완료</p>
        <h1>탑승하실 좌석을 골라주세요</h1>
        <p class="seat-card__desc">
          운전석은 기사님 좌석으로 이미 배정되어 있어요. 나머지 좌석 중에서 원하는 자리 한 곳을
          선택하면 됩니다.
        </p>
      </header>

      <div class="seat-layout" role="radiogroup" aria-label="좌석 선택">
        <svg class="seat-layout__car" viewBox="0 0 200 400" aria-hidden="true">
          <defs>
            <linearGradient id="car-body" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f6f7fb" />
              <stop offset="100%" stop-color="#e3e6ee" />
            </linearGradient>
          </defs>
          <path
            d="M50 10 Q100 -10 150 10 L180 80 L180 320 L150 390 Q100 410 50 390 L20 320 L20 80 Z"
            fill="url(#car-body)"
            stroke="#cbd2e1"
            stroke-width="3"
          />
          <rect x="52" y="70" width="96" height="90" rx="18" fill="#fff" stroke="#d1d7e3" />
          <rect x="52" y="240" width="96" height="90" rx="18" fill="#fff" stroke="#d1d7e3" />
          <line x1="100" y1="70" x2="100" y2="160" stroke="#dbe2ef" stroke-width="3" />
          <line x1="84" y1="240" x2="84" y2="330" stroke="#dbe2ef" stroke-width="3" />
          <line x1="116" y1="240" x2="116" y2="330" stroke="#dbe2ef" stroke-width="3" />
          <rect x="30" y="120" width="140" height="30" rx="10" fill="#dfe4ef" />
          <rect x="30" y="250" width="140" height="30" rx="10" fill="#dfe4ef" />
          <circle cx="58" cy="56" r="12" fill="#dfe4ef" />
          <circle cx="142" cy="56" r="12" fill="#dfe4ef" />
          <circle cx="58" cy="344" r="12" fill="#dfe4ef" />
          <circle cx="142" cy="344" r="12" fill="#dfe4ef" />
        </svg>
        <div class="seat-layout__seats">
          <button
            v-for="seat in seats"
            :key="seat.number"
            type="button"
            class="seat-marker"
            :class="{ 'seat-marker--active': seat.number === selectedSeat }"
            :style="seatStyle(seat)"
            :aria-pressed="seat.number === selectedSeat"
            @click="selectSeat(seat.number)"
          >
            <span>{{ seat.number }}</span>
          </button>
        </div>
      </div>

      <transition name="fade">
        <p v-if="selectedSeat" key="selection" class="seat-card__selection">
          {{ selectedSeat }}번 좌석을 선택했어요. 아래 버튼으로 확정해 주세요.
        </p>
        <p v-else key="selection-hint" class="seat-card__selection--hint">
          선택 가능한 좌석은 총 네 자리입니다. 원하는 곳을 눌러주세요.
        </p>
      </transition>

      <footer class="seat-card__actions">
        <button type="button" class="btn btn--primary" :disabled="!selectedSeat" @click="confirmSeat">
          좌석 확정하기
        </button>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoomMembership } from '@/composables/useRoomMembership'
import { getRoomById } from '@/data/mockRooms'

interface SeatInfo {
  number: number
  x: number
  y: number
}

const seats: SeatInfo[] = [
  { number: 2, x: 62, y: 28 },
  { number: 3, x: 28, y: 68 },
  { number: 4, x: 50, y: 68 },
  { number: 5, x: 72, y: 68 },
]

const router = useRouter()
const route = useRoute()
const selectedSeat = ref<number | null>(null)
const { joinedRooms, joinRoom: ensureRoom, updateSeat } = useRoomMembership()

function seatStyle(seat: SeatInfo) {
  return {
    left: `${seat.x}%`,
    top: `${seat.y}%`,
  }
}

function selectSeat(seatNumber: number) {
  selectedSeat.value = seatNumber
}

function confirmSeat() {
  if (!selectedSeat.value) return
  const roomId = (route.query.roomId as string) || 'room-101'
  if (!joinedRooms.value.some(entry => entry.roomId === roomId)) {
    const snapshot = getRoomById(roomId)
    if (snapshot) {
      ensureRoom(snapshot)
    }
  }
  updateSeat(roomId, selectedSeat.value)
  router.push({
    name: 'room-detail',
    params: { id: roomId },
    query: { seat: selectedSeat.value },
  })
}
</script>

<style scoped>
.seat-select {
  position: relative;
  min-height: calc(100dvh - var(--header-h, 0px));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(48px, 10vh, 110px) clamp(18px, 6vw, 52px);
  background: linear-gradient(180deg, #f5f5f5 0%, #eef2ff 65%, #e0e7ff 100%);
  color: #1f2937;
  overflow: hidden;
}

.seat-select::before,
.seat-select::after {
  content: '';
  position: absolute;
  border-radius: 999px;
  filter: blur(60px);
  opacity: 0.35;
  pointer-events: none;
}

.seat-select::before {
  width: 320px;
  height: 320px;
  top: 8%;
  left: 10%;
  background: rgba(79, 70, 229, 0.35);
}

.seat-select::after {
  width: 360px;
  height: 360px;
  bottom: -14%;
  right: -6%;
  background: rgba(251, 191, 36, 0.4);
}

.seat-card {
  width: min(520px, 100%);
  background: rgba(255, 255, 255, 0.98);
  border-radius: 32px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 32px 60px rgba(15, 23, 42, 0.18);
  display: grid;
  gap: 20px;
  padding: clamp(26px, 5vw, 34px);
}
.seat-card__header {
  display: grid;
  gap: 10px;
  text-align: center;
  color: #111827;
}
.seat-card__sub {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(79, 70, 229, 0.75);
}
.seat-card__header h1 {
  margin: 0;
  font-size: clamp(22px, 4vw, 28px);
}
.seat-card__desc {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
  font-size: 14px;
}
.seat-layout {
  position: relative;
  width: min(240px, 94%);
  margin: 0 auto;
  aspect-ratio: 2 / 3;
  background: linear-gradient(160deg, rgba(238, 242, 255, 0.9), rgba(224, 231, 255, 0.95));
  border-radius: 30px;
  padding: 18px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.seat-layout__car {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 24px;
  background: radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.5), transparent 55%);
  filter: drop-shadow(0 18px 34px rgba(79, 70, 229, 0.2));
}
.seat-layout__seats {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
.seat-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  width: clamp(38px, 14vw, 48px);
  height: clamp(46px, 16vw, 58px);
  border-radius: 14px;
  border: 2px solid rgba(79, 70, 229, 0.2);
  box-shadow: 0 14px 24px rgba(15, 23, 42, 0.18);
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.95), rgba(224, 231, 255, 0.88));
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 16px;
  color: #4338ca;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
  pointer-events: auto;
}
.seat-marker:hover {
  transform: translate(-50%, -50%) translateY(-4px);
  box-shadow: 0 18px 28px rgba(79, 70, 229, 0.26);
}
.seat-marker--active {
  background: linear-gradient(145deg, #4338ca, #6366f1);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 20px 32px rgba(79, 70, 229, 0.32);
}
.seat-marker span {
  pointer-events: none;
}
.seat-card__selection,
.seat-card__selection--hint {
  margin: 0;
  text-align: center;
  font-size: 14px;
  color: #1f2937;
  padding: 12px 16px;
  border-radius: 16px;
  background: rgba(226, 232, 240, 0.45);
}
.seat-card__selection--hint {
  color: #6b7280;
  background: rgba(226, 232, 240, 0.3);
}
.seat-card__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn {
  border: none;
  border-radius: 16px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
  transform: none;
  box-shadow: none;
}
.btn--primary {
  background: #facc15;
  color: #3b2400;
  box-shadow: none;
}
.btn--primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

@media (max-width: 520px) {
  .seat-card {
    padding: 22px;
  }
  .seat-card__actions {
    flex-direction: column-reverse;
  }
  .btn {
    width: 100%;
  }
}
</style>
