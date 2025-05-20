<template>
  <div class="profile-edit-page">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-back">
        <router-link to="/mypage" class="icon-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
              fill="currentColor"
            />
          </svg>
        </router-link>
      </div>
      <div class="header-title">프로필 수정</div>
      <div class="header-action"></div>
    </div>

    <div class="profile-edit-container">
      <div class="profile-header">
        <div class="profile-avatar">
          <img :src="userData.profileUrl" alt="프로필 이미지" />
        </div>
      </div>

      <form @submit.prevent="handleProfileEdit" class="profile-edit-form">
        <div class="form-group">
          {{ userData.email }}
        </div>
        <div class="form-group">
          <input
            id="nickname"
            type="text"
            v-model="nickname"
            :placeholder="userData.nickname"
            required
          />
        </div>
        <button type="submit" class="btn btn-profile-edit">수정 완료</button>
      </form>
    </div>
  </div>
</template>

<script>
import { getMyInfo } from "@/api/auth";

export default {
  name: "ProfileEdit",
  data() {
    return {
      userData: {
        email: "",
        nickname: "",
        profileUrl: "",
      },
    };
  },
  async mounted() {
    await this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await getMyInfo();
        const data = response.data.data;
        this.userData.email = data.email;
        this.userData.nickname = data.nickname;
        this.userData.profileUrl = data.profileUrl;
      } catch (err) {
        console.error("유저 정보 불러오기 실패", err);
        alert("마이페이지 정보를 불러오는 데 실패했습니다.");
      }
    },
  },
};
</script>

<style scoped>
.profile-header {
  display: flex;
  padding: var(--spacing-md);
  justify-content: center;
}
.profile-avatar {
  width: 150px;
  height: 150px;
}

.profile-edit-form {
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

.btn-profile-edit {
  width: 100%;
  height: 48px;
  border-radius: 0;
}
</style>
