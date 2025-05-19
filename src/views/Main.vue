<template>
  <div class="main-page">
    <div class="main-container">
      <router-link to="/signin" class="header-title">
        trea
        <component :is="currentLogo" class="logo-svg" />
        ure
      </router-link>
    </div>
    <div class="main-content">
      Welcome to
      <p class="main-content-h">Seoul</p>
      It's time to
      <p class="main-content-h">hunt</p>
    </div>
    <div class="main-footer">
      <router-link to="/signin" class="signin">시작하기</router-link>
    </div>
  </div>
</template>

<script>
import IconLogo from "@/components/icons/IconLogo.vue";
import IconLogo1 from "@/components/icons/IconLogo1.vue";
import IconLogo2 from "@/components/icons/IconLogo2.vue";
import IconLogo3 from "@/components/icons/IconLogo3.vue";
import IconLogo4 from "@/components/icons/IconLogo4.vue";
import IconLogo5 from "@/components/icons/IconLogo5.vue";
import IconLogo6 from "@/components/icons/IconLogo6.vue";
import IconLogo7 from "@/components/icons/IconLogo7.vue";
import IconLogo8 from "@/components/icons/IconLogo8.vue";
import IconLogo9 from "@/components/icons/IconLogo9.vue";
import IconLogo10 from "@/components/icons/IconLogo10.vue";

export default {
  name: "MainPage",
  components: {
    IconLogo,
    IconLogo1,
    IconLogo2,
    IconLogo3,
    IconLogo4,
    IconLogo5,
    IconLogo6,
    IconLogo7,
    IconLogo8,
    IconLogo9,
    IconLogo10,
  },
  data() {
    return {
      // 사용할 로고 컴포넌트 목록
      logos: [
        "IconLogo",
        "IconLogo1",
        "IconLogo2",
        "IconLogo3",
        "IconLogo4",
        "IconLogo5",
        "IconLogo6",
        "IconLogo7",
        "IconLogo8",
        "IconLogo9",
        "IconLogo10",
      ],
      currentIndex: 0,
      intervalId: null,
    };
  },
  computed: {
    currentLogo() {
      // components 옵션에 등록된 이름으로 참조
      return this.logos[this.currentIndex];
    },
  },
  mounted() {
    // 2초마다 인덱스 갱신 (원하는 속도로 변경 가능)
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.logos.length;
    }, 500);
  },
  beforeUnmount() {
    // 컴포넌트 제거 시 인터벌 클리어
    clearInterval(this.intervalId);
  },
};
</script>

<style scoped>
.main-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header-title {
  font-family: "Gloria Hallelujah", cursive;
  font-size: 60px;
  display: flex;
  justify-content: center;
  margin: 100px 0 60px;
  text-decoration: none;
}

.logo-svg {
  color: var(--text-deep-dark);
  width: 100px;
  height: 100px;
}

.main-content {
  font-family: "Gloria Hallelujah", cursive;
  font-size: 30px;
}

.main-footer {
  padding: 20px;
  margin-bottom: 100px;
}

.signin {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--text-deep-dark);
  color: var(--text-deep-light);
  text-decoration: none;
  /* border-radius: 0; */
}

.signin:hover {
  background-color: var(--primary);
}
</style>
