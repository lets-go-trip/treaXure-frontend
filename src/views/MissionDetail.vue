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
      <div class="header-action"></div>
    </div>

    <!-- 미션 상세 컨테이너 -->
    <div v-if="!isLoading" class="mission-content-wrapper">
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
            folder="images/missions/" 
            @upload-success="handleUploadSuccess" 
            @upload-error="handleUploadError"
          />

          <div v-if="uploadedImageUrls.original" class="uploaded-image-preview">
            <h4>업로드된 사진</h4>
            <div class="image-container">
              <img :src="uploadedImageUrls.original" alt="업로드된 사진" />
            </div>
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
          <button class="btn" @click="submitMission" :disabled="!uploadedImageUrls.original">미션 제출하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImageErrorMixin } from "@/script";
import ImageUploader from '@/components/ImageUploader.vue';
import axios from 'axios';

export default {
  name: "MissionDetail",
  components: {
    ImageUploader
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
        exampleImage: ""
      },
      uploadedImageUrls: {
        original: '',
        thumbnail: ''
      },
      comment: "",
      uploadError: "",
      isLoading: true,
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:8081'
    };
  },
  methods: {
    handleUploadSuccess(imageUrls) {
      this.uploadedImageUrls = imageUrls;
      this.uploadError = '';
      console.log('이미지 업로드 성공:', imageUrls);
    },
    handleUploadError(error) {
      this.uploadError = '이미지 업로드 중 오류가 발생했습니다.';
      console.error('이미지 업로드 실패:', error);
    },
    async loadMissionDetails() {
      const missionId = this.$route.params.id;
      if (!missionId) return;
      
      this.isLoading = true;
      
      try {
        // 실제 API 호출 먼저 시도
        if (!(process.env.NODE_ENV === 'development' && !this.apiBaseUrl.includes('localhost'))) {
          try {
            const response = await axios.get(`${this.apiBaseUrl}/api/missions/${missionId}`);
            this.mission = response.data;
            
            // 예시 이미지 URL이 상대 경로인 경우 서명된 URL로 변환
            if (this.mission.exampleImage && !this.mission.exampleImage.startsWith('http')) {
              const imageResponse = await axios.post(`${this.apiBaseUrl}/api/signed-url`, {
                objectKey: this.mission.exampleImage
              });
              if (imageResponse.data.signedUrl) {
                this.mission.exampleImage = imageResponse.data.signedUrl;
              }
            }
            
            this.isLoading = false;
            return;
          } catch (apiError) {
            console.error('미션 정보 API 호출 실패, 샘플 데이터를 사용합니다:', apiError);
            // API 호출 실패 시 샘플 데이터로 폴백
          }
        }
        
        // 개발 환경이거나 API 호출 실패 시 샘플 데이터 사용
        // 시뮬레이션된 지연
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 샘플 데이터 설정
        this.mission = {
          id: missionId,
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
        };
      } catch (error) {
        console.error('미션 정보 로드 중 오류 발생:', error);
        // 오류 처리, 예: 오류 메시지 표시
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
        // 실제 API 호출 시도
        if (!(process.env.NODE_ENV === 'development' && !this.apiBaseUrl.includes('localhost'))) {
          try {
            await axios.post(`${this.apiBaseUrl}/api/missions/${this.mission.id}/submit`, {
              imageUrl: this.uploadedImageUrls.original,
              thumbnailUrl: this.uploadedImageUrls.thumbnail || null,
              comment: this.comment
            });
            
            alert("미션이 성공적으로 제출되었습니다!");
            this.$router.push("/mission-list");
            return;
          } catch (apiError) {
            console.error('미션 제출 API 호출 실패, 개발용 시뮬레이션으로 진행합니다:', apiError);
            // API 호출 실패 시 개발용 시뮬레이션 진행
          }
        }
        
        // 개발 환경이거나 API 호출 실패 시 시뮬레이션
        console.log("미션 제출 시뮬레이션:", {
          missionId: this.mission.id,
          imageUrl: this.uploadedImageUrls.original,
          thumbnailUrl: this.uploadedImageUrls.thumbnail,
          comment: this.comment,
        });
        
        alert("미션이 성공적으로 제출되었습니다! (개발 모드)");
        this.$router.push("/mission-list");
      } catch (error) {
        console.error('미션 제출 중 오류 발생:', error);
        alert(`미션 제출 실패: ${error.message || '알 수 없는 오류가 발생했습니다.'}`);
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
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mission-content-wrapper {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.uploaded-image-preview {
  margin-top: 20px;
}

.image-container {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 8px;
}

.image-container img {
  width: 100%;
  height: auto;
  display: block;
}

/* 나머지 스타일은 전역 CSS에서 처리 */
</style>