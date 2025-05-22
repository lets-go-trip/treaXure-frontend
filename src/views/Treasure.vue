<template>
  <div class="map-container">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-title">
        trea
        <IconLogo class="logo-svg" />
        ure
      </div>
    </div>

    <div class="map-view">
      <div id="kakao-map" ref="kakaoMap"></div>

      <!-- 선택된 장소 정보 -->
      <transition name="info-card">
        <div class="info-card" v-if="selectedLocation">
          <div class="info-wrapper">
            <div>
              <div class="info-title">{{ selectedLocation.name }}</div>
              <div
                class="info-status"
                :style="{
                  color:
                    selectedLocation?.status === '미션 완료'
                      ? 'var(--primary)'
                      : 'var(--tertiary)',
                }"
              >
                {{ selectedLocation.status }}
              </div>
              <div class="info-value-container">
                <div class="info-value-wrapper">
                  미션
                  <span
                    class="info-value"
                    :style="{
                      color:
                        selectedLocation?.status === '미션 완료'
                          ? 'var(--primary)'
                          : 'var(--tertiary)',
                    }"
                    >{{ selectedLocation.questCount }}</span
                  >
                </div>
                <div class="info-value-wrapper">
                  보상
                  <span
                    class="info-value"
                    :style="{
                      color:
                        selectedLocation?.status === '미션 완료'
                          ? 'var(--primary)'
                          : 'var(--tertiary)',
                    }"
                    >{{ selectedLocation.coins }}</span
                  >
                </div>
              </div>
            </div>
            <div class="info-icon-wrapper">
              <div class="info-icon-spin" :key="selectedLocation.id">
                <div class="info-icon front">
                  <IconTemple class="info-icon-svg" />
                  <div class="info-icon-background"></div>
                </div>
                <div class="info-icon back">
                  <IconTemple class="info-icon-svg" />
                </div>
              </div>
            </div>
          </div>
          <div class="info-action">
            <router-link
              :to="'/mission-list/' + selectedLocation.placeId"
              class="btn-small"
              >미션 보기</router-link
            >
          </div>
        </div>
      </transition>
      <div class="blur-box"></div>
    </div>
  </div>
</template>

<script>
import { getAllPlaces } from "@/api/place";
import { getMissionsByPlaceId } from "@/api/mission";
import { KakaoMapMixin } from "@/script";
import { ImageErrorMixin } from "@/script";
import IconTemple from "@/components/icons/IconTemple.vue";
import IconLogo from "@/components/icons/IconLogo.vue";

export default {
  name: "Treaure",
  components: { IconTemple, IconLogo },
  mixins: [KakaoMapMixin, ImageErrorMixin],
  data() {
    return {
      // 현재 선택된 궁궐 정보
      selectedLocation: null,
      // 카카오맵에서 사용할 장소 데이터
      placeData: [],
    };
  },
  async mounted() {
    try {
      const res = await getAllPlaces();
      this.placeData = res.data?.data || [];

      if (this.$refs.kakaoMap) {
        await this.initMap(this.$refs.kakaoMap);
        window.addEventListener("placeSelected", this.handlePlaceSelected);
        window.addEventListener("clearSelectedPlace", this.clearSelectedPlace);
      }
    } catch (err) {
      console.error("장소 로딩 실패", err);
    }
  },
  beforeUnmount() {
    window.removeEventListener("placeSelected", this.handlePlaceSelected);
    window.removeEventListener("clearSelectedPlace", this.clearSelectedPlace);
  },
  watch: {
    // selectedLocation이 바뀔 때마다 코인 회전 재시작
    selectedLocation() {
      this.restartCoinSpin();
    },
  },
  methods: {
    async selectPlace(place) {
      const selectedData = this.placeData.find(
        (item) => item.placeId === place.placeId
      );
      if (selectedData) {
        try {
          const missionRes = await getMissionsByPlaceId(place.placeId);
          const missions = missionRes.data?.data || [];
          const totalScore = missions.reduce(
            (sum, mission) => sum + (mission.score || 0),
            0
          );

          // recentPlaceId를 쿠키에 저장
          document.cookie = `recentPlaceId=${place.placeId}; path=/; max-age=86400`;

          const enriched = {
            ...selectedData,
            questCount: missions.length,
            coins: totalScore,
            status: missions.length > 0 ? "미션 수행 필요" : "미션 없음",
          };

          this.selectedLocation = enriched;
        } catch (err) {
          console.error("미션 불러오기 실패:", err);
        }
      }
    },

    // 코인 회전 애니메이션 리셋 및 재시작
    restartCoinSpin() {
      this.$nextTick(() => {
        const el = this.$el.querySelector(".info-icon-spin");
        if (!el) return;
        el.classList.remove("spin-once");
        void el.offsetWidth; // reflow 발생
        el.classList.add("spin-once");
      });
    },

    // 글로벌 이벤트 핸들러
    handlePlaceSelected(event) {
      this.selectPlace(event.detail.place);
    },

    // 빈 공간 클릭 시 선택 해제
    clearSelectedPlace() {
      this.selectedLocation = null;
    },
  },
};
</script>

<style scoped>
.header {
  justify-content: center;
}

.header-title {
  font-family: "Gloria Hallelujah", cursive;
}
</style>
