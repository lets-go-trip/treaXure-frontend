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
            <img
              :src="mission.exampleImage || mission.referenceUrl"
              :alt="mission.title + ' 예시'"
              @error="handleImageError"
              @load="handleImageLoad"
            />
            <div v-if="imageLoadError" class="image-error">
              <p>이미지를 불러올 수 없습니다.</p>
            </div>
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

    <!-- SimilarityScoreModal -->
    <SimilarityScoreModal
      :isOpen="showSimilarityModal"
      :similarityScore="similarityScore"
      :useOpenAI="false"
      :uploadedImageUrl="uploadedImageUrls.original"
      :missionImageUrl="mission.exampleImage"
      :placeId="currentPlaceId"
      @close="handleModalClose"
      @action="handleModalAction"
    />
  </div>
</template>

<script>
import { getMyInfo } from "@/api/auth";
import { createBoard } from "@/api/board";
import { getMissionById } from "@/api/mission";
import { addPointToMember } from "../api/member";
import ImageUploader from "@/components/ImageUploader.vue";
import { ImageErrorMixin } from "@/script";
import SimilarityScoreModal from "@/components/SimilarityScoreModal.vue";
import axios from "axios";

export default {
  name: "MissionDetail",
  components: {
    ImageUploader,
    SimilarityScoreModal,
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
        placeId: null,
      },
      uploadedImageUrls: {
        original: "",
        thumbnail: "",
      },
      comment: "",
      uploadError: "",
      isLoading: true,
      apiBaseUrl:
        process.env.VUE_APP_API_URL ||
        "http://ec2-54-180-217-227.ap-northeast-2.compute.amazonaws.com:8081/",
      // SimilarityScoreModal 관련 데이터
      showSimilarityModal: false,
      similarityScore: 0,
      memberId: null,
      imageLoadError: false,
    };
  },
  computed: {
    currentPlaceId() {
      // 라우트에서 placeId를 가져오거나, mission 데이터에서 가져오거나, 기본값 사용
      return this.$route.params.placeId || this.mission.placeId || "1";
    },
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

      // 개발 환경에서 임시 해결책: 샘플 이미지 URL 사용
      if (process.env.NODE_ENV === "development") {
        console.log("개발 환경에서 샘플 이미지 URL 사용");
        this.uploadedImageUrls = {
          original:
            "https://via.placeholder.com/400x300?text=업로드된+이미지+샘플",
          thumbnail: "https://via.placeholder.com/200x150?text=썸네일+샘플",
        };
        this.uploadError = ""; // 에러 메시지 제거
      }
    },
    async loadMissionDetails() {
      console.log("loadMissionDetails 시작");
      this.isLoading = true;
      const missionId = this.$route.params.id;
      console.log("추출된 미션 ID:", missionId);
      if (!missionId) {
        console.error("미션 ID가 없습니다");
        return;
      }

      try {
        // 실제 API 호출 먼저 시도
        if (
          !(
            process.env.NODE_ENV === "development" &&
            !this.apiBaseUrl.includes("localhost")
          )
        ) {
          try {
            const response = await axios.get(
              `${this.apiBaseUrl}/api/missions/${missionId}`
            );
            console.log("미션 API 전체 응답:", response.data);
            const missionData = response.data.data; // 실제 미션 데이터는 data 속성에 있음
            console.log("미션 데이터:", missionData);
            console.log("referenceUrl 값:", missionData.referenceUrl);
            console.log("referenceUrl 타입:", typeof missionData.referenceUrl);

            // API 응답 데이터를 템플릿에서 사용하는 구조로 매핑
            this.mission = {
              id: missionData.missionId,
              title: missionData.title,
              location: "장소 정보", // API에서 장소 정보가 없어서 기본값 설정
              address: "",
              points: missionData.score,
              description: missionData.description,
              tips: [], // API에서 팁 정보가 없어서 빈 배열로 설정
              referenceUrl: missionData.referenceUrl,
              exampleImage: missionData.referenceUrl,
              placeId: missionData.placeId || "1", // API에서 placeId 가져오기, 없으면 기본값
            };

            console.log("매핑된 미션 데이터:", this.mission);
            console.log("최종 이미지 URL:", this.mission.exampleImage);

            // 예시 이미지 URL이 상대 경로인 경우 서명된 URL로 변환
            if (
              this.mission.exampleImage &&
              !this.mission.exampleImage.startsWith("http")
            ) {
              console.log(
                "상대 경로 이미지 URL 감지, 서명된 URL 요청:",
                this.mission.exampleImage
              );
              const imageResponse = await axios.post(
                `${this.apiBaseUrl}/api/signed-url`,
                {
                  objectKey: this.mission.exampleImage,
                }
              );
              console.log("서명된 URL 응답:", imageResponse.data);
              if (imageResponse.data.signedUrl) {
                this.mission.exampleImage = imageResponse.data.signedUrl;
                this.mission.referenceUrl = imageResponse.data.signedUrl;
                console.log(
                  "서명된 URL로 업데이트됨:",
                  this.mission.exampleImage
                );
              }
            }

            this.isLoading = false;
            return;
          } catch (apiError) {
            console.error(
              "미션 정보 API 호출 실패, 샘플 데이터를 사용합니다:",
              apiError
            );
            // API 호출 실패 시 샘플 데이터로 폴백
          }
        }

        // 개발 환경이거나 API 호출 실패 시 샘플 데이터 사용
        // 시뮬레이션된 지연
        await new Promise((resolve) => setTimeout(resolve, 300));

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
          referenceUrl:
            "https://via.placeholder.com/320x180?text=동궁과+후원+예시",
          exampleImage:
            "https://via.placeholder.com/320x180?text=동궁과+후원+예시",
          placeId: "1", // 샘플 데이터에서 placeId 설정
        };
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
        // 사용자 정보 가져오기 (memberId가 없는 경우)
        if (!this.memberId) {
          const userInfo = await getMyInfo();
          this.memberId = userInfo.data?.data?.memberId;
        }

        if (!this.memberId) {
          alert("사용자 정보를 가져올 수 없습니다.");
          return;
        }

        // 게시물 생성 API 호출
        const requestData = {
          memberId: this.memberId,
          missionId: this.mission.id,
          imageUrl: this.uploadedImageUrls.original,
          title: this.comment || `${this.mission.title} 미션 완료`,
        };

        const response = await axios.post(
          `${this.apiBaseUrl}/api/boards?useOpenAI=false`,
          requestData
        );

        if (response.data.success) {
          const boardData = response.data.data;

          // 유사도 점수 설정
          this.similarityScore = boardData.similarityScore || 0;

          // SimilarityScoreModal 띄우기
          this.showSimilarityModal = true;
        } else {
          alert("미션 제출에 실패했습니다.");
        }
      } catch (error) {
        console.error("미션 제출 중 오류 발생:", error);

        // 개발 환경에서는 항상 모달을 띄워서 테스트할 수 있도록 함
        if (process.env.NODE_ENV === "development") {
          console.log("개발 환경: 샘플 유사도 점수로 모달 표시");
          this.similarityScore = 0.75 + Math.random() * 0.2; // 0.75-0.95 사이 랜덤 점수
          this.showSimilarityModal = true;
        } else {
          alert(
            `미션 제출 실패: ${
              error.response?.data?.message ||
              error.message ||
              "알 수 없는 오류가 발생했습니다."
            }`
          );
        }
      }
    },
    handleModalClose() {
      this.showSimilarityModal = false;
    },
    handleModalAction(level) {
      // 모든 점수에서 동일하게 처리 - 모달에서 직접 이동 처리
      this.showSimilarityModal = false;
      console.log("모달 액션 완료 - 모달에서 이동 처리됨:", level);
    },
    handleImageError(event) {
      console.error("이미지 로드 실패:", {
        src: event.target.src,
        alt: event.target.alt,
        naturalWidth: event.target.naturalWidth,
        naturalHeight: event.target.naturalHeight,
        complete: event.target.complete,
      });
      this.imageLoadError = true;
    },
    handleImageLoad() {
      this.imageLoadError = false;
    },
  },
  async mounted() {
    console.log("MissionDetail 컴포넌트 마운트됨");
    console.log("현재 라우트:", this.$route);
    console.log("미션 ID:", this.$route.params.id);

    // CloudFront 인증 쿠키 설정
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/api/auth/cloudfront`,
        {
          withCredentials: true,
        }
      );
      console.log("CloudFront 인증 쿠키 설정 완료:", response.data);
    } catch (error) {
      console.error("CloudFront 인증 쿠키 설정 실패:", error);
    }

    // 사용자 정보와 미션 정보를 병렬로 로드
    try {
      const [userInfo] = await Promise.all([
        getMyInfo(),
        this.loadMissionDetails(),
      ]);

      this.memberId = userInfo.data?.data?.memberId;
      console.log("사용자 ID:", this.memberId);
    } catch (error) {
      console.error("초기 데이터 로드 중 오류 발생:", error);
      // 미션 정보 로드는 loadMissionDetails에서 처리
      this.loadMissionDetails();
    }
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

.image-container {
  position: relative;
  width: 100%;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
}

.image-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #666;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
}

.image-error p {
  margin: 0;
  font-size: 14px;
}
</style>
