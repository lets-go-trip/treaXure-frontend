<template>
  <div class="sign-in-page">
    <div class="sign-in-container">
      <h2 class="sign-in-title">로그인</h2>
      <form @submit.prevent="handleSignIn" class="sign-in-form">
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
        <button type="submit" class="btn btn-sign-in">로그인</button>
      </form>
      <div class="sign-in-footer">
        <router-link to="/signup">계정이 없으신가요? 회원가입</router-link>
        <router-link to="/forgot-password">비밀번호 찾기</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleSignIn() {
      try {
        const { data } = await this.$axios.post("/api/auth/signin", {
          email: this.email,
          password: this.password,
        });
        // JWT 토큰 로컬에 저장
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        this.$router.push("/");
      } catch (error) {
        console.error("로그인 실패:", error);
        alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      }
    },
  },
};
</script>

<style scoped>
.sign-in-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 65px); /* 하단 nav 높이 제외 */
  background-color: var(--bg-secondary);
}

.sign-in-container {
  width: 100%;
  max-width: 360px;
  padding: var(--spacing-lg);
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.sign-in-title {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  font-size: 24px;
  font-weight: 600;
  color: var(--text-deep-dark);
}

.sign-in-form .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-md);
}

.sign-in-form label {
  margin-bottom: var(--spacing-xs);
  font-size: 14px;
  color: var(--text-dark);
}

.sign-in-form input {
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 14px;
  outline: none;
}

.sign-in-form input:focus {
  border-color: var(--primary);
}

.btn-sign-in {
  width: 100%;
  padding: var(--spacing-sm) 0;
  font-size: 16px;
  font-weight: 500;
  margin-top: var(--spacing-sm);
}

.sign-in-footer {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-md);
  font-size: 13px;
}

.sign-in-footer a {
  color: var(--primary);
  text-decoration: none;
}

.sign-in-footer a:hover {
  text-decoration: underline;
}
</style>
