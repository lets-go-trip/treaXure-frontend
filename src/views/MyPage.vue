<template>
  <div class="mypage">
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
      <div class="header-title">마이페이지</div>
      <div class="header-action">
        <button class="icon-btn"></button>
      </div>
    </div>

    <!-- 스크롤 가능한 컨텐츠 영역 -->
    <div class="scrollable-content">
      <!-- 마이페이지 컨테이너 -->
      <div class="page-content">
        <div class="profile-section">
          <div class="profile-header">
            <div class="profile-avatar">
              <img :src="userData.profileUrl" alt="프로필 이미지" />
              <div class="edit-avatar-btn">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            <div class="profile-info">
              <h2>{{ userData.nickname }}</h2>
              <div>{{ userData.email }}</div>
              <span class="level-text">{{ userData.point }} 포인트</span>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-box" v-for="(stat, index) in stats" :key="index">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <div class="section-container">
          <div class="section-header">
            <h3>나의 랭킹</h3>
            <router-link to="/rankings" class="view-all">
              전체보기
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"
                  fill="currentColor"
                />
              </svg>
            </router-link>
          </div>

          <div class="card-list">
            <div
              class="ranking-card"
              v-for="(ranking, index) in rankings"
              :key="index"
            >
              <div class="ranking-position">
                <div class="position-number">{{ ranking.position }}</div>
                <div class="position-text">{{ ranking.percentile }}</div>
              </div>
              <div class="ranking-info">
                <div class="ranking-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path :d="ranking.iconPath" fill="currentColor" />
                  </svg>
                </div>
                <div class="ranking-details">
                  <div class="ranking-title">{{ ranking.title }}</div>
                  <div class="ranking-subtitle">{{ ranking.subtitle }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section-container">
          <div class="section-header">
            <h3>최근 미션 사진</h3>
            <router-link to="/photos" class="view-all">
              전체보기
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"
                  fill="currentColor"
                />
              </svg>
            </router-link>
          </div>

          <div class="photo-grid">
            <div
              class="photo-item"
              v-for="(photo, index) in recentPhotos"
              :key="index"
            >
              <div class="photo-container">
                <img :src="photo.url" :alt="photo.alt" />
                <div
                  v-if="photo.badge"
                  class="photo-badge"
                  :class="{ best: photo.badge === 'best' }"
                >
                  {{ photo.badge === "best" ? "베스트" : photo.badge }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section-container settings-section">
          <div class="section-header">
            <h3>설정</h3>
          </div>

          <div class="settings-list">
            <div
              v-for="(setting, index) in settings"
              :key="index"
              class="settings-item"
              @click="handleSettingClick(setting)"
            >
              <div class="settings-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path :d="setting.iconPath" fill="currentColor" />
                </svg>
              </div>
              <span class="settings-title">{{ setting.title }}</span>
              <div class="settings-arrow">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImageErrorMixin } from "@/script";
import { getMyInfo } from "@/api/auth";

export default {
  name: "MyPage",
  mixins: [ImageErrorMixin],
  data() {
    return {
      userData: {
        email: "",
        nickname: "",
        point: 0,
        profileUrl: "",
      },
      stats: [
        { value: 24, label: "방문 장소" },
        { value: 42, label: "완료 미션" },
        { value: 5, label: "베스트 사진" },
        { value: "3,250", label: "총 포인트" },
      ],
      rankings: [
        {
          position: 8,
          percentile: "상위 5% 탐험가",
          iconPath:
            "M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z",
          title: "지역 랭킹",
          subtitle: "서울 종로구 기준",
        },
        {
          position: 42,
          percentile: "상위 15% 탐험가",
          iconPath:
            "M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z",
          title: "전국 랭킹",
          subtitle: "최근 30일 기준",
        },
      ],
      recentPhotos: [
        {
          url: "https://via.placeholder.com/150x150?text=미션1",
          alt: "미션 사진",
          badge: "best",
        },
        {
          url: "https://via.placeholder.com/150x150?text=미션2",
          alt: "미션 사진",
        },
        {
          url: "https://via.placeholder.com/150x150?text=미션3",
          alt: "미션 사진",
          badge: "+100",
        },
        {
          url: "https://via.placeholder.com/150x150?text=미션4",
          alt: "미션 사진",
        },
      ],
      settings: [
        {
          title: "로그아웃",
          iconPath:
            "M10.09 15.59L11.5 17L16.5 12L11.5 7L10.09 8.41L12.67 11H3V13H12.67L10.09 15.59ZM19 3H5C3.89 3 3 3.9 3 5V9H5V5H19V19H5V15H3V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z",
          link: "/logout",
        },
      ],
    };
  },
  async mounted() {
    await this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await getMyInfo();
        const data = response.data.data;
        this.userData.email = data.email;
        this.userData.nickname = data.nickname;
        this.userData.point = data.point;
        this.userData.profileUrl = data.profileUrl;
        this.stats[3].value = data.point.toLocaleString();
      } catch (err) {
        console.error("유저 정보 불러오기 실패", err);
        alert("마이페이지 정보를 불러오는 데 실패했습니다.");
      }
    },
    async handleSettingClick(setting) {
      if (setting.link === "/logout") {
        try {
          await fetch("/api/auth/signout", {
            method: "POST",
            credentials: "include", // refreshToken 쿠키 포함
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          });
          localStorage.removeItem("jwtToken");
          this.$router.push("/signin");
        } catch (error) {
          console.error("로그아웃 실패", error);
          alert("로그아웃에 실패했습니다.");
        }
      } else {
        this.$router.push(setting.link);
      }
    },
  },
};
</script>

<style scoped>
.icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
