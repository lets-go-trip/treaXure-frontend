<template>
  <div class="app-container">
    <router-view />
    <bottom-nav />
  </div>
</template>

<script>
import BottomNav from "@/components/BottomNav.vue";

export default {
  name: "App",
  components: {
    BottomNav,
  },
};
</script>
