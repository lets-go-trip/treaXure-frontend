<template>
  <div class="weekly-best">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-back">
        <router-link to="/" class="icon-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
          </svg>
        </router-link>
      </div>
      <div class="header-title">주간 베스트</div>
      <div class="header-action">
        <button class="icon-btn">⋮</button>
      </div>
    </div>
    
    <!-- 주간 날짜 선택 -->
    <div class="date-selector">
      <button class="date-nav prev" @click="changePeriod(-1)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor"/>
        </svg>
      </button>
      <div class="date-display">{{ currentPeriod }}</div>
      <button class="date-nav next" @click="changePeriod(1)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
    
    <!-- 베스트 컨텐츠 -->
    <div class="best-content">
      <!-- 1위 사진 -->
      <div class="best-photo first">
        <div class="photo-rank">1위</div>
        <div class="photo-image" :class="{ 'empty-image': !bestPhotos[0].imageUrl }">
          <img v-if="bestPhotos[0].imageUrl" :src="bestPhotos[0].imageUrl" :alt="bestPhotos[0].alt">
        </div>
        <div class="photo-info">
          <div class="photo-header">
            <div class="user-info">
              <div class="user-avatar">
                <img :src="bestPhotos[0].userAvatar" :alt="bestPhotos[0].userName">
              </div>
              <div>
                <div class="user-name">{{ bestPhotos[0].userName }}</div>
                <div class="photo-location">{{ bestPhotos[0].location }}</div>
              </div>
            </div>
            <div class="like-button" @click="likePhoto(0)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :d="bestPhotos[0].isLiked ? heartFilled : heartOutline" fill="currentColor"/>
              </svg>
              <span>{{ bestPhotos[0].likes }}</span>
            </div>
          </div>
          <div class="photo-desc">{{ bestPhotos[0].description }}</div>
          <div class="action-bar">
            <button class="btn-outline btn-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
              </svg>
              댓글 {{ bestPhotos[0].comments }}개
            </button>
            <button class="btn-outline btn-sm" @click="sharePhoto(bestPhotos[0])">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor"/>
              </svg>
              공유하기
            </button>
          </div>
        </div>
      </div>
      
      <!-- 2, 3위 사진 -->
      <div class="runners-up">
        <div v-for="(photo, index) in bestPhotos.slice(1, 3)" :key="index + 1" :class="`best-photo ${index === 0 ? 'second' : 'third'}`">
          <div class="photo-rank">{{ index + 2 }}위</div>
          <div class="photo-image" :class="{ 'empty-image': !photo.imageUrl }">
            <img v-if="photo.imageUrl" :src="photo.imageUrl" :alt="photo.alt">
          </div>
          <div class="photo-info">
            <div class="photo-header">
              <div class="user-info">
                <div class="user-name">{{ photo.userName }}</div>
                <div class="photo-location">{{ photo.location }}</div>
              </div>
              <div class="like-count">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :d="photo.isLiked ? heartFilled : heartOutline" fill="currentColor"/>
                </svg>
                {{ photo.likes }}
              </div>
            </div>
            <div class="photo-desc-short">{{ photo.description }}</div>
          </div>
        </div>
      </div>
      
      <!-- 투표 참여 안내 -->
      <div class="vote-info">
        <div class="vote-header">
          <h3>이번 주 미션 투표에 참여하세요!</h3>
          <div class="vote-stats">
            <div class="vote-count">현재 {{ voteInfo.participants }}명 참여</div>
            <div class="time-left">남은 시간: {{ voteInfo.timeLeft }}</div>
          </div>
        </div>
        <div class="vote-action">
          <button class="btn" @click="participateVote">투표 참여하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImageErrorMixin } from '@/script';

