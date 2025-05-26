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
            <div class="stat-value">{{ visitCount }}</div>
            <div class="stat-label">방문 장소</div>
          </div>
          <div class="stat-container">
            <div class="stat-value">{{ completedMissionCount }}</div>
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
            <router-link to="/all-missions" class="view-all">
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
        <div class="section-container">
          <div class="section-header">
            <h3>좋아요한 사진</h3>
            <router-link to="/favorite" class="view-all">
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
              v-for="(photo, index) in likedBoards"
              :key="index"
            >
              <div class="photo-container">
                <img :src="photo.imageUrl" :alt="photo.title" />
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
import { getVisitsByMember } from "@/api/visit";
import { getMyBoards } from "@/api/board";
import { getAllFavorites } from "@/api/favorite";

export default {
  name: "MyPage",
  data() {
    return {
      userData: {
        memberId: null,
        email: "",
        nickname: "",
        point: 0,
        profileUrl: "",
      },
      visitCount: 0, // 방문 장소 수
      completedMissionCount: 0, // 완료된 미션 수
      recentPhotos: [],
      likedBoards: [], // 좋아요한 게시물
    };
  },
  async mounted() {
    await this.fetchUserData();
    await Promise.all([
      this.fetchVisitData(),
      this.fetchcompletedMissionCount(),
      this.fetchRecentPhotos(),
      this.fetchLikedBoards(),
    ]);
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await getMyInfo();
        const data = response.data.data;
        this.userData.memberId = data.memberId;
        this.userData.email = data.email;
        this.userData.nickname = data.nickname;
        this.userData.point = data.point;
        this.userData.profileUrl = data.profileUrl;
      } catch (err) {
        console.error("유저 정보 불러오기 실패", err);
        localStorage.removeItem("jwtToken");
        alert("마이페이지 정보를 불러오는 데 실패했습니다.");
        this.$router.push("/signin");
      }
    },
    async fetchVisitData() {
      try {
        const res = await getVisitsByMember(this.userData.memberId);
        this.visitCount = res.data.data.length;
      } catch (err) {
        console.error("방문 기록 불러오기 실패", err);
        this.visitCount = 0;
      }
    },
    async fetchcompletedMissionCount() {
      try {
        const res = await getMyBoards(this.userData.memberId);
        const missions = res.data.data;
        this.completedMissionCount = missions.length;
      } catch (err) {
        console.error("완료 미션 불러오기 실패", err);
        this.completedMissionCount = 0;
      }
    },
    async fetchRecentPhotos() {
      try {
        const res = await getMyBoards(this.userData.memberId);
        const boards = res.data.data;

        // 최신순 정렬 (createdAt 기준, 내림차순)
        const sorted = boards.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // 최대 4개까지만
        this.recentPhotos = sorted.slice(0, 4).map((board) => ({
          url: board.imageUrl,
          alt: board.title || "미션 사진",
        }));
      } catch (err) {
        console.error("최근 미션 사진 불러오기 실패", err);
        this.recentPhotos = [];
      }
    },
    async fetchLikedBoards() {
      try {
        const res = await getAllFavorites();
        const allFavorites = res.data.data;

        // 현재 로그인한 사용자의 좋아요만 필터링
        const myFavorites = allFavorites.filter(
          (f) => f.memberId === this.userData.memberId
        );

        // board 정보만 추출하고 최대 4개까지
        this.likedBoards = myFavorites.map((fav) => fav.board).slice(0, 4); // 최대 4개만 추출
      } catch (err) {
        console.error("좋아요한 게시물 불러오기 실패", err);
        this.likedBoards = [];
      }
    },
    async handleSignoutClick(btn) {
      if (btn == "signout") {
        try {
          await signout();
          // JWT 토큰만 localStorage에서 제거
          localStorage.removeItem("jwtToken");
          // 쿠키 삭제
          document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          document.cookie = "recentPlaceId=; path=/; max-age=0";
          console.log("로그아웃 완료 - 모든 토큰 삭제됨");
          this.$router.push("/signin");
        } catch (error) {
          console.error("로그아웃 실패", error);
          // 로그아웃 API 실패해도 클라이언트 토큰은 삭제
          localStorage.removeItem("jwtToken");
          document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          document.cookie = "recentPlaceId=; path=/; max-age=0";
          this.$router.push("/signin");
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
          // JWT 토큰만 localStorage에서 제거
          localStorage.removeItem("jwtToken");
          // 쿠키 삭제
          document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
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
