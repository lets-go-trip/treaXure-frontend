<template>
  <div class="sign-up-page">
    <div class="sign-up-container">
      <h2 class="sign-up-title">회원가입</h2>
      <form @submit.prevent="handleSignUp" class="sign-up-form">
        <div class="form-group">
          <label for="email">이메일</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="이메일을 입력하세요"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
        </div>
        <div class="form-group">
          <label for="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            v-model="nickname"
            placeholder="닉네임을 입력하세요"
            required
          />
        </div>
        <button type="submit" class="btn btn-sign-up">회원가입</button>
      </form>
      <div class="sign-up-footer">
        <router-link to="/signin">이미 계정이 있으신가요? 로그인</router-link>
      </div>
    </div>
  </div>
</template>

<script>
// axios를 import하고, 프록시가 설정된 상대 경로로 요청합니다
import axios from "axios";

export default {
  name: "SignUp",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      nickname: "",
    };
  },
  methods: {
    async handleSignUp() {
      if (this.password !== this.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      try {
        // /api는 vue.config.js의 devServer.proxy에 의해 localhost:8081로 프록시 됩니다
        const { data } = await axios.post("/api/auth/signup", {
          email: this.email,
          password: this.password,
          nickname: this.nickname,
        });

        alert(data.message || "회원가입이 완료되었습니다.");
        this.$router.push("/signin");
      } catch (error) {
        console.error("회원가입 실패:", error);
        const msg =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "회원가입 중 오류가 발생했습니다.";
        alert(msg);
      }
    },
  },
};
</script>

<style scoped>
.sign-up-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 65px);
  background-color: var(--bg-secondary);
}

.sign-up-container {
  width: 100%;
  max-width: 360px;
  padding: var(--spacing-lg);
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.sign-up-title {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  font-size: 24px;
  font-weight: 600;
  color: var(--text-deep-dark);
}

.sign-up-form .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-md);
}

.sign-up-form label {
  margin-bottom: var(--spacing-xs);
  font-size: 14px;
  color: var(--text-dark);
}

.sign-up-form input {
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 14px;
  outline: none;
}

.sign-up-form input:focus {
  border-color: var(--primary);
}

.btn-sign-up {
  width: 100%;
  padding: var(--spacing-sm) 0;
  font-size: 16px;
  font-weight: 500;
  margin-top: var(--spacing-sm);
}

.sign-up-footer {
  text-align: center;
  margin-top: var(--spacing-md);
  font-size: 13px;
}

.sign-up-footer a {
  color: var(--primary);
  text-decoration: none;
}

.sign-up-footer a:hover {
  text-decoration: underline;
}
</style>
