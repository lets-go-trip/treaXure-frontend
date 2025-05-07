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
      <div class="header-title">미션 리스트</div>
      <div class="header-action">
        <button class="icon-btn">⋮</button>
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
      <div 
        v-for="(quest, index) in quests" 
        :key="index" 
        class="quest-card"
        :class="{ completed: quest.completed }">
        <div class="quest-title">{{ quest.title }}</div>
        <div class="quest-desc">{{ quest.description }}</div>
        <div class="quest-footer">
          <div class="coin-reward">
            <div class="coin-icon">●</div>
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
/* 스타일은 전역 CSS에서 처리 */
</style> 