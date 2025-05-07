<template>
  <div class="quest-screen">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-back">
        <router-link to="/" class="icon-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
          </svg>
        </router-link>
      </div>
      <div class="header-title">{{ locationInfo.name }}</div>
      <div class="header-action">
        <button class="icon-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 미션 진행 상태 표시 -->
    <div class="progress-container">
      <div class="progress-info">
        <span>미션 진행도</span>
        <span class="progress-percentage">{{ Math.round((locationInfo.completedCount / locationInfo.totalCount) * 100) }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: (locationInfo.completedCount / locationInfo.totalCount) * 100 + '%' }"></div>
      </div>
    </div>
    
    <!-- 미션 리스트 컨테이너 -->
    <div class="quest-list">
      <!-- 장소 정보 헤더 -->
      <div class="location-header">
        <div class="location-image">
          <img src="https://via.placeholder.com/120x120?text=경복궁" alt="경복궁">
        </div>
        <div class="location-details">
          <h3>{{ locationInfo.name }} <span class="completion-badge">{{ locationInfo.completedCount }}/{{ locationInfo.totalCount }} 완료</span></h3>
          <p>{{ locationInfo.address }}</p>
          <div class="badge">{{ locationInfo.status }}</div>
        </div>
      </div>
      
      <!-- 미션 카드 목록 -->
      <h4 class="section-title">미션 목록</h4>
      <div 
        v-for="(quest, index) in quests" 
        :key="index" 
        class="quest-card"
        :class="{ completed: quest.completed }">
        <div class="quest-title">{{ quest.title }}</div>
        <div class="quest-desc">{{ quest.description }}</div>
        <div class="quest-footer">
          <div class="coin-reward">
            <div class="coin-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#FFD700"/>
                <path d="M12 7L14.39 11.79L19.5 12.26L15.75 15.9L16.8 21L12 18.27L7.2 21L8.25 15.9L4.5 12.26L9.61 11.79L12 7Z" fill="#FFD700"/>
              </svg>
            </div>
            {{ quest.points }} 포인트
          </div>
          <div v-if="quest.completed" class="badge completed">완료</div>
          <router-link v-else :to="'/mission-detail/' + quest.id" class="btn-small">도전하기</router-link>
        </div>
      </div>
      
      <!-- 추가 정보 섹션 -->
      <div class="location-info">
        <h4>장소 정보</h4>
        <p>{{ locationInfo.description }}</p>
        <div class="info-stats">
          <div>방문자 <span class="stat-value">{{ locationInfo.visitors }}명</span></div>
          <div>평균 완료 <span class="stat-value">{{ locationInfo.avgCompletionTime }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImageErrorMixin } from '@/script';

export default {
  name: 'MissionList',
  mixins: [ImageErrorMixin],
  data() {
    return {
      locationInfo: {
        id: 1,
        name: '경복궁 숨겨진 비밀',
        address: '서울 종로구 사직로 161',
        completedCount: 2,
        totalCount: 3,
        status: '방문 완료',
        description: `경복궁은 조선왕조의 법궁으로, 1395년 태조 이성계가 창건했습니다. 고려 말 개성에서 한양으로 수도를 옮긴 후 가장 먼저 지어진 궁궐입니다. 경복(景福)이란 이름은 '큰 복을 누리라'는 의미를 담고 있습니다.`,
        visitors: '3,250',
        avgCompletionTime: '2.5시간'
      },
      quests: [
        {
          id: 1,
          title: '경복궁 근정전 인증하기',
          description: '경복궁의 정전인 근정전 앞에서 인증샷을 찍어보세요.',
          points: 100,
          completed: true
        },
        {
          id: 2,
          title: '향원정의 연못 찾기',
          description: '경복궁 후원에 있는 향원정 연못의 아름다운 모습을 담아보세요.',
          points: 150,
          completed: true
        },
        {
          id: 3,
          title: '숨겨진 동궁과 후원 찾기',
          description: '경복궁에서 가장 아름다운 영역 중 하나인 동궁과 후원의 풍경을 담아보세요.',
          points: 200,
          completed: false
        }
      ]
    };
  },
  mounted() {
    // 라우터에서 전달된 장소 ID를 기반으로 미션 데이터 로드
    const locationId = this.$route.params.id;
    if (locationId) {
      // 실제 구현에서는 API를 호출하여 해당 장소의 미션 목록을 가져올 것
      console.log('Loading missions for location ID:', locationId);
    }
  }
};
</script>

<style scoped>
.quest-screen {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: var(--bg-secondary);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 16px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
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
  color: #333;
}

.icon-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.quest-list {
  flex: 1;
  padding: var(--spacing-md);
  padding-bottom: 300px; /* 네비게이션 바 위치 고려하여 큰 여백 추가 */
}

.location-header {
  display: flex;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(79, 108, 255, 0.18);
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.location-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  overflow: hidden;
}

.location-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.location-details {
  flex: 1;
  padding: var(--spacing-md);
  color: #fff;
}

.location-details h3 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm);
}

.location-details p {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 14px;
  opacity: 0.9;
}

.completion-badge {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4px var(--spacing-sm);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.badge {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
}

.quest-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  border-left: 4px solid var(--primary);
}

.quest-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.quest-card.completed {
  border-left: 4px solid var(--success);
  opacity: 0.9;
}

.quest-title {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-dark);
}

.quest-desc {
  font-size: 14px;
  color: var(--text-medium);
  margin-bottom: var(--spacing-md);
  line-height: 1.5;
}

.quest-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coin-reward {
  display: flex;
  align-items: center;
  color: var(--secondary);
  font-weight: 500;
  font-size: 14px;
}

.coin-icon {
  margin-right: 6px;
  color: #FFD700;
  font-size: 16px;
}

.btn-small {
  background: #4F6CFF;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
  border: none;
  cursor: pointer;
}

.btn-small:hover {
  background: #3F56CC;
}

.badge.completed {
  background-color: #e8f0fe;
  color: var(--primary);
}

.location-info {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.location-info h4 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 16px;
  color: var(--text-dark);
}

.location-info p {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 14px;
  color: var(--text-medium);
  line-height: 1.5;
}

.info-stats {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--text-medium);
}

.stat-value {
  font-weight: 600;
  color: var(--primary);
}

/* 반응형 스타일 */
@media (min-width: 769px) {
  .quest-list {
    padding: var(--spacing-lg);
  }
  
  .location-header {
    margin-bottom: var(--spacing-xl);
  }
  
  .quest-card {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  }
  
  .quest-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

/* 새로 추가된 스타일 */
.progress-container {
  padding: var(--spacing-md) var(--spacing-md) 0;
  background-color: var(--bg-primary);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
  font-size: 13px;
  color: var(--text-medium);
}

.progress-percentage {
  color: var(--primary);
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 5px;
  background: var(--bg-secondary);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 3px;
  transition: width 0.5s ease;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin: var(--spacing-md) 0;
}

.coin-icon {
  display: flex;
  align-items: center;
  margin-right: var(--spacing-xs);
}

@media (min-width: 769px) {
  .progress-container {
    padding: var(--spacing-md) var(--spacing-lg) 0;
  }
}

/* 여백 공간 추가 */
.bottom-space {
  height: 300px;
  width: 100%;
}
</style> 