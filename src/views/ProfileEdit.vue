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
        <ImageUploader
          ref="hiddenUploader"
          class="visually-hidden-uploader"
          :folder="'profile/'"
          :showFolderSelector="false"
          @upload-success="handleImageUpload"
          @upload-start="isUploading = true"
          @upload-end="isUploading = false"
        />
        프로필 사진
        <div class="profile-avatar" @click="triggerUpload">
          <img
            :src="uploadedImageUrl || userData.profileUrl"
            alt="프로필 이미지"
          />
        </div>
        <div v-if="isUploading" class="uploading-message">업로드 중...</div>
      </div>
      <form @submit.prevent="handleProfileEdit" class="profile-edit-form">
        <div class="profile-group">
          <div class="from-label">아이디</div>
          <div class="form-group user-email-container">
            {{ userData.email }}
          </div>
        </div>
        <div class="profile-group">
          <div class="from-label">닉네임</div>
          <div class="form-group">
            <input
              id="nickname"
              type="text"
              v-model="nickname"
              :placeholder="userData.nickname"
            />
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-profile-edit"
          :disabled="isUploading"
        >
          수정 완료
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { getMyInfo, updateMyInfo } from "@/api/auth";
import ImageUploader from "@/components/ImageUploader.vue";

export default {
  name: "ProfileEdit",
  components: {
    ImageUploader,
  },
  data() {
    return {
      userData: {
        email: "",
        nickname: "",
        profileUrl: "",
      },
      nickname: "",
      uploadedImageUrl: "", // 새로 업로드된 이미지 URL
      isUploading: false, // 사진 업로드 중 상태
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
        localStorage.removeItem("jwtToken");
        document.cookie =
          "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        alert("마이페이지 정보를 불러오는 데 실패했습니다.");
        this.$router.push("/signin");
      }
    },
    async handleImageUpload({ original }) {
      this.uploadedImageUrl = original;
    },
    triggerUpload() {
      this.$refs.hiddenUploader?.triggerFileInput();
    },
    async handleProfileEdit() {
      try {
        const payload = {
          nickname: this.nickname || this.userData.nickname,
          profileUrl: this.uploadedImageUrl || this.userData.profileUrl,
        };

        await updateMyInfo(payload);

        alert("프로필이 성공적으로 수정되었습니다.");
        this.$router.push("/mypage");
      } catch (error) {
        console.error("프로필 수정 실패", error);
        alert("프로필 수정 중 오류가 발생했습니다.");
      }
    },
  },
};
</script>

<style scoped>
.profile-header {
  position: relative;
  display: flex;
  padding: var(--spacing-md);
  justify-content: flex-start;
}

.profile-avatar {
  position: relative;
  width: 150px;
  height: 150px;
  cursor: pointer;
}

.uploading-message {
  position: absolute;
  top: 50%;
  left: 60%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: bold;
  color: var(--primary);
  z-index: 10;
}

.profile-edit-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.profile-group {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.from-label {
  width: 50px;
}

.form-group {
  display: flex;
  width: 350px;
}

.user-email-container {
  display: flex;
  align-items: center;
  width: 350px;
  height: 48px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border: 1px solid var(--text-medium);
  outline: none;
  color: var(--text-dark);
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
