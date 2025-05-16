import axios from "axios";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(null, async (error) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const rt = localStorage.getItem("refreshToken");
      const { data } = await axios.post("/api/auth/refresh-token", {
        refreshToken: rt,
      });
      localStorage.setItem("jwtToken", data.accessToken);
      // refreshToken은 그대로 사용 (토큰 회전 시 새로 저장)
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;
      originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
      return axios(originalRequest);
    } catch (_) {
      // 리프레시 실패 시 로그아웃
      localStorage.clear();
      window.location.href = "/signin";
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
});
