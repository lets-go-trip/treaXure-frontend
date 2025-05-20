<template>
  <div class="mission-detail">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-back">
        <router-link to="/mission-list" class="icon-btn">
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
      <div class="header-title">{{mission.location}}</div>
      <div class="header-action">
        <button class="icon-btn">⋮</button>
      </div>
    </div>

    <!-- 미션 상세 컨테이너 -->
    <div class="mission-header">
      <h2>{{ mission.title }}</h2>
      <div class="badge">{{ mission.points }} 포인트</div>
    </div>

    <div class="mission-content">
      <div class="mission-desc">
        <p>{{ mission.description }}</p>
        <ul>
          <li v-for="(tip, index) in mission.tips" :key="index">{{ tip }}</li>
        </ul>
      </div>

      <div class="example-image">
        <h4>예시 사진</h4>
        <div class="image-container">
          <img :src="mission.exampleImage" :alt="mission.title + ' 예시'" />
        </div>
      </div>

      <div class="upload-section">
        <h4>사진 업로드</h4>
        <p>
          미션에 맞는 사진을 업로드하세요. 높은 점수를 받으면 주간 베스트
          사진으로 선정될 수 있습니다!
        </p>

        <ImageUploader 
          folder="missions/" 
          @upload-success="handleUploadSuccess" 
          @upload-error="handleUploadError"
        />

        <div class="comment-box">
          <h4>코멘트 남기기</h4>
          <textarea
            v-model="comment"
            placeholder="사진에 대한 간단한 설명이나 코멘트를 남겨주세요."
            rows="3"
          >
          </textarea>
        </div>
      </div>

      <div class="action-buttons">
        <router-link to="/mission-list" class="btn-outline">취소</router-link>
        <button class="btn" @click="submitMission" :disabled="!uploadedImageUrl">미션 제출하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ImageErrorMixin } from "@/script";
import ImageUploader from '@/components/ImageUploader.vue';

export default {
  name: "MissionDetail",
  components: {
    ImageUploader
  },
  mixins: [ImageErrorMixin],
  data() {
    return {
      mission: {
        id: 3,
        title: "숨겨진 동궁과 후원 찾기",
        location: "경복궁",
        address: "서울 종로구",
        points: 200,
        description:
          "경복궁에서 가장 아름다운 영역 중 하나인 동궁과 후원의 풍경을 담아보세요. 조선시대 왕세자가 거처했던 이곳은 연못과 정자가 조화롭게 어우러져 있습니다.",
        tips: [
          "동궁과 후원 전체 모습이 담긴 사진을 촬영하세요",
          "연못 주변의 계절감이 느껴지는 사진을 찍어보세요",
          "왕실의 풍경을 현대적 시각으로 담아보세요",
        ],
        exampleImage:
          "https://via.placeholder.com/320x180?text=동궁과+후원+예시",
      },
      uploadedImageUrl: '',
      comment: "",
      uploadError: ""
    };
  },
  methods: {
    handleUploadSuccess(imageUrl) {
      this.uploadedImageUrl = imageUrl;
      console.log('이미지 업로드 성공:', imageUrl);
    },
    handleUploadError(error) {
      this.uploadError = '이미지 업로드 중 오류가 발생했습니다.';
      console.error('이미지 업로드 실패:', error);
    },
    submitMission() {
      if (!this.uploadedImageUrl) {
        alert("사진을 업로드해주세요");
        return;
      }

      // 실제 구현에서는 API 호출을 통해 미션 제출
      console.log("미션 제출", {
        missionId: this.mission.id,
        imageUrl: this.uploadedImageUrl,
        comment: this.comment,
      });

      // 제출 완료 후 리스트 페이지로 이동
      alert("미션이 성공적으로 제출되었습니다!");
      this.$router.push("/mission-list");
    },
  },
  mounted() {
    // 라우터에서 전달된 미션 ID를 기반으로 미션 상세 데이터 로드
    const missionId = this.$route.params.id;
    if (missionId) {
      // 실제 구현에서는 API를 호출하여 해당 미션의 상세 정보를 가져올 것
      console.log("Loading mission details for ID:", missionId);
    }
  },
};
</script>

<style scoped>
/* 스타일은 전역 CSS에서 처리 */
</style>
