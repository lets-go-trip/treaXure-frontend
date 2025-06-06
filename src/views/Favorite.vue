<template>
  <div class="favorite">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-back">
        <router-link to="/mypage" class="icon-btn">
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
      <div class="header-title">좋아요한 사진</div>
      <div class="header-action"></div>
    </div>

    <!-- 스크롤 가능한 컨텐츠 영역 -->
    <div class="scrollable-content">
      <div class="photo-grid">
        <div
          v-for="(photo, index) in photos"
          :key="index"
          class="photo-item"
          @click="openModal(photo)"
        >
          <img :src="photo.imageUrl" :alt="photo.title" />
        </div>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="selectedPhoto" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <img
          class="modal-img completed"
          :src="selectedPhoto.imageUrl"
          :alt="selectedPhoto.title"
        />
        <div class="modal-wrapper">
          <div
            class="modal-favorites"
            @click.stop="toggleFavorite(selectedPhoto)"
          >
            {{ isFavorited(selectedPhoto.boardId) ? "💗" : "🤍" }}
            {{ selectedPhoto.favoriteCount }}
          </div>
          <div class="modal-points">
            🍀 {{ Math.floor(selectedPhoto.similarityScore * 100) }}
          </div>
        </div>
        <div class="modal-title">{{ selectedPhoto.title }}</div>
        <div class="modal-description">
          <img :src="selectedPhoto.profileUrl" class="modal-avatar" />
          <div class="modal-info-wrapper">
            <div class="modal-nickname">{{ selectedPhoto.nickname }}</div>
            <div class="modal-info">
              <div class="modal-member">
                {{ formattedDate(selectedPhoto.createdAt) }}
              </div>
              <div class="modal-place">{{ selectedPhoto.placeName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllBoards } from "@/api/board";
import { getMyInfo } from "@/api/auth";
import {
  createFavorite,
  deleteFavorite,
  getAllFavorites,
} from "@/api/favorite";

export default {
  name: "Favorite",
  data() {
    return {
      photos: [], // 최종적으로 좋아요한 게시물의 board 정보가 담김
      selectedPhoto: null,
      savedScrollY: 0,
      memberId: null,
      myFavorites: [], // 로그인한 사용자의 좋아요 목록
    };
  },
  async mounted() {
    try {
      const [userRes, favRes] = await Promise.all([
        getMyInfo(),
        getAllFavorites(),
      ]);

      this.memberId = userRes.data?.data?.memberId;

      // 내가 좋아요한 항목만 필터링
      this.myFavorites =
        favRes.data?.data?.filter((f) => f.memberId === this.memberId) || [];

      // 각 좋아요의 board 정보만 추출해 photos에 저장
      this.photos = this.myFavorites.map((f) => f.board).filter((b) => !!b); // null/undefined 방지
    } catch (error) {
      console.error("좋아요한 사진 로딩 실패:", error);
    }
  },

  methods: {
    openModal(photo) {
      this.savedScrollY = window.scrollY;
      this.selectedPhoto = photo;
      document.body.style.position = "fixed";
      document.body.style.top = `-${this.savedScrollY}px`;
      document.body.style.overflowY = "scroll";
      document.body.style.width = "100%";
    },
    closeModal() {
      this.selectedPhoto = null;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflowY = "";
      document.body.style.width = "";
      window.scrollTo(0, this.savedScrollY);
    },
    formattedDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    isFavorited(boardId) {
      return this.myFavorites.some((f) => f.boardId === boardId);
    },
    async toggleFavorite(photo) {
      const target = this.myFavorites.find((f) => f.boardId === photo.boardId);
      try {
        if (target) {
          await deleteFavorite(target.favoriteId);
          this.myFavorites = this.myFavorites.filter(
            (f) => f.favoriteId !== target.favoriteId
          );
          photo.favoriteCount--;
        } else {
          const res = await createFavorite({
            boardId: photo.boardId,
            memberId: this.memberId,
          });
          this.myFavorites.push(res.data.data);
          photo.favoriteCount++;
        }
      } catch (err) {
        console.error("좋아요 처리 실패:", err);
      }
    },
  },
};
</script>

<style scoped></style>
