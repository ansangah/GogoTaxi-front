<template>
  <section class="review">
    <div class="review-card">
      <header class="review-header">
        <img class="driver-avatar" :src="logoMy" alt="기사님 프로필" />
        <div class="review-header__txt">
          <p class="sub">운행이 종료되었습니다</p>
          <h1>기사님 서비스는 어떠셨나요?</h1>
        </div>
      </header>

      <div class="rating">
        <p class="rating__label">별점을 선택해주세요</p>
        <div class="rating__stars" role="radiogroup" aria-label="별점 선택">
          <button
            v-for="star in stars"
            :key="star"
            type="button"
            class="star-btn"
            :class="{ 'star-btn--active': star <= activeStar }"
            :aria-label="`${star}점`"
            :aria-pressed="star === rating"
            @click="setRating(star)"
            @mouseenter="hover(star)"
            @mouseleave="hover(null)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2.8l2.7 5.5 6 0.9-4.3 4.2 1 5.9L12 16.9l-5.4 2.8 1-5.9-4.3-4.2 6-0.9z"
              />
            </svg>
          </button>
        </div>
        <transition name="fade">
          <p v-if="rating" key="selected" class="rating__summary">
            {{ ratingText }}
          </p>
        </transition>
      </div>

      <label class="feedback">
        <span class="feedback__label">후기를 남겨주세요</span>
        <textarea
          v-model="comment"
          rows="5"
          placeholder="친절함, 안전운전, 차량 상태 등 자유롭게 작성해주세요."
        />
      </label>

      <div class="actions">
        <button type="button" class="btn btn--ghost" @click="skip">나중에 할게요</button>
        <button type="button" class="btn btn--primary" :disabled="!rating" @click="submit">
          후기 제출
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import logoMy from '@/assets/logo_my.png'

const stars = [1, 2, 3, 4, 5]
const rating = ref(0)
const hovered = ref<number | null>(null)
const comment = ref('')

const activeStar = computed(() => hovered.value ?? rating.value)

const ratingText = computed(() => {
  if (!rating.value) return ''
  switch (rating.value) {
    case 1:
      return '아쉬웠어요. 개선이 필요해요.'
    case 2:
      return '조금 아쉬웠어요.'
    case 3:
      return '괜찮았어요.'
    case 4:
      return '좋았어요!'
    case 5:
      return '최고였어요! 다음에도 함께하고 싶어요.'
    default:
      return ''
  }
})

function setRating(value: number) {
  rating.value = value
}

function hover(value: number | null) {
  hovered.value = value
}

function skip() {
  // 추후 라우팅이나 모달 종료 로직 연결 예정
  alert('후기를 나중에 남기실 수 있어요!')
}

function submit() {
  if (!rating.value) return
  // TODO: API 연동 예정
  alert(`별점 ${rating.value}점과 후기를 전송했습니다.\n\n${comment.value}`)
  rating.value = 0
  hovered.value = null
  comment.value = ''
}
</script>

<style scoped>
.review {
  min-height: calc(100dvh - var(--header-h));
  background: radial-gradient(circle at 20% 20%, rgba(255, 243, 210, 0.35), transparent 55%),
    radial-gradient(circle at 80% 15%, rgba(186, 214, 255, 0.3), transparent 55%),
    linear-gradient(180deg, #f3ede3 0%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(80px, 12vh, 140px) clamp(16px, 5vw, 40px);
}
.review-card {
  width: min(560px, 100%);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 32px;
  padding: clamp(28px, 5vw, 36px);
  border: 1px solid rgba(120, 92, 68, 0.12);
  box-shadow: 0 30px 60px rgba(24, 18, 12, 0.16);
  display: grid;
  gap: clamp(24px, 4vw, 32px);
}
.review-header {
  display: flex;
  gap: 18px;
  align-items: center;
}
.driver-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.18);
}
.review-header__txt .sub {
  margin: 0;
  color: #85766a;
  font-size: 14px;
}
.review-header__txt h1 {
  margin: 6px 0 0;
  font-size: clamp(22px, 4vw, 26px);
  color: #2f241b;
}
.rating {
  display: grid;
  gap: 12px;
}
.rating__label {
  margin: 0;
  color: #4f4338;
  font-weight: 600;
}
.rating__stars {
  display: flex;
  gap: 12px;
}
.star-btn {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  border: none;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.12);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.star-btn svg {
  width: 28px;
  height: 28px;
  fill: #e4d7c6;
  transition: fill 0.18s ease;
}
.star-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 24px rgba(255, 186, 0, 0.3);
}
.star-btn--active {
  background: linear-gradient(135deg, #facc15, #f59e0b);
}
.star-btn--active svg {
  fill: #ffffff;
}
.rating__summary {
  margin: 0;
  color: #c47a00;
  font-weight: 600;
  font-size: 14px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.feedback {
  display: grid;
  gap: 10px;
}
.feedback__label {
  font-weight: 600;
  color: #4f4338;
}
.feedback textarea {
  resize: vertical;
  min-height: 120px;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(120, 92, 68, 0.16);
  background: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.5;
  color: #3d3228;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
}
.feedback textarea::placeholder {
  color: rgba(82, 70, 60, 0.6);
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn {
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
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
.btn--ghost {
  background: rgba(79, 67, 56, 0.1);
  color: #4f4338;
}
.btn--ghost:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(79, 67, 56, 0.16);
}
.btn--primary {
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: #fffaf0;
  box-shadow: 0 12px 22px rgba(255, 149, 5, 0.35);
}
.btn--primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

@media (max-width: 520px) {
  .star-btn {
    width: 48px;
    height: 48px;
  }
  .star-btn svg {
    width: 24px;
    height: 24px;
  }
  .review-header {
    flex-direction: column;
    text-align: center;
  }
  .review-card {
    padding: 24px;
  }
  .actions {
    flex-direction: column-reverse;
  }
  .btn {
    width: 100%;
  }
}
</style>
