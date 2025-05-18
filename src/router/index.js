// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// 페이지 컴포넌트 import
import Signin from "@/views/SignIn.vue";
import Signup from "@/views/SignUp.vue";
import Treasure from "@/views/Treasure.vue";
import MissionList from "@/views/MissionList.vue";
import MissionListById from "@/views/MissionList.vue";
import MissionDetailById from "@/views/MissionDetail.vue";
import AllMissions from "@/views/AllMissions.vue";
import WeeklyBest from "@/views/WeeklyBest.vue";
import MyPage from "@/views/MyPage.vue";

const routes = [
  { path: "/signin", name: "Signin", component: Signin },
  { path: "/signup", name: "Signup", component: Signup },
  {
    path: "/treasure",
    name: "Treasure",
    component: Treasure,
    meta: { requiresAuth: true },
  },
  {
    path: "/mission-list",
    name: "MissionList",
    component: MissionList,
    meta: { requiresAuth: true },
  },
  {
    path: "/mission-list/:id",
    name: "MissionListById",
    component: MissionListById,
    meta: { requiresAuth: true },
  },
  {
    path: "/mission-detail/:id",
    name: "MissionDetailById",
    component: MissionDetailById,
    meta: { requiresAuth: true },
  },
  {
    path: "/all-missions",
    name: "AllMissions",
    component: AllMissions,
    meta: { requiresAuth: true },
  },
  {
    path: "/weekly-best",
    name: "WeeklyBest",
    component: WeeklyBest,
    meta: { requiresAuth: true },
  },
  {
    path: "/mypage",
    name: "MyPage",
    component: MyPage,
    meta: { requiresAuth: true },
  },
  { path: "/", redirect: "/treasure" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 라우터 가드
router.beforeEach((to, from, next) => {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");

  // 소셜 로그인으로 들어온 경우
  if (token) {
    localStorage.setItem("jwtToken", token);

    // URL에서 ?token= 제거
    url.searchParams.delete("token");
    window.history.replaceState({}, "", url.pathname);

    // 현재 라우팅으로 재진입
    return next(to.fullPath); // 같은 경로 다시 접근
  }

  const accessToken = localStorage.getItem("jwtToken");

  // 인증 필요 없는 경로
  if (to.path === "/signin" || to.path === "/signup") {
    return next();
  }

  // 인증 필요 시 accessToken 여부 확인
  if (to.meta.requiresAuth && !accessToken) {
    return next("/signin");
  }

  next();
});

export default router;
