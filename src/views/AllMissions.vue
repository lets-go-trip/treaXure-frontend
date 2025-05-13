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
              :class="{ collapsed: location.collapsed }"
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
                @click.stop="selectMission(mission)"
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
        <div class="modal-content">
          <button class="close-btn" @click="closeModal">×</button>
          <h3>{{ selectedMission.title }}</h3>
          <p>{{ selectedMission.description }}</p>
          <img
            :src="selectedMission.imageUrl"
            :alt="selectedMission.title"
            class="modal-img"
          />
          <p class="modal-points">{{ selectedMission.points }} 포인트</p>
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
      // 모달에 띄울 선택된 미션
      selectedMission: null,
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
              completed: false,
            },
            {
              id: 6,
              title: "낙선재 문고 탐방",
              description:
                "조선시대 왕실 도서관이었던 낙선재 문고를 찾아 인증샷을 찍어보세요.",
              imageUrl:
                "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166266.jpg",
              points: 180,
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
    };
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
    selectMission(mission) {
      this.selectedMission = mission;
    },
    closeModal() {
      this.selectedMission = null;
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

.mission-detail {
  margin: 20px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.mission-detail-img {
  width: 100%;
  margin: 8px 0;
  border-radius: 4px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  position: relative;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.modal-img {
  width: 100%;
  border-radius: 4px;
  margin: 12px 0;
  object-fit: cover;
}

.modal-points {
  font-weight: 600;
  margin-bottom: 16px;
}
</style>
{}
