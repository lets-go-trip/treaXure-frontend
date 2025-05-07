<template>
  <div class="bottom-nav">
    <router-link to="/" class="nav-item" :class="{ active: currentRoute === '/' }">
      <div class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
        </svg>
      </div>
      <span>지도</span>
    </router-link>
    <router-link to="/mission-list" class="nav-item" :class="{ active: currentRoute === '/mission-list' }">
      <div class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
        </svg>
      </div>
      <span>탐색</span>
    </router-link>
    <router-link to="/all-missions" class="nav-item" :class="{ active: currentRoute === '/all-missions' }">
      <div class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor"/>
        </svg>
      </div>
      <span>전체 미션</span>
    </router-link>
    <router-link to="/weekly-best" class="nav-item" :class="{ active: currentRoute === '/weekly-best' }">
      <div class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3Z" fill="currentColor"/>
        </svg>
      </div>
      <span>랭킹</span>
    </router-link>
    <router-link to="/mypage" class="nav-item" :class="{ active: currentRoute === '/mypage' }">
      <div class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
        </svg>
      </div>
      <span>내정보</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'BottomNav',
  computed: {
    currentRoute() {
      return this.$route.path;
    }
  }
}
</script>

<style scoped>
/* 스타일은 전역 CSS에서 관리되므로 여기에 추가하지 않습니다 */
</style> 