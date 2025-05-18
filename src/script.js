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

        // 반응형 마커 기능
        window.kakao.maps.event.addListener(this.map, "zoom_changed", () => {
          const level = this.map.getLevel();
          this.updateMarkerSizes(level);
          this.updateCircleVisibility(level);
        });

        // 위치 정보 가져오기 시도
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const currentPosition = new window.kakao.maps.LatLng(
                pos.coords.latitude,
                pos.coords.longitude
              );
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
      container.innerHTML = `
        <div>
          <h3 style="margin-bottom:10px;">지도를 로드할 수 없습니다</h3>
          <p>API 불러오기 실패. 인터넷 연결을 확인하세요.</p>
        </div>
      `;
      Object.assign(container.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "#721c24",
        backgroundColor: "#f8f9fa",
      });
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

    displayCircle(position) {
      if (this.circle) this.circle.setMap(null);
      this.circle = new window.kakao.maps.Circle({
        center: position,
        radius: 100,
        strokeWeight: 4,
        strokeColor: "#8B6E4E",
        strokeOpacity: 1,
        strokeStyle: "dashed",
        fillColor: "#D9A566",
        fillOpacity: 0.6,
        map: this.map,
      });
    },

    addPalaceMarkers() {
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
          status: "수행 필요",
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
          status: "완료",
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
          status: "수행 필요",
        },
      ];

      // 각 궁궐에 마커와 반경 추가
      palaces.forEach((palace) => {
        const markerImage = this.createMarkerImage(
          palace.color,
          palace.questCount,
          this.map.getLevel()
        );
        const marker = new window.kakao.maps.Marker({
          position: palace.position,
          image: markerImage,
          map: this.map,
          zIndex: 3,
          clickable: true,
        });

        this.palaceMarkers.push({ marker, palace });
        this.addPalaceCircle(palace.position, palace.color, palace.status);

        window.kakao.maps.event.addListener(marker, "click", () => {
          this.map.setCenter(palace.position);
          this.map.setLevel(3);
          const event = new CustomEvent("palaceSelected", {
            detail: { palace },
          });
          window.dispatchEvent(event);
        });
      });
    },

    updateCircleVisibility(level) {
      const hiddenLevels = [7, 8, 9, 10, 11, 12, 13, 14];

      this.palaceCircles.forEach((circle) => {
        if (hiddenLevels.includes(level)) {
          circle.setMap(null); // 지도에서 제거
        } else {
          circle.setMap(this.map); // 다시 표시
        }
      });
    },

    updateMarkerSizes(level) {
      const sizeMap = {
        1: [70, 70],
        2: [60, 60],
        3: [50, 50],
        4: [40, 40],
        5: [35, 35],
        6: [30, 30],
        7: [25, 25],
        8: [20, 20],
        9: [15, 15],
        10: [10, 10],
        11: [8, 8],
        12: [7, 7],
        13: [6, 6],
        14: [5, 5],
      };
      const [width, height] = sizeMap[level] || [24, 28];

      this.palaceMarkers.forEach(({ marker, palace }) => {
        const newImage = this.createMarkerImage(
          palace.color,
          palace.questCount,
          level,
          palace.status
        );
        marker.setImage(newImage);
      });
    },

    createMarkerImage(color, questCount, level = 5, status = "") {
      const sizeMap = {
        1: [70, 70],
        2: [60, 60],
        3: [50, 50],
        4: [40, 40],
        5: [35, 35],
        6: [30, 30],
        7: [25, 25],
        8: [20, 20],
        9: [15, 15],
        10: [10, 10],
        11: [8, 8],
        12: [7, 7],
        13: [6, 6],
        14: [5, 5],
      };
      const [width, height] = sizeMap[level] || [24, 28];

      const svg =
        status === "완료"
          ? `<svg
            xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="12 13 38 36" x="0px" y="0px"
            fill="#40c996" >
          >
            <path d="M21.6335,47.1864C19.7408,45.06,18.2119,42.98,16.735,40.9656a35.467,35.467,0,0,1-3.4943-5.8448c-.61-1.2474-.88-2.5105.4413-3.3226,3.7867-2.3271,4.5627-.1051,6.6209,2.4731,1.22,1.5277,3.019,4.0469,4.1462,5.6386,1.0767,1.52,2.3893-1.2234,2.9133-1.9975,1.8624-2.7511,6.7029-9.4863,8.7032-11.9759,1.899-2.3634,8.0285-8.9844,9.1711-10.0375.9726-.8967,3.0261-2.8635,4.407-1.7785,1.4511,1.14,2.16,3.307,1.14,4.716-1.7764,2.453-4.5667,4.7865-6.4974,7.1222-3.9082,4.728-7.6083,9.8244-11.16,14.8988-1.2069,1.7244-2.9014,4.6125-3.9534,6.4826C27.205,50.8386,25.4765,51.5044,21.6335,47.1864Z" />
          </svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="19 18 50 53" xml:space="preserve" preserveAspectRatio="xMinYMin meet"
            fill="#f07b8a" >
            <path
              d="M61.562,18.717c-12.13,9.172-15.244,13.136-22.515,21.412c-0.896-1.376-2.574-3.281-2.615-3.355  c-1.594-3.662-5.048-6.932-6.256-9.995c-1.255-3.265-3.219-4.724-4.858-4.746c-2.109-0.031-3.678,2.324-2.511,6.25  c0.359,1.203,1.26,2.23,1.744,3.386c2.115,5.036,5.172,10.812,8.615,15.844c-2.599,2.905-6.317,7.052-7.479,10.192  c-0.62,1.677-2.417,2.568-3.177,4.177c-0.563,1.183-2.183,3.114-1.651,4.532c0.333,0.885-2.604,4.083-0.63,4.728  c4.578,1.511,6.041-0.619,7.25-3.932c0.692-1.906,2.905-3.719,4-5.49c1.396-2.276,4.859-5.25,6.738-7.407  c1.74,2.491,3.959,5.792,5.496,7.043c2.025,1.645,4.337,1.614,5.041,4.161c0.558,2.005,4.266,2.979,6.23,3.531  c1.426,0.401,3.27,0.115,5.009-0.333c1.614-0.421,2.412-1.964,2.308-3.525c-0.032-0.469,0.333-1.209,0.292-1.646  c-0.125-1.219,0.078-2.858-0.532-3.369c-0.87-0.735-2.515-0.532-3.656-0.995c-6.62-2.708-10.672-6.88-14.688-11.959  c2.355-2.995,8.219-9.193,11.74-11.953c1.751-1.369,3.489-2.749,5.36-4.03c1.937-1.333,3.744-2.86,5.795-3.986  c3.855-2.119,5.38-4.228,1.725-7.109C66.042,18.378,64.01,18.02,61.562,18.717z"
            />
          </svg>
      `;
      const encoded = btoa(svg);
      const markerImageSrc = `data:image/svg+xml;base64,${encoded}`;
      return new window.kakao.maps.MarkerImage(
        markerImageSrc,
        new window.kakao.maps.Size(width, height),
        { offset: new window.kakao.maps.Point(width / 2, height / 2) }
      );
    },

    // 궁궐 반경 원 표시 함수
    addPalaceCircle(position, color, status) {
      if (!this.map || !window.kakao) return;

      const strokeColor = status === "완료" ? "#40c996" : "#f07b8a";
      const fillColor = status === "완료" ? "#a5f5de" : "#ffc7ce";

      // 반경 원 스타일 정의
      const circleOptions = {
        radius: 250, // 미터 단위 반경
        strokeWeight: 4, // 선의 두께
        strokeColor: strokeColor, // 선 색상
        strokeOpacity: 1, // 선의 불투명도
        strokeStyle: "shortdot", // 점선
        fillColor: fillColor, // 채우기 색상
        fillOpacity: 0.2, // 채우기 불투명도
      };

      // 반경 원 생성
      const circle = new window.kakao.maps.Circle(
        Object.assign(
          {
            center: position,
            radius: 250,
            strokeWeight: 0,
            strokeColor: color,
            strokeOpacity: 0,
            fillColor: color,
            fillOpacity: 0.5,
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
