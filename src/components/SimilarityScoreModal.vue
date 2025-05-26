<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container" ref="container" @click.self="closeModal">
      <div class="modal-overlay-effect" ref="overlay"></div>
      <div class="modal-card similarity-modal">
        <button class="close-btn" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <!-- 이미지 비교 단계 -->
        <div v-if="currentStep === 'comparison'" class="comparison-stage">
          <h2 class="stage-title">이미지 비교 분석</h2>
          <p class="stage-subtitle">미션 예시와 업로드된 이미지를 비교합니다</p>
          
          <div class="images-comparison">
            <div class="image-wrapper mission-image">
              <img :src="missionImageUrl" alt="미션 예시 이미지" class="comparison-image" />
              <div class="image-label mission-label">미션 예시</div>
            </div>
            
            <div class="vs-indicator">
              <div class="vs-text">VS</div>
              <div class="comparison-arrows">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 18l4-4-4-4"></path>
                  <path d="M16 6l-4 4 4 4"></path>
                </svg>
              </div>
            </div>
            
            <div class="image-wrapper user-image">
              <img :src="uploadedImageUrl" alt="업로드된 이미지" class="comparison-image" />
              <div class="image-label user-label">업로드 이미지</div>
            </div>
          </div>
          
          <div class="stage-info">
            <div class="stage-status">이미지 비교 준비 중...</div>
          </div>
        </div>
        
        <!-- 이미지 오버레이 단계 -->
        <div v-if="currentStep === 'overlay'" class="overlay-stage">
          <h2 class="stage-title">이미지 정렬 및 매칭</h2>
          <p class="stage-subtitle">두 이미지를 겹쳐서 유사도를 측정합니다</p>
          
          <div class="overlay-container">
            <div class="overlay-animation-wrapper">
              <!-- 움직이는 이미지들 -->
              <div class="moving-image-container left-image" :class="{ 'move-center': overlayProgress > 10 }">
                <img :src="missionImageUrl" alt="미션 예시 이미지" class="moving-image" />
                <div class="image-label-overlay mission-label-overlay">미션 예시</div>
              </div>
              
              <div class="moving-image-container right-image" :class="{ 'move-center': overlayProgress > 10 }">
                <img :src="uploadedImageUrl" alt="업로드된 이미지" class="moving-image" />
                <div class="image-label-overlay user-label-overlay">업로드 이미지</div>
              </div>
              
              <!-- 최종 겹쳐진 이미지 -->
              <div class="final-overlay-wrapper" :class="{ 'show-final': overlayProgress > 60 }">
                <img :src="missionImageUrl" alt="미션 예시 이미지" class="base-overlay-image" />
                <img :src="uploadedImageUrl" alt="업로드된 이미지" class="top-overlay-image" :style="{ 
                  opacity: overlayImageOpacity, 
                  mixBlendMode: overlayBlendMode 
                }" />
                
                <div class="alignment-grid" :class="{ 'show-grid': overlayProgress > 40 }">
                  <div class="grid-cell" v-for="i in 9" :key="i" :style="{ animationDelay: (i * 0.1) + 's' }"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="stage-info">
            <div class="stage-status">{{ overlayStepText }}</div>
            <div class="progress-indicators">
                <div class="indicator" :class="{ active: overlayProgress > 25 }">위치 정렬</div>
                <div class="indicator" :class="{ active: overlayProgress > 50 }">크기 조정</div>
                <div class="indicator" :class="{ active: overlayProgress > 75 }">투명도 적용</div>
                <div class="indicator" :class="{ active: overlayProgress >= 100 }">매칭 완료</div>
            </div>
          </div>
        </div>
        
        <!-- 스캔 단계 -->
        <div v-if="currentStep === 'scanning'" class="scanning-stage">
          <h2 class="stage-title">이미지 분석 중...</h2>
          
          <div class="scanning-container">
            <div class="scan-image-wrapper">
              <!-- 겹쳐진 이미지 표시 -->
              <img :src="missionImageUrl" alt="미션 예시 이미지" class="base-scan-image" />
              <img :src="uploadedImageUrl" alt="업로드된 이미지" class="overlay-scan-image" />
              
              <!-- 분석 격자 -->
              <div class="analysis-grid" v-show="scanProgress > 5">
                <div class="grid-line horizontal" v-for="i in 8" :key="'h-' + i" :style="{ top: `${i * 12.5}%` }"></div>
                <div class="grid-line vertical" v-for="i in 8" :key="'v-' + i" :style="{ left: `${i * 12.5}%` }"></div>
              </div>
              
              <!-- 바운딩 박스들 -->
              <div class="bounding-boxes" v-show="scanProgress > 20">
                <div class="bounding-box" 
                     v-for="(box, index) in boundingBoxes" 
                     :key="'box-' + index"
                     :style="{ 
                       left: box.x + '%', 
                       top: box.y + '%',
                       width: box.width + '%',
                       height: box.height + '%',
                       animationDelay: box.delay + 's'
                     }"
                     :class="{ 
                       active: scanProgress > box.threshold,
                       detected: scanProgress > box.threshold + 10
                     }">
                  <div class="box-label">{{ box.label }}</div>
                  <div class="box-confidence" v-if="scanProgress > box.threshold + 5">{{ box.confidence }}%</div>
                </div>
              </div>
              
              <!-- 특징점 원형 마커 -->
              <div class="feature-circles" v-show="scanProgress > 30">
                <div class="feature-circle" 
                     v-for="(circle, index) in featureCircles" 
                     :key="'circle-' + index"
                     :style="{ 
                       left: circle.x + '%', 
                       top: circle.y + '%',
                       animationDelay: circle.delay + 's'
                     }"
                     :class="{ active: scanProgress > circle.threshold }">
                  <div class="circle-pulse"></div>
                </div>
              </div>
              
              <!-- 영역 하이라이트 -->
              <div class="region-highlights" v-show="scanProgress > 40">
                <div class="region-highlight" 
                     v-for="(region, index) in highlightRegions" 
                     :key="'region-' + index"
                     :style="{ 
                       left: region.x + '%', 
                       top: region.y + '%',
                       width: region.width + '%',
                       height: region.height + '%',
                       animationDelay: region.delay + 's'
                     }"
                     :class="{ 
                       active: scanProgress > region.threshold,
                       [region.type]: true
                     }">
                </div>
              </div>
              
              <!-- 분석 포인트들 -->
              <div class="analysis-points" v-show="scanProgress > 15">
                <div class="analysis-point" 
                     v-for="(point, index) in analysisPoints" 
                     :key="index"
                     :style="{ 
                       left: point.x + '%', 
                       top: point.y + '%',
                       animationDelay: point.delay + 's'
                     }"
                     :class="{ active: scanProgress > point.threshold }">
                </div>
              </div>
              
              <!-- 스캔 라인 -->
              <div class="scan-line" :style="{ top: `${scanProgress}%` }">
                <div class="scan-particles">
                  <div class="particle" v-for="i in 5" :key="i" :style="{ left: `${i * 20}%` }"></div>
                </div>
              </div>
              
              <!-- 레이더 스캔 효과 -->
              <div class="radar-scan" v-show="scanProgress > 60" :class="{ active: scanProgress > 60 }">
                <div class="radar-sweep"></div>
              </div>
              
              <!-- 스캔 오버레이 -->
              <div class="scan-overlay" :style="{ height: `${scanProgress}%` }"></div>
              
              <!-- 매칭 라인들 -->
              <div class="matching-lines" v-show="scanProgress > 70">
                <svg class="matching-svg" width="100%" height="100%">
                  <line v-for="(line, index) in matchingLines" 
                        :key="'line-' + index"
                        :x1="line.x1 + '%'" 
                        :y1="line.y1 + '%'" 
                        :x2="line.x2 + '%'" 
                        :y2="line.y2 + '%'"
                        :class="{ active: scanProgress > line.threshold }"
                        class="matching-line"
                        :style="{ animationDelay: line.delay + 's' }" />
                </svg>
              </div>
            </div>
            
            <div class="scan-info">
              <div class="scan-status">
                <div class="status-item">
                  <span class="status-label">상태:</span>
                  <span class="status-value blinking">{{ currentAnalysisStatus }}</span>
                </div>
                <div class="status-item" v-show="scanProgress > 20">
                  <span class="status-label">처리된 픽셀:</span>
                  <span class="status-value">{{ (scanProgress * 784).toFixed(0) }}/78,400</span>
                </div>
                <div class="status-item" v-show="scanProgress > 30">
                  <span class="status-label">바운딩 박스:</span>
                  <span class="status-value">{{ Math.floor(scanProgress / 15) }}개 감지</span>
                </div>
                <div class="status-item" v-show="scanProgress > 40">
                  <span class="status-label">특징점:</span>
                  <span class="status-value">{{ Math.floor(scanProgress * 2.3) }}개 감지</span>
                </div>
                <div class="status-item" v-show="scanProgress > 70">
                  <span class="status-label">매칭 포인트:</span>
                  <span class="status-value">{{ Math.floor(scanProgress * 1.2) }}개 연결</span>
                </div>
              </div>
              
              <div class="progress-container">
                <div class="progress-bar-wrapper">
                  <div class="progress-bar" :style="{ width: `${scanProgress}%` }"></div>
                </div>
                <div class="progress-text">{{ scanProgress.toFixed(0) }}% 완료</div>
              </div>
              
              <div class="analysis-steps">
                <div class="step" :class="{ active: scanProgress >= 25, completed: scanProgress > 25 }">
                  <div class="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 11l3 3L22 4"></path>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                    </svg>
                  </div>
                  <span>이미지 전처리</span>
                  </div>
                
                <div class="step" :class="{ active: scanProgress >= 40, completed: scanProgress > 40 }">
                  <div class="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <path d="M21 15l-5-5L5 21l5-5"></path>
                    </svg>
                  </div>
                  <span>객체 감지</span>
                </div>
                
                <div class="step" :class="{ active: scanProgress >= 60, completed: scanProgress > 60 }">
                  <div class="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="M21 21l-4.35-4.35"></path>
                    </svg>
                  </div>
                  <span>특징점 추출</span>
                </div>
                
                <div class="step" :class="{ active: scanProgress >= 80, completed: scanProgress > 80 }">
                  <div class="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 12l2 2 4-4"></path>
                      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                    </svg>
                  </div>
                  <span>AI 모델 분석</span>
                </div>
                
                <div class="step" :class="{ active: scanProgress >= 100, completed: scanProgress >= 100 }">
                  <div class="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span>결과 생성</span>
                </div>
              </div>
              
              <div v-if="useOpenAI" class="openai-processing">
                <div class="openai-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5093-2.6067-1.4997z" />
                  </svg>
                  OpenAI 정밀 분석 중...
                </div>
                <div class="processing-details">{{ openaiProcessingStatus }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 결과 단계 -->
        <div v-else-if="currentStep === 'result'" class="result-stage">
          <div class="result-header">
            <div class="result-icon-container">
              <div class="result-icon" :class="scoreClass">
                <svg v-if="scoreLevel === 'high'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <svg v-else-if="scoreLevel === 'medium'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                </svg>
              </div>
            </div>
            <h2 class="result-title">이미지 유사도 분석 결과</h2>
          </div>
          
          <!-- 비교 이미지 요약 -->
          <div class="result-summary">
            <div class="summary-images">
              <div class="summary-image-item">
                <img :src="missionImageUrl" alt="미션 예시" class="summary-image" />
                <div class="summary-label mission-summary">미션 예시</div>
              </div>
              <div class="comparison-connector">
                <div class="connector-line"></div>
                <div class="connector-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                  </svg>
                </div>
              </div>
              <div class="summary-image-item">
                <img :src="uploadedImageUrl" alt="업로드 이미지" class="summary-image" />
                <div class="summary-label user-summary">업로드 이미지</div>
              </div>
            </div>
          </div>
          
          <!-- 점수 표시 -->
          <div class="score-display">
            <div class="score-container">
            <div class="score-ring-container">
                <svg class="score-ring" width="120" height="120">
                  <circle class="ring-background" cx="60" cy="60" r="50" />
                  <circle class="ring-progress" :class="scoreClass" cx="60" cy="60" r="50" 
                          :style="{ strokeDashoffset: `${314 - (animatedScore / 100) * 314}` }" />
                </svg>
                <div class="score-value" :class="scoreClass">
                  {{ animatedScore.toFixed(1) }}<span class="score-percent">%</span>
                </div>
              </div>
            </div>
            <div class="score-label">{{ scoreMessage }}</div>
          </div>

          <!-- 점수 설명 -->
          <div class="score-description" :class="scoreClass">
            <div class="description-icon">
              <svg v-if="scoreLevel === 'high'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <svg v-else-if="scoreLevel === 'medium'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <div class="description-content">
              <p>{{ scoreDescription }}</p>
              <div v-if="useOpenAI" class="openai-notice">
                <div class="openai-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5093-2.6067-1.4997z" />
                  </svg>
                  OpenAI 분석
                </div>
                <span>더 정밀한 AI 분석이 적용되었습니다</span>
              </div>
            </div>
          </div>
          
          <!-- 분석 세부 정보 -->
          <div class="analysis-details">
            <div class="detail-grid">
              <div class="detail-item">
                <div class="detail-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                  </svg>
                </div>
                <div class="detail-content">
                  <div class="detail-title">처리된 픽셀</div>
                  <div class="detail-value">78,400개</div>
                </div>
              </div>
              
              <div class="detail-item">
                <div class="detail-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                </div>
                <div class="detail-content">
                  <div class="detail-title">특징점 감지</div>
                  <div class="detail-value">{{ Math.floor(similarityScore * 230) }}개</div>
                </div>
              </div>
              
              <div class="detail-item">
                <div class="detail-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                <div class="detail-content">
                  <div class="detail-title">처리 시간</div>
                  <div class="detail-value">{{ (2.5 + Math.random() * 1.5).toFixed(1) }}초</div>
                </div>
              </div>
              
              <div class="detail-item">
                <div class="detail-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                  </svg>
                </div>
                <div class="detail-content">
                  <div class="detail-title">매칭 정확도</div>
                  <div class="detail-value">{{ (similarityScore * 100 + Math.random() * 2 - 1).toFixed(1) }}%</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 액션 버튼 -->
          <div class="action-buttons">
            <button class="btn-primary" @click="handleAction">
              {{ actionText }}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </button>
            <button class="btn-secondary" @click="closeModal">닫기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SimilarityScoreModal",
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    similarityScore: {
      type: Number,
      default: 0
    },
    useOpenAI: {
      type: Boolean,
      default: false
    },
    uploadedImageUrl: {
      type: String,
      default: () => require('@/assets/img/sample1.jpg')
    },
    missionImageUrl: {
      type: String,
      default: () => require('@/assets/img/sample2.webp')
    },
    placeId: {
      type: [String, Number],
      default: null
    }
  },
  emits: ["close", "action"],
  data() {
    return {
      currentStep: 'comparison', // 'comparison' | 'overlay' | 'scanning' | 'result'
      scanProgress: 0,
      scanInterval: null,
      statusInterval: null,
      overlayProgress: 0,
      overlayInterval: null,
      comparisonTimer: null,
      animatedScore: 0,
      scoreAnimation: null,
      analysisPoints: [
        { x: 25, y: 30, threshold: 20, delay: 0.5 },
        { x: 70, y: 45, threshold: 35, delay: 1.2 },
        { x: 15, y: 65, threshold: 50, delay: 0.8 },
        { x: 85, y: 25, threshold: 25, delay: 1.5 },
        { x: 45, y: 80, threshold: 60, delay: 2.0 },
        { x: 60, y: 15, threshold: 40, delay: 1.8 },
      ],
      currentAnalysisStatus: "초기화 중...",
      openaiProcessingStatus: "GPT Vision 모델 준비...",
      boundingBoxes: [
        { x: 15, y: 20, width: 25, height: 20, label: "객체1", confidence: 95, threshold: 25, delay: 0.5 },
        { x: 55, y: 35, width: 20, height: 25, label: "객체2", confidence: 88, threshold: 30, delay: 0.8 },
        { x: 25, y: 60, width: 30, height: 15, label: "객체3", confidence: 92, threshold: 35, delay: 1.1 },
        { x: 70, y: 15, width: 20, height: 20, label: "객체4", confidence: 85, threshold: 40, delay: 1.4 },
        { x: 10, y: 75, width: 25, height: 20, label: "객체5", confidence: 78, threshold: 45, delay: 1.7 },
      ],
      featureCircles: [
        { x: 20, y: 30, threshold: 32, delay: 0.6 },
        { x: 65, y: 45, threshold: 38, delay: 1.0 },
        { x: 40, y: 70, threshold: 42, delay: 1.3 },
        { x: 80, y: 25, threshold: 46, delay: 1.6 },
        { x: 30, y: 55, threshold: 50, delay: 1.9 },
        { x: 75, y: 65, threshold: 54, delay: 2.2 },
      ],
      highlightRegions: [
        { x: 10, y: 15, width: 35, height: 30, type: "important", threshold: 42, delay: 0.7 },
        { x: 50, y: 30, width: 40, height: 35, type: "similar", threshold: 48, delay: 1.2 },
        { x: 20, y: 55, width: 45, height: 25, type: "match", threshold: 52, delay: 1.5 },
      ],
      matchingLines: [
        { x1: 20, y1: 30, x2: 65, y2: 45, threshold: 72, delay: 0.3 },
        { x1: 65, y1: 45, x2: 40, y2: 70, threshold: 74, delay: 0.6 },
        { x1: 40, y1: 70, x2: 80, y2: 25, threshold: 76, delay: 0.9 },
        { x1: 80, y1: 25, x2: 30, y2: 55, threshold: 78, delay: 1.2 },
        { x1: 30, y1: 55, x2: 75, y2: 65, threshold: 80, delay: 1.5 },
      ]
    };
  },
  computed: {
    scoreLevel() {
      if (this.similarityScore >= 0.89) return "high";
      if (this.similarityScore >= 0.6) return "medium";
      return "low";
    },
    scoreClass() {
      return {
        'high-score': this.scoreLevel === 'high',
        'medium-score': this.scoreLevel === 'medium',
        'low-score': this.scoreLevel === 'low'
      };
    },
    scoreMessage() {
      if (this.scoreLevel === 'high') return "매우 유사한 이미지";
      if (this.scoreLevel === 'medium') return "보통 수준의 유사도";
      return "낮은 유사도";
    },
    scoreDescription() {
      if (this.scoreLevel === 'high') {
        return "이미지가 매우 유사합니다. 높은 유사도는 미션 요구사항을 잘 충족했다는 의미입니다.";
      } else if (this.scoreLevel === 'medium') {
        return "이미지가 어느 정도 유사합니다. 미션 요구사항을 부분적으로 충족했습니다.";
      } else {
        return "이미지의 유사도가 낮습니다. 미션 요구사항과 차이가 있을 수 있습니다.";
      }
    },
    actionText() {
      // 모든 점수에서 동일한 액션 텍스트 사용
      return "미션 목록으로 이동";
    },
    overlayStepText() {
      if (this.overlayProgress < 25) return "이미지 정렬 중...";
      if (this.overlayProgress < 50) return "크기 조정 중...";
      if (this.overlayProgress < 75) return "투명도 적용 중...";
      return "매칭 완료";
    },
    overlayImageOpacity() {
      if (this.overlayProgress < 75) return 1;
      return Math.max(0.3, 1 - (this.overlayProgress - 75) / 25 * 0.7);
    },
    overlayBlendMode() {
      if (this.overlayProgress < 60) return 'normal';
      if (this.overlayProgress < 80) return 'multiply';
      return 'soft-light';
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.startComparison();
        // 마우스 호버 효과 관련 코드 제거됨
      } else {
        this.resetModal();
      }
    }
  },
  methods: {
    startComparison() {
      this.currentStep = 'comparison';
      this.comparisonTimer = setTimeout(() => {
        this.startOverlay();
      }, 1500); // 2500ms에서 1500ms로 단축
    },
    
    startOverlay() {
      this.currentStep = 'overlay';
      this.overlayProgress = 0;
      
      this.overlayInterval = setInterval(() => {
        if (this.overlayProgress < 100) {
          this.overlayProgress += 3; // 2에서 3으로 증가하여 더 빠르게
        } else {
          clearInterval(this.overlayInterval);
          setTimeout(() => {
            this.startScanning();
          }, 500); // 800ms에서 500ms로 단축
        }
      }, 30); // 40ms에서 30ms로 단축
    },
    
    startScanning() {
      this.currentStep = 'scanning';
      this.scanProgress = 0;
      this.currentAnalysisStatus = "스캔 시작...";
      
      this.statusInterval = setInterval(() => {
        this.updateAnalysisStatus();
        this.updateOpenAIStatus();
      }, 1200); // 1500ms에서 1200ms로 단축
      
      this.scanInterval = setInterval(() => {
        if (this.scanProgress < 100) {
          if (this.scanProgress < 25) {
            this.scanProgress += 2; // 1.5에서 2로 증가
          } else if (this.scanProgress < 50) {
            this.scanProgress += 1.8; // 1.2에서 1.8로 증가
          } else if (this.scanProgress < 75) {
            this.scanProgress += 1.2; // 0.8에서 1.2로 증가
          } else if (this.scanProgress < 95) {
            this.scanProgress += 0.6; // 0.4에서 0.6으로 증가
          } else {
            this.scanProgress = 100;
          }
        } else {
          clearInterval(this.scanInterval);
          clearInterval(this.statusInterval);
          this.currentAnalysisStatus = "분석 완료";
          setTimeout(() => {
            this.currentStep = 'result';
            this.startScoreAnimation();
          }, 300); // 500ms에서 300ms로 단축
        }
      }, 40); // 50ms에서 40ms로 단축
    },
    
    startScoreAnimation() {
      this.animatedScore = 0;
      const targetScore = this.similarityScore * 100;
      const duration = 1200; // 2000ms에서 1200ms로 단축
      const steps = 50; // 60에서 50으로 단축
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      
      this.scoreAnimation = setInterval(() => {
        currentStep++;
        
        if (currentStep <= steps) {
          const progress = currentStep / steps;
          const easeOut = 1 - Math.pow(1 - progress, 3);
          this.animatedScore = targetScore * easeOut;
        } else {
          this.animatedScore = targetScore;
          clearInterval(this.scoreAnimation);
          this.scoreAnimation = null;
        }
      }, stepDuration);
    },
    
    stopScoreAnimation() {
      if (this.scoreAnimation) {
        clearInterval(this.scoreAnimation);
        this.scoreAnimation = null;
      }
      this.animatedScore = 0;
    },
    
    updateAnalysisStatus() {
      const statuses = [
        "이미지 데이터 읽는 중...",
        "픽셀 매트릭스 분석...",
        "객체 감지 알고리즘 실행...",
        "바운딩 박스 생성 중...",
        "색상 히스토그램 계산...",
        "특징점 매핑...",
        "영역별 유사도 측정...",
        "패턴 인식 진행...",
        "머신러닝 모델 실행...",
        "특징점 매칭 중...",
        "유사도 벡터 계산...",
        "레이더 스캔 분석...",
        "매칭 라인 생성...",
        "결과 검증 중...",
        "최종 처리 중..."
      ];
      
      // 진행률에 따라 적절한 메시지 선택
      let messageIndex;
      if (this.scanProgress < 25) {
        messageIndex = Math.floor(Math.random() * 3); // 초기 메시지들
      } else if (this.scanProgress < 40) {
        messageIndex = 3 + Math.floor(Math.random() * 3); // 객체 감지 관련
      } else if (this.scanProgress < 60) {
        messageIndex = 6 + Math.floor(Math.random() * 3); // 특징점 관련
      } else if (this.scanProgress < 80) {
        messageIndex = 9 + Math.floor(Math.random() * 3); // 매칭 관련
      } else {
        messageIndex = 12 + Math.floor(Math.random() * 3); // 최종 처리
      }
      
      this.currentAnalysisStatus = statuses[messageIndex];
    },
    
    updateOpenAIStatus() {
      if (!this.useOpenAI) return;
      
      const statuses = [
        "GPT Vision 모델 로딩...",
        "멀티모달 분석 실행...",
        "시각적 컨텍스트 이해...",
        "고급 패턴 매칭...",
        "정밀 유사도 계산...",
        "품질 검증 중..."
      ];
      
      const randomIndex = Math.floor(Math.random() * statuses.length);
      this.openaiProcessingStatus = statuses[randomIndex];
    },
    
    resetModal() {
      this.currentStep = 'comparison';
      this.scanProgress = 0;
      this.overlayProgress = 0;
      this.currentAnalysisStatus = "초기화 중...";
      this.openaiProcessingStatus = "GPT Vision 모델 준비...";
      
      this.stopScoreAnimation();
      
      if (this.comparisonTimer) {
        clearTimeout(this.comparisonTimer);
        this.comparisonTimer = null;
      }
      if (this.overlayInterval) {
        clearInterval(this.overlayInterval);
        this.overlayInterval = null;
      }
      if (this.scanInterval) {
        clearInterval(this.scanInterval);
        this.scanInterval = null;
      }
      if (this.statusInterval) {
        clearInterval(this.statusInterval);
        this.statusInterval = null;
      }
    },
    
    closeModal() {
      this.resetModal();
      this.$emit("close");
    },
    
    handleAction() {
      // 모든 점수에서 동일하게 미션 목록으로 이동
      const targetPlaceId = this.placeId || '1';
      console.log('이동할 placeId:', targetPlaceId);
      this.$router.push(`/mission-list/${targetPlaceId}`);
    }
  },
  
  beforeUnmount() {
    this.resetModal();
  }
};
</script>

