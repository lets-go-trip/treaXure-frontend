// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// 페이지 컴포넌트 import
import Main from "@/views/Main.vue";
import Signin from "@/views/SignIn.vue";
import Signup from "@/views/SignUp.vue";
import Treasure from "@/views/Treasure.vue";
import AllMissions from "@/views/AllMissions.vue";
import MissionList from "@/views/MissionList.vue";
import MissionListById from "@/views/MissionList.vue";
import MissionDetailById from "@/views/MissionDetail.vue";
import Explorer from "@/views/Explorer.vue";
import Ranking from "@/views/Ranking.vue";
import MyPage from "@/views/MyPage.vue";
import ProfileEdit from "@/views/ProfileEdit.vue";
import Favorite from "@/views/Favorite.vue";

const routes = [
  { path: "/main", name: "Main", component: Main },
  { path: "/signin", name: "Signin", component: Signin },
  { path: "/signup", name: "Signup", component: Signup },
  {
    path: "/treasure",
    name: "Treasure",
    component: Treasure,
    meta: { requiresAuth: true },
  },
  {
    path: "/all-missions",
    name: "AllMissions",
    component: AllMissions,
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
    meta: { requiresAuth: false },
  },
  {
    path: "/explorer",
    name: "Explorer",
    component: Explorer,
    meta: { requiresAuth: true },
  },
  {
    path: "/ranking",
    name: "Ranking",
    component: Ranking,
    meta: { requiresAuth: true },
  },
  {
    path: "/mypage",
    name: "MyPage",
    component: MyPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile-edit",
    name: "ProfileEdit",
    component: ProfileEdit,
    meta: { requiresAuth: true },
  },
  {
    path: "/favorite",
    name: "Favorite",
    component: Favorite,
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
    return next(to.path); // teasure 페이지
  }

  const jwtToken = localStorage.getItem("jwtToken");

  // 로그인된 사용자가 접근 불가능한 페이지 제한
  const isGuestOnlyPage = ["/main", "/signin", "/signup"].includes(to.path);
  if (jwtToken && isGuestOnlyPage) {
    return next("/treasure");
  }

  // 인증 필요 없는 경로
  if (to.path === "/main" || to.path === "/signin" || to.path === "/signup") {
    return next();
  }

  // 인증 필요 시 accessToken 여부 확인
  if (to.meta.requiresAuth && !jwtToken) {
    return next("/main");
  }

  next();
});

export default router;
