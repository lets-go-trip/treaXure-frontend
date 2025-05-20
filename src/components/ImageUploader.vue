<template>
  <div class="image-uploader">
    <div 
      class="upload-area" 
      @click="triggerFileInput" 
      @dragover.prevent 
      @drop.prevent="handleDrop"
      :class="{ 'is-dragging': isDragging }"
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
import { ref, computed } from 'vue';
import { uploadImage } from '@/config/aws';

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
    }
  },
  emits: ['upload-success', 'upload-error'],
  setup(props, { emit }) {
    const fileInput = ref(null);
    const selectedFile = ref(null);
    const previewUrl = ref('');
    const uploadProgress = ref(0);
    const error = ref('');
    const isDragging = ref(false);

    const triggerFileInput = () => {
      fileInput.value.click();
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      validateAndProcessFile(file);
    };

    const handleDrop = (event) => {
      isDragging.value = false;
      const file = event.dataTransfer.files[0];
      validateAndProcessFile(file);
    };

    const validateAndProcessFile = (file) => {
      error.value = '';
      
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        error.value = '이미지 파일만 업로드 가능합니다.';
        return;
      }
      
      if (file.size > props.maxSize) {
        error.value = `파일 크기는 ${props.maxSize / (1024 * 1024)}MB 이하여야 합니다.`;
        return;
      }
      
      selectedFile.value = file;
      createPreview(file);
      uploadFile(file);
    };

    const createPreview = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const uploadFile = async (file) => {
      try {
        uploadProgress.value = 10;
        const imageUrl = await uploadImage(file, props.folder);
        uploadProgress.value = 100;
        emit('upload-success', imageUrl);
      } catch (err) {
        error.value = '이미지 업로드 중 오류가 발생했습니다.';
        emit('upload-error', err);
      }
    };

    const removeImage = () => {
      selectedFile.value = null;
      previewUrl.value = '';
      uploadProgress.value = 0;
      error.value = '';
    };

    return {
      fileInput,
      previewUrl,
      uploadProgress,
      error,
      isDragging,
      triggerFileInput,
      handleFileChange,
      handleDrop,
      removeImage
    };
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
</style> 