<style scoped>
/* 기본 모달 스타일 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  max-width: 420px;
  max-height: 90vh;
  width: 95%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  overflow: hidden;
  /* 호버 효과 제거 */
  transform: none !important;
  transition: none !important;
}

.modal-overlay-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  border-radius: 16px;
  pointer-events: none;
  /* 호버 효과 제거 */
  background: none !important;
  filter: none !important;
  mix-blend-mode: normal !important;
  transition: none !important;
}

.similarity-modal {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  position: relative;
  z-index: 1;
  text-align: center;
  max-height: 95vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

/* 공통 스테이지 스타일 */
.stage-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #333;
}

.stage-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px;
}

.stage-info {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.stage-status {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  animation: textPulse 1.5s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 비교 단계 스타일 */
.comparison-stage {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.images-comparison {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.image-wrapper {
  position: relative;
  opacity: 0;
  animation: fadeInSlide 0.8s ease-out forwards;
}

.mission-image {
  animation-delay: 0.3s;
  animation-name: slideInFromLeft;
}

.user-image {
  animation-delay: 0.6s;
  animation-name: slideInFromRight;
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.comparison-image {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.comparison-image:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

.image-label {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 500;
  padding: 3px 6px;
  border-radius: 8px;
  white-space: nowrap;
  z-index: 10;
}

.mission-label {
  background-color: #e3f2fd;
  color: #1976d2;
}

.user-label {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.vs-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0;
  animation: bounceIn 0.6s ease-out 0.9s forwards;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(-10px);
  }
  60% {
    opacity: 1;
    transform: scale(1.1) translateY(0);
  }
  80% {
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.vs-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 12px;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
}

.comparison-arrows {
  color: #666;
  animation: pulseArrows 2s ease-in-out infinite;
}

@keyframes pulseArrows {
  0%, 100% { 
    opacity: 0.6; 
    transform: scale(1);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.1);
  }
}

/* 오버레이 단계 스타일 */
.overlay-stage {
  animation: fadeInUp 0.5s ease-out;
}

.overlay-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.overlay-animation-wrapper {
  position: relative;
  width: 200px;
  height: 140px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.moving-image-container {
  position: absolute;
  width: 100px;
  height: 70px;
  transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3;
}

.moving-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.left-image {
  top: 35px;
  left: 15px;
}

.left-image.move-center {
  top: 35px;
  left: 50px;
}

.right-image {
  top: 35px;
  right: 15px;
}

.right-image.move-center {
  top: 35px;
  right: 50px;
}

.image-label-overlay {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 500;
  padding: 2px 5px;
  border-radius: 8px;
  white-space: nowrap;
  transition: opacity 0.8s ease;
  z-index: 10;
}

.move-center .image-label-overlay {
  opacity: 0;
}

.mission-label-overlay {
  background-color: #e3f2fd;
  color: #1976d2;
}

.user-label-overlay {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.final-overlay-wrapper {
  position: absolute;
  top: 35px;
  left: 50px;
  width: 100px;
  height: 70px;
  z-index: 2;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.show-final {
  opacity: 1;
}

.base-overlay-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.top-overlay-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
  transition: opacity 0.5s ease;
}

.alignment-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  z-index: 4;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.show-grid {
  opacity: 1;
}

.grid-cell {
  border: 1px solid rgba(0, 255, 255, 0.4);
  background: rgba(0, 255, 255, 0.08);
  opacity: 0;
  animation: gridCellAppear 0.3s ease-out forwards;
}

@keyframes gridCellAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.progress-indicators {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
}

.indicator {
  flex: 1;
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  padding: 6px 4px;
  border-radius: 6px;
  background-color: #e0e0e0;
  color: #888;
  transition: all 0.3s ease;
}

.indicator.active {
  background-color: #00bcd4;
  color: white;
  transform: scale(1.05);
}

/* 스캔 단계 스타일 */
.scanning-stage {
  animation: fadeInUp 0.5s ease-out;
}

.scanning-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.scan-image-wrapper {
  position: relative;
  width: 200px;
  height: 140px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.base-scan-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.overlay-scan-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
  opacity: 0.7;
  mix-blend-mode: multiply;
}

.analysis-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  opacity: 0;
  animation: gridFadeIn 1s ease-out forwards;
}

@keyframes gridFadeIn {
  to { opacity: 0.6; }
}

.grid-line {
  position: absolute;
  background-color: rgba(0, 255, 255, 0.3);
  animation: gridPulse 2s ease-in-out infinite alternate;
}

.grid-line.horizontal {
  width: 100%;
  height: 1px;
}

.grid-line.vertical {
  height: 100%;
  width: 1px;
}

@keyframes gridPulse {
  0% { opacity: 0.2; }
  100% { opacity: 0.6; }
}

/* 바운딩 박스 스타일 */
.bounding-boxes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 6;
}

.bounding-box {
  position: absolute;
  border: 2px solid #ff6b6b;
  border-radius: 4px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  background: rgba(255, 107, 107, 0.1);
  animation: boxAppear 0.5s ease-out forwards;
}

.bounding-box.active {
  opacity: 1;
  transform: scale(1);
  border-color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
}

.bounding-box.detected {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.15);
  animation: boxDetected 1s ease-in-out infinite alternate;
}

@keyframes boxAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes boxDetected {
  0% { box-shadow: 0 0 10px rgba(76, 175, 80, 0.4); }
  100% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.8); }
}

.box-label {
  position: absolute;
  top: -20px;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  animation: labelFadeIn 0.3s ease-out 0.2s forwards;
}

.box-confidence {
  position: absolute;
  bottom: -18px;
  right: 0;
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 9px;
  font-weight: 600;
  opacity: 0;
  animation: labelFadeIn 0.3s ease-out 0.4s forwards;
}

@keyframes labelFadeIn {
  to { opacity: 1; }
}

/* 특징점 원형 마커 스타일 */
.feature-circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
}

.feature-circle {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid #00bcd4;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: circleAppear 0.5s ease-out forwards;
}

.feature-circle.active {
  opacity: 1;
  border-color: #00ff88;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.6);
  animation: circlePulse 1.5s ease-in-out infinite;
}

@keyframes circleAppear {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes circlePulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.3); }
}

