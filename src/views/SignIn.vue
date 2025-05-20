<template>
  <div class="sign-in-page">
    <div class="sign-in-container">
      <router-link to="/main" class="header-title">
        trea
        <IconLogo class="logo-svg" />
        ure
      </router-link>

      <!-- 기존 이메일/비밀번호 로그인 -->
      <form @submit.prevent="handleSignIn" class="sign-in-form">
        <div class="form-group">
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="이메일"
            required
          />
        </div>
        <div class="form-group">
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="비밀번호"
            required
          />
        </div>
        <button type="submit" class="btn btn-sign-in">로그인</button>

        <div class="sign-in-footer">
          아직 회원이 아니신가요?
          <router-link to="/signup" class="signup">회원가입</router-link>
        </div>

        <!-- 소셜 로그인 -->
        <div class="social-login">
          <button class="btn-sns kakao" @click="loginWithKakao">
            카카오 로그인
          </button>
          <button class="btn-sns naver" @click="loginWithNaver">
            네이버 로그인
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import axios from "axios";
import IconLogo from "@/components/icons/IconLogo.vue";

export default {
  name: "SignIn",
  components: { IconLogo },
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
        const res = await axios.post("/api/auth/signin", {
          email: this.email,
          password: this.password,
        });
        // ApiResponseDto<String> 구조: { data: "<accessToken>" }
        const token = res.data.data;
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
.header-title {
  font-family: "Gloria Hallelujah", cursive;
  font-size: 60px;
  display: flex;
  justify-content: center;
  margin: 100px 0 60px;
  text-decoration: none;
}

.logo-svg {
  color: var(--primary);
  width: 100px;
  height: 100px;
}

.header-title:hover .logo-svg {
  color: var(--text-deep-dark);
}

.sign-in-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.form-group {
  width: 100%;
}

.form-group input {
  width: 100%;
  height: 48px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border: 1px solid var(--primary);
  outline: none;
  color: var(--primary);
}

.form-group input::placeholder {
  color: var(--primary);
}

.btn-sign-in {
  width: 100%;
  height: 48px;
  border-radius: 0;
}

.sign-in-footer {
  text-align: center;
  margin-top: var(--spacing-md);
}

.signup {
  color: var(--primary);
  text-decoration: none;
}

.signup:hover {
  text-decoration: underline;
}

.social-login {
  width: 100%;
  display: flex;
  gap: 20px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-sns {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 0;
  font-weight: bold;
  cursor: pointer;
}

.btn-sns:hover {
  filter: brightness(0.7);
}

.btn-sns.kakao {
  background: #fee500;
  color: #3c1e1e;
}

.btn-sns.naver {
  background: #03c75a;
  color: #fff;
}
</style>
