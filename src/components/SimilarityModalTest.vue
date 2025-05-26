<template>
  <div class="test-container">
    <div class="test-header">
      <h1>이미지 유사도 분석 모달 테스트</h1>
      <p class="test-description">모달 크기 최적화 버전</p>
    </div>
    
    <div class="test-controls">
      <div class="control-group">
        <h3>모달 설정</h3>
        <div class="control-row">
          <label>유사도 점수:</label>
          <input 
            type="range" 
            v-model="similarityScore" 
            min="0" 
            max="1" 
            step="0.01"
            class="score-slider"
          />
          <span class="score-display">{{ (similarityScore * 100).toFixed(1) }}%</span>
        </div>
        
        <div class="control-row">
          <label>
            <input type="checkbox" v-model="useOpenAI" />
            OpenAI 분석 사용
          </label>
        </div>
        
        <div class="control-row">
          <button @click="openModal" class="open-btn">모달 열기</button>
          <button @click="resetSettings" class="reset-btn">설정 초기화</button>
        </div>
      </div>
      
      <div class="control-group">
        <h3>이미지 미리보기</h3>
        <div class="image-preview-container">
          <div class="preview-item">
            <img :src="missionImageUrl" alt="미션 이미지" class="preview-image" />
            <span class="preview-label">미션 예시</span>
          </div>
          <div class="preview-item">
            <img :src="uploadedImageUrl" alt="업로드 이미지" class="preview-image" />
            <span class="preview-label">업로드 이미지</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="test-info">
      <h3>현재 설정</h3>
      <div class="info-grid">
        <div class="info-item">
          <strong>유사도:</strong> {{ (similarityScore * 100).toFixed(1) }}%
        </div>
        <div class="info-item">
          <strong>등급:</strong> {{ scoreLevel }}
        </div>
        <div class="info-item">
          <strong>OpenAI:</strong> {{ useOpenAI ? '사용' : '미사용' }}
        </div>
        <div class="info-item">
          <strong>모달 크기:</strong> 420px × 90vh (모바일 최적화)
        </div>
      </div>
    </div>
    
    <!-- 이미지 유사도 모달 -->
    <SimilarityScoreModal
      :isOpen="isModalOpen"
      :similarityScore="similarityScore"
      :useOpenAI="useOpenAI"
      :uploadedImageUrl="uploadedImageUrl"
      :missionImageUrl="missionImageUrl"
      @close="closeModal"
      @action="handleAction"
    />
  </div>
</template>

<script>
import SimilarityScoreModal from './SimilarityScoreModal.vue';

export default {
  name: 'SimilarityModalTest',
  components: {
    SimilarityScoreModal
  },
  data() {
    return {
      isModalOpen: false,
      similarityScore: 0.85,
      useOpenAI: true,
      uploadedImageUrl: require('@/assets/img/sample1.jpg'),
      missionImageUrl: require('@/assets/img/sample2.webp')
    };
  },
  computed: {
    scoreLevel() {
      if (this.similarityScore >= 0.89) return "높음 (89%+)";
      if (this.similarityScore >= 0.6) return "보통 (60-89%)";
      return "낮음 (60% 미만)";
    }
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    
    closeModal() {
      this.isModalOpen = false;
    },
    
    handleAction(level) {
      console.log('모달 액션:', level);
      this.closeModal();
    },
    
    resetSettings() {
      this.similarityScore = 0.85;
      this.useOpenAI = true;
    }
  }
};
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.test-header {
  text-align: center;
  margin-bottom: 30px;
}

.test-header h1 {
  color: #333;
  margin-bottom: 8px;
  font-size: 24px;
}

.test-description {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.test-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.control-group {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.control-group h3 {
  margin: 0 0 15px;
  color: #333;
  font-size: 16px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.control-row:last-child {
  margin-bottom: 0;
}

.control-row label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
  min-width: 80px;
}

.score-slider {
  flex: 1;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  outline: none;
}

.score-display {
  min-width: 50px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.open-btn, .reset-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.open-btn {
  background: #4CAF50;
  color: white;
}

.open-btn:hover {
  background: #45a049;
}

.reset-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.reset-btn:hover {
  background: #e9ecef;
}

.image-preview-container {
  display: flex;
  gap: 15px;
}

.preview-item {
  flex: 1;
  text-align: center;
}

.preview-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
}

.preview-label {
  display: block;
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.test-info {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.test-info h3 {
  margin: 0 0 15px;
  color: #333;
  font-size: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.info-item {
  font-size: 14px;
  color: #555;
}

.info-item strong {
  color: #333;
}

@media (max-width: 768px) {
  .test-controls {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .image-preview-container {
    flex-direction: column;
  }
  
  .control-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .control-row label {
    min-width: auto;
  }
  
  .score-slider {
    width: 100%;
  }
}
</style> 