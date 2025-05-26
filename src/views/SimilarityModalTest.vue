<template>
  <div class="test-container">
    <h1>유사도 모달 테스트</h1>
    
    <div class="controls">
      <div class="slider-container">
        <label>유사도 점수: {{ (score * 100).toFixed(1) }}%</label>
        <input type="range" min="0" max="1" step="0.01" v-model="score">
      </div>
      
      <div class="checkbox-container">
        <input type="checkbox" id="openai" v-model="useOpenAI">
        <label for="openai">OpenAI 사용</label>
      </div>
      
      <div class="image-selector">
        <label for="imageUrl">업로드된 이미지 URL:</label>
        <input type="text" id="imageUrl" v-model="uploadedImageUrl" placeholder="이미지 URL을 입력하세요">
        <p class="image-note">기본 이미지: sample1.jpg</p>
      </div>
      
      <button class="btn" @click="showModal = true">모달 열기</button>
    </div>
    
    <div class="preview-section">
      <h3>미리보기 이미지</h3>
      <div class="image-preview">
        <div class="preview-item">
          <h4>미션 예시</h4>
          <img :src="missionImageUrl" alt="미션 예시" />
        </div>
        <div class="preview-item">
          <h4>업로드 이미지</h4>
          <img :src="uploadedImageUrl" alt="업로드 이미지" @error="handleImageError" />
        </div>
      </div>
    </div>
    
    <SimilarityScoreModal 
      :isOpen="showModal"
      :similarityScore="Number(score)"
      :useOpenAI="useOpenAI"
      :uploadedImageUrl="uploadedImageUrl"
      :missionImageUrl="missionImageUrl"
      @close="showModal = false"
      @action="handleAction"
    />
  </div>
</template>

<script>
import SimilarityScoreModal from '@/components/SimilarityScoreModal.vue';

export default {
  name: 'SimilarityModalTest',
  components: {
    SimilarityScoreModal
  },
  data() {
    return {
      showModal: false,
      score: 0.85,
      useOpenAI: false,
      uploadedImageUrl: require('@/assets/img/sample1.jpg'),
      missionImageUrl: require('@/assets/img/sample2.webp')
    }
  },
  methods: {
    handleAction(level) {
      alert(`액션 버튼이 클릭되었습니다. 점수 레벨: ${level}`);
    },
    handleImageError() {
      // 이미지 로드 에러 시 기본 이미지로 복원
      this.uploadedImageUrl = require('@/assets/img/sample1.jpg');
    }
  }
}
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
}

.controls {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.slider-container {
  margin-bottom: 15px;
}

.slider-container label {
  display: block;
  margin-bottom: 8px;
}

.slider-container input {
  width: 100%;
}

.checkbox-container {
  margin-bottom: 20px;
}

.image-selector {
  margin-bottom: 20px;
}

.image-selector label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.image-selector input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.image-note {
  font-size: 12px;
  color: #666;
  margin: 4px 0 0;
}

.preview-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.preview-section h3 {
  margin: 0 0 16px;
  font-size: 16px;
}

.image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  min-height: 200px;
  background-color: #fff;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
}

.preview-item {
  text-align: center;
}

.preview-item h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #666;
}

.preview-item img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn {
  background-color: var(--primary, #4CAF50);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}
</style> 