<!-- src/views/SignIn.vue -->
<template>
  <div class="sign-in-page">
    <div class="sign-in-container">
      <h2 class="sign-in-title">로그인</h2>

      <!-- 소셜 로그인 -->
      <div class="social-login">
        <button class="btn-sns kakao" @click="loginWithKakao">
          카카오로 로그인
        </button>
        <button class="btn-sns naver" @click="loginWithNaver">
          네이버로 로그인
        </button>
      </div>

      <hr />

      <!-- 기존 이메일/비밀번호 로그인 -->
      <form @submit.prevent="handleSignIn" class="sign-in-form">
        <div class="form-group">
          <label for="email">이메일</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <button type="submit" class="btn btn-sign-in">로그인</button>
      </form>

      <div class="sign-in-footer">
        <router-link to="/signup">회원가입</router-link>
        <router-link to="/forgot-password">비밀번호 찾기</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import axios from "axios";

export default {
  name: "SignIn",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    // 기존 이메일/비번 로그인
    async handleSignIn() {
      try {
        const { data } = await axios.post("/api/auth/signin", {
          email: this.email,
          password: this.password,
        });
        const token = data.token || data.accessToken;
        // 1. 토큰 저장
        localStorage.setItem("jwtToken", token);
        // refreshToken은 백엔드에서 HttpOnly Cookie로 설정 (프론트에서는 저장 X)

        // 2. 로그인 성공 후 /treasure로 이동
        this.$router.push("/");
      } catch (e) {
        alert(e.response?.data?.message || "로그인 실패");
      }
    },

    // 카카오 OAuth 시작
    loginWithKakao() {
      const { authUrl, clientId, redirectUri } = config.kakao;
      const url = `${authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code`;
      window.location.href = url;
    },
    // 네이버 OAuth 시작
    loginWithNaver() {
      const { authUrl, clientId, redirectUri, state } = config.naver;
      const url = `${authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&state=${state}`;
      window.location.href = url;
    },
  },
};
</script>

<style scoped>
.social-login {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.btn-sns {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
.btn-sns.kakao {
  background: #fee500;
  color: #3c1e1e;
}
.btn-sns.naver {
  background: #03c75a;
}
hr {
  margin: 1rem 0;
  border: none;
  border-top: 1px solid #eee;
}
</style>