export default {
  name: 'WeeklyBest',
  mixins: [ImageErrorMixin],
  data() {
    return {
      currentPeriod: '2023년 10월 2주차',
      heartFilled: 'M16.5 3C14.76 3 13.09 3.81 12 5.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.04L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3Z',
      heartOutline: 'M16.5 3C14.76 3 13.09 3.81 12 5.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.04L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3ZM12.1 18.55L12 18.65L11.9 18.55C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5C9.04 5 10.54 5.99 11.07 7.36H12.94C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5C20 11.39 16.86 14.24 12.1 18.55Z',
      bestPhotos: [
        {
          id: 1,
          imageUrl: 'https://via.placeholder.com/360x240?text=1위+미션사진',
          alt: '1위 사진',
          userAvatar: 'https://via.placeholder.com/40x40?text=K',
          userName: '김찰칵',
          location: '경복궁 · 향원정',
          likes: 483,
          isLiked: false,
          comments: 35,
          description: '석양이 비치는 향원정의 아름다운 풍경을 담았습니다. 가을의 정취가 가득한 순간이었어요!'
        },
        {
          id: 2,
          imageUrl: 'https://via.placeholder.com/280x180?text=2위+미션사진',
          alt: '2위 사진',
          userName: '이탐험',
          location: '창덕궁 · 부용지',
          likes: 359,
          isLiked: true,
          comments: 18,
          description: '연못에 비친 부용정의 모습이 마치 거울처럼 선명했어요.'
        },
        {
          id: 3,
          imageUrl: 'https://via.placeholder.com/280x180?text=3위+미션사진',
          alt: '3위 사진',
          userName: '박여행',
          location: '덕수궁 · 정관헌',
          likes: 291,
          isLiked: false,
          comments: 24,
          description: '서양식 건물인 정관헌의 독특한 분위기를 담아봤습니다.'
        }
      ],
      voteInfo: {
        participants: 1245,
        timeLeft: '3일 12시간'
      }
    };
  },
  methods: {
    changePeriod(direction) {
      // 현재 기간을 변경하는 로직
      // 실제 구현에서는 API를 호출하여 다른 기간의 데이터를 가져올 것
      const year = 2023;
      const month = 10;
      const week = parseInt(this.currentPeriod.match(/(\d+)주차/)[1]) + direction;
      
      if (week >= 1 && week <= 5) {
        this.currentPeriod = `${year}년 ${month}월 ${week}주차`;
        this.loadPhotosForPeriod();
      }
    },
    loadPhotosForPeriod() {
      // 해당 기간의 베스트 사진을 로드하는 로직
      // 실제 구현에서는 API를 호출할 것
      console.log('Loading photos for period:', this.currentPeriod);
    },
    likePhoto(photoIndex) {
      // 사진 좋아요 토글 기능
      const photo = this.bestPhotos[photoIndex];
      if (photo.isLiked) {
        photo.likes--;
      } else {
        photo.likes++;
      }
      photo.isLiked = !photo.isLiked;
    },
    sharePhoto(photo) {
      // 사진 공유 기능
      console.log('Sharing photo:', photo);
      // 실제 구현에서는 공유 다이얼로그를 표시할 것
      alert(`사진을 공유합니다: ${photo.userName}의 ${photo.location} 사진`);
    },
    participateVote() {
      // 투표 참여 기능
      console.log('Participating in vote');
      // 실제 구현에서는 투표 페이지로 이동하거나 투표 모달을 표시할 것
      alert('투표 페이지로 이동합니다.');
    }
  },
  mounted() {
    // 컴포넌트 마운트 시 초기 데이터 로드
    this.loadPhotosForPeriod();
  }
};
</script>

<style scoped>
.weekly-best {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

/* 헤더 스타일 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  min-height: 60px;
  padding: 0 var(--spacing-md);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.header-back, .header-action {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--text-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.icon-btn:active {
  transform: scale(0.95);
}

/* 스크롤 가능한 컨텐츠 영역 */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  height: calc(100% - 60px);
  scrollbar-width: thin;
  padding-bottom: 120px; /* 하단 여백 더 크게 증가 */
}

/* 날짜 선택기 스타일 */
.date-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background-color: var(--bg-primary);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 5;
}

.date-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.date-nav:hover {
  background-color: var(--bg-tertiary);
}

.date-nav:active {
  transform: scale(0.95);
}

