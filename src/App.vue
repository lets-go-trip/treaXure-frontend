<template>
  <div class="app-container">
    <router-view />
    <!-- 인증 필요 페이지일 때만 바텀 내비를 띄운다 -->
    <bottom-nav v-if="showBottomNav" />
  </div>
</template>

<script>
import BottomNav from "@/components/BottomNav.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "App",
  components: {
    BottomNav,
  },
  setup() {
    const route = useRoute();
    // 현재 라우트에 meta.requiresAuth 가 true 여야만 BottomNav 보이도록
    const showBottomNav = computed(() => !!route.meta.requiresAuth);
    return { showBottomNav };
  },
};
</script>
