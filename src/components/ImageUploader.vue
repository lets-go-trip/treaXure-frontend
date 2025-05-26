<template>
  <div class="image-uploader">
    <div
      class="upload-area"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'is-dragging': isDragging, 'file-selected': previewUrl }"
    >
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
        style="display: none"
      />

      <p v-if="isUploading" class="uploading-indicator">업로드 중...</p>

      <div v-if="!previewUrl" class="upload-placeholder">
        <i class="upload-icon">📁</i>
        <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>

        <div class="folder-selector" v-if="showFolderSelector">
          <label>
            <input
              type="radio"
              v-model="currentFolder"
              :value="folder"
              checked
            />
            기본 폴더
          </label>
          <label>
            <input type="radio" v-model="currentFolder" value="missions" /> 미션
            폴더
          </label>
        </div>
      </div>

      <div v-else class="preview-container">
        <img :src="previewUrl" alt="미리보기" class="preview-image" />
        <button class="remove-button" @click.stop="removeImage">×</button>
      </div>
    </div>

    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress-bar">
      <div class="progress" :style="{ width: `${uploadProgress}%` }"></div>
    </div>

    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "ImageUploader",
  props: {
    folder: {
      type: String,
      default: "images/",
    },
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024, // 5MB
    },
    showFolderSelector: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["upload-success", "upload-error", "upload-start", "upload-end"],
  data() {
    return {
      fileInput: null,
      selectedFile: null,
      previewUrl: "",
      uploadProgress: 0,
      error: "",
      isDragging: false,
      isUploading: false,
      uploadedImageUrl: "",
      uploadedThumbnailUrl: "",
      currentFolder: this.folder,
      apiBaseUrl: process.env.VUE_APP_API_URL || "https://treaxure.kro.kr/",
      pollingInterval: null,
      maxPollingAttempts: 10,
      pollingCount: 0,
      cloudFrontDomain:
        process.env.VUE_APP_CLOUDFRONT_DOMAIN || "d8h3hut1jkl2n.cloudfront.net",
      userNickname: "user",
      originalObjectKey: "",
      thumbnailObjectKey: "",
    };
  },
  created() {
    this.getCloudFrontCookies();
  },
  methods: {
    async getCloudFrontCookies() {
      try {
        const response = await axios.get(
          `${this.apiBaseUrl}/api/auth/cloudfront`,
          {
            withCredentials: true,
          }
        );

        console.log(
          "CloudFront 인증 쿠키가 설정되었습니다. 만료: ",
          response.data.expiresAt
        );
      } catch (error) {
        console.error("CloudFront 인증 쿠키 설정 실패:", error);
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      this.validateAndProcessFile(file).then(() => this.uploadImage());
    },

    handleDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      this.validateAndProcessFile(file).then(() => this.uploadImage());
    },

    // 파일 → WebP 변환
    async convertToWebp(file) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("WebP 변환 실패"));
              const webpFile = new File(
                [blob],
                file.name.replace(/\.\w+$/, ".webp"),
                { type: "image/webp" }
              );
              resolve(webpFile);
            },
            "image/webp",
            0.9
          );
        };
        img.onerror = () => reject(new Error("이미지 로드 실패"));
        img.src = URL.createObjectURL(file);
      });
    },

    async validateAndProcessFile(file) {
      this.error = "";

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        this.error = "이미지 파일만 업로드 가능합니다.";
        return;
      }

      if (file.size > this.maxSize) {
        this.error = `파일 크기는 ${
          this.maxSize / (1024 * 1024)
        }MB 이하여야 합니다.`;
        return;
      }

      try {
        const webp = await this.convertToWebp(file);
        this.selectedFile = webp;
        this.createPreview(webp);
      } catch (e) {
        console.error(e);
        this.error = "이미지를 WebP 로 변환하는 중 오류가 발생했습니다.";
      }
    },

    createPreview(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    async uploadImage() {
      if (!this.selectedFile) {
        this.error = "업로드할 파일을 선택해주세요.";
        return;
      }

      this.isUploading = true;
      this.$emit("upload-start");

      this.uploadProgress = 0;
      this.error = "";

      try {
        const contentType = this.selectedFile.type || "image/jpeg";

        const requestData = {
          userNickname: this.userNickname || "user",
          fileName: this.selectedFile.name,
          contentType: contentType,
        };

        console.log("프리사인드 URL 요청 데이터:", requestData);

        // 실제 백엔드 API 호출
        const presignedResponse = await axios.post(
          `${this.apiBaseUrl}/api/presigned-upload`,
          requestData
        );

        console.log("백엔드 응답 전체:", presignedResponse.data);

        const { presignedUrl, originalObjectKey, thumbnailObjectKey } =
          presignedResponse.data;

        console.log("받은 ObjectKey들:", {
          originalObjectKey,
          thumbnailObjectKey,
          presignedUrl,
        });

        this.originalObjectKey = originalObjectKey;
        this.thumbnailObjectKey = thumbnailObjectKey;

        const axiosInstance = axios.create();
        delete axiosInstance.defaults.headers.common["Authorization"];

        await axiosInstance.put(presignedUrl, this.selectedFile, {
          headers: {
            "Content-Type": contentType,
          },
          withCredentials: false,
          onUploadProgress: (progressEvent) => {
            this.uploadProgress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          },
        });

        // 원본 이미지 서명된 URL 획득 (인증 헤더 문제 해결)
        const originalSignedResponse = await axios.post(
          `${this.apiBaseUrl}/api/signed-url`,
          {
            objectKey: this.originalObjectKey,
          }
        );

        console.log(
          "원본 이미지 서명된 URL 응답:",
          originalSignedResponse.data
        );
        console.log(
          "최종 업로드된 이미지 URL:",
          originalSignedResponse.data.signedUrl
        );

        this.uploadedImageUrl = originalSignedResponse.data.signedUrl;

        this.startPollingForThumbnail();
      } catch (error) {
        console.error("업로드 오류:", error);

        if (error.response) {
          console.error("오류 응답 데이터:", error.response.data);
          console.error("오류 상태 코드:", error.response.status);
          console.error("오류 헤더:", error.response.headers);

          if (error.response.status === 500) {
            if (error.response.data && error.response.data.message) {
              this.error = `서버 오류: ${error.response.data.message}`;
            } else {
              this.error =
                "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
            }
          } else if (
            typeof error.response.data === "string" &&
            error.response.data.includes("<?xml")
          ) {
            const codeMatch = error.response.data.match(/<Code>(.*?)<\/Code>/);
            const messageMatch = error.response.data.match(
              /<Message>(.*?)<\/Message>/
            );

            if (codeMatch && messageMatch) {
              const errorCode = codeMatch[1];
              const errorMessage = messageMatch[1];

              if (errorCode === "AccessDenied") {
                this.error = "접근이 거부되었습니다. 권한을 확인해주세요.";
              } else if (errorCode === "InvalidArgument") {
                this.error = "잘못된 인수가 전달되었습니다. 다시 시도해주세요.";
              } else if (errorCode === "EntityTooLarge") {
                this.error =
                  "파일 크기가 너무 큽니다. 더 작은 파일을 선택해주세요.";
              } else {
                this.error = `S3 오류(${errorCode}): ${errorMessage}`;
              }

              console.log(`S3 오류 상세: ${errorCode} - ${errorMessage}`);
            } else {
              this.error = `업로드 중 오류가 발생했습니다: ${
                error.message || "알 수 없는 오류"
              }`;
            }
          } else {
            this.error = `업로드 중 오류가 발생했습니다: ${
              error.message || "알 수 없는 오류"
            }`;
          }
        } else {
          this.error = `업로드 중 오류가 발생했습니다: ${
            error.message || "알 수 없는 오류"
          }`;
        }

        this.$emit("upload-error", error);
        this.isUploading = false;
        this.$emit("upload-end");
      }
    },

    // 썸네일 생성 완료 확인을 위한 폴링 함수
    startPollingForThumbnail() {
      this.pollingCount = 0;

      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }

      this.pollingInterval = setInterval(async () => {
        this.pollingCount++;

        try {
          const thumbnailApi = axios.create();
          delete thumbnailApi.defaults.headers.common["Authorization"];

          const thumbnailSignedResponse = await thumbnailApi.post(
            `${this.apiBaseUrl}/api/signed-url`,
            {
              objectKey: this.thumbnailObjectKey,
            }
          );

          if (thumbnailSignedResponse.data.signedUrl) {
            this.uploadedThumbnailUrl = thumbnailSignedResponse.data.signedUrl;
            clearInterval(this.pollingInterval);
            this.isUploading = false;

            this.$emit("upload-success", {
              original: this.uploadedImageUrl.split("?")[0],
              thumbnail: this.uploadedThumbnailUrl.split("?")[0],
            });

            this.$emit("upload-end");
          }
        } catch (error) {
          console.log(
            `썸네일 확인 시도 ${this.pollingCount}/${this.maxPollingAttempts}`
          );

          if (this.pollingCount >= this.maxPollingAttempts) {
            console.warn("썸네일 생성 시간 초과, 원본 이미지만 사용합니다.");
            clearInterval(this.pollingInterval);
            this.isUploading = false;

            this.$emit("upload-success", {
              original: this.uploadedImageUrl.split("?")[0],
              thumbnail: this.uploadedImageUrl.split("?")[0],
            });

            this.$emit("upload-end");
          }
        }
      }, 2000);
    },

    removeImage() {
      this.selectedFile = null;
      this.previewUrl = "";
      this.uploadProgress = 0;
      this.error = "";
      this.uploadedImageUrl = "";
      this.uploadedThumbnailUrl = "";
      this.originalObjectKey = "";
      this.thumbnailObjectKey = "";
    },
  },
};
</script>

<style scoped>
.image-uploader {
  width: 100%;
  /* max-width: 500px; */
  margin: 0 auto;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: var(--spacing-md);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* ProfileEdit에서만 적용될 스타일 */
.visually-hidden-uploader {
  display: none;
}

.upload-area:hover,
.upload-area.is-dragging {
  border-color: var(--primary);
  background-color: rgba(76, 175, 80, 0.05);
}

.uploading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  background-color: var(--text-deep-light);
  color: var(--primary);
  z-index: 10;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 0;
}

.preview-image {
  border-radius: var(--spacing-md);
  height: fit-content;
  /* max-width: 100%; */
  /* max-height: 300px; */
  object-fit: contain;
}

.remove-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 0;
  width: 24px;
  height: 24px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-bar {
  margin-top: 10px;
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: var(--primary);
  transition: width 0.3s ease;
}

.error-message {
  color: #ff4444;
  margin-top: 8px;
  font-size: 14px;
}

.folder-selector {
  margin-top: 15px;
  display: flex;
  gap: 15px;
}

.upload-btn-container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.upload-btn {
  padding: 8px 16px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.upload-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
