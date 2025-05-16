import axios from "axios";

// (1) 백엔드 서버 기본 URL 설정 (포트가 다르다면 환경변수 또는 직접 URL 기입)
axios.defaults.baseURL =
  process.env.VUE_APP_API_BASE_URL || "http://localhost:8081";

if (process.env.NODE_ENV === "production") {
  axios.defaults.baseURL =
    process.env.VUE_APP_API_BASE_URL || "http://localhost:8081";
} else {
  axios.defaults.baseURL = "";
}

// 요청 시 JWT 헤더 자동 첨부
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답에서 401 발생 시 토큰 갱신 시도
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post("/api/auth/refresh", {
          refreshToken,
        });
        // 새 액세스 토큰 저장
        localStorage.setItem("jwtToken", data.data.accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.data.accessToken}`;
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data.data.accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        // 갱신 실패 시 로그아웃
        localStorage.clear();
        window.location.href = "/signin";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
