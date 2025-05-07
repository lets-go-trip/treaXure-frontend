<template>
  <div>
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
        <button class="icon-btn">⋮</button>
      </div>
    </div>
    
    <!-- 필터 및 정렬 옵션 -->
    <div class="filter-bar">
      <div class="filter-options">
        <label class="checkbox">
          <input type="checkbox" v-model="filters.showIncomplete">
          <span class="checkbox-label">미완료 미션</span>
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="filters.showComplete">
          <span class="checkbox-label">완료 미션</span>
        </label>
      </div>
      <div class="sort-dropdown">
        <select v-model="sortOption">
          <option value="recent">최근 방문순</option>
          <option value="points">포인트 높은순</option>
          <option value="location">장소별</option>
        </select>
      </div>
    </div>
    
    <!-- 미션 목록 컨테이너 -->
    <div class="all-missions">
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
            <h3>{{ location.name }} <span class="location-stats">{{ location.completedCount }}/{{ location.totalCount }} 완료</span></h3>
            <p>{{ location.address }}</p>
          </div>
          <div class="toggle-icon">
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
                <div class="coin-icon">●</div>
                {{ mission.points }} 포인트
              </div>
              <div v-if="mission.completed" class="badge completed">완료</div>
              <router-link v-else :to="'/mission-detail/' + mission.id" class="btn-small">도전하기</router-link>
            </div>
          </div>
        </div>
      </div>
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
/* 스타일은 전역 CSS에서 처리 */
</style> 