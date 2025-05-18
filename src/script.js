import config from "@/config.js";
import "./assets/css/styles.css";

/**
 * 이미지 에러 핸들링을 위한 Vue 믹스인
 */
export const ImageErrorMixin = {
  mounted() {
    // 컴포넌트 내의 모든 이미지를 찾음
    const images = this.$el.querySelectorAll("img");

    // 각 이미지에 에러 핸들러 추가
    images.forEach((img) => {
      img.addEventListener("error", function () {
        // 에러 클래스 추가
        this.classList.add("error");

        // 깨진 이미지 아이콘 방지를 위해 src와 srcset 제거
        this.setAttribute(
          "src",
          "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        );
        if (this.hasAttribute("srcset")) {
          this.removeAttribute("srcset");
        }

        // alt 텍스트가 없으면 빈 값 설정
        if (!this.hasAttribute("alt") || this.getAttribute("alt") === "") {
          this.setAttribute("alt", " ");
        }

        // 랭킹 페이지의 이미지일 경우 특별 처리
        const isInRankingPage =
          this.closest(".best-photo") ||
          this.closest(".photo-image") ||
          this.closest(".weekly-best");

        if (isInRankingPage) {
          const container = this.closest(".photo-image") || this.parentElement;
          if (container) {
            container.classList.add("empty-image");
          }
        }
      });
    });
  },
};

/**
 * 이미지 업로드 핸들링을 위한 Vue 믹스인
 */
export const FileUploadMixin = {
  methods: {
    handleFileUpload(event, selector = ".upload-box") {
      const files = event.target.files;
      if (files.length > 0) {
        const fileName = files[0].name;
        const uploadBox = this.$el.querySelector(selector);
        if (uploadBox) {
          const textElement = uploadBox.querySelector("p");
          if (textElement) {
            textElement.textContent = `${fileName} 선택됨`;
          }
          uploadBox.classList.add("file-selected");
        }
      }
    },
  },
};

/**
 * 카카오맵 핸들링을 위한 믹스인
 */
export const KakaoMapMixin = {
  data() {
    return {
      map: null,
      circle: null,
      marker: null,
      mapLoadError: false,
      palaceMarkers: [], // 궁궐 마커 배열
      palaceCircles: [], // 궁궐 반경 원 배열
      isMapScriptLoaded: false,
    };
  },
  methods: {
    // 카카오맵 스크립트 동적 로드 함수
    loadKakaoMapScript() {
      return new Promise((resolve, reject) => {
        // 이미 로드되었는지 확인
        if (window.kakao && window.kakao.maps) {
          this.isMapScriptLoaded = true;
          return resolve();
        }

        // API 키 확인
        const apiKey = config.kakaoMap.apiKey;
        if (!apiKey) {
          return reject(new Error("카카오맵 API 키가 설정되지 않았습니다."));
        }

        // 스크립트 엘리먼트 생성
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
        script.async = true;

        // 로드 완료 시 처리
        script.onload = () => {
          // 카카오맵 API 초기화
          window.kakao.maps.load(() => {
            this.isMapScriptLoaded = true;
            resolve();
          });
        };

        // 로드 실패 시 처리
        script.onerror = (e) => {
          reject(new Error("카카오맵 API 로드에 실패했습니다."));
        };

        // 문서에 스크립트 추가
        document.head.appendChild(script);
      });
    },

    async initMap(mapContainer) {
      try {
        // 카카오맵 스크립트 로드
        await this.loadKakaoMapScript();

        // 지도 초기화
        this.initializeKakaoMap(mapContainer);
      } catch (error) {
        console.error("카카오맵 로드 실패:", error);
        this.mapLoadError = true;
        this.showMapLoadError(mapContainer);
      }
    },

    // 실제 지도 초기화 함수
    initializeKakaoMap(mapContainer) {
      try {
        // 기본 위치 - 서울 시청
        const defaultPosition = new window.kakao.maps.LatLng(37.5665, 126.978);

        // 지도 옵션
        const mapOption = {
          center: defaultPosition,
          level: 5, // 확대 레벨 (낮을수록 확대) - 서울 시내가 보이도록 확대 레벨 조정
        };

        // 지도 생성
        this.map = new window.kakao.maps.Map(mapContainer, mapOption);

        // 지도 빈 공간 클릭 시 info-card 제거 이벤트 발생
        window.kakao.maps.event.addListener(this.map, "click", () => {
          const event = new CustomEvent("clearSelectedPalace");
          window.dispatchEvent(event);
        });

        // 지도 확대 축소 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl();
        this.map.addControl(
          zoomControl,
          window.kakao.maps.ControlPosition.RIGHT
        );

        // 경복궁, 창덕궁, 덕수궁 마커 추가
        this.addPalaceMarkers();

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
                map: this.map,
              });

              // 반경 원 생성 및 표시
              this.displayCircle(currentPosition);

              console.log("현재 위치 기반 지도 표시 완료");
            },
            // 위치 정보 가져오기 실패 시
            (error) => {
              console.error("위치 정보를 가져오는데 실패했습니다:", error);

              // 기본 위치로 지도 표시
              this.displayDefaultMap(defaultPosition);
            }
          );
        } else {
          // 위치 정보 지원하지 않는 경우
          console.error("Geolocation이 지원되지 않는 브라우저입니다.");

          // 기본 위치로 지도 표시
          this.displayDefaultMap(defaultPosition);
        }
      } catch (error) {
        this.mapLoadError = true;
        console.error("지도 초기화 중 오류 발생:", error);
        this.showMapLoadError(mapContainer);
      }
    },

    // 지도 로드 오류 메시지 표시
    showMapLoadError(container) {
      if (!container) return;

      // 에러 메시지 컨테이너 스타일 설정
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.justifyContent = "center";
      container.style.textAlign = "center";
      container.style.padding = "20px";
      container.style.backgroundColor = "#f8f9fa";
      container.style.color = "#721c24";
      container.style.height = "100%";
      container.style.boxSizing = "border-box";

      // 에러 메시지 표시
      container.innerHTML = `
        <div>
          <h3 style="margin-bottom: 10px;">지도를 로드할 수 없습니다</h3>
          <p>카카오맵 API를 불러오지 못했습니다.<br>인터넷 연결을 확인하거나 나중에 다시 시도해 주세요.</p>
        </div>
      `;
    },

    // 기본 위치로 지도 표시 함수
    displayDefaultMap(defaultPosition) {
      if (!this.map || !window.kakao) return;

      // 지도 중심 설정
      this.map.setCenter(defaultPosition);

      // 기본 위치 마커 생성
      this.marker = new window.kakao.maps.Marker({
        position: defaultPosition,
        map: this.map,
      });

      // 반경 원 생성 및 표시
      this.displayCircle(defaultPosition);
    },

    // 특정 좌표에 반경 원 표시 함수
    displayCircle(position) {
      if (!this.map || !window.kakao) return;

      // 반경 원 스타일 정의
      const circleOptions = {
        radius: 100, // 미터 단위 반경
        strokeWeight: 4, // 선의 두께 (더 두껍게)
        strokeColor: "#8B6E4E", // 선의 색상 (갈색)
        strokeOpacity: 1, // 선의 불투명도 (완전 불투명)
        strokeStyle: "dashed", // 선의 스타일
        fillColor: "#D9A566", // 채우기 색상 (황금빛)
        fillOpacity: 0.6, // 채우기 불투명도 (더 진하게)
      };

      // 기존 원 삭제 (있는 경우)
      if (this.circle) {
        this.circle.setMap(null);
      }

      // 반경 원 생성
      this.circle = new window.kakao.maps.Circle(
        Object.assign(
          {
            center: position,
            map: this.map,
          },
          circleOptions
        )
      );

      console.log("반경 표시 완료:", position);
    },

    // 경복궁, 창덕궁, 덕수궁 마커 추가 함수
    addPalaceMarkers() {
      if (!this.map || !window.kakao) return;

      // 궁궐 좌표 정보
      const palaces = [
        {
          id: 1,
          name: "경복궁",
          position: new window.kakao.maps.LatLng(37.5789, 126.9769),
          color: "#40c996",
          questCount: 3,
          address: "서울 종로구 사직로 161",
          title: "경복궁 숨겨진 비밀",
          difficulty: 2,
          coins: 250,
          status: "접근 가능",
        },
        {
          id: 3,
          name: "창덕궁",
          position: new window.kakao.maps.LatLng(37.5826, 126.991),
          color: "#7D9D6F", // 초록색 (completed)
          questCount: 2,
          address: "서울 종로구 율곡로 99",
          title: "창덕궁 신비로운 길",
          difficulty: 4,
          coins: 500,
          status: "완료됨",
        },
        {
          id: 2,
          name: "덕수궁",
          position: new window.kakao.maps.LatLng(37.5657, 126.9751),
          color: "#D9A566", // 황금빛 (accent)
          questCount: 4,
          address: "서울 중구 세종대로 99",
          title: "덕수궁 보물 찾기",
          difficulty: 3,
          coins: 350,
          status: "접근 가능",
        },
      ];

      // 각 궁궐에 마커와 반경 추가
      palaces.forEach((palace) => {
        // 카카오맵 공식 마커를 사용하되 커스텀 이미지로 설정
        const markerImageSrc = this.createMarkerImageSrc(
          palace.color,
          palace.questCount
        );
        const markerSize = new window.kakao.maps.Size(36, 40);
        const markerOption = {
          offset: new window.kakao.maps.Point(18, 40), // 마커의 중심점과 꼭지점의 오프셋
        };

        // 마커 이미지 생성
        const markerImage = new window.kakao.maps.MarkerImage(
          markerImageSrc,
          markerSize,
          markerOption
        );

        // 마커 생성 - 카카오맵 공식 마커를 사용하면 지도 확대/축소와 함께 마커 위치가 자동으로 조정됨
        const marker = new window.kakao.maps.Marker({
          position: palace.position,
          image: markerImage,
          map: this.map,
          clickable: true,
          zIndex: 3,
        });

        // 마커 저장
        this.palaceMarkers.push(marker);

        // 반경 원 생성 (투명한 테두리)
        this.addPalaceCircle(palace.position, palace.color);

        // 마커 클릭 이벤트 처리
        window.kakao.maps.event.addListener(marker, "click", () => {
          // 지도 중심 이동
          this.map.setCenter(palace.position);

          // 맵 레벨 조정 (더 확대)
          this.map.setLevel(3);

          // 이벤트 발생 (Vue 컴포넌트에서 처리)
          if (this.$parent && typeof this.$parent.selectPalace === "function") {
            this.$parent.selectPalace(palace);
          } else {
            // 부모 컴포넌트에 selectPalace 메서드가 없는 경우
            console.log(`${palace.name} 마커가 클릭되었습니다.`);

            // 글로벌 이벤트 디스패치
            if (typeof window.dispatchEvent === "function") {
              const event = new CustomEvent("palaceSelected", {
                detail: {
                  palace: palace,
                },
              });
              window.dispatchEvent(event);
            }
          }
        });
      });
    },

    // 마커 이미지를 SVG로 생성하고 DataURL로 반환
    createMarkerImageSrc(color, questCount) {
      // SVG 마커 아이콘 생성
      const svgMarker = `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="19 18 50 53" xml:space="preserve" preserveAspectRatio="xMinYMin meet"
        fill="#f07b8a" >
        <path
          d="M61.562,18.717c-12.13,9.172-15.244,13.136-22.515,21.412c-0.896-1.376-2.574-3.281-2.615-3.355  c-1.594-3.662-5.048-6.932-6.256-9.995c-1.255-3.265-3.219-4.724-4.858-4.746c-2.109-0.031-3.678,2.324-2.511,6.25  c0.359,1.203,1.26,2.23,1.744,3.386c2.115,5.036,5.172,10.812,8.615,15.844c-2.599,2.905-6.317,7.052-7.479,10.192  c-0.62,1.677-2.417,2.568-3.177,4.177c-0.563,1.183-2.183,3.114-1.651,4.532c0.333,0.885-2.604,4.083-0.63,4.728  c4.578,1.511,6.041-0.619,7.25-3.932c0.692-1.906,2.905-3.719,4-5.49c1.396-2.276,4.859-5.25,6.738-7.407  c1.74,2.491,3.959,5.792,5.496,7.043c2.025,1.645,4.337,1.614,5.041,4.161c0.558,2.005,4.266,2.979,6.23,3.531  c1.426,0.401,3.27,0.115,5.009-0.333c1.614-0.421,2.412-1.964,2.308-3.525c-0.032-0.469,0.333-1.209,0.292-1.646  c-0.125-1.219,0.078-2.858-0.532-3.369c-0.87-0.735-2.515-0.532-3.656-0.995c-6.62-2.708-10.672-6.88-14.688-11.959  c2.355-2.995,8.219-9.193,11.74-11.953c1.751-1.369,3.489-2.749,5.36-4.03c1.937-1.333,3.744-2.86,5.795-3.986  c3.855-2.119,5.38-4.228,1.725-7.109C66.042,18.378,64.01,18.02,61.562,18.717z"
        />
      </svg>
      `;

      // SVG를 Base64 인코딩하여 DataURL로 변환
      const encodedSvg = btoa(svgMarker);
      return "data:image/svg+xml;base64," + encodedSvg;
    },

    // 궁궐 반경 원 표시 함수
    addPalaceCircle(position, color) {
      if (!this.map || !window.kakao) return;

      // 반경 원 스타일 정의 (테두리 없음)
      const circleOptions = {
        radius: 250, // 미터 단위 반경
        strokeWeight: 0, // 선의 두께 (0으로 설정하여 테두리 없음)
        strokeColor: color, // 선 색상 (사용되지 않음)
        strokeOpacity: 0, // 선의 불투명도 (0으로 설정)
        fillColor: color, // 채우기 색상
        fillOpacity: 0.6, // 채우기 불투명도 (매우 투명하게)
      };

      // 반경 원 생성
      const circle = new window.kakao.maps.Circle(
        Object.assign(
          {
            center: position,
            map: this.map,
          },
          circleOptions
        )
      );

      // 원 배열에 추가
      this.palaceCircles.push(circle);
    },
  },
};