.date-display {
  font-weight: 600;
  font-size: 16px;
  padding: 0 var(--spacing-lg);
  color: var(--text-dark);
}

/* 컨텐츠 영역 스타일 */
.best-content {
  padding: 0 var(--spacing-md);
  padding-bottom: 350px; /* 매우 큰 하단 여백 */
}

.bottom-space {
  height: 300px; /* 더 큰 하단 여백 */
  width: 100%;
}

/* 베스트 사진 공통 스타일 */
.best-photo {
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal);
}

.best-photo:hover {
  transform: translateY(-3px);
}

.rank-badge {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  z-index: 2;
  box-shadow: var(--shadow-sm);
}

.photo-image {
  width: 100%;
  height: 240px;
  background-color: var(--bg-tertiary);
  position: relative;
  overflow: hidden;
}

.best-photo.second .photo-image,
.best-photo.third .photo-image {
  height: 180px;
}

.photo-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.photo-image img:hover {
  transform: scale(1.05);
}

.empty-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-tertiary);
  color: var(--text-light);
  font-size: 16px;
}

/* 사진 정보 영역 */
.photo-info {
  padding: var(--spacing-md);
}

.photo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-right: var(--spacing-xs);
  flex: 1;
}

.best-photo.first .user-info {
  flex-direction: row;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 15px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-location {
  font-size: 12px;
  color: var(--text-medium);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.like-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-medium);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: 16px;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.like-button.liked {
  color: #E74C3C;
}

.like-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.like-button span {
  margin-left: 4px;
  font-weight: 500;
}

.like-button.small {
  font-size: 12px;
  padding: 4px 8px;
}

.photo-desc, .photo-desc-short {
  color: var(--text-medium);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
}

.photo-desc-short {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  margin-bottom: 0;
}

/* 액션 바 스타일 */
.action-bar {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-interact {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-tertiary);
  color: var(--text-medium);
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-interact svg {
  margin-right: 4px;
}

.btn-interact:hover {
  background-color: rgba(79, 108, 255, 0.1);
  color: var(--primary);
}

.btn-interact:active {
  transform: scale(0.98);
}

/* 2, 3위 사진 컨테이너 */
.runners-up {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.runners-up .best-photo {
  margin-bottom: 0;
}

.runners-up .photo-info {
  padding: var(--spacing-sm) var(--spacing-md);
}

/* 투표 섹션 - 더 많은 여백과 높은 z-index */
.vote-section {
  margin-top: var(--spacing-xl);
  margin-bottom: calc(var(--spacing-xl) * 2);
  position: relative;
  z-index: 5; /* 네비게이션 바보다는 낮게 설정 */
}

/* 투표 정보 섹션 */
.vote-info {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  color: white;
  box-shadow: var(--shadow-md);
  position: relative;
  z-index: 5; /* 네비게이션 바보다는 낮게 설정 */
}

.vote-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.vote-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  font-size: 14px;
  opacity: 0.9;
}

.vote-count, .time-left {
  display: flex;
  align-items: center;
}

.vote-count svg, .time-left svg {
  margin-right: 4px;
}

.vote-action {
  display: flex;
  justify-content: center;
  padding: var(--spacing-sm) 0;
}

.btn-primary {
  background-color: white;
  color: var(--primary);
  font-weight: 600;
  padding: 14px 28px;
  border-radius: var(--radius-sm);
  border: none;
  font-size: 15px;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  position: relative;
  z-index: 6; /* 투표 섹션보다는 위에 있어야 함 */
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}

/* 반응형 스타일 */
@media (max-width: 480px) {
  .runners-up {
    grid-template-columns: 1fr;
  }
  
  .best-content {
    padding-bottom: 400px; /* 모바일에서 더 큰 하단 여백 */
  }
  
  .bottom-space {
    height: 350px; /* 모바일에서 더 큰 하단 여백 */
  }
}

@media (min-width: 768px) {
  .best-photo.first {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
  }
  
  .best-photo.first .photo-image {
    height: 100%;
  }
  
  .photo-image img {
    height: 100%;
  }
}
</style> 