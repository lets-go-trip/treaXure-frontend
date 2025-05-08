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
/* 프리텐다드 폰트 추가 */
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css");

/* 전역 CSS 변수 - 디자인 시스템 */
:root {
  /* 주요 색상 */
  --primary: #4F6CFF;
  --primary-dark: #3F56CC;
  --secondary: #6652FF;
  
  /* 중립 색상 */
  --text-dark: #333333;
  --text-medium: #666666;
  --text-light: #999999;
  --border-color: #E0E0E0;
  
  /* 배경 색상 */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #f0f3ff;
  
  /* 상태 색상 */
  --success: #2ECC71;
  --warning: #F39C12;
  --error: #E74C3C;
  
  /* 그림자 */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  
  /* 라운딩 */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  
  /* 애니메이션 */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  
  /* 간격 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}

/* 기본 스타일 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--text-dark);
  background-color: #f0f2f5;
}

/* 스크롤바 스타일 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.03);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.15);
}

/* 버튼 공통 스타일 */
button, .btn {
  cursor: pointer;
  border: none;
  font-family: inherit;
}

/* 앱 컨테이너 스타일 */
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
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

/* 아이콘 크기 일관성 */
.icon-btn svg {
  color: inherit;
}

/* 헤더 공통 스타일 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 var(--spacing-md);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  z-index: 10;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
}

/* 버튼 스타일 */
.btn-small {
  background: var(--primary);
  color: white;
  padding: 10px 24px;
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  transition: background var(--transition-fast), transform var(--transition-fast);
  border: none;
}

.btn-small:hover {
  background: var(--primary-dark);
}

.btn-small:active {
  transform: scale(0.98);
}

/* 배지 스타일 */
.badge {
  display: inline-block;
  background-color: var(--bg-tertiary);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
}

/* 미디어 쿼리 */
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