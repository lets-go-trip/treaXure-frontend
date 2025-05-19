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
      <div class="header-title">{{ mission.location }}</div>
      <div class="header-action">
        <button class="icon-btn"></button>
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

        <div
          class="upload-box"
          :class="{ 'file-selected': selectedFile }"
          @click="triggerFileInput"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM14.14 11.86L11.14 15.73L9 13.14L6 17H18L14.14 11.86Z"
              fill="currentColor"
            />
          </svg>
          <p>{{ uploadText }}</p>
          <input
            type="file"
            ref="photoUpload"
            accept="image/*"
            style="display: none"
            @change="handleFileUpload"
          />
        </div>

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
        <button class="btn" @click="submitMission">미션 제출하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ImageErrorMixin, FileUploadMixin } from "@/script";

export default {
  name: "MissionDetail",
  mixins: [ImageErrorMixin, FileUploadMixin],
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
      selectedFile: null,
      uploadText: "여기를 클릭하여 사진을 업로드하세요",
      comment: "",
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.photoUpload.click();
    },
    handleFileUpload(event) {
      // FileUploadMixin의 메서드를 직접 호출
      this.FileUploadMixin_handleFileUpload(event);

      const files = event.target.files;
      if (files.length > 0) {
        this.selectedFile = files[0];
        this.uploadText = `${files[0].name} 선택됨`;
      }
    },
    submitMission() {
      if (!this.selectedFile) {
        alert("사진을 업로드해주세요");
        return;
      }

      // 실제 구현에서는 API 호출을 통해 미션 제출
      console.log("미션 제출", {
        missionId: this.mission.id,
        file: this.selectedFile,
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
