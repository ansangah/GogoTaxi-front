<template>
  <div class="mypage-wrapper">
    <main class="mypage-card">
      <header class="card-header">
        <div class="profile-avatar">
          <img
            :src="user.gender === 'female' ? '/images/female-profile.png' : '/images/male-profile.png'"
            alt="프로필 이미지"
          />
        </div>
        <div class="nickname-block">
          <div class="nickname-row">
            <span class="nickname-label">{{ user.nickname }}</span>
            <button type="button" class="edit-button" @click="openProfileSettings">
              <span class="sr-only">프로필 수정 페이지로 이동</span>
              <img :src="editIcon" alt="" class="edit-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <nav class="menu-list">
        <button type="button" class="menu-item" @click="goTo('history')">
          <span class="menu-item-label">이용 기록</span>
          <i class="menu-item-arrow" aria-hidden="true">›</i>
        </button>
        <button type="button" class="menu-item" @click="goTo('payment')">
          <span class="menu-item-label">결제 수단 관리</span>
          <i class="menu-item-arrow" aria-hidden="true">›</i>
        </button>
        <button type="button" class="menu-item" @click="goTo('notice')">
          <span class="menu-item-label">공지사항</span>
          <i class="menu-item-arrow" aria-hidden="true">›</i>
        </button>
      </nav>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import editIcon from "@/assets/edit.png";

const router = useRouter();

const user = ref({
  gender: "female",
  nickname: "김예은",
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffe4b3 0%, #fff1d8 35%, #ffffff 100%);
  padding: 3.5rem 1rem 3rem;
  font-family: "Pretendard", "Apple SD Gothic Neo", sans-serif;
}

.mypage-card {
  width: min(420px, 100%);
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 18px 32px rgba(238, 187, 110, 0.28);
  padding: 2.2rem 1.6rem 1.9rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.profile-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #fdd651;
  display: grid;
  place-items: center;
  box-shadow: inset 0 0 0 5px #fff;
  flex-shrink: 0;
}

.profile-avatar img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  background: #fff7e3;
}

.nickname-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.nickname-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nickname-label {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2f2f33;
}

.edit-button {
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  width: 24px;
  height: 24px;
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


.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.menu-item {
  width: 100%;
  border: none;
  border-radius: 18px;
  background: #fdd651;
  padding: 0.9rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.05rem;
  font-weight: 600;
  color: #2f2f33;
  cursor: pointer;
  box-shadow: 0 10px 18px rgba(203, 128, 38, 0.2);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.menu-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 22px rgba(203, 128, 38, 0.28);
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
  font-style: normal;
  font-size: 1.2rem;
  color: #c48332;
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

@media (max-width: 360px) {
  .profile-avatar {
    width: 76px;
    height: 76px;
  }

  .profile-avatar img {
    width: 62px;
    height: 62px;
  }

  .nickname-label {
    font-size: 1.1rem;
  }

  .edit-button {
    width: 36px;
    height: 36px;
  }
}

@media (min-width: 768px) {
  .mypage-wrapper {
    padding: 4.5rem 2rem;
  }

  .mypage-card {
    width: min(520px, 100%);
    padding: 2.5rem 2.2rem 2.2rem;
  }

  .nickname-label {
    font-size: 1.3rem;
  }
}
</style>
