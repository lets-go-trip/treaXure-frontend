import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/styles.css'
import config from './config'

// 카카오맵 API 감지 함수
function detectKakaoMapsAPI() {
  return new Promise((resolve) => {
    // 이미 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      console.log('카카오맵 API가 이미 로드되어 있습니다.');
      return resolve(true);
    }
    
    // 로드될 때까지 기다림 (최대 5초)
    let checkCount = 0;
    const interval = setInterval(() => {
      checkCount++;
      
      if (window.kakao && window.kakao.maps) {
        clearInterval(interval);
        console.log('카카오맵 API가 감지되었습니다.');
        return resolve(true);
      }
      
      // 5초(50 * 100ms) 후에 타임아웃
      if (checkCount > 50) {
        clearInterval(interval);
        console.warn('카카오맵 API를 찾을 수 없습니다.');
        return resolve(false);
      }
    }, 100);
  });
}

// 앱 생성
const app = createApp(App);
app.use(store);
app.use(router);

// 카카오맵 API 감지 후 앱 마운트
detectKakaoMapsAPI()
  .then((isKakaoMapLoaded) => {
    // 로드 결과를 글로벌 변수에 저장
    window.kakaoMapLoadFailed = !isKakaoMapLoaded;
    
    if (isKakaoMapLoaded) {
      console.log('카카오맵 API 로드 성공, 앱 마운트 진행');
    } else {
      console.warn('카카오맵 API 로드 실패, 앱은 계속 마운트됩니다');
    }
    
    // 앱 마운트
    app.mount('#app');
  }); 