import { createRouter, createWebHistory } from 'vue-router'

// 각 페이지 import
import MainPage from '@/pages/Home/MainPage.vue'
import FindRoom from '@/pages/Stub/FindRoom.vue'
import MyRooms from '@/pages/Stub/MyRooms.vue'
import MyPage from '@/pages/Stub/MyPage.vue'
import NoticeList from '@/pages/Home/Notice/NoticeList.vue'
import PaymentMethods from '@/pages/Payments/PaymentMethods.vue'

const routes = [
  { path: '/', name: 'home', component: MainPage },
  { path: '/find-room', name: 'find-room', component: FindRoom },
  { path: '/my-rooms', name: 'my-rooms', component: MyRooms },
  { path: '/mypage', name: 'mypage', component: MyPage },
  { path: '/notice', name: 'notice', component: NoticeList },
  { path: '/payment-methods', name: 'payment-methods', component: PaymentMethods },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
