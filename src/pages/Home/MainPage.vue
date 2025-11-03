<!-- src/pages/Home/MainPage.vue -->
<template>
  <section class="main">
    <!-- 배경 -->
    <div class="hero" :style="bgStyle">
      <!-- 배경 위 아이콘 3개 -->
      <button class="path-pin pin-make"    @click="goCreate"  aria-label="방 만들기">
        <img :src="logoMake" alt="" /><span>방 만들기</span>
      </button>
      <button class="path-pin pin-find"    @click="goSearch"  aria-label="방 찾기">
        <img :src="logoFind" alt="" /><span>방 찾기</span>
      </button>
      <!--<button class="path-pin pin-myrooms" @click="goMyRooms" aria-label="나의 방">
        <img :src="logoMy" alt="" /><span>나의 방</span>
      </button>
    -->


      <!-- 하단 그라데이션(가독성) -->
      <div class="hero-gradient" aria-hidden="true"></div>
    </div>

    <!-- 아래 섹션 -->
    <div class="blocks">
      <BlockRow title="공지" subtitle="새 소식과 안내" icon="📢" @click="goNotice" />
      <BlockRow title="결제수단" subtitle="카드/계좌 관리" icon="💳" @click="goPayment" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

/** 배경 & 아이콘 이미지 (파일명/경로만 네 프로젝트에 맞게 바꿔) */
import bg from '@/assets/path-bg.jpg'
import logoMake from '@/assets/logo_make.png'
import logoFind from '@/assets/logo_find.png'
/**import logoMy   from '@/assets/logo_my.png'**/

const router = useRouter()

const bgStyle = computed(() => ({
  backgroundImage: `url(${bg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center top',
  backgroundRepeat: 'no-repeat',
}))

function goCreate()  { router.push({ name: 'create-room' }) }   // 새로 만드는 라우트
function goSearch()  { router.push({ name: 'find-room'   }) }   // 하단바와 동일
//function goMyRooms() { router.push({ name: 'my-rooms'    }) }   // 하단바와 동일
function goNotice()  { router.push({ name: 'notice'      }) }
function goPayment() { router.push({ name: 'payment-methods' }) }

/** 간단 재사용 블록 */
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
/* 탭이 가리는 것 방지 */
.main{ min-height:100%; padding-bottom:var(--tab-h) }

/* 배경 */
.hero{
  position:relative; z-index:0; width:100%;
  height:100vh; /* 모바일 꽉 채움 */
}
@media (min-width:769px){ .hero{ height:80vh } }

/* 배경 위 가독성용 그라데이션 */
.hero-gradient{
  position:absolute; inset:auto 0 0 0; height:28%;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,.35));
  pointer-events:none;
}

/* 공통 아이콘 버튼 */
.path-pin{
  position:absolute; transform:translate(-50%,-50%);
  display:flex; flex-direction:column; align-items:center; gap:6px;
  background:transparent; border:0; cursor:pointer; z-index:1;
}
.path-pin img{
  width:110px; height:110px; object-fit:contain; border-radius:16px; background:#fff;
  box-shadow:0 10px 24px rgba(0,0,0,.18);
}
.path-pin span{
  font-weight:700; font-size:13px; color:#111;
  text-shadow:0 1px 2px rgba(255,255,255,.85);
}
.path-pin img {
  width: 1110px;
  height: 110px;
  object-fit: contain;
  border-radius: 16px;
  background: transparent; /* 흰 배경 제거 */
  box-shadow: none;        /* 그림자 제거 */
}

/* 위치(퍼센트 좌표) — 필요하면 값만 바꿔 */
.pin-make    { left:28%; top:40%; }  /* 방 만들기 */
.pin-find    { left:66%; top:30%; }  /* 방 찾기 */
.pin-myrooms { left:46%; top:64%; }  /* 나의 방 */

@media (min-width:769px){
  .pin-make    { left:32%; top:42%; }
  .pin-find    { left:62%; top:32%; }
  .pin-myrooms { left:48%; top:66%; }
}

/* 아래 블록 */
.blocks{
  padding:16px; display:grid; gap:12px; max-width:960px; margin:0 auto;
}
.block-row{
  display:flex; align-items:center; gap:12px;
  background:#fff; border:1px solid #eee; border-radius:14px;
  padding:14px 16px; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,.04);
}
.block-row .ic{ font-size:20px }
.block-row .txt{ flex:1 }
.block-row .title{ font-weight:700; color:#111 }
.block-row .sub{ color:#666; font-size:12px }
.block-row .chev{ font-size:18px; color:#bbb }
</style>
