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
        <div v-for="(photo, index) in photos" :key="index" class="photo-item">
          <img :src="photo.imageUrl" :alt="photo.title" />
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
}
</style>
