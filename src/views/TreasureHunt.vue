<template>
  <div class="map-container">
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
      // 고정된 카카오맵 마커로 대체하므로 locationMarkers 배열은 더 이상 필요하지 않음
      palaceData: [
        {
          id: 1,
          title: '경복궁 숨겨진 비밀',
          address: '서울 종로구 사직로 161',
          difficulty: 2,
          questCount: 3,
          coins: 250,
          status: '접근 가능'
        },
        {
          id: 2,
          title: '덕수궁 보물 찾기',
          address: '서울 중구 세종대로 99',
          difficulty: 3,
          questCount: 4,
          coins: 350,
          status: '접근 가능'
        },
        {
          id: 3,
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
    this.$nextTick(() => {
      if (this.$refs.kakaoMap) {
        this.initMap(this.$refs.kakaoMap);
        
        // 기본적으로 첫 번째 궁궐 정보 표시
        this.selectedLocation = this.palaceData[0];
        
        // 글로벌 이벤트 리스너 추가
        window.addEventListener('palaceSelected', this.handlePalaceSelected);
      }
    });
  },
  beforeUnmount() {
    // 컴포넌트 제거 시 이벤트 리스너 제거
    window.removeEventListener('palaceSelected', this.handlePalaceSelected);
  },
  methods: {
    // 궁궐 마커가 클릭되었을 때 호출될 메서드
    selectPalace(palace) {
      // ID로 맞는 궁궐 데이터 찾기
      const selectedData = this.palaceData.find(item => item.id === palace.id);
      
      if (selectedData) {
        // 선택된 위치 정보 업데이트
        this.selectedLocation = selectedData;
        console.log(`${palace.name} 정보가 표시됩니다.`);
      }
    },
    // 글로벌 이벤트 핸들러
    handlePalaceSelected(event) {
      const palace = event.detail.palace;
      this.selectPalace(palace);
    }
  }
};
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh; /* 전체 화면 높이 */
  position: relative;
}

.map-view {
  flex: 1;
  width: 100%;
  position: relative;
  height: calc(100vh - 60px); /* 헤더 높이를 뺀 나머지 영역 */
}

/* 카카오맵 컨테이너 스타일 */
#kakao-map {
  width: 100%;
  height: 100%;
  min-height: 500px; /* 최소 높이 증가 */
  z-index: 1;
}

/* 정보 카드 스타일 개선 */
.info-card {
  z-index: 20;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.95); /* 약간 투명하게 */
  backdrop-filter: blur(5px); /* 블러 효과 추가 */
  max-width: 90%; /* 모바일에서 너무 넓지 않도록 */
}

/* 헤더 스타일 개선 */
.header {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  z-index: 5;
  height: 60px; /* 명시적 높이 지정 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* 프로그레스 바 위치 수정 */
.progress-bar {
  position: absolute;
  top: 60px; /* 헤더 아래에 위치 */
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 5;
}

/* 미디어 쿼리 추가 - 데스크톱에서 높이 조정 */
@media (min-width: 769px) {
  .map-container {
    height: calc(100vh - 40px); /* 브라우저 상단 여백 고려 */
    margin: 20px auto;
  }
  
  .map-view {
    height: calc(100vh - 100px);
  }
  
  #kakao-map {
    min-height: 600px;
  }
}
</style> 