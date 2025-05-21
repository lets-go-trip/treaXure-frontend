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
      <div class="header-action"></div>
    </div>

    <!-- 스크롤 가능한 컨텐츠 영역 -->
    <div class="scrollable-content">
      <!-- 마이페이지 컨테이너 -->
      <div class="page-content">
        <div class="profile-section">
          <div class="profile-header">
            <div class="profile-avatar">
              <img :src="userData.profileUrl" alt="프로필 이미지" />
            </div>
            <div class="profile-info">
              <h2>{{ userData.nickname }}</h2>
              <div>{{ userData.email }}</div>
            </div>
          </div>
          <router-link to="/profile-edit" class="profile-edit btn"
            >프로필 수정</router-link
          >
        </div>
        <div class="stats-wrapper">
          <div class="stat-container">
            <div class="stat-value">23</div>
            <div class="stat-label">방문 장소</div>
          </div>
          <div class="stat-container">
            <div class="stat-value">32</div>
            <div class="stat-label">완료 미션</div>
          </div>
          <div class="stat-container">
            <div class="stat-value">{{ userData.point }}</div>
            <div class="stat-label">포인트</div>
          </div>
        </div>
        <div class="section-container">
          <div class="section-header">
            <h3>최근 미션 사진</h3>
            <router-link to="/photos" class="view-all">
              전체보기
              <svg
                width=""
                height=""
                viewBox="8 6 7 12"
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

          <div class="img-grid">
            <div
              class="img-item"
              v-for="(photo, index) in recentPhotos"
              :key="index"
            >
              <div class="photo-container">
                <img :src="photo.url" :alt="photo.alt" />
              </div>
            </div>
          </div>
        </div>
        <div class="section-setting">
          <div class="signout-btn btn" @click="handleSignoutClick('signout')">
            로그아웃
          </div>
          <div class="withdraw-btn btn" @click="handleSignoutClick('withdraw')">
            회원탈퇴
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMyInfo, signout, deactivateAccount } from "@/api/auth";

export default {
  name: "MyPage",
  data() {
    return {
      userData: {
        email: "",
        nickname: "",
        point: 0,
        profileUrl: "",
      },
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
          url: "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166254.jpg",
          alt: "미션 사진",
        },
        {
          url: "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166273.jpg",
          alt: "미션 사진",
        },
        {
          url: "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166267.jpg",
          alt: "미션 사진",
        },
        {
          url: "https://thumb16.iclickart.co.kr/Thumb16/1170000/1166270.jpg",
          alt: "미션 사진",
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
      } catch (err) {
        console.error("유저 정보 불러오기 실패", err);
        localStorage.removeItem("jwtToken");
        document.cookie =
          "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        alert("마이페이지 정보를 불러오는 데 실패했습니다.");
        this.$router.push("/signin");
      }
    },
    async handleSignoutClick(btn) {
      if (btn == "signout") {
        try {
          await signout();
          localStorage.removeItem("jwtToken");
          this.$router.push("/signin");
        } catch (error) {
          console.error("로그아웃 실패", error);
          alert("로그아웃에 실패했습니다.");
        }
      } else if (btn == "withdraw") {
        // 계정 비활성화 API 호출
        const confirmed = window.confirm(
          "정말로 회원 탈퇴를 진행하시겠습니까?\n탈퇴 시 모든 데이터가 삭제됩니다."
        );
        if (!confirmed) return;
        try {
          await deactivateAccount();
          await signout();
          localStorage.removeItem("jwtToken");
          alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
          this.$router.push("/main");
        } catch (error) {
          console.error("회원 탈퇴 실패", error);
          return alert("회원 탈퇴 중 오류가 발생했습니다.");
        }
      }
    },
  },
};
</script>

<style scoped></style>
