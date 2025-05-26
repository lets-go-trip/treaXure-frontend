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
          <h2 class="comparison-title">이미지 비교 분석</h2>
          <p class="comparison-subtitle">미션 예시와 업로드된 이미지를 비교합니다</p>
          
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
          
          <div class="comparison-info">
            <div class="comparison-step">이미지 비교 준비 중...</div>
          </div>
        </div>
        
        <!-- 이미지 오버레이 단계 -->
        <div v-if="currentStep === 'overlay'" class="overlay-stage">
          <h2 class="overlay-title">이미지 정렬 및 매칭</h2>
          <p class="overlay-subtitle">두 이미지를 겹쳐서 유사도를 측정합니다</p>
          
          <div class="images-overlay-container">
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
              
              <!-- 최종 겹쳐진 이미지 (중앙) -->
              <div class="final-overlay-wrapper" :class="{ 'show-final': overlayProgress > 60 }">
                <img :src="missionImageUrl" alt="미션 예시 이미지" class="base-overlay-image" />
                <img :src="uploadedImageUrl" alt="업로드된 이미지" class="top-overlay-image" :style="{ 
                  opacity: overlayImageOpacity, 
                  mixBlendMode: overlayBlendMode 
                }" />
                
                <!-- 이미지 구분을 위한 시각적 표시 -->
                <div class="image-distinction-effects" :class="{ 'show-effects': overlayProgress > 70 }">
                  <div class="base-image-border"></div>
                  <div class="overlay-image-border"></div>
                  <div class="overlay-indicator">
                    <div class="indicator-dot base-dot"></div>
                    <div class="indicator-dot overlay-dot"></div>
                  </div>
                </div>
                
                <div class="alignment-grid" :class="{ 'show-grid': overlayProgress > 40 }">
                  <div class="grid-cell" v-for="i in 9" :key="i" :style="{ animationDelay: (i * 0.1) + 's' }"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="overlay-info">
            <div class="overlay-progress">
              <div class="overlay-step">{{ overlayStepText }}</div>
              <div class="alignment-indicators">
                <div class="indicator" :class="{ active: overlayProgress > 25 }">위치 정렬</div>
                <div class="indicator" :class="{ active: overlayProgress > 50 }">크기 조정</div>
                <div class="indicator" :class="{ active: overlayProgress > 75 }">투명도 적용</div>
                <div class="indicator" :class="{ active: overlayProgress >= 100 }">매칭 완료</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 스캔 단계 -->
        <div v-if="currentStep === 'scanning'" class="scanning-stage">
          <h2 class="scanning-title">이미지 분석 중...</h2>
          
          <div class="image-analysis-container">
            <div class="uploaded-image-wrapper">
              <!-- 겹쳐진 이미지 표시 -->
              <img :src="missionImageUrl" alt="미션 예시 이미지" class="base-scan-image" />
              <img :src="uploadedImageUrl" alt="업로드된 이미지" class="overlay-scan-image" />
              
              <!-- 분석 격자 -->
              <div class="analysis-grid" v-show="scanProgress > 5">
                <div class="grid-line horizontal" v-for="i in 8" :key="'h-' + i" :style="{ top: `${i * 12.5}%` }"></div>
                <div class="grid-line vertical" v-for="i in 8" :key="'v-' + i" :style="{ left: `${i * 12.5}%` }"></div>
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
              
              <!-- 스캔 오버레이 -->
              <div class="scan-overlay" :style="{ height: `${scanProgress}%` }"></div>
              
              <!-- 분석 영역 표시 -->
              <div class="focus-areas" v-show="scanProgress > 30">
                <div class="focus-box" 
                     v-for="(area, index) in focusAreas" 
                     :key="index"
                     :style="{
                       left: area.x + '%',
                       top: area.y + '%',
                       width: area.width + '%',
                       height: area.height + '%',
                       animationDelay: area.delay + 's'
                     }"
                     :class="{ visible: scanProgress > area.threshold }">
                </div>
              </div>
            </div>
            
            <div class="analysis-info">
              <div class="real-time-status">
                <div class="status-item">
                  <span class="status-label">상태:</span>
                  <span class="status-value blinking">{{ currentAnalysisStatus }}</span>
                </div>
                <div class="status-item" v-show="scanProgress > 20">
                  <span class="status-label">처리된 픽셀:</span>
                  <span class="status-value">{{ (scanProgress * 784).toFixed(0) }}/78,400</span>
                </div>
                <div class="status-item" v-show="scanProgress > 40">
                  <span class="status-label">특징점:</span>
                  <span class="status-value">{{ Math.floor(scanProgress * 2.3) }}개 감지</span>
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
                  <div class="step-detail" v-show="scanProgress >= 10 && scanProgress < 30">
                    {{ preprocessingDetails[Math.floor((scanProgress - 10) / 5)] }}
                  </div>
                </div>
                
                <div class="step" :class="{ active: scanProgress >= 50, completed: scanProgress > 50 }">
                  <div class="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="M21 21l-4.35-4.35"></path>
                    </svg>
                  </div>
                  <span>특징점 추출</span>
                  <div class="step-detail" v-show="scanProgress >= 35 && scanProgress < 65">
                    {{ featureDetails[Math.floor((scanProgress - 35) / 7)] }}
                  </div>
                </div>
                
                <div class="step" :class="{ active: scanProgress >= 75, completed: scanProgress > 75 }">
                  <div class="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 12l2 2 4-4"></path>
                      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                    </svg>
                  </div>
                  <span>AI 모델 분석</span>
                  <div class="step-detail" v-show="scanProgress >= 60 && scanProgress < 90">
                    {{ aiDetails[Math.floor((scanProgress - 60) / 8)] }}
                  </div>
                </div>
                
                <div class="step" :class="{ active: scanProgress >= 100, completed: scanProgress >= 100 }">
                  <div class="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span>결과 생성</span>
                  <div class="step-detail" v-show="scanProgress >= 85">
                    유사도 점수 계산 중...
                  </div>
                </div>
              </div>
              
              <div v-if="useOpenAI" class="openai-processing">
                <div class="openai-badge-processing">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5093-2.6067-1.4997z" />
                  </svg>
                  OpenAI 정밀 분석 중...
                </div>
                <div class="processing-details">
                  {{ openaiProcessingStatus }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 결과 단계 -->
        <div v-else-if="currentStep === 'result'" class="result-stage">
          <div class="similarity-header">
            <div class="similarity-icon-container">
              <div class="similarity-icon" :class="scoreClass">
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
            <h2 class="similarity-title">이미지 유사도 분석 결과</h2>
          </div>
          
          <!-- 비교 이미지 요약 -->
          <div class="comparison-summary">
            <div class="summary-images">
              <div class="summary-image-item">
                <img :src="missionImageUrl" alt="미션 예시" class="summary-image" />
                <div class="summary-label mission-summary">미션 예시</div>
              </div>
              <div class="comparison-result-icon" :class="scoreClass">
                <div class="result-connector"></div>
                <div class="result-icon">
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
          
          <div class="score-display">
            <div class="score-value-wrapper">
              <div class="score-value" :class="scoreClass">
                {{ animatedScore.toFixed(1) }}
                <span class="score-percent">%</span>
              </div>
            </div>
            <div class="score-ring-container">
              <div class="score-ring" :class="scoreClass">
                <svg class="ring-svg" width="90" height="90">
                  <circle class="ring-background" cx="45" cy="45" r="35" />
                  <circle class="ring-progress" :class="scoreClass" cx="45" cy="45" r="35" 
                          :style="{ strokeDasharray: `${(animatedScore / 100) * 220} 220` }" />
                </svg>
              </div>
            </div>
            <div class="score-label">{{ scoreMessage }}</div>
          </div>

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
    }
  },
  emits: ["close", "action"],
  data() {
    return {
      isTicking: false,
      currentStep: 'comparison', // 'comparison' | 'overlay' | 'scanning' | 'result'
      scanProgress: 0,
      scanInterval: null,
      statusInterval: null,
      overlayProgress: 0,
      overlayInterval: null,
      comparisonTimer: null,
      animatedScore: 0, // 애니메이션용 점수
      scoreAnimation: null, // 점수 애니메이션 인터벌
      analysisPoints: [
        { x: 25, y: 30, threshold: 20, delay: 0.5 },
        { x: 70, y: 45, threshold: 35, delay: 1.2 },
        { x: 15, y: 65, threshold: 50, delay: 0.8 },
        { x: 85, y: 25, threshold: 25, delay: 1.5 },
        { x: 45, y: 80, threshold: 60, delay: 2.0 },
        { x: 60, y: 15, threshold: 40, delay: 1.8 },
      ],
      focusAreas: [
        { x: 20, y: 25, width: 30, height: 25, threshold: 35, delay: 0.3 },
        { x: 55, y: 40, width: 25, height: 30, threshold: 50, delay: 0.8 },
        { x: 10, y: 60, width: 35, height: 20, threshold: 65, delay: 1.2 },
      ],
      preprocessingDetails: [
        "노이즈 제거 중...",
        "해상도 최적화...",
        "색상 보정 적용...",
        "전처리 완료"
      ],
      featureDetails: [
        "엣지 검출 중...",
        "코너 포인트 추출...",
        "텍스처 분석...",
        "특징 벡터 생성..."
      ],
      aiDetails: [
        "신경망 로딩...",
        "딥러닝 모델 실행...",
        "패턴 매칭 분석...",
        "유사도 계산..."
      ],
      currentAnalysisStatus: "초기화 중...",
      openaiProcessingStatus: "GPT Vision 모델 준비..."
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
      if (this.scoreLevel === 'high') return "미션 피드로 이동";
      if (this.scoreLevel === 'medium') return "미션 피드로 이동";
      return "다시 시도하기";
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
        this.$nextTick(() => {
          const c = this.$refs.container;
          if (c) {
            c.addEventListener("mousemove", this.handleMouseMove);
            c.addEventListener("mouseout", this.handleMouseOut);
          }
        });
      } else {
        this.resetModal();
        const c = this.$refs.container;
        if (c) {
          c.removeEventListener("mousemove", this.handleMouseMove);
          c.removeEventListener("mouseout", this.handleMouseOut);
        }
      }
    }
  },
  methods: {
    startComparison() {
      this.currentStep = 'comparison';
      // 2초 후 오버레이 단계로 이동
      this.comparisonTimer = setTimeout(() => {
        this.startOverlay();
      }, 2500);
    },
    
    startOverlay() {
      this.currentStep = 'overlay';
      this.overlayProgress = 0;
      
      // 오버레이 애니메이션
      this.overlayInterval = setInterval(() => {
        if (this.overlayProgress < 100) {
          this.overlayProgress += 2;
        } else {
          clearInterval(this.overlayInterval);
          // 잠시 대기 후 스캔 시작
          setTimeout(() => {
            this.startScanning();
          }, 800);
        }
      }, 40);
    },
    
    startScanning() {
      this.currentStep = 'scanning';
      this.scanProgress = 0;
      this.currentAnalysisStatus = "스캔 시작...";
      
      // 실시간 상태 업데이트
      this.statusInterval = setInterval(() => {
        this.updateAnalysisStatus();
        this.updateOpenAIStatus();
      }, 1500);
      
      // 스캔 애니메이션 시작
      this.scanInterval = setInterval(() => {
        if (this.scanProgress < 100) {
          // 각 단계별로 속도 조절
          if (this.scanProgress < 25) {
            this.scanProgress += 1.5; // 처음엔 조금 빠르게
          } else if (this.scanProgress < 50) {
            this.scanProgress += 1.2; // 중간 속도
          } else if (this.scanProgress < 75) {
            this.scanProgress += 0.8; // 느리게
          } else if (this.scanProgress < 95) {
            this.scanProgress += 0.4; // 매우 느리게
          } else {
            this.scanProgress = 100; // 완료
          }
        } else {
          clearInterval(this.scanInterval);
          clearInterval(this.statusInterval);
          this.currentAnalysisStatus = "분석 완료";
          // 잠시 대기 후 결과 표시
          setTimeout(() => {
            this.currentStep = 'result';
            this.startScoreAnimation(); // 점수 애니메이션 시작
          }, 500);
        }
      }, 50);
    },
    
    startScoreAnimation() {
      this.animatedScore = 0;
      const targetScore = this.similarityScore * 100;
      const duration = 2000; // 2초
      const steps = 60; // 60 스텝
      const increment = targetScore / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      
      this.scoreAnimation = setInterval(() => {
        currentStep++;
        
        if (currentStep <= steps) {
          // easeOut 애니메이션 효과
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
        "색상 히스토그램 계산...",
        "특징점 매핑...",
        "패턴 인식 진행...",
        "머신러닝 모델 실행...",
        "유사도 벡터 계산...",
        "결과 검증 중...",
        "최종 처리 중..."
      ];
      
      const randomIndex = Math.floor(Math.random() * statuses.length);
      this.currentAnalysisStatus = statuses[randomIndex];
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
      
      // 점수 애니메이션 정리
      this.stopScoreAnimation();
      
      // 모든 타이머와 인터벌 정리
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
      this.$emit("action", this.scoreLevel);
    },
    
    handleMouseMove(e) {
      if (this.isTicking || this.currentStep === 'comparison' || this.currentStep === 'overlay' || this.currentStep === 'scanning') return;
      this.isTicking = true;

      requestAnimationFrame(() => {
        const container = this.$refs.container;
        const overlay = this.$refs.overlay;
        
        if (!container || !overlay) {
          this.isTicking = false;
          return;
        }

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / centerX;
        const moveY = (y - centerY) / centerY;
        
        const rotateY = moveX * 4;
        const rotateX = -moveY * 4;
        
        container.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`;
        overlay.style.backgroundPosition = `${50 + moveX * 10}% ${50 + moveY * 10}%`;
        
        this.isTicking = false;
      });
    },
    
    handleMouseOut() {
      if (this.currentStep !== 'result') return;
      
      const container = this.$refs.container;
      const overlay = this.$refs.overlay;
      
      if (!container || !overlay) return;
      
      container.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      overlay.style.backgroundPosition = '50% 50%';
    }
  },
  
  beforeUnmount() {
    this.resetModal();
  }
};
</script>

<style scoped>
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
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  will-change: transform;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  overflow: hidden;
}

.modal-overlay-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  border-radius: 16px;
  background: linear-gradient(105deg,
      transparent 40%,
      rgba(255, 255, 255, 0.1) 45%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 54%);
  filter: brightness(1.1) opacity(0.5);
  mix-blend-mode: overlay;
  background-size: 150% 150%;
  background-position: 100%;
  transition: all 0.2s;
  pointer-events: none;
}

.similarity-modal {
  background: #ffffff;
  padding: 18px 20px;
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

/* 비교 단계 스타일 */
.comparison-stage {
  animation: fadeInUp 0.5s ease-out;
}

.comparison-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text-deep-dark, #333);
}

.comparison-subtitle {
  font-size: 13px;
  color: var(--text-dark, #666);
  margin: 0 0 18px;
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

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-image {
  animation-delay: 0.6s;
  animation-name: slideInFromRight;
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
  font-size: 10px;
  font-weight: 500;
  padding: 2px 5px;
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
  padding: 4px 10px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 11px;
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

.comparison-info {
  text-align: center;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.comparison-step {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  animation: textPulse 1.5s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 오버레이 단계 스타일 */
.overlay-stage {
  animation: fadeInUp 0.5s ease-out;
}

.overlay-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text-deep-dark, #333);
}

.overlay-subtitle {
  font-size: 13px;
  color: var(--text-dark, #666);
  margin: 0 0 18px;
}

.images-overlay-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.overlay-animation-wrapper {
  position: relative;
  width: 190px;
  height: 130px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
}

.moving-image-container {
  position: absolute;
  width: 95px;
  height: 65px;
  transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3;
}

.moving-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.left-image {
  top: 33px;
  left: 12px;
}

.left-image.move-center {
  top: 33px;
  left: 47px;
  width: 95px;
  height: 65px;
}

.right-image {
  top: 33px;
  right: 12px;
}

.right-image.move-center {
  top: 33px;
  right: 47px;
  width: 95px;
  height: 65px;
}

.image-label-overlay {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 500;
  padding: 3px 6px;
  border-radius: 10px;
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
  top: 33px;
  left: 47px;
  width: 95px;
  height: 65px;
  z-index: 2;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  border-radius: 5px;
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
  filter: brightness(0.95) contrast(1.05);
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
  animation: overlayPulse 3s ease-in-out infinite;
}

@keyframes overlayPulse {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    filter: hue-rotate(0deg);
  }
  25% {
    transform: translate(1px, -1px) scale(1.01);
    filter: hue-rotate(5deg);
  }
  50% {
    transform: translate(-1px, 1px) scale(0.99);
    filter: hue-rotate(-5deg);
  }
  75% {
    transform: translate(1px, 1px) scale(1.01);
    filter: hue-rotate(3deg);
  }
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

.overlay-info {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #00bcd4;
}

.overlay-step {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
  text-align: center;
  animation: textPulse 1.5s ease-in-out infinite;
}

.alignment-indicators {
  display: flex;
  justify-content: space-between;
  gap: 8px;
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

/* 스캔 단계 이미지 스타일 업데이트 */
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

/* 스캔 단계 스타일 */
.scanning-stage {
  min-height: auto;
}

.scanning-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 18px;
  color: var(--text-deep-dark, #333);
}

.image-analysis-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.uploaded-image-wrapper {
  position: relative;
  width: 190px;
  height: 130px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 분석 격자 */
.analysis-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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

/* 분석 포인트 */
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

/* 스캔 라인과 파티클 */
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
  z-index: 3;
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

/* 포커스 영역 */
.focus-areas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.focus-box {
  position: absolute;
  border: 2px solid #ffd700;
  border-radius: 4px;
  opacity: 0;
  animation: focusBoxBlink 2s ease-in-out infinite;
  box-shadow: 
    0 0 15px rgba(255, 215, 0, 0.4),
    inset 0 0 15px rgba(255, 215, 0, 0.1);
}

.focus-box.visible {
  opacity: 1;
}

@keyframes focusBoxBlink {
  0%, 100% { border-color: #ffd700; box-shadow: 0 0 15px rgba(255, 215, 0, 0.6); }
  50% { border-color: #ffff00; box-shadow: 0 0 25px rgba(255, 255, 0, 0.8); }
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

.analysis-info {
  width: 100%;
  max-width: 100%;
}

.real-time-status {
  margin-bottom: 16px;
  background-color: #f8f9fa;
  padding: 10px;
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
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.status-value {
  font-size: 12px;
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

.step-detail {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
  font-style: italic;
  animation: detailFadeIn 0.3s ease-out;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes detailFadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.processing-details {
  margin-top: 4px;
  font-size: 10px;
  color: #10a37f;
  text-align: center;
  font-style: italic;
  animation: processingPulse 2s ease-in-out infinite;
}

@keyframes processingPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
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
  gap: 6px;
  margin-bottom: 14px;
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 5px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  font-size: 12px;
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
  width: 18px;
  height: 18px;
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
  padding: 8px;
  background-color: #f0fdf4;
  border-radius: 6px;
  border: 1px solid #bbf7d0;
}

.openai-badge-processing {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: #10a37f;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 결과 단계 스타일 최적화 */
.result-stage {
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

.similarity-header {
  margin-bottom: 20px;
}

.similarity-icon-container {
  position: relative;
  width: 50px;
  height: 50px;
  margin: 0 auto 10px;
}

.similarity-icon svg {
  width: 28px;
  height: 28px;
}

.similarity-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: var(--text-deep-dark, #333);
}

.comparison-summary {
  margin-bottom: 24px;
  position: relative;
}

.summary-images {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
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
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  font-weight: 500;
  padding: 2px 4px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 10;
}

.result-connector {
  width: 2px;
  height: 40px;
  background: linear-gradient(to bottom, 
    transparent 0%, 
    #00ffff 20%, 
    #ffffff 50%, 
    #00ffff 80%, 
    transparent 100%);
  box-shadow: 
    0 0 12px #00ffff,
    0 0 25px #00ffff,
    0 1px 6px rgba(0, 255, 255, 0.5);
  border-radius: 1px;
}

.result-icon {
  font-size: 10px;
  padding: 2px 6px;
}

.result-score {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 12px;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
}

.score-display {
  margin-bottom: 20px;
}

.score-value-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.score-value {
  font-size: 42px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
  position: relative;
  display: inline-flex;
  align-items: baseline;
  z-index: 2;
}

.score-percent {
  font-size: 22px;
  font-weight: 500;
  margin-left: 2px;
}

.score-ring-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.score-ring {
  width: 80px;
  height: 80px;
  transform: rotate(-90deg);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.ring-svg {
  width: 100%;
  height: 100%;
}

.ring-background {
  fill: none;
  stroke: #f0f0f0;
  stroke-width: 6;
  stroke-dasharray: 220 220;
  stroke-dashoffset: 0;
}

.ring-progress {
  fill: none;
  stroke-width: 6;
  stroke-dasharray: 220 220;
  stroke-dashoffset: 220;
  transition: stroke-dasharray 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
              stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ring-progress-animation 1.5s ease-out forwards;
  stroke-linecap: round;
}

@keyframes ring-progress-animation {
  from {
    stroke-dashoffset: 220;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.ring-progress.high-score {
  stroke: var(--success, #2ecc71);
  filter: drop-shadow(0 0 6px rgba(46, 204, 113, 0.4));
  animation: ring-progress-animation 1.5s ease-out forwards,
             ring-glow-high 2s ease-in-out infinite alternate;
}

.ring-progress.medium-score {
  stroke: var(--warning, #f39c12);
  filter: drop-shadow(0 0 6px rgba(241, 196, 15, 0.4));
  animation: ring-progress-animation 1.5s ease-out forwards,
             ring-glow-medium 2s ease-in-out infinite alternate;
}

.ring-progress.low-score {
  stroke: var(--error, #e74c3c);
  filter: drop-shadow(0 0 6px rgba(231, 76, 60, 0.4));
  animation: ring-progress-animation 1.5s ease-out forwards,
             ring-glow-low 2s ease-in-out infinite alternate;
}

@keyframes ring-glow-high {
  0% { filter: drop-shadow(0 0 6px rgba(46, 204, 113, 0.4)); }
  100% { filter: drop-shadow(0 0 12px rgba(46, 204, 113, 0.6)); }
}

@keyframes ring-glow-medium {
  0% { filter: drop-shadow(0 0 6px rgba(241, 196, 15, 0.4)); }
  100% { filter: drop-shadow(0 0 12px rgba(241, 196, 15, 0.6)); }
}

@keyframes ring-glow-low {
  0% { filter: drop-shadow(0 0 6px rgba(231, 76, 60, 0.4)); }
  100% { filter: drop-shadow(0 0 12px rgba(231, 76, 60, 0.6)); }
}

.analysis-details {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 24px;
  border-left: 3px solid #4CAF50;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.detail-icon {
  width: 20px;
  height: 20px;
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
  font-size: 9px;
  font-weight: 500;
  color: #666;
  margin-bottom: 1px;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;
  color: #333;
}

.score-meter {
  margin-bottom: 16px;
}

.meter-labels {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: #888;
  font-weight: 500;
}

.score-description {
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: left;
  display: flex;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.description-content p {
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.4;
  color: #444;
}

.openai-notice {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 16px;
}

@media (max-width: 480px) {
  .modal-container {
    width: 95%;
    max-width: 100%;
    max-height: 95vh;
    margin: 0 8px;
  }
  
  .similarity-modal {
    padding: 12px 14px;
    max-height: 95vh;
    border-radius: 12px;
  }
  
  .comparison-title, .overlay-title, .scanning-title, .similarity-title {
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  .comparison-subtitle, .overlay-subtitle {
    font-size: 12px;
    margin-bottom: 16px;
  }
  
  .images-comparison {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }
  
  .vs-indicator {
    order: 2;
    transform: rotate(90deg);
    margin: 6px 0;
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
  
  .image-label {
    bottom: -18px;
    font-size: 10px;
    padding: 2px 5px;
  }
  
  .vs-text {
    padding: 4px 10px;
    font-size: 11px;
  }
  
  .overlay-animation-wrapper {
    width: 160px;
    height: 110px;
  }
  
  .moving-image-container {
    width: 80px;
    height: 55px;
  }
  
  .left-image {
    top: 28px;
    left: 10px;
  }
  
  .left-image.move-center {
    top: 28px;
    left: 40px;
    width: 80px;
    height: 55px;
  }
  
  .right-image {
    top: 32px;
    right: 12px;
  }
  
  .right-image.move-center {
    top: 28px;
    right: 40px;
    width: 80px;
    height: 55px;
  }
  
  .final-overlay-wrapper {
    top: 28px;
    left: 40px;
    width: 80px;
    height: 55px;
  }
  
  .uploaded-image-wrapper {
    width: 160px;
    height: 110px;
  }
  
  .image-analysis-container {
    gap: 12px;
  }
  
  .real-time-status {
    padding: 8px;
    margin-bottom: 12px;
  }
  
  .status-item {
    font-size: 11px;
    margin-bottom: 3px;
  }
  
  .progress-container {
    margin-bottom: 12px;
  }
  
  .analysis-steps {
    gap: 4px;
    margin-bottom: 10px;
  }
  
  .step {
    padding: 4px 6px;
    font-size: 11px;
    gap: 6px;
  }
  
  .step-detail {
    font-size: 9px;
    margin-top: 1px;
  }
  
  .similarity-header {
    margin-bottom: 12px;
  }
  
  .similarity-icon-container {
    width: 40px;
    height: 40px;
    margin: 0 auto 8px;
  }
  
  .similarity-icon svg {
    width: 24px;
    height: 24px;
  }
  
  .comparison-summary {
    margin-bottom: 24px;
  }
  
  .summary-images {
    flex-direction: column;
    gap: 8px;
  }
  
  .summary-image {
    width: 60px;
    height: 42px;
  }
  
  .summary-label {
    bottom: -14px;
    font-size: 8px;
  }
  
  .comparison-result-icon {
    order: 2;
    transform: rotate(90deg);
    margin: 4px 0;
  }
  
  .summary-image-item:first-child {
    order: 1;
  }
  
  .summary-image-item:last-child {
    order: 3;
  }
  
  .result-connector {
    width: 30px;
    height: 2px;
  }
  
  .result-score {
    font-size: 10px;
    padding: 2px 6px;
  }
  
  .score-display {
    margin-bottom: 14px;
  }
  
  .score-value-wrapper {
    flex-direction: column;
    gap: 10px;
  }
  
  .score-value {
    font-size: 36px;
  }
  
  .score-percent {
    font-size: 18px;
  }
  
  .score-ring-container {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    width: 70px;
    height: 70px;
  }
  
  .ring-background, .ring-progress {
    stroke-width: 5;
  }
  
  .analysis-details {
    padding: 8px;
    margin-bottom: 12px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 6px;
    margin-bottom: 8px;
  }
  
  .detail-item {
    padding: 5px;
    gap: 5px;
  }
  
  .detail-icon {
    width: 18px;
    height: 18px;
  }
  
  .detail-title {
    font-size: 8px;
  }
  
  .detail-value {
    font-size: 10px;
  }
  
  .score-meter {
    margin-bottom: 12px;
  }
  
  .meter-labels {
    font-size: 8px;
  }
  
  .score-description {
    padding: 8px;
    gap: 6px;
    margin-bottom: 12px;
  }
  
  .description-content p {
    font-size: 11px;
    margin-bottom: 5px;
    line-height: 1.3;
  }
  
  .openai-notice {
    font-size: 9px;
    gap: 5px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
  }
  
  .btn-primary, .btn-secondary {
    max-width: 100%;
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .comparison-info, .overlay-info {
    padding: 8px;
    margin-bottom: 12px;
  }
  
  .comparison-step, .overlay-step {
    font-size: 11px;
  }
  
  .alignment-indicators {
    gap: 3px;
  }
  
  .indicator {
    font-size: 9px;
    padding: 3px 2px;
  }
  
  .image-label-overlay {
    bottom: -18px;
    font-size: 9px;
    padding: 1px 4px;
  }
  
  .openai-processing {
    padding: 6px;
  }
  
  .openai-badge-processing {
    font-size: 10px;
    padding: 3px 6px;
  }
  
  .processing-details {
    font-size: 9px;
    margin-top: 3px;
  }
}

@media (max-height: 700px) {
  .similarity-modal {
    padding: 14px 18px;
  }
  
  .comparison-title, .overlay-title, .scanning-title, .similarity-title {
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  .comparison-subtitle, .overlay-subtitle {
    margin-bottom: 14px;
  }
  
  .images-comparison {
    margin-bottom: 14px;
  }
  
  .overlay-animation-wrapper, .uploaded-image-wrapper {
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
  
  .similarity-header, .comparison-summary {
    margin-bottom: 14px;
  }
  
  .score-display, .score-meter, .score-description, .analysis-details {
    margin-bottom: 14px;
  }
  
  .real-time-status, .progress-container {
    margin-bottom: 12px;
  }
  
  .analysis-steps {
    margin-bottom: 10px;
  }
}

/* 기본 스타일 보완 */
.similarity-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.similarity-icon.high-score {
  background-color: rgba(46, 204, 113, 0.08);
  color: var(--success, #2ecc71);
  box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
}

.similarity-icon.medium-score {
  background-color: rgba(241, 196, 15, 0.08);
  color: var(--warning, #f39c12);
  box-shadow: 0 0 0 2px rgba(241, 196, 15, 0.2);
}

.similarity-icon.low-score {
  background-color: rgba(231, 76, 60, 0.08);
  color: var(--error, #e74c3c);
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}

.score-value.high-score {
  color: var(--success, #2ecc71);
  animation: score-pulse-high 2s ease-in-out infinite alternate;
}

.score-value.medium-score {
  color: var(--warning, #f39c12);
  animation: score-pulse-medium 2s ease-in-out infinite alternate;
}

.score-value.low-score {
  color: var(--error, #e74c3c);
  animation: score-pulse-low 2s ease-in-out infinite alternate;
}

@keyframes score-pulse-high {
  0% { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 rgba(46, 204, 113, 0.3); }
  100% { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(46, 204, 113, 0.4); }
}

@keyframes score-pulse-medium {
  0% { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 rgba(241, 196, 15, 0.3); }
  100% { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(241, 196, 15, 0.4); }
}

@keyframes score-pulse-low {
  0% { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 rgba(231, 76, 60, 0.3); }
  100% { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(231, 76, 60, 0.4); }
}

.meter-fill.high-score {
  background-color: var(--success, #2ecc71);
}

.meter-fill.medium-score {
  background-color: var(--warning, #f39c12);
}

.meter-fill.low-score {
  background-color: var(--error, #e74c3c);
}

.score-description.high-score::before {
  background-color: var(--success, #2ecc71);
}

.score-description.medium-score::before {
  background-color: var(--warning, #f39c12);
}

.score-description.low-score::before {
  background-color: var(--error, #e74c3c);
}

.score-description::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
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

.openai-badge {
  background-color: #10a37f;
  color: white;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 3px;
}

.btn-primary {
  background-color: var(--primary, #40c996);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: var(--radius-sm, 8px);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast, 0.2s);
  flex: 1;
  max-width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-primary:hover {
  background-color: var(--primary-deep, #267e67);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-dark, #666);
  border: 1px solid var(--border-color, #ddd);
  padding: 12px 20px;
  border-radius: var(--radius-sm, 8px);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast, 0.2s);
  flex: 1;
  max-width: 100px;
}

.btn-secondary:hover {
  background-color: var(--bg-secondary, #f5f5f5);
}

.result-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
}

.ring-background {
  fill: none;
  stroke: #f0f0f0;
  stroke-width: 6;
  stroke-dasharray: 220 220;
  stroke-dashoffset: 0;
}

.ring-progress {
  fill: none;
  stroke-width: 6;
  stroke-dasharray: 220 220;
  stroke-dashoffset: 220;
  transition: stroke-dasharray 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
              stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ring-progress-animation 1.5s ease-out forwards;
}

@keyframes ring-progress-animation {
  from {
    stroke-dashoffset: 220;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.ring-progress.high-score {
  stroke: var(--success, #2ecc71);
  filter: drop-shadow(0 0 6px rgba(46, 204, 113, 0.4));
}

.ring-progress.medium-score {
  stroke: var(--warning, #f39c12);
  filter: drop-shadow(0 0 6px rgba(241, 196, 15, 0.4));
}

.ring-progress.low-score {
  stroke: var(--error, #e74c3c);
  filter: drop-shadow(0 0 6px rgba(231, 76, 60, 0.4));
}

.result-icon {
  padding: 4px;
  box-shadow: 0 1px 6px rgba(102, 126, 234, 0.3);
}

.ring-background, .ring-progress {
  stroke-width: 4;
}
</style> 