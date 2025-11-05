<template>
  <div class="mypage-wrapper">
    <div class="mypage-content">
      <section class="profile-summary">
        <div class="profile-avatar">
          <img :src="profileImage" alt="프로필 이미지" />
        </div>
        <div class="profile-details">
          <span class="profile-name">{{ user.nickname }}</span>
          <span v-if="user.phone" class="profile-meta">{{ user.phone }}</span>
          <span v-else class="profile-meta">GoGoTaxi 회원</span>
        </div>
        <button type="button" class="edit-button" @click="openProfileSettings">
          <span class="sr-only">프로필 수정 페이지 이동</span>
          <img :src="editIcon" alt="" class="edit-icon" aria-hidden="true" />
        </button>
      </section>

      <section class="menu-section">
        <h2 class="section-title">바로가기</h2>
        <nav class="menu-list">
          <button type="button" class="menu-item" @click="goTo('history')">
            <span class="menu-item-label">이용 기록</span>
            <span class="menu-item-arrow" aria-hidden="true">&gt;</span>
          </button>
          <button type="button" class="menu-item" @click="goTo('payment')">
            <span class="menu-item-label">결제 수단 관리</span>
            <span class="menu-item-arrow" aria-hidden="true">&gt;</span>
          </button>
          <button type="button" class="menu-item" @click="goTo('notice')">
            <span class="menu-item-label">공지사항</span>
            <span class="menu-item-arrow" aria-hidden="true">&gt;</span>
          </button>
        </nav>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import editIcon from "@/assets/edit.png";
import profileImage from "@/assets/user.png";

const router = useRouter();

const user = ref({
  gender: "female",
  nickname: "김예은",
  phone: "010-1234-5678",
});

const routeNameMap: Record<string, string> = {
  history: "History",
  payment: "payment-methods",
  notice: "notice",
};

const goTo = (page: string) => {
  const routeName = routeNameMap[page];

  if (!routeName) {
    console.warn(`Unknown MyPage destination: ${page}`);
    return;
  }

  router.push({ name: routeName });
};

const openProfileSettings = () => {
  router.push("/mypage/settings");
};
</script>

<style scoped>
.mypage-wrapper {
  min-height: 100vh;
  background: #3a2e20;
  padding: 4rem 1.25rem 4.5rem;
  font-family: "Pretendard", "Apple SD Gothic Neo", sans-serif;
}

.mypage-content {
  width: min(640px, 100%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.profile-summary {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.7rem 1.6rem;
  background: #eeeff2;
  border-radius: 28px;
  box-shadow: 0 24px 40px rgba(237, 173, 98, 0.18);
}

.profile-avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: #fdd651;
  display: grid;
  place-items: center;
  box-shadow: inset 0 0 0 3px #fff;
  flex-shrink: 0;
  border: 3px solid #fdd651;
}

.profile-avatar img {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  object-fit: cover;
  background: #fff7e3;
  border: 3px solid #fff;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  justify-content: center;
  flex: 1;
}

.profile-name {
  font-size: 1.35rem;
  font-weight: 700;
  color: #2f2f33;
}

.profile-meta {
  font-size: 0.96rem;
  color: #6d6d73;
}

.edit-button {
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-left: auto;
}

.edit-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
  transition: transform 0.18s ease;
}

.edit-button:hover .edit-icon,
.edit-button:focus-visible .edit-icon {
  transform: scale(1.05);
}

.edit-button:focus-visible {
  outline: 3px solid rgba(203, 128, 38, 0.4);
  border-radius: 8px;
  outline-offset: 3px;
}

.menu-section {
  background: #eeeff2;
  border-radius: 28px;
  box-shadow: 0 22px 44px rgba(237, 173, 98, 0.16);
  padding: 1.25rem 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 700;
  color: #3a3a40;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.menu-item {
  width: 100%;
  border: none;
  border-radius: 18px;
  background: #fdd651;
  padding: 0.95rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 600;
  color: #2f2f33;
  cursor: pointer;
  box-shadow: 0 14px 22px rgba(203, 128, 38, 0.22);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.menu-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 26px rgba(203, 128, 38, 0.28);
}

.menu-item:focus-visible {
  outline: 3px solid rgba(203, 128, 38, 0.4);
  outline-offset: 3px;
}

.menu-item-label {
  flex: 1;
  text-align: left;
}

.menu-item-arrow {
  font-size: 1.2rem;
  color: #a76c16;
  margin-left: 0.75rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 480px) {
  .mypage-wrapper {
    padding: 3.2rem 1rem 3.5rem;
  }

  .profile-summary {
    flex-direction: column;
    align-items: stretch;
    gap: 1.1rem;
  }

  .profile-avatar {
    width: 74px;
    height: 74px;
    align-self: center;
  }

  .profile-avatar img {
    width: 60px;
    height: 60px;
  }

  .profile-details {
    align-items: center;
    text-align: center;
  }

  .edit-button {
    margin-left: 0;
    align-self: center;
  }
}

@media (min-width: 768px) {
  .mypage-wrapper {
    padding: 5rem 2rem 5rem;
  }

  .profile-name {
    font-size: 1.5rem;
  }

  .menu-item {
    font-size: 1.05rem;
  }
}
</style>
