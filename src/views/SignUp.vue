<template>
  <div class="sign-up-page">
    <div class="sign-up-container">
      <router-link to="/main" class="header-title">
        trea
        <IconLogo class="logo-svg" />
        ure
      </router-link>
      <form @submit.prevent="handleSignUp" class="sign-up-form">
        <div class="form-group">
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="이메일"
            required
          />
        </div>
        <div class="form-group">
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="비밀번호"
            required
          />
        </div>
        <div class="form-group">
          <input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            placeholder="비밀번호 확인"
            required
          />
        </div>
        <div class="form-group">
          <input
            id="nickname"
            type="text"
            v-model="nickname"
            placeholder="닉네임"
            required
          />
        </div>
        <button type="submit" class="btn btn-sign-up">회원가입</button>
        <div class="sign-up-footer">
          이미 계정이 있으신가요?
          <router-link to="/signin" class="signin">로그인</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import IconLogo from "@/components/icons/IconLogo.vue";

export default {
  name: "SignUp",
  components: { IconLogo },
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
.header-title {
  font-family: "Gloria Hallelujah", cursive;
  font-size: 60px;
  display: flex;
  justify-content: center;
  margin: 100px 0 60px;
  text-decoration: none;
}

.logo-svg {
  width: 100px;
  height: 100px;
}

.header-title:hover .logo-svg {
  color: var(--text-deep-dark);
}

.sign-up-form {
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

.btn-sign-up {
  width: 100%;
  height: 48px;
  border-radius: 0;
}

.sign-up-footer {
  text-align: center;
  margin-top: var(--spacing-md);
}

.sign-up-footer a {
  color: var(--primary);
  text-decoration: none;
}

.sign-up-footer a:hover {
  text-decoration: underline;
}
</style>
