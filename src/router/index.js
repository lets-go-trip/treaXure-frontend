import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Treasure',
    component: () => import('../views/Treasure.vue')
  },
  {
    path: '/mission-list',
    name: 'MissionList',
    component: () => import('../views/MissionList.vue')
  },
  {
    path: '/mission-list/:id',
    name: 'MissionListById',
    component: () => import('../views/MissionList.vue')
  },
  {
    path: '/mission-detail',
    name: 'MissionDetail',
    component: () => import('../views/MissionDetail.vue')
  },
  {
    path: '/mission-detail/:id',
    name: 'MissionDetailById',
    component: () => import('../views/MissionDetail.vue')
  },
  {
    path: '/all-missions',
    name: 'AllMissions',
    component: () => import('../views/AllMissions.vue')
  },
  {
    path: '/weekly-best',
    name: 'WeeklyBest',
    component: () => import('../views/WeeklyBest.vue')
  },
  {
    path: '/mypage',
    name: 'MyPage',
    component: () => import('../views/MyPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 