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
          <div class="modal-favorites">
            💗🤍 {{ selectedPhoto.favoriteCount }}
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

export default {
  name: "Explorer",
  data() {
    return {
      photos: [],
      selectedPhoto: null,
      savedScrollY: 0,
    };
  },
  async mounted() {
    try {
      const res = await getAllBoards();
      this.photos = res.data.data || [];
    } catch (error) {
      console.error("게시물 목록을 불러오는 데 실패했습니다.", error);
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
