<template>
  <div class="all-missions-screen">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-back">
        <router-link to="/" class="icon-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
          </svg>
        </router-link>
      </div>
      <div class="header-title">전체 미션</div>
      <div class="header-action">
        <button class="icon-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 필터 및 정렬 옵션 -->
    <div class="filter-bar">
      <div class="filter-chips">
        <label class="chip" :class="{ active: filters.showIncomplete }">
          <input type="checkbox" v-model="filters.showIncomplete" class="chip-input">
          <div class="chip-content">
            <span class="chip-dot" v-if="filters.showIncomplete"></span>
            <span class="chip-label">미완료 미션</span>
          </div>
        </label>
        <label class="chip" :class="{ active: filters.showComplete }">
          <input type="checkbox" v-model="filters.showComplete" class="chip-input">
          <div class="chip-content">
            <span class="chip-dot" v-if="filters.showComplete"></span>
            <span class="chip-label">완료 미션</span>
          </div>
        </label>
      </div>
      <div class="sort-dropdown">
        <select v-model="sortOption" class="sort-select">
          <option value="recent">최근 방문순</option>
          <option value="points">포인트 높은순</option>
          <option value="location">장소별</option>
        </select>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="sort-icon">
          <path d="M7 10l5 5 5-5z" fill="currentColor"/>
        </svg>
      </div>
    </div>
    
    <!-- 스크롤 가능한 컨텐츠 영역 -->
    <div class="scrollable-content">
      <!-- 미션 목록 컨테이너 -->
      <div class="missions-container">
        <!-- 각 장소 그룹 -->
        <div 
          v-for="(location, locationIndex) in filteredLocations" 
          :key="locationIndex" 
          class="location-group">
          
          <!-- 장소 헤더 -->
          <div 
            class="location-header" 
            :class="{ collapsed: location.collapsed }"
            @click="toggleLocation(locationIndex)">
            <div class="location-image">
              <img :src="location.imageUrl" :alt="location.name">
            </div>
            <div class="location-details">
              <h3>{{ location.name }} <span class="location-stats">{{ location.completedCount }}/{{ location.totalCount }}</span></h3>
              <p>{{ location.address }}</p>
            </div>
            <div class="toggle-icon" :class="{ collapsed: location.collapsed }">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.59 8.59L12 13.17L7.41 8.59L6 10L12 16L18 10L16.59 8.59Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          <!-- 미션 리스트 -->
          <div 
            class="mission-list" 
            v-show="!location.collapsed">
            <div 
              v-for="(mission, missionIndex) in filteredMissions(location.missions)" 
              :key="missionIndex" 
              class="quest-card" 
              :class="{ completed: mission.completed }">
              <div class="quest-title">{{ mission.title }}</div>
              <div class="quest-desc">{{ mission.description }}</div>
              <div class="quest-footer">
                <div class="coin-reward">
                  <div class="coin-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#FFD700"/>
                      <path d="M12 7L14.39 11.79L19.5 12.26L15.75 15.9L16.8 21L12 18.27L7.2 21L8.25 15.9L4.5 12.26L9.61 11.79L12 7Z" fill="#FFD700"/>
                    </svg>
                  </div>
                  {{ mission.points }} 포인트
                </div>
                <div v-if="mission.completed" class="badge completed">완료</div>
                <router-link v-else :to="'/mission-detail/' + mission.id" class="btn-small">도전하기</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 하단 여백 -->
      <div class="bottom-space"></div>
    </div>
  </div>
</template>

<script>
import { ImageErrorMixin } from '@/script';

