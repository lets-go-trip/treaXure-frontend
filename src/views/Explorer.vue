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
  name: "Explorer",
  data() {
    return {
      photos: [],
      selectedPhoto: null,
      savedScrollY: 0,
      memberId: null,
      myFavorites: [],
    };
  },
  async mounted() {
    try {
      const userRes = await getMyInfo();
      this.memberId = userRes.data?.data?.memberId;

      const res = await getAllBoards();
      this.photos = res.data.data || [];

      const favRes = await getAllFavorites();
      this.myFavorites = favRes.data.data.filter(
        (f) => f.memberId === this.memberId
      );
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
  },
};
</script>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.photo-item {
  display: contents;
}

.photo-item img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  cursor: pointer;
}

.modal-favorites {
  cursor: pointer;
}

.modal-description {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-avatar {
  width: 35px;
  height: 35px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 50%;
}

.modal-info-wrapper {
  display: flex;
  flex-direction: column;
}

.modal-info {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: var(--text-dark);
}
</style>
