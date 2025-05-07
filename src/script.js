/**
 * 이미지 에러 핸들링을 위한 Vue 믹스인
 */
export const ImageErrorMixin = {
  mounted() {
    // 컴포넌트 내의 모든 이미지를 찾음
    const images = this.$el.querySelectorAll('img');
    
    // 각 이미지에 에러 핸들러 추가
    images.forEach(img => {
      img.addEventListener('error', function() {
        // 에러 클래스 추가
        this.classList.add('error');
        
        // 깨진 이미지 아이콘 방지를 위해 src와 srcset 제거
        this.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
        if (this.hasAttribute('srcset')) {
          this.removeAttribute('srcset');
        }
        
        // alt 텍스트가 없으면 빈 값 설정
        if (!this.hasAttribute('alt') || this.getAttribute('alt') === "") {
          this.setAttribute('alt', ' ');
        }
        
        // 랭킹 페이지의 이미지일 경우 특별 처리
        const isInRankingPage = 
          this.closest('.best-photo') || 
          this.closest('.photo-image') || 
          this.closest('.weekly-best');
          
        if (isInRankingPage) {
          const container = this.closest('.photo-image') || this.parentElement;
          if (container) {
            container.classList.add('empty-image');
          }
        }
      });
    });
  }
}

/**
 * 이미지 업로드 핸들링을 위한 Vue 믹스인
 */
export const FileUploadMixin = {
  methods: {
    handleFileUpload(event, selector = '.upload-box') {
      const files = event.target.files;
      if (files.length > 0) {
        const fileName = files[0].name;
        const uploadBox = this.$el.querySelector(selector);
        if (uploadBox) {
          const textElement = uploadBox.querySelector('p');
          if (textElement) {
            textElement.textContent = `${fileName} 선택됨`;
          }
          uploadBox.classList.add('file-selected');
        }
      }
    }
  }
}

/**
 * 카카오맵 핸들링을 위한 믹스인
 */
export const KakaoMapMixin = {
  data() {
    return {
      map: null,
      circle: null,
      marker: null
    };
  },
  methods: {
    initMap(mapContainer) {
      // 카카오맵 API가 로드되어 있는지 확인
      if (typeof window.kakao === 'undefined' || typeof window.kakao.maps === 'undefined') {
        console.error('카카오맵 API가 로드되지 않았습니다.');
        return;
      }

      // 기본 위치 - 서울 시청
      const defaultPosition = new window.kakao.maps.LatLng(37.5665, 126.9780);
      
      // 지도 옵션
      const mapOption = { 
        center: defaultPosition,
        level: 3  // 확대 레벨 (낮을수록 확대)
      };
      
      // 지도 생성
      this.map = new window.kakao.maps.Map(mapContainer, mapOption);
      
      // 위치 정보 가져오기 시도
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          // 위치 정보 가져오기 성공 시
          (position) => {
            // 현재 위치 좌표
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const currentPosition = new window.kakao.maps.LatLng(lat, lng);
            
            // 지도 중심 이동
            this.map.setCenter(currentPosition);
            
            // 현재 위치 마커 생성
            this.marker = new window.kakao.maps.Marker({
              position: currentPosition,
              map: this.map
            });
            
            // 반경 원 생성 및 표시
            this.displayCircle(currentPosition);
            
            console.log('현재 위치 기반 지도 표시 완료');
          },
          // 위치 정보 가져오기 실패 시
          (error) => {
            console.error('위치 정보를 가져오는데 실패했습니다:', error);
            
            // 기본 위치로 지도 표시
            this.displayDefaultMap(defaultPosition);
          }
        );
      } else {
        // 위치 정보 지원하지 않는 경우
        console.error('Geolocation이 지원되지 않는 브라우저입니다.');
        
        // 기본 위치로 지도 표시
        this.displayDefaultMap(defaultPosition);
      }
    },
    
    // 기본 위치로 지도 표시 함수
    displayDefaultMap(defaultPosition) {
      if (!this.map || !window.kakao) return;
      
      // 지도 중심 설정
      this.map.setCenter(defaultPosition);
      
      // 기본 위치 마커 생성
      this.marker = new window.kakao.maps.Marker({
        position: defaultPosition,
        map: this.map
      });
      
      // 반경 원 생성 및 표시
      this.displayCircle(defaultPosition);
    },
    
    // 특정 좌표에 반경 원 표시 함수
    displayCircle(position) {
      if (!this.map || !window.kakao) return;
      
      // 반경 원 스타일 정의
      const circleOptions = {
        radius: 100,           // 미터 단위 반경
        strokeWeight: 4,       // 선의 두께 (더 두껍게)
        strokeColor: '#8B6E4E',// 선의 색상 (갈색)
        strokeOpacity: 1,      // 선의 불투명도 (완전 불투명)
        strokeStyle: 'dashed', // 선의 스타일
        fillColor: '#D9A566',  // 채우기 색상 (황금빛)
        fillOpacity: 0.6       // 채우기 불투명도 (더 진하게)
      };
      
      // 기존 원 삭제 (있는 경우)
      if (this.circle) {
        this.circle.setMap(null);
      }
      
      // 반경 원 생성
      this.circle = new window.kakao.maps.Circle(Object.assign({
        center: position,
        map: this.map
      }, circleOptions));
      
      console.log('반경 표시 완료:', position);
    }
  }
} 