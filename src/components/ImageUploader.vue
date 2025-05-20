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
      
      <div v-if="!previewUrl" class="upload-placeholder">
        <i class="upload-icon">📁</i>
        <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
        
        <div class="folder-selector" v-if="showFolderSelector">
          <label>
            <input type="radio" v-model="currentFolder" :value="folder" checked> 기본 폴더
          </label>
          <label>
            <input type="radio" v-model="currentFolder" value="missions"> 미션 폴더
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
    
    <div v-if="!previewUrl && !isUploading" class="upload-btn-container">
      <button 
        class="upload-btn" 
        @click="triggerFileInput"
        :disabled="isUploading"
      >
        파일 선택
      </button>
    </div>
    
    <div v-if="previewUrl && !isUploading && !uploadedImageUrl" class="upload-btn-container">
      <button 
        class="upload-btn" 
        @click="uploadImage"
        :disabled="isUploading"
      >
        업로드
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ImageUploader',
  props: {
    folder: {
      type: String,
      default: 'images/'
    },
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024 // 5MB
    },
    showFolderSelector: {
      type: Boolean,
      default: false
    }
  },
  emits: ['upload-success', 'upload-error'],
  data() {
    return {
      fileInput: null,
      selectedFile: null,
      previewUrl: '',
      uploadProgress: 0,
      error: '',
      isDragging: false,
      isUploading: false,
      uploadedImageUrl: '',
      uploadedThumbnailUrl: '',
      currentFolder: this.folder,
      // 백엔드 API 설정
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:8081',
      // 폴링 관련 설정
      pollingInterval: null,
      maxPollingAttempts: 10,
      pollingCount: 0,
      // CloudFront 설정
      cloudFrontDomain: process.env.VUE_APP_CLOUDFRONT_DOMAIN || 'd8h3hut1jkl2n.cloudfront.net',
      // 사용자 정보
      userNickname: 'user', // 나중에 사용자 정보에서 가져오도록 수정 필요
      // 객체 키 저장
      originalObjectKey: '',
      thumbnailObjectKey: ''
    };
  },
  created() {
    // CloudFront 인증 쿠키 얻기
    this.getCloudFrontCookies();
  },
  methods: {
    // CloudFront 인증 쿠키 얻기
    async getCloudFrontCookies() {
      try {
        // 개발 환경에서는 백엔드가 준비되지 않았을 수 있으므로 요청을 건너뛰거나 처리합니다
        if (process.env.NODE_ENV === 'development' && !this.apiBaseUrl.includes('localhost')) {
          console.log('개발 환경: CloudFront 인증 쿠키 요청을 건너뜁니다.');
          return;
        }
        
        const response = await axios.get(`${this.apiBaseUrl}/api/auth/cloudfront`, {
          withCredentials: true
        });
        
        console.log('CloudFront 인증 쿠키가 설정되었습니다. 만료: ', response.data.expiresAt);
      } catch (error) {
        console.error('CloudFront 인증 쿠키 설정 실패:', error);
        // 실패해도 계속 진행하도록 오류를 무시합니다
      }
    },
    
    // 썸네일 URL 생성 함수
    createThumbnailUrl(originalUrl) {
      const urlParts = originalUrl.split('/');
      const imagesIndex = urlParts.indexOf('images');
      if (imagesIndex !== -1) {
        urlParts.splice(imagesIndex + 1, 0, 'thumb');
        return urlParts.join('/');
      }
      return originalUrl;
    },
    
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      this.validateAndProcessFile(file);
    },

    handleDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      this.validateAndProcessFile(file);
    },

    validateAndProcessFile(file) {
      this.error = '';
      
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        this.error = '이미지 파일만 업로드 가능합니다.';
        return;
      }
      
      if (file.size > this.maxSize) {
        this.error = `파일 크기는 ${this.maxSize / (1024 * 1024)}MB 이하여야 합니다.`;
        return;
      }
      
      this.selectedFile = file;
      this.createPreview(file);
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
        this.error = '업로드할 파일을 선택해주세요.';
        return;
      }
      
      this.isUploading = true;
      this.uploadProgress = 0;
      this.error = '';
      
      try {
        // 백엔드 API가 준비되지 않았으므로 로컬 미리보기 URL 사용
        if (process.env.NODE_ENV === 'development' && !this.apiBaseUrl.includes('localhost')) {
          // 시뮬레이션된 업로드 진행
          this.uploadProgress = 30;
          await new Promise(resolve => setTimeout(resolve, 500));
          this.uploadProgress = 60;
          await new Promise(resolve => setTimeout(resolve, 500));
          this.uploadProgress = 100;
          
          // 로컬 파일 URL 생성 (실제 업로드는 아님)
          const localImageUrl = URL.createObjectURL(this.selectedFile);
          this.uploadedImageUrl = localImageUrl;
          this.uploadedThumbnailUrl = this.createThumbnailUrl(localImageUrl);
          
          // 업로드 성공 이벤트 (개발용)
          this.$emit('upload-success', {
            original: localImageUrl,
            thumbnail: this.uploadedThumbnailUrl
          });
          
          this.isUploading = false;
          return;
        }
        
        // 파일 타입 확인 및 정규화
        const contentType = this.selectedFile.type || 'image/jpeg';
        
        // API 명세에 맞는 요청 객체 구성
        const requestData = {
          userNickname: this.userNickname || 'user123', // 유저 닉네임이 없을 경우 기본값 제공
          fileName: this.selectedFile.name,
          contentType: contentType
        };
        
        console.log('프리사인드 URL 요청 데이터:', requestData);
        
        // 인증 관련 헤더 문제를 해결하기 위한 axios 인스턴스 생성
        const api = axios.create();
        
        // Authorization 헤더가 undefined인 경우 삭제
        if (api.defaults.headers.common['Authorization'] === 'Bearer undefined' ||
            api.defaults.headers.common['Authorization'] === undefined) {
          delete api.defaults.headers.common['Authorization'];
        }
        
        // 실제 백엔드 API 호출
        const presignedResponse = await api.post(`${this.apiBaseUrl}/api/presigned-upload`, requestData);
        
        // API 응답 데이터 추출
        const { 
          presignedUrl, 
          originalObjectKey, 
          thumbnailObjectKey, 
          bucketName 
        } = presignedResponse.data;
        
        // 객체 키 저장
        this.originalObjectKey = originalObjectKey;
        this.thumbnailObjectKey = thumbnailObjectKey;
        
        // S3에 직접 업로드
        // 인증 헤더 충돌을 방지하기 위해 새 axios 인스턴스 생성
        const axiosInstance = axios.create();
        delete axiosInstance.defaults.headers.common['Authorization']; // 인증 헤더 제거
        
        await axiosInstance.put(presignedUrl, this.selectedFile, {
          headers: {
            'Content-Type': contentType
          },
          withCredentials: false, // 쿠키 전송 비활성화
          onUploadProgress: progressEvent => {
            this.uploadProgress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          }
        });
        
        // 원본 이미지 서명된 URL 획득 (인증 헤더 문제 해결)
        const originalSignedResponse = await api.post(`${this.apiBaseUrl}/api/signed-url`, {
          objectKey: this.originalObjectKey
        });
        
        this.uploadedImageUrl = originalSignedResponse.data.signedUrl;
        
        // 썸네일 생성 확인을 위한 폴링 시작
        this.startPollingForThumbnail();
      } catch (error) {
        console.error('업로드 오류:', error);
        
        // 개발 환경에서는 백엔드 오류시 로컬 시뮬레이션으로 대체
        if (process.env.NODE_ENV === 'development' && error.response && error.response.status === 500) {
          console.log('개발 환경: 백엔드 오류로 로컬 업로드 시뮬레이션으로 전환합니다.');
          
          // 시뮬레이션된 업로드 진행
          this.uploadProgress = 30;
          await new Promise(resolve => setTimeout(resolve, 500));
          this.uploadProgress = 60;
          await new Promise(resolve => setTimeout(resolve, 500));
          this.uploadProgress = 100;
          
          // 로컬 파일 URL 생성 (실제 업로드는 아님)
          const localImageUrl = URL.createObjectURL(this.selectedFile);
          this.uploadedImageUrl = localImageUrl;
          this.uploadedThumbnailUrl = this.createThumbnailUrl(localImageUrl);
          
          // 업로드 성공 이벤트 (개발용)
          this.$emit('upload-success', {
            original: localImageUrl,
            thumbnail: this.uploadedThumbnailUrl
          });
          
          this.isUploading = false;
          return;
        }
        
        // 더 자세한 오류 정보 출력
        if (error.response) {
          console.error('오류 응답 데이터:', error.response.data);
          console.error('오류 상태 코드:', error.response.status);
          console.error('오류 헤더:', error.response.headers);
          
          // 백엔드 API 오류인 경우
          if (error.response.status === 500) {
            if (error.response.data && error.response.data.message) {
              this.error = `서버 오류: ${error.response.data.message}`;
            } else {
              this.error = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            }
          }
          // S3 XML 오류 메시지가 있는 경우 파싱
          else if (typeof error.response.data === 'string' && error.response.data.includes('<?xml')) {
            const codeMatch = error.response.data.match(/<Code>(.*?)<\/Code>/);
            const messageMatch = error.response.data.match(/<Message>(.*?)<\/Message>/);
            
            if (codeMatch && messageMatch) {
              const errorCode = codeMatch[1];
              const errorMessage = messageMatch[1];
              
              // 사용자 친화적인 오류 메시지
              if (errorCode === 'AccessDenied') {
                this.error = '접근이 거부되었습니다. 권한을 확인해주세요.';
              } else if (errorCode === 'InvalidArgument') {
                this.error = '잘못된 인수가 전달되었습니다. 다시 시도해주세요.';
              } else if (errorCode === 'EntityTooLarge') {
                this.error = '파일 크기가 너무 큽니다. 더 작은 파일을 선택해주세요.';
              } else {
                this.error = `S3 오류(${errorCode}): ${errorMessage}`;
              }
              
              console.log(`S3 오류 상세: ${errorCode} - ${errorMessage}`);
            } else {
              this.error = `업로드 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`;
            }
          } else {
            this.error = `업로드 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`;
          }
        } else {
          this.error = `업로드 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`;
        }
        
        this.isUploading = false;
        this.$emit('upload-error', error);
      }
    },
    
    // 썸네일 생성 완료 확인을 위한 폴링 함수
    startPollingForThumbnail() {
      this.pollingCount = 0;
      
      // 이전 폴링 인터벌이 있다면 정리
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
      
      // 개발 환경에서 Lambda 오류가 있을 경우 원본 이미지로 대체
      if (process.env.NODE_ENV === 'development') {
        // 짧은 시간만 기다린 후 원본 이미지를 썸네일로 사용
        setTimeout(() => {
          console.log('개발 환경: 원본 이미지를 썸네일로 사용합니다.');
          this.uploadedThumbnailUrl = this.createThumbnailUrl(this.uploadedImageUrl);
          this.isUploading = false;
          
          // 업로드 성공 이벤트 발생
          this.$emit('upload-success', {
            original: this.uploadedImageUrl,
            thumbnail: this.uploadedThumbnailUrl
          });
        }, 1500);
        
        return;
      }
      
      // 정기적으로 썸네일 URL 획득 시도
      this.pollingInterval = setInterval(async () => {
        this.pollingCount++;
        
        try {
          // 썸네일 서명된 URL 요청 (인증 헤더 문제 해결)
          // 새 axios 인스턴스 생성
          const thumbnailApi = axios.create();
          delete thumbnailApi.defaults.headers.common['Authorization']; // 인증 헤더 제거
          
          const thumbnailSignedResponse = await thumbnailApi.post(`${this.apiBaseUrl}/api/signed-url`, {
            objectKey: this.thumbnailObjectKey
          });
          
          if (thumbnailSignedResponse.data.signedUrl) {
            // 썸네일 URL 획득 성공
            this.uploadedThumbnailUrl = thumbnailSignedResponse.data.signedUrl;
            clearInterval(this.pollingInterval);
            this.isUploading = false;
            
            // 업로드 성공 이벤트 발생
            this.$emit('upload-success', {
              original: this.uploadedImageUrl,
              thumbnail: this.uploadedThumbnailUrl
            });
          }
        } catch (error) {
          // 아직 썸네일이 생성되지 않음
          console.log(`썸네일 확인 시도 ${this.pollingCount}/${this.maxPollingAttempts}`);
          
          if (this.pollingCount >= this.maxPollingAttempts) {
            console.warn('썸네일 생성 시간 초과, 원본 이미지만 사용합니다.');
            // 최대 시도 횟수 초과, 썸네일 없이 완료
            clearInterval(this.pollingInterval);
            this.isUploading = false;
            
            // 원본 이미지 URL만 전달 (원본을 썸네일로도 사용)
            this.$emit('upload-success', {
              original: this.uploadedImageUrl,
              thumbnail: this.createThumbnailUrl(this.uploadedImageUrl) // 람다 오류가 있을 경우 원본 이미지 기반 썸네일 URL 생성
            });
          }
        }
      }, 2000); // 2초마다 확인 (시간 증가)
    },

    removeImage() {
      this.selectedFile = null;
      this.previewUrl = '';
      this.uploadProgress = 0;
      this.error = '';
      this.uploadedImageUrl = '';
      this.uploadedThumbnailUrl = '';
      this.originalObjectKey = '';
      this.thumbnailObjectKey = '';
    }
  }
};
</script>

<style scoped>
.image-uploader {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.upload-area:hover, .upload-area.is-dragging {
  border-color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.05);
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
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.remove-button {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
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
  background-color: #4CAF50;
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
  background-color: #4CAF50;
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