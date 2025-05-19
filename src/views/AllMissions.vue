<template>
  <div class="all-missions">
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
      <div class="header-title">탐험 기록</div>
      <div class="header-action">
        <button class="icon-btn"></button>
      </div>
    </div>

    <!-- 필터 및 정렬 옵션 -->
    <div class="filter-bar">
      <div class="filter-chips">
        <label class="chip complete" :class="{ active: filters.showComplete }">
          <input
            type="checkbox"
            v-model="filters.showComplete"
            class="chip-input"
          />
          <div class="chip-content">
            <span class="chip-label">완료</span>
          </div>
        </label>
        <label
          class="chip incomplete"
          :class="{ active: filters.showIncomplete }"
        >
          <input
            type="checkbox"
            v-model="filters.showIncomplete"
            class="chip-input"
          />
          <div class="chip-content">
            <span class="chip-label">미완료</span>
          </div>
        </label>
      </div>
      <div class="sort-dropdown">
        <select v-model="sortOption" class="sort-select">
          <option value="recent">최근 방문순</option>
          <option value="points">포인트순</option>
          <option value="location">이름순</option>
        </select>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="sort-icon"
        >
          <path d="M7 10l5 5 5-5z" fill="currentColor" />
        </svg>
      </div>
    </div>

    <!-- 스크롤 가능한 컨텐츠 영역 -->
    <div class="scrollable-content">
      <!-- 미션 목록 컨테이너 -->
      <div class="missions-container">
        <!-- 각 장소 그룹 -->
        <div
          v-for="(location, locationIndex) in filteredLocations"
          :key="locationIndex"
          class="location-group"
        >
          <!-- 장소 헤더 -->
          <div class="location-header-wrapper">
            <div
              class="location-header"
              :class="{
                collapsed: location.collapsed,
                highlighted: location.id === selectedLocationId,
              }"
              @click="toggleLocation(locationIndex)"
            >
              <div class="location-logo">
                <IconTemple class="info-icon-svg" />
              </div>
              <div class="location-title">
                {{ location.name }}
              </div>
              <div
                class="toggle-icon"
                :class="{ collapsed: location.collapsed }"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.59 8.59L12 13.17L7.41 8.59L6 10L12 16L18 10L16.59 8.59Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            <router-link :to="`/mission-list/${location.id}`" class="btn-small">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xml:space="preserve"
                version="1.1"
                style="
                  shape-rendering: geometricPrecision;
                  text-rendering: geometricPrecision;
                  image-rendering: optimizeQuality;
                "
                viewBox="0 0 847 847"
                x="0px"
                y="0px"
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="currentColor"
              >
                <g>
                  <path
                    class="fil0"
                    d="M372 16c34,0 68,0 103,0 0,119 0,237 0,356 118,0 237,0 356,0 0,34 0,68 0,103 -119,0 -238,0 -356,0 0,118 0,237 0,356 -35,0 -69,0 -103,0 0,-119 0,-238 0,-356 -119,0 -237,0 -356,0 0,-35 0,-69 0,-103 119,0 237,0 356,0 0,-119 0,-237 0,-356z"
                  />
                </g>
              </svg>
            </router-link>
          </div>

          <!-- 미션 리스트 -->
          <div class="mission-img-list" v-show="!location.collapsed">
            <div
              v-for="(mission, missionIndex) in filteredMissions(
                location.missions
              )"
              :key="missionIndex"
              class="mission-img-card"
              :class="{ completed: mission.completed }"
            >
              <img
                :src="mission.imageUrl"
                :alt="mission.title"
                class="mission-img"
                @click.stop="selectMission(mission, location.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 팝업 오버레이 -->
      <div
        v-if="selectedMission"
        class="modal-overlay"
        @click.self="closeModal"
      >
        <div class="modal-container" ref="container" @click.self="closeModal">
          <div class="modal-overlay-effect" ref="overlay"></div>
          <div class="modal-card">
            <img
              :src="selectedMission.imageUrl"
              :alt="selectedMission.title"
              class="modal-img"
              :class="{ completed: selectedMission.completed }"
            />
            <div class="modal-points">🍀 {{ selectedMission.points }}</div>
            <div class="modal-title">{{ selectedMission.title }}</div>
            <div class="modal-description">
              {{ selectedMission.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImageErrorMixin } from "@/script";
import IconTemple from "@/components/icons/IconTemple.vue";

export default {
  name: "AllMissions",
  components: {
    IconTemple,
  },
  mixins: [ImageErrorMixin],
  data() {
    return {
      selectedMission: null, // 모달에 띄울 선택된 미션
      savedScrollY: 0, // 현재 스크롤 위치 저장
      selectedLocationId: null,
      filters: {
        showIncomplete: true,
        showComplete: true,
      },
      sortOption: "recent",
      locations: [
        {
          id: 1,
          name: "경복궁",
          address: "서울 종로구 사직로 161",
          imageUrl: "https://via.placeholder.com/60x60?text=경복궁",
          completedCount: 2,
          totalCount: 3,
          collapsed: false,
          missions: [
            {
              id: 1,
              title: "경복궁 근정전 인증하기",
              description: "경복궁의 정전인 근정전 앞에서 인증샷을 찍어보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166254.jpg",
              points: 100,
              completed: true,
            },
            {
              id: 2,
              title: "향원정의 연못 찾기",
              description:
                "경복궁 후원에 있는 향원정 연못의 아름다운 모습을 담아보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166273.jpg",
              points: 150,
              completed: true,
            },
            {
              id: 3,
              title: "숨겨진 동궁과 후원 찾기",
              description:
                "경복궁에서 가장 아름다운 영역 중 하나인 동궁과 후원의 풍경을 담아보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166267.jpg",
              points: 200,
              completed: false,
            },
            {
              id: 9,
              title: "숨겨진 동궁과 후원 찾기",
              description:
                "경복궁에서 가장 아름다운 영역 중 하나인 동궁과 후원의 풍경을 담아보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166270.jpg",
              points: 200,
              completed: false,
            },
            {
              id: 10,
              title: "숨겨진 동궁과 후원 찾기",
              description:
                "경복궁에서 가장 아름다운 영역 중 하나인 동궁과 후원의 풍경을 담아보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166275.jpg",
              points: 200,
              completed: false,
            },
          ],
        },
        {
          id: 2,
          name: "창덕궁",
          address: "서울 종로구 율곡로 99",
          imageUrl:
            "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166257.jpg",
          completedCount: 1,
          totalCount: 3,
          collapsed: false,
          missions: [
            {
              id: 4,
              title: "부용지 연꽃 촬영하기",
              description:
                "창덕궁의 후원에 있는 부용지에 피어있는 연꽃을 촬영해보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166273.jpg",
              points: 120,
              completed: true,
            },
            {
              id: 5,
              title: "대조전 찾아가기",
              description:
                "왕비의 처소였던 대조전을 찾아 그 아름다운 건축양식을 담아보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166261.jpg",
              points: 150,
              completed: true,
            },
            {
              id: 6,
              title: "낙선재 문고 탐방",
              description:
                "조선시대 왕실 도서관이었던 낙선재 문고를 찾아 인증샷을 찍어보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166266.jpg",
              points: 180,
              completed: true,
            },
            {
              id: 11,
              title: "숨겨진 동궁과 후원 찾기",
              description:
                "경복궁에서 가장 아름다운 영역 중 하나인 동궁과 후원의 풍경을 담아보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166275.jpg",
              points: 200,
              completed: true,
            },
            {
              id: 12,
              title: "숨겨진 동궁과 후원 찾기",
              description:
                "경복궁에서 가장 아름다운 영역 중 하나인 동궁과 후원의 풍경을 담아보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166275.jpg",
              points: 200,
              completed: false,
            },
          ],
        },
        {
          id: 3,
          name: "덕수궁",
          address: "서울 중구 세종대로 99",
          imageUrl: "https://via.placeholder.com/60x60?text=덕수궁",
          completedCount: 0,
          totalCount: 2,
          collapsed: false,
          missions: [
            {
              id: 7,
              title: "정관헌 촬영하기",
              description:
                "서양식 건물인 정관헌의 독특한 건축 양식을 담아보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166283.jpg",
              points: 130,
              completed: false,
            },
            {
              id: 8,
              title: "중화전 찾기",
              description:
                "덕수궁의 정전인 중화전을 찾아 그 웅장한 모습을 촬영해보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166261.jpg",
              points: 170,
              completed: false,
            },
          ],
        },
      ],
      isTicking: false,
    };
  },
  watch: {
    selectedMission(newVal, oldVal) {
      if (newVal) {
        // 모달이 열린 직후, 다음 틱에 refs가 준비되면 리스너 등록
        this.$nextTick(() => {
          const c = this.$refs.container;
          if (c) {
            c.addEventListener("mousemove", this.handleMouseMove);
            c.addEventListener("mouseout", this.handleMouseOut);
          }
        });
      } else if (oldVal) {
        // 모달이 닫힐 때(=selectedMission가 null로 돌아갈 때) 리스너 제거
        const c = this.$refs.container;
        if (c) {
          c.removeEventListener("mousemove", this.handleMouseMove);
          c.removeEventListener("mouseout", this.handleMouseOut);
        }
      }
    },
  },
  computed: {
    filteredLocations() {
      let sortedLocations = [...this.locations];

      // 정렬 옵션에 따라 장소 목록 정렬
      switch (this.sortOption) {
        case "recent":
          // 최근 방문순 (예시 데이터에서는 현재 순서 유지)
          break;
        case "points":
          // 포인트 높은순
          sortedLocations.sort((a, b) => {
            const aMaxPoints = Math.max(...a.missions.map((m) => m.points));
            const bMaxPoints = Math.max(...b.missions.map((m) => m.points));
            return bMaxPoints - aMaxPoints;
          });
          break;
        case "location":
          // 장소명 순
          sortedLocations.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }

      return sortedLocations;
    },
  },
  methods: {
    toggleLocation(index) {
      this.locations[index].collapsed = !this.locations[index].collapsed;
    },
    filteredMissions(missions) {
      return missions.filter((mission) => {
        if (mission.completed && this.filters.showComplete) return true;
        if (!mission.completed && this.filters.showIncomplete) return true;
        return false;
      });
    },
    selectMission(mission, locationId) {
      this.selectedMission = mission;
      this.selectedLocationId = locationId;
      // 현재 스크롤 위치 저장
      this.savedScrollY = window.scrollY;
      // body를 fixed로 락 (스크롤바는 사라지지 않고, 화면은 고정되면서 스크롤이 안 됩니다)
      Object.assign(document.body.style, {
        position: "fixed",
        top: `-${this.savedScrollY}px`,
        left: "0",
        right: "0",
        overflowY: "scroll", // 스크롤바 자리는 유지
        width: "100%",
      });
    },
    closeModal() {
      this.selectedMission = null;
      this.selectedLocationId = null;
      // body 스타일 원복
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflowY = "";
      document.body.style.width = "";
      // 원래 스크롤 위치로 복원
      window.scrollTo(0, this.savedScrollY);
    },
    handleMouseMove(e) {
      const container = this.$refs.container;
      const overlay = this.$refs.overlay;
      if (!container || !overlay) {
        // 모달이 닫혀 refs가 사라졌다면 아무 것도 하지 않고 리턴
        this.isTicking = false;
        return;
      }

      if (!this.isTicking) {
        this.isTicking = true;
        window.requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          // client 좌표 → container 기준 좌표
          const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
          const y = Math.min(rect.height, Math.max(0, e.clientY - rect.top));

          const halfW = rect.width / 2;
          const halfH = rect.height / 2;
          const dx = x - halfW;
          const dy = y - halfH;

          const rotateY = (-15 * dx) / halfW;
          const rotateX = (10 * dy) / halfH;

          container.style.transform = `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          overlay.style.backgroundPosition = `${x / 5 + y / 5}%`;
          overlay.style.opacity = Math.min(x / 200, 1);

          this.isTicking = false;
        });
      }
    },
    handleMouseOut() {
      const container = this.$refs.container;
      const overlay = this.$refs.overlay;
      if (!container || !overlay) return;

      overlay.style.opacity = "0";
      container.style.transform =
        "perspective(350px) rotateX(0deg) rotateY(0deg)";
    },
  },
};
</script>

<style scoped>
.btn-small {
  display: flex;
  padding: 0;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  width: 40px;
  height: 40px;
  border-radius: 24px 24px 24px 0;
  color: var(--text-deep-light);
}
</style>
