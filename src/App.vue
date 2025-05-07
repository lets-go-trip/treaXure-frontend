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
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  margin: 0 auto;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

@media (min-width: 769px) {
  .app-container {
    margin: 20px auto;
    min-height: calc(100vh - 40px);
  }
}

@media (min-height: 900px) {
  .app-container {
    max-height: 90vh;
  }
}
</style> 