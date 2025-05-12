<template>
  <div class="map-container">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-title">
        <img class="logo" src="../../src/assets/img/logo_bg.png" alt="" />
        treaXure
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

    <div class="map-view">
      <div id="kakao-map" ref="kakaoMap"></div>

      <!-- 선택된 장소 정보 -->
      <transition name="info-card">
        <div class="info-card" v-if="selectedLocation">
          <div class="info-wrapper">
            <div>
              <div class="info-title">{{ selectedLocation.title }}</div>
              <div class="info-status">{{ selectedLocation.status }}</div>
              <div class="info-value-container">
                <div class="info-value-wrapper">
                  미션
                  <span class="info-value">{{
                    selectedLocation.questCount
                  }}</span>
                </div>
                <div class="info-value-wrapper">
                  보상
                  <span class="info-value">{{ selectedLocation.coins }}</span>
                </div>
              </div>
            </div>
            <div class="info-icon-wrapper">
              <div class="info-icon-spin">

                  <div class="info-icon front">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xmlns:serif="http://www.serif.com/"
                      viewBox="0 0 24 24"
                      version="1.1"
                      xml:space="preserve"
                      style=""
                      x="0px"
                      y="0px"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      stroke-linejoin="round"
                      stroke-miterlimit="2"
                    >
                      <g>
                        <path
                          d="M2,22.75c-0.414,-0 -0.75,-0.336 -0.75,-0.75c0,-0.414 0.336,-0.75 0.75,-0.75l20,0c0.414,-0 0.75,0.336 0.75,0.75c0,0.414 -0.336,0.75 -0.75,0.75l-20,0Z"
                          fill="currentColor"
                        />
                        <path
                          d="M20.75,14l0,8c0,0.414 -0.336,0.75 -0.75,0.75l-16,0c-0.414,-0 -0.75,-0.336 -0.75,-0.75l-0,-8c0,-0.414 0.336,-0.75 0.75,-0.75l16,-0c0.414,-0 0.75,0.336 0.75,0.75Zm-1.5,0.75l-14.5,0c-0,0 -0,6.5 -0,6.5l14.5,-0l-0,-6.5Z"
                          fill="currentColor"
                        />
                        <path
                          d="M20.75,7.5l0,3.5c0,0.414 -0.336,0.75 -0.75,0.75l-16,0c-0.414,0 -0.75,-0.336 -0.75,-0.75l-0,-3.5c0,-0.414 0.336,-0.75 0.75,-0.75l16,0c0.414,-0 0.75,0.336 0.75,0.75Zm-1.5,0.75l-14.5,-0c-0,-0 -0,2 -0,2l14.5,0l-0,-2Z"
                          fill="currentColor"
                        />
                        <path
                          d="M1.25,7.5l0,-1c0,-0.251 0.125,-0.485 0.334,-0.624l2.666,-1.777l0,-0.599c0,-0.414 0.336,-0.75 0.75,-0.75l14,0c0.414,0 0.75,0.336 0.75,0.75l-0,0.599l2.666,1.777c0.209,0.139 0.334,0.373 0.334,0.624l0,1c0,0.414 -0.336,0.75 -0.75,0.75l-20,0c-0.414,-0 -0.75,-0.336 -0.75,-0.75Zm1.727,-0.75l18.046,0l-2.439,-1.626c-0.209,-0.139 -0.334,-0.373 -0.334,-0.624c0,0 0,-0.25 -0,-0.25l-12.5,-0l0,0.25c0,0.251 -0.125,0.485 -0.334,0.624l-2.439,1.626Z"
                          fill="currentColor"
                        />
                        <path
                          d="M2,10.25l20,0c0.414,0 0.75,0.336 0.75,0.75l0,1c0,0.199 -0.079,0.39 -0.22,0.53l-2,2c-0.14,0.141 -0.331,0.22 -0.53,0.22l-16,0c-0.199,-0 -0.39,-0.079 -0.53,-0.22l-2,-2c-0.141,-0.14 -0.22,-0.331 -0.22,-0.53l0,-1c0,-0.414 0.336,-0.75 0.75,-0.75Zm0.811,1.5l1.5,1.5l15.378,0l1.5,-1.5l-18.378,-0Z"
                          fill="currentColor"
                        />
                        <path
                          d="M19.75,3.5c-0,0.414 -0.336,0.75 -0.75,0.75c-0.414,-0 -0.75,-0.336 -0.75,-0.75l0,-1.5c-0,-0.414 0.336,-0.75 0.75,-0.75c0.414,-0 0.75,0.336 0.75,0.75l0,1.5Z"
                          fill="currentColor"
                        />
                        <path
                          d="M5.75,3.5c0,0.414 -0.336,0.75 -0.75,0.75c-0.414,0 -0.75,-0.336 -0.75,-0.75l0,-1.5c0,-0.414 0.336,-0.75 0.75,-0.75c0.414,0 0.75,0.336 0.75,0.75l0,1.5Z"
                          fill="currentColor"
                        />
                        <path
                          d="M12,15.75c1.519,-0 2.75,1.231 2.75,2.75l-0,3.5c-0,0.414 -0.336,0.75 -0.75,0.75l-4,-0c-0.414,-0 -0.75,-0.336 -0.75,-0.75l0,-3.5c0,-1.519 1.231,-2.75 2.75,-2.75Zm-0,1.5c-0.69,0 -1.25,0.56 -1.25,1.25l0,2.75l2.5,0l-0,-2.75c-0,-0.69 -0.56,-1.25 -1.25,-1.25Z"
                          fill="currentColor"
                        />
                      </g>
                    </svg>
                    <div class="info-icon-background"></div>
                  </div>
                  <div class="info-icon back">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xmlns:serif="http://www.serif.com/"
                      viewBox="0 0 24 24"
                      version="1.1"
                      xml:space="preserve"
                      style=""
                      x="0px"
                      y="0px"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      stroke-linejoin="round"
                      stroke-miterlimit="2"
                    >
                      <g>
                        <path
                          d="M2,22.75c-0.414,-0 -0.75,-0.336 -0.75,-0.75c0,-0.414 0.336,-0.75 0.75,-0.75l20,0c0.414,-0 0.75,0.336 0.75,0.75c0,0.414 -0.336,0.75 -0.75,0.75l-20,0Z"
                          fill="currentColor"
                        />
                        <path
                          d="M20.75,14l0,8c0,0.414 -0.336,0.75 -0.75,0.75l-16,0c-0.414,-0 -0.75,-0.336 -0.75,-0.75l-0,-8c0,-0.414 0.336,-0.75 0.75,-0.75l16,-0c0.414,-0 0.75,0.336 0.75,0.75Zm-1.5,0.75l-14.5,0c-0,0 -0,6.5 -0,6.5l14.5,-0l-0,-6.5Z"
                          fill="currentColor"
                        />
                        <path
                          d="M20.75,7.5l0,3.5c0,0.414 -0.336,0.75 -0.75,0.75l-16,0c-0.414,0 -0.75,-0.336 -0.75,-0.75l-0,-3.5c0,-0.414 0.336,-0.75 0.75,-0.75l16,0c0.414,-0 0.75,0.336 0.75,0.75Zm-1.5,0.75l-14.5,-0c-0,-0 -0,2 -0,2l14.5,0l-0,-2Z"
                          fill="currentColor"
                        />
                        <path
                          d="M1.25,7.5l0,-1c0,-0.251 0.125,-0.485 0.334,-0.624l2.666,-1.777l0,-0.599c0,-0.414 0.336,-0.75 0.75,-0.75l14,0c0.414,0 0.75,0.336 0.75,0.75l-0,0.599l2.666,1.777c0.209,0.139 0.334,0.373 0.334,0.624l0,1c0,0.414 -0.336,0.75 -0.75,0.75l-20,0c-0.414,-0 -0.75,-0.336 -0.75,-0.75Zm1.727,-0.75l18.046,0l-2.439,-1.626c-0.209,-0.139 -0.334,-0.373 -0.334,-0.624c0,0 0,-0.25 -0,-0.25l-12.5,-0l0,0.25c0,0.251 -0.125,0.485 -0.334,0.624l-2.439,1.626Z"
                          fill="currentColor"
                        />
                        <path
                          d="M2,10.25l20,0c0.414,0 0.75,0.336 0.75,0.75l0,1c0,0.199 -0.079,0.39 -0.22,0.53l-2,2c-0.14,0.141 -0.331,0.22 -0.53,0.22l-16,0c-0.199,-0 -0.39,-0.079 -0.53,-0.22l-2,-2c-0.141,-0.14 -0.22,-0.331 -0.22,-0.53l0,-1c0,-0.414 0.336,-0.75 0.75,-0.75Zm0.811,1.5l1.5,1.5l15.378,0l1.5,-1.5l-18.378,-0Z"
                          fill="currentColor"
                        />
                        <path
                          d="M19.75,3.5c-0,0.414 -0.336,0.75 -0.75,0.75c-0.414,-0 -0.75,-0.336 -0.75,-0.75l0,-1.5c-0,-0.414 0.336,-0.75 0.75,-0.75c0.414,-0 0.75,0.336 0.75,0.75l0,1.5Z"
                          fill="currentColor"
                        />
                        <path
                          d="M5.75,3.5c0,0.414 -0.336,0.75 -0.75,0.75c-0.414,0 -0.75,-0.336 -0.75,-0.75l0,-1.5c0,-0.414 0.336,-0.75 0.75,-0.75c0.414,0 0.75,0.336 0.75,0.75l0,1.5Z"
                          fill="currentColor"
                        />
                        <path
                          d="M12,15.75c1.519,-0 2.75,1.231 2.75,2.75l-0,3.5c-0,0.414 -0.336,0.75 -0.75,0.75l-4,-0c-0.414,-0 -0.75,-0.336 -0.75,-0.75l0,-3.5c0,-1.519 1.231,-2.75 2.75,-2.75Zm-0,1.5c-0.69,0 -1.25,0.56 -1.25,1.25l0,2.75l2.5,0l-0,-2.75c-0,-0.69 -0.56,-1.25 -1.25,-1.25Z"
                          fill="currentColor"
                        />
                      </g>
                    </svg>
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

