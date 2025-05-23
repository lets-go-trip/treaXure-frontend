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
                  color: selectedLocation.isCompleted
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
                      color: selectedLocation.isCompleted
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
                      color: selectedLocation.isCompleted
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
            <div
              @click="handleVisitAndGo(selectedLocation.placeId)"
              class="btn-small"
            >
              미션 보기
            </div>
          </div>
        </div>
      </transition>
      <div class="blur-box"></div>
    </div>
  </div>
</template>

<script>
import { getMyInfo } from "@/api/auth";
import { recordVisit } from "@/api/visit";
import { getAllPlaces } from "@/api/place";
import { getMissionsByPlaceId, getMissionStatusByPlace } from "@/api/mission";
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
      selectedLocation: null,
      placeData: [],
      memberId: null,
    };
  },
  async mounted() {
    try {
      const userRes = await getMyInfo();
      this.memberId = userRes.data?.data?.memberId;

      const [placeRes, statusRes] = await Promise.all([
        getAllPlaces(),
        getMissionStatusByPlace(this.memberId),
      ]);

      const places = placeRes.data?.data || [];
      const statuses = statusRes.data?.data || [];

      // 장소별 미션 완료 상태 병합
      this.placeData = places.map((place) => {
        const status = statuses.find((s) => s.placeId === place.placeId);
        return {
          ...place,
          missionStatus: status || {
            totalMissions: 0,
            completedMissions: 0,
            allCompleted: false,
          },
        };
      });

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

          document.cookie = `recentPlaceId=${place.placeId}; path=/; max-age=86400`;

          const enriched = {
            ...selectedData,
            questCount: missions.length,
            coins: totalScore,
            isCompleted: selectedData.missionStatus.allCompleted,
            status: selectedData.missionStatus.allCompleted
              ? "미션 완료"
              : missions.length > 0
              ? "미션 수행 필요"
              : "미션 없음",
          };

          this.selectedLocation = enriched;
        } catch (err) {
          console.error("미션 불러오기 실패:", err);
        }
      }
    },

    async handleVisitAndGo(placeId) {
      try {
        if (!this.memberId) return;
        await recordVisit(this.memberId, placeId);
        this.$router.push(`/mission-list/${placeId}`);
      } catch (err) {
        console.error("방문 기록 저장 실패", err);
      }
    },

    restartCoinSpin() {
      this.$nextTick(() => {
        const el = this.$el.querySelector(".info-icon-spin");
        if (!el) return;
        el.classList.remove("spin-once");
        void el.offsetWidth;
        el.classList.add("spin-once");
      });
    },

    handlePlaceSelected(event) {
      this.selectPlace(event.detail.place);
    },

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
