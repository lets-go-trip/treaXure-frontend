<template>
  <div class="mission-screen">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-back">
        <router-link to="/all-missions" class="icon-btn">
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
      <div class="header-action"></div>
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
          <div class="location-value">
            {{ locationInfo.avgCompletionTime }}개
          </div>
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
        v-for="(mission, index) in availableMissions"
        :key="'available-' + index"
        class="mission-card"
      >
        <div class="mission-title-wrapper">
          <div class="mission-title">{{ mission.title }}</div>
          <div class="badge score-badge">{{ mission.score }}점</div>
        </div>
        <div class="mission-desc">{{ mission.description }}</div>
        <router-link
          :to="'/mission-detail/' + mission.missionId"
          class="btn-small incomplete-btn-small"
          >도전하기</router-link
        >
      </div>

      <h4 class="mission-section-title completed">완료한 미션</h4>
      <div
        v-for="(mission, index) in completedMissions"
        :key="'completed-' + index"
        class="mission-card completed"
      >
        <div class="mission-title-wrapper">
          <div class="mission-title">{{ mission.title }}</div>
          <div class="badge completed">완료</div>
        </div>
        <div class="mission-desc">{{ mission.description }}</div>
        <!-- 인증 사진 표시 -->
        <img
          v-if="mission.boardImageUrl"
          :src="mission.boardImageUrl"
          alt="인증 사진"
          class="mission-completed-image"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getVisitMissionsByMember } from "@/api/visit";
import { getMyInfo } from "@/api/auth";
import { getMyBoards } from "@/api/board";

export default {
  name: "MissionList",
  data() {
    return {
      locationInfo: {},
      missions: [],
      userId: null,
    };
  },
  computed: {
    availableMissions() {
      return this.missions.filter((q) => !q.completed);
    },
    completedMissions() {
      return this.missions.filter((q) => q.completed);
    },
  },
  async mounted() {
    try {
      const [me, boardRes] = await Promise.all([getMyInfo(), getMyBoards()]);

      this.userId = me.data?.data.memberId;
      const visitMissionsRes = await getVisitMissionsByMember(this.userId);
      const placeId = parseInt(this.$route.params.id);

      const place = visitMissionsRes.data?.data.find(
        (v) => v.placeId === placeId
      );
      if (!place) throw new Error("해당 장소의 방문 기록이 없습니다.");

      const missions = place.missions || [];
      const myBoards = boardRes.data?.data || [];

      // boardMap 구성: missionId → board 객체
      const boardMap = new Map();
      myBoards.forEach((board) => {
        boardMap.set(board.missionId, board);
      });

      // 미션에 completed 여부 및 board imageUrl 연결
      const missionsWithCompletion = missions.map((mission) => {
        const board = boardMap.get(mission.missionId);
        return {
          ...mission,
          id: mission.missionId,
          completed: !!board,
          boardImageUrl: board?.imageUrl || null,
        };
      });

      this.missions = missionsWithCompletion;

      const completedCount = missionsWithCompletion.filter(
        (q) => q.completed
      ).length;
      const totalCount = missionsWithCompletion.length;

      this.locationInfo = {
        name: place.placeName,
        description: place.placeDescription,
        thumbnailUrl: place.thumbnailUrl,
        completedCount,
        totalCount,
        visitors: place.visitorCount || 0,
        avgCompletionTime:
          place.visitorCount > 0
            ? Math.round(place.boardCount / place.visitorCount)
            : 0,
      };
    } catch (err) {
      console.error("미션 정보 로딩 실패", err);
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

.icon-btn {
  color: var(--text-light);
}

.header-title {
  color: var(--text-light);
}
</style>
