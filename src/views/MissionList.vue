<template>
  <div class="quest-screen">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-back">
        <router-link to="/" class="icon-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
              fill="currentColor"
            />
          </svg>
        </router-link>
      </div>
      <div class="header-action">
        <button class="icon-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 장소 정보 -->
    <div class="location-info">
      <div class="location-name">{{ locationInfo.name }}</div>
      <div class="location-description">{{ locationInfo.description }}</div>
      <div class="location-icon-value-container">
        <div class="location-icon-value-wrapper">
          <div class="location-icon-wrapper">
            <div class="location-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 32 32"
                style="enable-background: new 0 0 32 32"
                xml:space="preserve"
              >
                <path
                  d="M16,30c0.8857422,0,1.7314453-0.378418,2.3183594-1.0380859C21.7470703,25.105957,27.5,17.9550781,27.5,13.3891602  C27.5,7.109375,22.3408203,2,16,2S4.5,7.109375,4.5,13.3891602c0,4.565918,5.7529297,11.7167969,9.1816406,15.5732422  C14.2685547,29.621582,15.1142578,30,16,30z M16,4c5.2382812,0,9.5,4.2119141,9.5,9.3891602  c0,2.8095703-3.2431641,8.1342773-8.6757812,14.2431641c-0.421875,0.4746094-1.2265625,0.4741211-1.6484375,0.0004883  C9.7431641,21.5234375,6.5,16.1987305,6.5,13.3891602C6.5,8.2119141,10.7617188,4,16,4z"
                />
                <path
                  d="M16,20.1459961c3.1748047,0,5.7568359-2.5825195,5.7568359-5.7568359c0-0.5522461-0.4472656-1-1-1s-1,0.4477539-1,1  c0,2.0712891-1.6855469,3.7568359-3.7568359,3.7568359s-3.7568359-1.6855469-3.7568359-3.7568359c0-0.5522461-0.4472656-1-1-1  s-1,0.4477539-1,1C10.2431641,17.5634766,12.8251953,20.1459961,16,20.1459961z"
                  fill="currentColor"
                />
                <path
                  d="M13.2822266,11.9916992c0.5527344,0,1-0.4477539,1-1V9.6328125c0-0.5522461-0.4472656-1-1-1s-1,0.4477539-1,1v1.3588867  C12.2822266,11.5439453,12.7294922,11.9916992,13.2822266,11.9916992z"
                  fill="currentColor"
                />
                <path
                  d="M18.7177734,11.9916992c0.5527344,0,1-0.4477539,1-1V9.6328125c0-0.5522461-0.4472656-1-1-1s-1,0.4477539-1,1v1.3588867  C17.7177734,11.5439453,18.1650391,11.9916992,18.7177734,11.9916992z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div class="location-title">방문자</div>
          </div>
          <div class="location-value">{{ locationInfo.visitors }}명</div>
        </div>
        <div class="location-icon-value-wrapper">
          <div class="location-icon-wrapper">
            <div class="location-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 32 32"
                style="enable-background: new 0 0 32 32"
                xml:space="preserve"
              >
                <path
                  d="M27.0839844,2.6347656C26.9335938,2.2519531,26.5644531,2,26.1533203,2H12.3574219c-0.5527344,0-1,0.4472656-1,1  s0.4472656,1,1,1h11.2490234l-5.1337891,4.7675781C18.2695312,8.9560547,18.1533203,9.2216797,18.1533203,9.5  s0.1162109,0.5439453,0.3193359,0.7324219L23.6064453,15H12.3574219c-0.5527344,0-1,0.4472656-1,1s0.4472656,1,1,1h13.7958984  c0.4111328,0,0.7802734-0.2519531,0.9306641-0.6347656s0.0507812-0.8183594-0.25-1.0976562L20.6230469,9.5l6.2109375-5.7675781  C27.1347656,3.453125,27.234375,3.0175781,27.0839844,2.6347656z"
                  fill="currentColor"
                />
                <path
                  d="M10.8691406,28H9.3574219V3c0-0.5527344-0.4472656-1-1-1s-1,0.4472656-1,1v25H5.8466797c-0.5527344,0-1,0.4472656-1,1  s0.4472656,1,1,1h5.0224609c0.5527344,0,1-0.4472656,1-1S11.421875,28,10.8691406,28z"
                />
              </svg>
            </div>
            <div class="location-title">평균 완료</div>
          </div>
          <div class="location-value">{{ locationInfo.avgCompletionTime }}</div>
        </div>
      </div>
    </div>

    <!-- 미션 진행도 -->
    <div class="progress-wrapper">
      <div class="progress-info">
        <span>미션 진행도</span>
        <span class="completion-badge"
          >{{ locationInfo.completedCount }}/{{
            locationInfo.totalCount
          }}
          완료</span
        >
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{
            width:
              (locationInfo.completedCount / locationInfo.totalCount) * 100 +
              '%',
          }"
        ></div>
      </div>
    </div>

    <!-- 미션 리스트 -->
    <div class="mission-list">
      <!-- 미션 카드 목록 -->
      <h4 class="mission-section-title">도전 가능한 미션</h4>
      <div
        v-for="(quest, index) in availableQuests"
        :key="'available-' + index"
        class="mission-card"
      >
        <div class="mission-title">{{ quest.title }}</div>
        <div class="mission-desc">{{ quest.description }}</div>
        <div class="mission-footer">
          <router-link :to="'/mission-detail/' + quest.id" class="btn-small"
            >도전하기</router-link
          >
        </div>
      </div>

      <h4 class="mission-section-title completed">완료한 미션</h4>
      <div
        v-for="(quest, index) in completedQuests"
        :key="'completed-' + index"
        class="mission-card completed"
      >
        <div class="mission-title">{{ quest.title }}</div>
        <div class="mission-desc">{{ quest.description }}</div>
        <div class="mission-footer">
          <div class="badge completed">완료</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImageErrorMixin } from "@/script";

