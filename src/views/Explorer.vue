<template>
  <div class="explorer">
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
      <div class="header-title">탐색</div>
      <div class="header-action"></div>
    </div>

    <!-- 스크롤 가능한 컨텐츠 영역 -->
    <div class="scrollable-content">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="검색어를 입력하세요"
          @input="filterPhotos"
        />
      </div>

      <div class="photo-grid">
        <div
          v-for="(photo, index) in filteredPhotos"
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
  name: "Explorer",
  data() {
    return {
      photos: [], // 전체 게시물
      filteredPhotos: [], // 검색 필터된 게시물
      selectedPhoto: null,
      savedScrollY: 0,
      memberId: null,
      myFavorites: [],
      searchQuery: "", // 검색어
    };
  },
  async mounted() {
    try {
      const [userRes, boardRes, favRes] = await Promise.all([
        getMyInfo(),
        getAllBoards(),
        getAllFavorites(),
      ]);

      this.memberId = userRes.data?.data?.memberId;
      this.photos = boardRes.data?.data || [];

      // 현재 사용자 좋아요만 필터링
      this.myFavorites =
        favRes.data?.data?.filter((f) => f.memberId === this.memberId) || [];

      // 초기 검색 필터 대상 설정
      this.filteredPhotos = this.photos;
    } catch (error) {
      console.error("탐색 데이터 로딩 실패:", error);
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
    filterPhotos() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) {
        this.filteredPhotos = this.photos;
        return;
      }

      this.filteredPhotos = this.photos.filter((photo) => {
        return (
          (photo.nickname || "").toLowerCase().includes(query) ||
          (photo.placeName || "").toLowerCase().includes(query) ||
          (photo.title || "").toLowerCase().includes(query)
        );
      });
    },
  },
};
</script>

<style scoped>
.search-box {
  padding: 0 16px 16px 16px;
}

.search-box input {
  width: 100%;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid var(--primary);
  font-size: 14px;
  color: var(--primary);
  outline: none;
}

.search-box input::placeholder {
  color: var(--primary);
}
</style>