.circle-pulse {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 1px solid rgba(0, 255, 136, 0.4);
  border-radius: 50%;
  animation: pulseBorder 2s ease-in-out infinite;
}

@keyframes pulseBorder {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* 영역 하이라이트 스타일 */
.region-highlights {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
}

.region-highlight {
  position: absolute;
  border-radius: 4px;
  opacity: 0;
  animation: regionFadeIn 0.5s ease-out forwards;
}

.region-highlight.active {
  opacity: 1;
}

.region-highlight.fruit {
  background: linear-gradient(45deg, 
    rgba(255, 193, 7, 0.2) 0%, 
    rgba(255, 152, 0, 0.2) 50%, 
    rgba(255, 87, 34, 0.2) 100%);
  border: 1px solid rgba(255, 193, 7, 0.6);
  animation: fruitGlow 2s ease-in-out infinite alternate;
}

.region-highlight.important {
  background: linear-gradient(45deg, 
    rgba(244, 67, 54, 0.15) 0%, 
    rgba(233, 30, 99, 0.15) 50%, 
    rgba(156, 39, 176, 0.15) 100%);
  border: 1px solid rgba(244, 67, 54, 0.6);
  animation: importantGlow 2s ease-in-out infinite alternate;
}

.region-highlight.similar {
  background: linear-gradient(45deg, 
    rgba(33, 150, 243, 0.15) 0%, 
    rgba(3, 169, 244, 0.15) 50%, 
    rgba(0, 188, 212, 0.15) 100%);
  border: 1px solid rgba(33, 150, 243, 0.6);
  animation: similarGlow 2s ease-in-out infinite alternate;
}

.region-highlight.match {
  background: linear-gradient(45deg, 
    rgba(76, 175, 80, 0.15) 0%, 
    rgba(139, 195, 74, 0.15) 50%, 
    rgba(205, 220, 57, 0.15) 100%);
  border: 1px solid rgba(76, 175, 80, 0.6);
  animation: matchGlow 2s ease-in-out infinite alternate;
}

@keyframes regionFadeIn {
  to { opacity: 1; }
}

@keyframes fruitGlow {
  0% { box-shadow: 0 0 5px rgba(255, 193, 7, 0.3); }
  100% { box-shadow: 0 0 15px rgba(255, 193, 7, 0.6); }
}

@keyframes importantGlow {
  0% { box-shadow: 0 0 5px rgba(244, 67, 54, 0.3); }
  100% { box-shadow: 0 0 15px rgba(244, 67, 54, 0.6); }
}

@keyframes similarGlow {
  0% { box-shadow: 0 0 5px rgba(33, 150, 243, 0.3); }
  100% { box-shadow: 0 0 15px rgba(33, 150, 243, 0.6); }
}

@keyframes matchGlow {
  0% { box-shadow: 0 0 5px rgba(76, 175, 80, 0.3); }
  100% { box-shadow: 0 0 15px rgba(76, 175, 80, 0.6); }
}

/* 레이더 스캔 효과 */
.radar-scan {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 7;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.radar-scan.active {
  opacity: 1;
}

.radar-sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 50%;
  background: linear-gradient(to bottom, 
    rgba(0, 255, 255, 0.8) 0%, 
    rgba(0, 255, 255, 0.4) 50%, 
    transparent 100%);
  transform-origin: bottom center;
  transform: translate(-50%, 0) rotate(0deg);
  animation: radarSweep 3s linear infinite;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
}

@keyframes radarSweep {
  0% { transform: translate(-50%, 0) rotate(0deg); }
  100% { transform: translate(-50%, 0) rotate(360deg); }
}

/* 매칭 라인 스타일 */
.matching-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 8;
  pointer-events: none;
}

