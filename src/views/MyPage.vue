<template>
  <div class="mypage">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-title">마이페이지</div>
      <div class="header-action">
        <button class="icon-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.91 7.63 6.29L5.24 5.33C5.02 5.26 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.74 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 마이페이지 컨테이너 -->
    <div class="profile-section">
      <div class="profile-header">
        <div class="profile-avatar">
          <img src="https://via.placeholder.com/90x90?text=KM" alt="프로필 이미지">
          <div class="edit-avatar-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="white"/>
            </svg>
          </div>
        </div>
        <div class="profile-info">
          <h2>{{ userData.name }}</h2>
          <p>Level {{ userData.level }} · {{ userData.title }}</p>
          <div class="level-progress">
            <div class="level-bar">
              <div class="level-fill" :style="{ width: userData.levelProgress + '%' }"></div>
            </div>
            <span>{{ userData.currentPoints }}/{{ userData.maxPoints }} 포인트</span>
          </div>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-box" v-for="(stat, index) in stats" :key="index">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
    
    <div class="ranking-section">
      <div class="section-header">
        <h3>나의 랭킹</h3>
        <router-link to="/rankings" class="view-all">전체보기</router-link>
      </div>
      
      <div class="ranking-card" v-for="(ranking, index) in rankings" :key="index">
        <div class="ranking-position">
          <div class="position-number">{{ ranking.position }}</div>
          <div class="position-text">{{ ranking.percentile }}</div>
        </div>
        <div class="ranking-info">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :d="ranking.iconPath" fill="currentColor" class="icon-fill"/>
          </svg>
          <div>
            <div class="ranking-title">{{ ranking.title }}</div>
            <div class="ranking-subtitle">{{ ranking.subtitle }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="recent-photos">
      <div class="section-header">
        <h3>최근 미션 사진</h3>
        <router-link to="/photos" class="view-all">전체보기</router-link>
      </div>
      
      <div class="photo-grid">
        <div class="photo-item" v-for="(photo, index) in recentPhotos" :key="index">
          <img :src="photo.url" :alt="photo.alt">
          <div v-if="photo.badge" class="photo-badge" :class="{ best: photo.badge === 'best' }">
            {{ photo.badge === 'best' ? '베스트' : photo.badge }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <router-link v-for="(setting, index) in settings" :key="index" :to="setting.link" class="settings-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :d="setting.iconPath" fill="currentColor" class="icon-fill"/>
        </svg>
        <span>{{ setting.title }}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ImageErrorMixin } from '@/script';

export default {
  name: 'MyPage',
  mixins: [ImageErrorMixin],
  data() {
    return {
      userData: {
        name: '김모험',
        level: 5,
        title: '보물 탐험가',
        levelProgress: 65,
        currentPoints: 650,
        maxPoints: 1000
      },
      stats: [
        { value: 24, label: '방문 장소' },
        { value: 42, label: '완료 미션' },
        { value: 5, label: '베스트 사진' },
        { value: '3,250', label: '총 포인트' }
      ],
      rankings: [
        {
          position: 8,
          percentile: '상위 5% 탐험가',
          iconPath: 'M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z',
          title: '지역 랭킹',
          subtitle: '서울 종로구 기준'
        },
        {
          position: 42,
          percentile: '상위 15% 탐험가',
          iconPath: 'M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z',
          title: '전국 랭킹',
          subtitle: '최근 30일 기준'
        }
      ],
      recentPhotos: [
        { url: 'https://via.placeholder.com/150x150?text=미션1', alt: '미션 사진', badge: 'best' },
        { url: 'https://via.placeholder.com/150x150?text=미션2', alt: '미션 사진' },
        { url: 'https://via.placeholder.com/150x150?text=미션3', alt: '미션 사진', badge: '+100' },
        { url: 'https://via.placeholder.com/150x150?text=미션4', alt: '미션 사진' }
      ],
      settings: [
        {
          title: '미션 알림 설정',
          iconPath: 'M19 2H5C3.9 2 3 2.9 3 4V18C3 19.1 3.9 20 5 20H9L12 23L15 20H19C20.1 20 21 19.1 21 18V4C21 2.9 20.1 2 19 2ZM19 18H14.17L12 20.17L9.83 18H5V4H19V18Z',
          link: '/settings/notifications'
        },
        {
          title: '계정 설정',
          iconPath: 'M12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 15C14.7 15 17.8 16.29 18 17V18H6V17.01C6.2 16.29 9.3 15 12 15ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13Z',
          link: '/settings/account'
        },
        {
          title: '로그아웃',
          iconPath: 'M10.09 15.59L11.5 17L16.5 12L11.5 7L10.09 8.41L12.67 11H3V13H12.67L10.09 15.59ZM19 3H5C3.89 3 3 3.9 3 5V9H5V5H19V19H5V15H3V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z',
          link: '/logout'
        }
      ]
    };
  }
};
</script>

<style scoped>
/* 스타일은 메인 CSS에서 처리됨 */
</style> 