<template>
  <div class="app-container">
    <router-view />
    <bottom-nav />
  </div>
</template>

<script>
import BottomNav from '@/components/BottomNav.vue'

export default {
  name: 'App',
  components: {
    BottomNav
  }
}
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  width: 360px;
  height: 640px;
  margin: 30px auto;
  background: var(--bg-primary);
  border-radius: 28px;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}
</style> 