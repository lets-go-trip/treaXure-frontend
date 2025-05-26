import axios from "axios";

// 쿠키에서 값을 읽는 유틸리티 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// (1) 백엔드 서버 기본 URL 설정 (포트가 다르다면 환경변수 또는 직접 URL 기입)
if (process.env.NODE_ENV === "production") {
  axios.defaults.baseURL =
    process.env.VUE_APP_API_BASE_URL || "https://treaxure.kro.kr/";
} else {
  // 개발 환경에서는 프록시를 사용하므로 baseURL을 빈 문자열로 설정
  axios.defaults.baseURL = "";
}

// 쿠키 전송을 위한 설정
axios.defaults.withCredentials = true;

// 요청 시 JWT 헤더 자동 첨부
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("JWT 토큰 헤더 추가:", token.substring(0, 20) + "...");
  } else {
    console.log("JWT 토큰이 없습니다.");
  }

  // preflight 요청을 피하기 위해 간단한 헤더만 사용
  config.headers["Content-Type"] = "application/json";

  return config;
});

// 응답에서 401 발생 시 토큰 갱신 시도
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 네트워크 에러나 CORS 에러 처리
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("네트워크 에러 또는 CORS 에러:", error);
      return Promise.reject(error);
    }

    // 리다이렉트 응답 감지 (HTML 응답이 오는 경우)
    if (
      error.response &&
      error.response.headers["content-type"] &&
      error.response.headers["content-type"].includes("text/html")
    ) {
      console.warn(
        "HTML 응답 감지 - 백엔드에서 리다이렉트 시도:",
        error.response.config.url
      );
      // 인증이 필요한 상황으로 처리
      localStorage.clear();
      window.location.href = "/signin";
      return Promise.reject(new Error("Authentication required"));
    }

    const isLoginRequest = originalRequest.url.includes("/api/auth/signin");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest
    ) {
      originalRequest._retry = true;
      try {
        // 쿠키에서만 refresh 토큰 확인 (localStorage 사용 안 함)
        let refreshToken = getCookie("refreshToken");

        if (!refreshToken) {
          console.warn("Refresh 토큰이 쿠키에 없습니다.");
          throw new Error("No refresh token available");
        }

        console.log("토큰 갱신 시도 중...");
        const { data } = await axios.post("/api/auth/refresh", {
          refreshToken,
        });

        console.log("토큰 갱신 응답:", data);

        // 새 토큰 추출
        let newAccessToken = null;
        let newRefreshToken = null;

        if (data.data) {
          if (typeof data.data === "object") {
            newAccessToken = data.data.accessToken || data.data.jwtToken;
            newRefreshToken = data.data.refreshToken;
          } else {
            newAccessToken = data.data;
          }
        } else if (data.accessToken) {
          newAccessToken = data.accessToken;
          newRefreshToken = data.refreshToken;
        }

        if (newAccessToken) {
          // 새 액세스 토큰 저장
          localStorage.setItem("jwtToken", newAccessToken);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // 새 리프레시 토큰이 있다면 저장
          if (newRefreshToken) {
            document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=${
              7 * 24 * 60 * 60
            }; SameSite=Lax`;
            console.log("새 Refresh 토큰 쿠키로 저장됨");
          }

          console.log("토큰 갱신 성공");
          return axios(originalRequest);
        } else {
          throw new Error("새 토큰을 받지 못했습니다.");
        }
      } catch (err) {
        // 갱신 실패 시 로그아웃
        console.error("토큰 갱신 실패:", err);
        localStorage.removeItem("jwtToken");
        // 쿠키 삭제
        document.cookie =
          "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/signin";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