export default {
  name: "Treaure",
  mixins: [KakaoMapMixin, ImageErrorMixin],
  data() {
    return {
      selectedLocation: null,
      // 고정된 카카오맵 마커로 대체하므로 locationMarkers 배열은 더 이상 필요하지 않음
      palaceData: [
        {
          id: 1,
          title: "경복궁",
          address: "서울 종로구 사직로 161",
          difficulty: 2,
          questCount: 3,
          coins: 250,
          status: "미션 접근 가능",
        },
        {
          id: 2,
          title: "덕수궁",
          address: "서울 중구 세종대로 99",
          difficulty: 3,
          questCount: 4,
          coins: 350,
          status: "미션 접근 가능",
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
    // 카카오맵 초기화 (KakaoMapMixin에서 가져온 메서드)
    this.$nextTick(() => {
      if (this.$refs.kakaoMap) {
        this.initMap(this.$refs.kakaoMap);

        // 기본적으로 첫 번째 궁궐 정보 표시
        // this.selectedLocation = this.palaceData[0];

        // 글로벌 이벤트 리스너 추가
        window.addEventListener("palaceSelected", this.handlePalaceSelected);

        // 빈 공간 클릭 시 info-card 제거 이벤트 리스너 추가
        window.addEventListener(
          "clearSelectedPalace",
          this.clearSelectedPalace
        );
      }
    });
  },
  beforeUnmount() {
    // 컴포넌트 제거 시 이벤트 리스너 제거
    window.removeEventListener("palaceSelected", this.handlePalaceSelected);
    // 이것도 함께 제거
    window.removeEventListener("clearSelectedPalace", this.clearSelectedPalace);
  },
  methods: {
    // 궁궐 마커가 클릭되었을 때 호출될 메서드
    selectPalace(palace) {
      // ID로 맞는 궁궐 데이터 찾기
      const selectedData = this.palaceData.find(
        (item) => item.id === palace.id
      );

      if (selectedData) {
        // 선택된 위치 정보 업데이트
        this.selectedLocation = selectedData;
        console.log(`${palace.name} 정보가 표시됩니다.`);
      }

      this.restartCoinSpin();
    },

    restartCoinSpin() {
      this.$nextTick(() => {
        const el = this.$el.querySelector(".info-icon-spin");
        if (!el) return;

        // 기존 애니메이션 클래스 제거
        el.classList.remove("spin-once");

        // 강제로 reflow 발생시켜 재적용 가능하게 함
        void el.offsetWidth;

        // 다시 클래스 추가해서 애니메이션 재시작
        el.classList.add("spin-once");
      });
    },

    // 글로벌 이벤트 핸들러
    handlePalaceSelected(event) {
      const palace = event.detail.palace;
      this.selectPalace(palace);
    },

    // 빈 공간 클릭 시 info-card 숨기기
    clearSelectedPalace() {
      this.selectedLocation = null;
    },
  },
};
</script>