export default {
  name: 'AllMissions',
  mixins: [ImageErrorMixin],
  data() {
    return {
      filters: {
        showIncomplete: true,
        showComplete: true
      },
      sortOption: 'recent',
      locations: [
        {
          id: 1,
          name: '경복궁',
          address: '서울 종로구 사직로 161',
          imageUrl: 'https://via.placeholder.com/60x60?text=경복궁',
          completedCount: 2,
          totalCount: 3,
          collapsed: false,
          missions: [
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
        },
        {
          id: 2,
          name: '창덕궁',
          address: '서울 종로구 율곡로 99',
          imageUrl: 'https://via.placeholder.com/60x60?text=창덕궁',
          completedCount: 1,
          totalCount: 3,
          collapsed: false,
          missions: [
            {
              id: 4,
              title: '부용지 연꽃 촬영하기',
              description: '창덕궁의 후원에 있는 부용지에 피어있는 연꽃을 촬영해보세요.',
              points: 120,
              completed: true
            },
            {
              id: 5,
              title: '대조전 찾아가기',
              description: '왕비의 처소였던 대조전을 찾아 그 아름다운 건축양식을 담아보세요.',
              points: 150,
              completed: false
            },
            {
              id: 6,
              title: '낙선재 문고 탐방',
              description: '조선시대 왕실 도서관이었던 낙선재 문고를 찾아 인증샷을 찍어보세요.',
              points: 180,
              completed: false
            }
          ]
        },
        {
          id: 3,
          name: '덕수궁',
          address: '서울 중구 세종대로 99',
          imageUrl: 'https://via.placeholder.com/60x60?text=덕수궁',
          completedCount: 0,
          totalCount: 2,
          collapsed: false,
          missions: [
            {
              id: 7,
              title: '정관헌 촬영하기',
              description: '서양식 건물인 정관헌의 독특한 건축 양식을 담아보세요.',
              points: 130,
              completed: false
            },
            {
              id: 8,
              title: '중화전 찾기',
              description: '덕수궁의 정전인 중화전을 찾아 그 웅장한 모습을 촬영해보세요.',
              points: 170,
              completed: false
            }
          ]
        }
      ]
    };
  },
  computed: {
    filteredLocations() {
      let sortedLocations = [...this.locations];
      
      // 정렬 옵션에 따라 장소 목록 정렬
      switch (this.sortOption) {
        case 'recent':
          // 최근 방문순 (예시 데이터에서는 현재 순서 유지)
          break;
        case 'points':
          // 포인트 높은순
          sortedLocations.sort((a, b) => {
            const aMaxPoints = Math.max(...a.missions.map(m => m.points));
            const bMaxPoints = Math.max(...b.missions.map(m => m.points));
            return bMaxPoints - aMaxPoints;
          });
          break;
        case 'location':
          // 장소명 순
          sortedLocations.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
      
      return sortedLocations;
    }
  },
  methods: {
    toggleLocation(index) {
      this.locations[index].collapsed = !this.locations[index].collapsed;
    },
    filteredMissions(missions) {
      return missions.filter(mission => {
        if (mission.completed && this.filters.showComplete) return true;
        if (!mission.completed && this.filters.showIncomplete) return true;
        return false;
      });
    }
  }
};
</script>

<style scoped>
.all-missions-screen {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh; /* 최소 뷰포트 높이로 변경 */
  position: relative;
  background-color: var(--bg-secondary);
  overflow-y: auto; /* 스크롤 추가 */
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  background-color: var(--bg-primary);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 60px;
  z-index: 5;
  gap: var(--spacing-sm);
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  flex: 1;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  background-color: #f0f0f5;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  color: #8E8E93;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.chip-content {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
}

.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary);
  margin-right: 8px;
  display: inline-block;
  transition: transform 0.3s ease;
  box-shadow: 0 0 0 2px rgba(79, 108, 255, 0.2);
}

.chip.active {
  background-color: var(--bg-tertiary);
  color: var(--primary);
  border: 1px solid rgba(79, 108, 255, 0.3);
  box-shadow: 0 3px 8px rgba(79, 108, 255, 0.15);
  transform: translateY(-1px);
  font-weight: 600;
}

.chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.chip.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 4px;
}

.chip-input {
  display: none;
}

.sort-dropdown {
  position: relative;
}

.sort-select {
  appearance: none;
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 8px 30px 8px 14px;
  font-size: 13px;
  color: var(--text-dark);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.sort-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(79, 108, 255, 0.1);
}

.sort-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-medium);
}

.missions-container {
  padding: 0 var(--spacing-md);
  padding-bottom: 300px; /* 하단 여백 증가 */
}

.location-group {
  margin-bottom: var(--spacing-lg);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  background-color: var(--bg-primary);
}

.location-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background: linear-gradient(to right, var(--bg-tertiary), var(--bg-primary));
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.location-header:hover {
  background: linear-gradient(to right, rgba(79, 108, 255, 0.1), rgba(79, 108, 255, 0.05));
}

.location-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
  background-color: var(--bg-tertiary);
  border: 2px solid #fff;
  box-shadow: var(--shadow-sm);
}

.location-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.location-details {
  flex: 1;
}

.location-details h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-dark);
  display: flex;
  align-items: center;
}

.location-details p {
  font-size: 13px;
  color: var(--text-medium);
  margin: 0;
}

.location-stats {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(79, 108, 255, 0.1);
  color: var(--primary);
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
  padding: 2px 8px;
  margin-left: var(--spacing-sm);
}

.toggle-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.toggle-icon.collapsed {
  transform: rotate(-180deg);
}

.mission-list {
  padding: var(--spacing-md);
  background-color: var(--bg-primary);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.quest-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.quest-card:last-child {
  margin-bottom: 0;
}

.quest-card:active {
  transform: translateY(2px);
  box-shadow: var(--shadow-sm);
}

.quest-card.completed {
  background-color: var(--bg-tertiary);
  border-left: 4px solid var(--primary);
}

.quest-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-dark);
}

.quest-desc {
  font-size: 13px;
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
  font-size: 13px;
}

.coin-icon {
  display: flex;
  align-items: center;
  margin-right: var(--spacing-xs);
}

.badge.completed {
  background-color: rgba(79, 108, 255, 0.1);
  color: var(--primary);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 반응형 디자인 */
@media (min-width: 769px) {
  .missions-container {
    padding: var(--spacing-lg);
  }
  
  .location-group {
    margin-bottom: var(--spacing-xl);
  }
  
  .quest-card {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  }
  
  .quest-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .filter-bar {
    padding: var(--spacing-md) var(--spacing-lg);
  }
}

/* 반응형 스타일 */
@media (max-width: 480px) {
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .sort-dropdown {
    width: 100%;
  }
  
  .sort-select {
    width: 100%;
  }
}

/* scrollable-content 클래스 추가 */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

/* 하단 여백 */
.bottom-space {
  height: 300px; /* 충분한 하단 여백 */
  width: 100%;
}
</style> 