.matching-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.matching-line {
  stroke: #00ff88;
  stroke-width: 2;
  stroke-dasharray: 5, 5;
  opacity: 0;
  animation: lineAppear 0.5s ease-out forwards, lineDash 1s linear infinite;
  filter: drop-shadow(0 0 3px rgba(0, 255, 136, 0.6));
}

.matching-line.active {
  opacity: 1;
}

@keyframes lineAppear {
  to { opacity: 1; }
}

@keyframes lineDash {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 10; }
}

.analysis-points {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
}

.analysis-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #ff6b6b;
  border: 2px solid #ffffff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: pointPulse 1.5s ease-in-out infinite;
  box-shadow: 0 0 15px rgba(255, 107, 107, 0.6);
}

.analysis-point.active {
  opacity: 1;
  background-color: #00ff88;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
}

@keyframes pointPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.3); }
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    #00ffff 20%, 
    #ffffff 50%, 
    #00ffff 80%, 
    transparent 100%);
  box-shadow: 
    0 0 20px #00ffff,
    0 0 40px #00ffff,
    0 2px 10px rgba(0, 255, 255, 0.5);
  transition: top 0.1s ease-out;
  z-index: 5;
  transform: translateY(-2px);
}

.scan-particles {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  transform: translateY(-50%);
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background-color: #ffffff;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  animation: particleFloat 0.8s ease-in-out infinite alternate;
  box-shadow: 0 0 6px #00ffff;
}

