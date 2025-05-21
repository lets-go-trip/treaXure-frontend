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
              <div class="info-title">{{ selectedLocation.title }}</div>
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
              :to="'/mission-list/' + selectedLocation.id"
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
      // 카카오맵에서 사용할 궁궐 데이터
      palaceData: [
        {
          id: 1,
          title: "경복궁",
          address: "서울 종로구 사직로 161",
          difficulty: 2,
          questCount: 3,
          coins: 250,
          status: "미션 수행 필요",
        },
        {
          id: 2,
          title: "덕수궁",
          address: "서울 중구 세종대로 99",
          difficulty: 3,
          questCount: 4,
          coins: 350,
          status: "미션 수행 필요",
        },
        {
          id: 3,
          title: "창덕궁",
          address: "서울 종로구 율곡로 99",
          difficulty: 4,
          questCount: 2,
          coins: 500,
          status: "미션 완료",
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.kakaoMap) {
        this.initMap(this.$refs.kakaoMap);
        window.addEventListener("palaceSelected", this.handlePalaceSelected);
        window.addEventListener(
          "clearSelectedPalace",
          this.clearSelectedPalace
        );
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener("palaceSelected", this.handlePalaceSelected);
    window.removeEventListener("clearSelectedPalace", this.clearSelectedPalace);
  },
  watch: {
    // selectedLocation이 바뀔 때마다 코인 회전 재시작
    selectedLocation() {
      this.restartCoinSpin();
    },
  },
  methods: {
    // 마커 클릭 시 선택된 궁궐 설정
    selectPalace(palace) {
      const selectedData = this.palaceData.find(
        (item) => item.id === palace.id
      );
      if (selectedData) {
        // 동일 참조 문제 방지: 새로운 객체로 할당
        this.selectedLocation = { ...selectedData };
        console.log(`${palace.name} 정보가 표시됩니다.`);
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
    handlePalaceSelected(event) {
      this.selectPalace(event.detail.palace);
    },

    // 빈 공간 클릭 시 선택 해제
    clearSelectedPalace() {
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

.btn-small {
  height: 64px;
}
</style>
