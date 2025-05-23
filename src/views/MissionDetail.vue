<template>
  <div class="mission-detail">
    <!-- 로딩 인디케이터 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>미션 정보 로딩 중...</p>
    </div>

    <!-- 헤더 -->
    <div class="header">
      <div class="header-back">
        <router-link :to="'/mission-list/' + mission.placeId" class="icon-btn">
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
      <div class="header-title">{{ mission.location }}</div>
      <div class="header-action"></div>
    </div>

    <!-- 미션 상세 컨테이너 -->
    <div v-if="!isLoading" class="mission-content-wrapper">
      <div class="mission-header-wrapper">
        <div class="mission-header">
          <h2 class="mission-name">{{ mission.title }}</h2>
          <div class="badge">{{ mission.score }}점</div>
        </div>
        <div class="mission-description">{{ mission.description }}</div>
      </div>

      <div class="mission-content">
        <div class="image-wrapper">
          <h4>미션 사진</h4>
          <div class="image-container">
            <img :src="mission.referenceUrl" :alt="mission.title + ' 예시'" />
          </div>
        </div>

        <div class="upload-wrapper">
          <h4>사진 업로드</h4>
          <ImageUploader
            folder="images/missions/"
            @upload-success="handleUploadSuccess"
            @upload-error="handleUploadError"
          />
        </div>

        <div class="comment-wrapper">
          <h4>코멘트 남기기</h4>
          <textarea
            v-model="comment"
            placeholder="사진에 대한 간단한 설명이나 코멘트를 남겨주세요."
            rows="3"
          >
          </textarea>
        </div>

        <div class="action-buttons">
          <button
            class="btn"
            @click="submitMission"
            :disabled="!uploadedImageUrls.original"
          >
            미션 제출하기
          </button>
          <router-link
            :to="'/mission-list/' + mission.placeId"
            class="btn cancel-btn"
            >취소</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMyInfo } from "@/api/auth";
import { createBoard } from "@/api/board";
import { getMissionById } from "@/api/mission";
import { addPointToMember } from "../api/member";
import ImageUploader from "@/components/ImageUploader.vue";
import { ImageErrorMixin } from "@/script";

export default {
  name: "MissionDetail",
  components: {
    ImageUploader,
  },
  mixins: [ImageErrorMixin],
  data() {
    return {
      mission: {
        id: null,
        title: "",
        location: "",
        address: "",
        points: 0,
        description: "",
        tips: [],
        referenceUrl: "",
        exampleImage: "",
      },
      uploadedImageUrls: {
        original: "",
        thumbnail: "",
      },
      comment: "",
      uploadError: "",
      isLoading: true,
    };
  },
  methods: {
    handleUploadSuccess(imageUrls) {
      this.uploadedImageUrls = imageUrls;
      this.uploadError = "";
      console.log("이미지 업로드 성공:", imageUrls);
    },
    handleUploadError(error) {
      this.uploadError = "이미지 업로드 중 오류가 발생했습니다.";
      console.error("이미지 업로드 실패:", error);
    },
    async loadMissionDetails() {
      this.isLoading = true;
      const missionId = this.$route.params.id;

      try {
        const res = await getMissionById(missionId); // ⬅️ 실제 API 호출 함수 사용
        this.mission = res.data.data;
      } catch (error) {
        console.error("미션 정보 로드 중 오류 발생:", error);
        alert("미션 정보를 불러오는 데 실패했습니다.");
      } finally {
        this.isLoading = false;
      }
    },
    async submitMission() {
      if (!this.uploadedImageUrls.original) {
        alert("사진을 업로드해주세요");
        return;
      }

      try {
        const me = await getMyInfo();
        const memberId = me.data?.data.memberId;

        const boardData = {
          missionId: this.mission.missionId,
          imageUrl: this.uploadedImageUrls.original,
          title: this.comment || `${this.mission.title} 후기`,
          memberId,
        };

        await createBoard(boardData);

        await addPointToMember(memberId, this.mission.score);

        alert("미션이 성공적으로 제출되었습니다!");
        this.$router.push(`/mission-list/${this.mission.placeId}`);
      } catch (error) {
        console.error("미션 제출 중 오류 발생:", error);
        alert(
          `미션 제출 실패: ${
            error.response?.data?.message || error.message || "알 수 없는 오류"
          }`
        );
      }
    },
  },
  mounted() {
    this.loadMissionDetails();
  },
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.mission-content-wrapper {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.uploaded-image-preview {
  margin-top: 20px;
}

/* 나머지 스타일은 전역 CSS에서 처리 */
</style>