export default {
  name: "MissionList",
  mixins: [ImageErrorMixin],
  computed: {
    availableQuests() {
      return this.quests.filter((q) => !q.completed);
    },
    completedQuests() {
      return this.quests.filter((q) => q.completed);
    },
  },
  data() {
    return {
      locationInfo: {
        id: 1,
        name: "경복궁",
        address: "서울 종로구 사직로 161",
        completedCount: 3,
        totalCount: 5,
        status: "방문 완료",
        description: `경복궁은 조선왕조의 법궁으로, 1395년 태조 이성계가 창건했습니다. 고려 말 개성에서 한양으로 수도를 옮긴 후 가장 먼저 지어진 궁궐입니다. 경복(景福)이란 이름은 '큰 복을 누리라'는 의미를 담고 있습니다.`,
        visitors: "3,250",
        avgCompletionTime: "2.5시간",
      },
      quests: [
        {
          id: 1,
          title: "경복궁 방문하기",
          description: "경복궁에 방문하세요.",
          points: 100,
          completed: true,
        },
        {
          id: 2,
          title: "경복궁 근정전 인증하기",
          description: "경복궁의 정전인 근정전 앞에서 인증샷을 찍어보세요.",
          points: 100,
          completed: true,
        },
        {
          id: 3,
          title: "향원정의 연못 찾기",
          description:
            "경복궁 후원에 있는 향원정 연못의 아름다운 모습을 담아보세요.",
          points: 150,
          completed: true,
        },
        {
          id: 4,
          title: "숨겨진 동궁과 후원 찾기",
          description:
            "경복궁에서 가장 아름다운 영역 중 하나인 동궁과 후원의 풍경을 담아보세요.",
          points: 200,
          completed: false,
        },
        {
          id: 5,
          title: "핫플 따라 찍기",
          description: "경복궁에서 하늘과 함께 후원의 풍경을 담아보세요.",
          points: 200,
          completed: false,
        },
      ],
    };
  },
  mounted() {
    // 라우터에서 전달된 장소 ID를 기반으로 미션 데이터 로드
    const locationId = this.$route.params.id;
    if (locationId) {
      // 실제 구현에서는 API를 호출하여 해당 장소의 미션 목록을 가져올 것
      console.log("Loading missions for location ID:", locationId);
    }
  },
};
</script>

<style scoped>
.header {
  background-color: var(--primary);
  border-bottom: 0;
  box-shadow: none;
}

.header-back svg,
.header-action svg {
  color: var(--text-light);
}

.header-title {
  color: var(--text-light);
}
</style>
