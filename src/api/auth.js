import axios from "@/plugins/axios";

/**
 * 회원가입
 * @param {{ email: string, password: string, nickname: string }} payload
 */
export function signup(payload) {
  return axios.post("/api/auth/signup", payload);
}

/**
 * 로그인
 * @param {{ email: string, password: string }} payload
 */
export function signin(payload) {
  return axios.post("/api/auth/signin", payload);
}

/**
 * 액세스 토큰 재발급
 * @param {{ refreshToken: string }} payload
 */
export function refreshToken(payload) {
  return axios.post("/api/auth/refresh", payload);
}

/**
 * 로그아웃
 */
export function signout() {
  return axios.post("/api/auth/signout");
}