@keyframes particleFloat {
  0% { transform: translateY(-50%) translateX(-2px); opacity: 1; }
  100% { transform: translateY(-50%) translateX(2px); opacity: 0.5; }
}

.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to bottom, 
    rgba(0, 255, 255, 0.15) 0%, 
    rgba(0, 255, 255, 0.08) 50%, 
    rgba(0, 255, 255, 0.03) 80%,
    transparent 100%);
  transition: height 0.1s ease-out;
  z-index: 2;
  pointer-events: none;
}

.scan-info {
  width: 100%;
  max-width: 100%;
}

.scan-status {
  margin-bottom: 16px;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #00bcd4;
}

.status-item {
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-label {
  font-weight: 500;
  color: #666;
}

.status-value {
  font-weight: 600;
  color: #333;
}

.status-value.blinking {
  animation: statusBlink 1.5s ease-in-out infinite;
  color: #00bcd4;
}

@keyframes statusBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.progress-container {
  margin-bottom: 20px;
}

.progress-bar-wrapper {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #00E676);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6));
  animation: progress-shine 1.5s infinite;
}

@keyframes progress-shine {
  0% { transform: translateX(20px); }
  100% { transform: translateX(-100%); }
}

.progress-text {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.analysis-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.step {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  font-size: 13px;
  color: #666;
}

.step.active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.step.completed {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.step-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #ddd;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step.active .step-icon {
  background-color: #2196f3;
  color: white;
}

.step.completed .step-icon {
  background-color: #4caf50;
  color: white;
}

.openai-processing {
  text-align: center;
  padding: 10px;
  background-color: #f0fdf4;
  border-radius: 6px;
  border: 1px solid #bbf7d0;
}

.openai-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #10a37f;
  color: white;
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.processing-details {
  margin-top: 6px;
  font-size: 11px;
  color: #10a37f;
  font-style: italic;
  animation: processingPulse 2s ease-in-out infinite;
}

@keyframes processingPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* 결과 단계 스타일 */
.result-stage {
  animation: fadeInUp 0.5s ease-out;
}

.result-header {
  margin-bottom: 20px;
  text-align: center;
}

.result-icon-container {
  position: relative;
  width: 50px;
  height: 50px;
  margin: 0 auto 12px;
}

.result-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.result-icon svg {
  width: 28px;
  height: 28px;
}

.result-icon.high-score {
  background-color: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
  box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
}

.result-icon.medium-score {
  background-color: rgba(241, 196, 15, 0.1);
  color: #f1c40f;
  box-shadow: 0 0 0 2px rgba(241, 196, 15, 0.2);
}

.result-icon.low-score {
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.result-summary {
  margin-bottom: 24px;
}

.summary-images {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.summary-image-item {
  position: relative;
}

.summary-image {
  width: 80px;
  height: 55px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.summary-image:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.summary-label {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 500;
  padding: 2px 5px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 10;
}

.mission-summary {
  background-color: #e3f2fd;
  color: #1976d2;
}

.user-summary {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.comparison-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.connector-line {
  width: 2px;
  height: 30px;
  background: linear-gradient(to bottom, 
    transparent 0%, 
    #00bcd4 20%, 
    #ffffff 50%, 
    #00bcd4 80%, 
    transparent 100%);
  box-shadow: 0 0 8px rgba(0, 188, 212, 0.4);
  border-radius: 1px;
}

.connector-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.score-display {
  margin-bottom: 20px;
  text-align: center;
}

.score-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.score-ring-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-ring {
  transform: rotate(-90deg);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.ring-background {
  fill: none;
  stroke: #f0f0f0;
  stroke-width: 8;
  stroke-dasharray: 314 314;
  stroke-dashoffset: 0;
}

.ring-progress {
  fill: none;
  stroke-width: 8;
  stroke-dasharray: 314 314;
  stroke-dashoffset: 314;
  transition: stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  stroke-linecap: round;
}

.ring-progress.high-score {
  stroke: #2ecc71;
  filter: drop-shadow(0 0 8px rgba(46, 204, 113, 0.4));
}

.ring-progress.medium-score {
  stroke: #f1c40f;
  filter: drop-shadow(0 0 8px rgba(241, 196, 15, 0.4));
}

.ring-progress.low-score {
  stroke: #e74c3c;
  filter: drop-shadow(0 0 8px rgba(231, 76, 60, 0.4));
}

.score-value {
  position: absolute;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  display: flex;
  align-items: baseline;
}

.score-percent {
  font-size: 18px;
  font-weight: 500;
  margin-left: 2px;
}

.score-value.high-score {
  color: #2ecc71;
}

.score-value.medium-score {
  color: #f1c40f;
}

.score-value.low-score {
  color: #e74c3c;
}

.score-label {
  font-size: 16px;
  font-weight: 500;
  color: #666;
}

.score-description {
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: left;
  display: flex;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.score-description::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.score-description.high-score::before {
  background-color: #2ecc71;
}

.score-description.medium-score::before {
  background-color: #f1c40f;
}

.score-description.low-score::before {
  background-color: #e74c3c;
}

.description-icon {
  color: #666;
  flex-shrink: 0;
  margin-top: 2px;
}

.description-content {
  flex: 1;
}

.description-content p {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.4;
  color: #444;
}

.openai-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #666;
}

.analysis-details {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border-left: 4px solid #4CAF50;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.detail-item:hover {
  transform: translateY(-1px);
}

.detail-icon {
  width: 24px;
  height: 24px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  flex-shrink: 0;
}

.detail-content {
  flex: 1;
}

.detail-title {
  font-size: 10px;
  font-weight: 500;
  color: #666;
  margin-bottom: 2px;
}

.detail-value {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.action-buttons {
  display: flex !important;
  flex-direction: row !important;
  gap: 12px !important;
  justify-content: center !important;
  align-items: center !important;
  margin-top: 20px !important;
  width: 100% !important;
}

.btn-primary {
  background-color: #40c996;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  max-width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  white-space: nowrap;
}

.btn-primary:hover {
  background-color: #267e67;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 201, 150, 0.3);
}

.btn-secondary {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  max-width: 100px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.btn-secondary:hover {
  background-color: #f5f5f5;
  border-color: #bbb;
  transform: translateY(-1px);
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .modal-container {
    width: 95%;
    max-width: 100%;
    max-height: 95vh;
    margin: 0 8px;
  }
  
  .similarity-modal {
    padding: 16px;
    max-height: 95vh;
    border-radius: 12px;
  }
  
  .stage-title {
    font-size: 16px;
    margin-bottom: 6px;
  }
  
  .stage-subtitle {
    font-size: 12px;
    margin-bottom: 16px;
  }
  
  .images-comparison {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .vs-indicator {
    order: 2;
    transform: rotate(90deg);
    margin: 8px 0;
  }
  
  .mission-image {
    order: 1;
  }
  
  .user-image {
    order: 3;
  }
  
  .comparison-image {
    width: 90px;
    height: 60px;
  }
  
  .overlay-animation-wrapper, .scan-image-wrapper {
    width: 180px;
    height: 120px;
  }
  
  .moving-image-container {
    width: 90px;
    height: 60px;
  }
  
  .left-image {
    top: 30px;
    left: 12px;
  }
  
  .left-image.move-center {
    top: 30px;
    left: 45px;
    width: 90px;
    height: 60px;
  }
  
  .right-image {
    top: 30px;
    right: 12px;
  }
  
  .right-image.move-center {
    top: 30px;
    right: 45px;
    width: 90px;
    height: 60px;
  }
  
  .final-overlay-wrapper {
    top: 30px;
    left: 45px;
    width: 90px;
    height: 60px;
  }
  
  .summary-images {
    flex-direction: column;
    gap: 10px;
  }
  
  .comparison-connector {
    order: 2;
    transform: rotate(90deg);
    margin: 6px 0;
  }
  
  .summary-image-item:first-child {
    order: 1;
  }
  
  .summary-image-item:last-child {
    order: 3;
  }
  
  .connector-line {
    width: 30px;
    height: 2px;
  }
  
  .summary-image {
    width: 70px;
    height: 48px;
  }
  
  .score-ring {
    width: 100px;
    height: 100px;
  }
  
  .score-value {
    font-size: 28px;
  }
  
  .score-percent {
    font-size: 16px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .action-buttons {
    flex-direction: row;
    gap: 8px;
    margin-top: 16px;
    justify-content: space-between;
  }
  
  .btn-primary, .btn-secondary {
    max-width: 48%;
    padding: 10px 12px;
    font-size: 13px;
    min-height: 40px;
  }
  
  .btn-primary {
    flex: 1.2;
  }
  
  .btn-secondary {
    flex: 0.8;
  }
  
  .progress-indicators {
    gap: 4px;
  }
  
  .indicator {
    font-size: 10px;
    padding: 4px 2px;
  }
  
  .stage-info {
    padding: 12px;
  }
  
  .scan-status {
    padding: 10px;
    margin-bottom: 12px;
  }
  
  .status-item {
    font-size: 11px;
    margin-bottom: 3px;
  }
  
  .progress-container {
    margin-bottom: 16px;
  }
  
  .analysis-steps {
    gap: 6px;
    margin-bottom: 12px;
  }
  
  .step {
    padding: 6px 8px;
    font-size: 12px;
    gap: 8px;
  }
  
  .step-icon {
    width: 18px;
    height: 18px;
  }
  
  .openai-processing {
    padding: 8px;
  }
  
  .openai-badge {
    font-size: 11px;
    padding: 4px 8px;
  }
  
  .processing-details {
    font-size: 10px;
    margin-top: 4px;
  }
  
  .result-header {
    margin-bottom: 16px;
  }
  
  .result-icon-container {
    width: 40px;
    height: 40px;
    margin: 0 auto 10px;
  }
  
  .result-icon svg {
    width: 24px;
    height: 24px;
  }
  
  .result-title {
    font-size: 16px;
  }
  
  .result-summary {
    margin-bottom: 20px;
  }
  
  .score-display {
    margin-bottom: 16px;
  }
  
  .score-description {
    padding: 12px;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .description-content p {
    font-size: 12px;
    margin-bottom: 6px;
    line-height: 1.3;
  }
  
  .openai-notice {
    font-size: 10px;
    gap: 6px;
  }
  
  .analysis-details {
    padding: 12px;
    margin-bottom: 20px;
  }
  
  .detail-item {
    padding: 6px;
    gap: 6px;
  }
  
  .detail-icon {
    width: 20px;
    height: 20px;
  }
  
  .detail-title {
    font-size: 9px;
  }
  
  .detail-value {
    font-size: 11px;
  }
}

@media (max-height: 700px) {
  .similarity-modal {
    padding: 14px 18px;
  }
  
  .stage-title {
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  .stage-subtitle {
    margin-bottom: 14px;
  }
  
  .images-comparison {
    margin-bottom: 14px;
  }
  
  .overlay-animation-wrapper, .scan-image-wrapper {
    width: 200px;
    height: 130px;
  }
  
  .moving-image-container {
    width: 100px;
    height: 68px;
  }
  
  .left-image {
    top: 32px;
    left: 14px;
  }
  
  .left-image.move-center {
    top: 32px;
    left: 50px;
    width: 100px;
    height: 68px;
  }
  
  .right-image {
    top: 32px;
    right: 14px;
  }
  
  .right-image.move-center {
    top: 32px;
    right: 50px;
    width: 100px;
    height: 68px;
  }
  
  .final-overlay-wrapper {
    top: 32px;
    left: 50px;
    width: 100px;
    height: 68px;
  }
  
  .result-header, .result-summary {
    margin-bottom: 14px;
  }
  
  .score-display, .score-description, .analysis-details {
    margin-bottom: 14px;
  }
  
  .scan-status, .progress-container {
    margin-bottom: 12px;
  }
  
  .analysis-steps {
    margin-bottom: 10px;
  }
}

/* 액션 버튼 강제 가로 배치 */
.result-stage .action-buttons {
  display: flex !important;
  flex-direction: row !important;
  gap: 12px !important;
  justify-content: center !important;
  align-items: center !important;
  margin-top: 20px !important;
  width: 100% !important;
}

.result-stage .action-buttons .btn-primary,
.result-stage .action-buttons .btn-secondary {
  flex: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
</style> 