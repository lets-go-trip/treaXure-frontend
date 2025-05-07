<template>
  <div>
    <!-- 헤더 -->
    <div class="header">
      <div class="header-title">트레저헌터</div>
      <div class="header-action">
        <button class="icon-btn">⋮</button>
      </div>
    </div>
    
    <div class="map-view">
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      
      <div id="kakao-map" ref="kakaoMap"></div>
      
      <!-- 지도 위에 표시될 마커들 -->
      <div 
        v-for="(marker, index) in locationMarkers" 
        :key="index"
        class="location-marker" 
        :style="{ top: marker.top, left: marker.left }"
        @click="selectMarker(marker)">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4C13.4 4 8 9.4 8 16C8 25 20 36 20 36C20 36 32 25 32 16C32 9.4 26.6 4 20 4ZM20 20C17.8 20 16 18.2 16 16C16 13.8 17.8 12 20 12C22.2 12 24 13.8 24 16C24 18.2 22.2 20 20 20Z" 
                fill="currentColor" 
                :class="marker.fillClass" />
        </svg>
        <div class="marker-badge">{{ marker.badge }}</div>
      </div>
      
      <!-- 선택된 장소 정보 카드 -->
      <div class="info-card" v-if="selectedLocation">
        <div class="info-header">
          <div class="location-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 16H8V14H16V16ZM16 13H8V11H16V13ZM16 10H8V8H16V10Z" fill="currentColor" class="icon-fill"/>
            </svg>
          </div>
          <div>
            <div class="info-title">{{ selectedLocation.title }}</div>
            <div class="info-address">{{ selectedLocation.address }}</div>
          </div>
        </div>
        
        <div class="difficulty">
          <div 
            v-for="n in 5" 
            :key="n" 
            class="difficulty-unit" 
            :class="{ active: n <= selectedLocation.difficulty }">
          </div>
        </div>
        
        <div class="info-stats">
          <div>퀘스트 <span class="stat-value">{{ selectedLocation.questCount }}개</span></div>
          <div>코인 <span class="stat-value">{{ selectedLocation.coins }}</span></div>
          <div>상태 <span class="stat-value">{{ selectedLocation.status }}</span></div>
        </div>
        
        <div class="info-action">
          <router-link :to="'/mission-list/' + selectedLocation.id" class="btn-small">미션 보기</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { KakaoMapMixin } from '@/script';
import { ImageErrorMixin } from '@/script';

export default {
  name: 'TreasureHunt',
  mixins: [KakaoMapMixin, ImageErrorMixin],
  data() {
    return {
      selectedLocation: null,
      locationMarkers: [
        {
          id: 1,
          top: '25%',
          left: '25%',
          fillClass: 'marker-fill',
          badge: '2',
          title: '경복궁 숨겨진 비밀',
          address: '서울 종로구 사직로 161',
          difficulty: 2,
          questCount: 3,
          coins: 250,
          status: '접근 가능'
        },
        {
          id: 2,
          top: '45%',
          left: '65%',
          fillClass: 'marker-fill-secondary',
          badge: '3',
          title: '덕수궁 보물 찾기',
          address: '서울 중구 세종대로 99',
          difficulty: 3,
          questCount: 4,
          coins: 350,
          status: '접근 가능'
        },
        {
          id: 3,
          top: '65%',
          left: '40%',
          fillClass: 'marker-fill-completed',
          badge: '✓',
          title: '창덕궁 신비로운 길',
          address: '서울 종로구 율곡로 99',
          difficulty: 4,
          questCount: 2,
          coins: 500,
          status: '완료됨'
        }
      ]
    };
  },
  mounted() {
    // 카카오맵 초기화 (KakaoMapMixin에서 가져온 메서드)
    this.initMap(this.$refs.kakaoMap);
    
    // 기본적으로 첫 번째 마커 선택
    this.selectMarker(this.locationMarkers[0]);
  },
  methods: {
    selectMarker(marker) {
      this.selectedLocation = marker;
    }
  }
};
</script>

<style scoped>
/* 스타일은 전역 CSS에서 처리 */
</style> 