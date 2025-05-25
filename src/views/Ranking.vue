<template>
  <div class="ranking">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-back">
        <router-link to="/" class="icon-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
              fill="currentColor"
            />
          </svg>
        </router-link>
      </div>
      <div class="header-title">최고의 탐험</div>
      <div class="header-action"></div>
    </div>

    <!-- 랭킹 선택 버튼 -->
    <div class="ranking-buttons">
      <button :class="{ active: period === 7 }" @click="fetchRanking(7)">
        주간
      </button>
      <button :class="{ active: period === 30 }" @click="fetchRanking(30)">
        월간
      </button>
      <button :class="{ active: period === 365 }" @click="fetchRanking(365)">
        연간
      </button>
    </div>

    <!-- 랭킹 콘텐츠 -->
    <div class="best-content" v-if="ranking.length">
      <div class="top1" @click="openModal(ranking[0])">
        <img :src="ranking[0].imageUrl" class="top-image" />
        <div class="top1-svg">
          <svg viewBox="21 10 58 80" version="1.1" x="0px" y="0px">
            <g>
              <path
                fill="#40c996"
                d="M 63.685547 60.091797 C 62.74316 60.201642 61.917517 60.353219 61.369141 60.619141 C 60.114463 61.227566 58.475144 63.194932 56.748047 65.169922 C 55.020952 67.144912 53.024248 69.335297 50.083984 69.341797 C 47.143712 69.348269 45.136862 67.166576 43.400391 65.199219 C 41.663919 63.231864 40.015287 61.272886 38.757812 60.669922 C 38.287862 60.444579 37.596659 60.310062 36.828125 60.205078 A 1.5001501 1.5001501 0 0 0 36.564453 61.052734 L 36.564453 88.5 A 1.5001501 1.5001501 0 0 0 39.125 89.560547 L 50.259766 78.410156 L 61.394531 89.560547 A 1.5001501 1.5001501 0 0 0 63.955078 88.5 L 63.955078 60.949219 A 1.5001501 1.5001501 0 0 0 63.685547 60.091797 z "
              />
              <path
                fill="#40c996"
                d="M 60.095703 10.013672 C 58.066192 10.133349 56.191747 11.038286 54.427734 11.814453 C 52.663722 12.59062 51.0112 13.224247 49.958984 13.226562 C 48.676343 13.229363 46.528042 12.262435 44.302734 11.324219 C 42.077427 10.386002 39.541545 9.3792305 37.105469 10.560547 C 34.66949 11.741814 33.886707 14.356078 33.242188 16.685547 C 32.597665 19.015016 32.023053 21.303473 31.224609 22.310547 C 30.426061 23.317753 28.332654 24.397174 26.212891 25.554688 C 24.093127 26.712201 21.726772 28.069881 21.130859 30.710938 C 20.534961 33.351928 22.087025 35.596018 23.503906 37.552734 C 24.920787 39.509451 26.349983 41.382927 26.638672 42.636719 C 26.927382 43.890601 26.462848 46.20318 26.044922 48.583984 C 25.626996 50.964788 25.211059 53.663294 26.902344 55.777344 C 28.593453 57.891182 31.315113 58.074028 33.726562 58.185547 C 36.138013 58.297066 38.492752 58.351159 39.650391 58.90625 C 40.808055 59.461353 42.325189 61.264974 43.923828 63.076172 C 45.522468 64.88737 47.371236 66.89463 50.078125 66.888672 C 52.785007 66.882672 54.622882 64.867054 56.212891 63.048828 C 57.802899 61.230602 59.311708 59.419507 60.466797 58.859375 C 61.621764 58.299302 63.975239 58.237095 66.386719 58.115234 C 68.798199 57.993374 71.521122 57.797285 73.203125 55.675781 C 74.885084 53.554332 74.457576 50.85947 74.029297 48.480469 C 73.601017 46.101468 73.126945 43.790342 73.410156 42.535156 C 73.693385 41.2799 75.113539 39.398811 76.521484 37.435547 C 77.92943 35.472283 79.470739 33.222206 78.863281 30.583984 C 78.2558 27.9457 75.884361 26.597468 73.759766 25.449219 C 71.635171 24.300969 69.537406 23.230332 68.734375 22.226562 C 67.931365 21.222825 67.346435 18.939483 66.691406 16.613281 C 66.036377 14.28708 65.241693 11.67433 62.800781 10.503906 C 62.191479 10.211744 61.547239 10.061708 60.916016 10.017578 C 60.640654 9.9983271 60.366589 9.9976739 60.095703 10.013672 z M 56.304688 21.142578 A 2.0002 2.0002 0 0 1 56.308594 21.142578 C 57.74495 21.156208 59.040068 22.060992 59.548828 23.404297 C 59.504018 23.285962 59.719275 23.769348 59.871094 24.308594 C 60.349633 26.008363 60.499376 27.309305 61.478516 28.533203 C 62.457342 29.756709 63.69113 30.18441 65.244141 31.023438 C 65.755829 31.299878 66.211536 31.643714 66.074219 31.552734 L 66.074219 31.550781 C 67.609496 32.567093 68.091977 34.659263 67.158203 36.246094 A 2.0002 2.0002 0 0 0 67.15625 36.246094 C 67.21731 36.142545 66.972992 36.620581 66.640625 37.083984 C 65.611628 38.518674 64.689067 39.444186 64.34375 40.974609 C 63.998674 42.503988 64.43334 43.74384 64.746094 45.480469 C 64.846316 46.036885 64.862616 46.556856 64.853516 46.455078 A 2.0002 2.0002 0 0 0 64.853516 46.457031 C 65.015248 48.292203 63.679751 49.973555 61.855469 50.230469 C 62.004335 50.209559 61.458941 50.320529 60.882812 50.349609 C 59.117401 50.438729 57.819642 50.29402 56.412109 50.976562 C 55.004675 51.659062 54.312452 52.768493 53.148438 54.099609 C 52.770406 54.531909 52.34599 54.893379 52.457031 54.787109 C 51.122037 56.064717 48.966751 56.069342 47.626953 54.796875 C 47.704233 54.870325 47.308823 54.534166 46.9375 54.113281 C 45.769971 52.789928 45.070255 51.682944 43.658203 51.005859 C 42.246539 50.328964 40.949509 50.477764 39.185547 50.396484 C 38.618155 50.370344 38.092335 50.268706 38.212891 50.285156 A 2.0002 2.0002 0 0 0 38.210938 50.285156 C 36.385021 50.034846 35.043156 48.357858 35.199219 46.521484 C 35.188839 46.644127 35.204019 46.105524 35.302734 45.542969 C 35.607887 43.804955 36.037467 42.565529 35.685547 41.037109 C 35.333555 39.508402 34.406389 38.586406 33.371094 37.15625 C 33.03814 36.696305 32.792304 36.224969 32.851562 36.324219 C 31.90764 34.741151 32.38154 32.64504 33.914062 31.621094 C 33.797866 31.698734 34.237168 31.36645 34.740234 31.091797 C 36.286851 30.247418 37.520006 29.810706 38.494141 28.582031 C 39.468376 27.353232 39.613084 26.052782 40.083984 24.351562 C 40.23486 23.806483 40.447043 23.324281 40.408203 23.427734 C 41.057902 21.701266 42.995083 20.763847 44.751953 21.326172 C 44.59039 21.274452 45.14053 21.415842 45.673828 21.640625 C 47.30025 22.326145 48.409811 23.019125 49.974609 23.015625 C 51.541529 23.012225 52.648412 22.314747 54.269531 21.623047 C 54.859587 21.371284 55.424927 21.248254 55.341797 21.271484 C 55.654829 21.184524 55.979808 21.140278 56.304688 21.142578 z "
              />
              <path
                fill="#ffe500"
                d="m 55.972656,25.261719 c -0.03663,0.01411 -0.06587,0.01163 -0.134765,0.04102 -1.172353,0.50022 -3.112151,1.706891 -5.853516,1.712891 -2.742648,0.0061 -4.689559,-1.194741 -5.863281,-1.689453 -0.05437,-0.02292 -0.101626,-0.03089 -0.134766,-0.04297 -0.01219,0.03724 -0.03254,0.07593 -0.04883,0.134766 -0.340376,1.229675 -0.605035,3.499747 -2.308594,5.648437 -1.703353,2.148438 -3.854123,2.926444 -4.972656,3.53711 -0.05475,0.02989 -0.08816,0.06005 -0.121094,0.08008 0.0218,0.03336 0.03898,0.07558 0.07617,0.126953 0.747087,1.032024 2.355171,2.654857 2.970703,5.328125 0.615458,2.672987 -0.119304,4.839614 -0.339843,6.095703 -0.01097,0.06241 -0.0088,0.109037 -0.01367,0.148437 0.0386,0.0036 0.08158,0.01478 0.142578,0.01758 1.272608,0.05864 3.543149,-0.187514 6.015625,0.998047 2.472395,1.185523 3.704987,3.111894 4.548828,4.068359 0.03983,0.04515 0.07466,0.06982 0.101562,0.09766 0.02523,-0.02625 0.06234,-0.05281 0.101563,-0.09766 0.839,-0.959444 2.060976,-2.892894 4.529297,-4.089844 2.468282,-1.196933 4.742199,-0.957294 6.013672,-1.021484 0.06041,-0.0031 0.106028,-0.01583 0.142578,-0.01953 -0.0052,-0.03979 -0.0026,-0.08514 -0.01367,-0.146485 -0.226096,-1.255429 -0.970931,-3.41991 -0.367188,-6.095703 0.603636,-2.675275 2.202722,-4.306433 2.945313,-5.341797 0.03704,-0.05165 0.05443,-0.09523 0.07617,-0.128906 -0.03117,-0.01893 -0.06769,-0.05123 -0.121094,-0.08008 -1.121107,-0.605688 -3.275186,-1.370397 -4.988281,-3.511719 -1.712975,-2.141172 -1.988104,-4.410105 -2.333985,-5.638672 -0.01607,-0.05709 -0.03711,-0.09555 -0.04883,-0.130859 z"
              />
            </g>
          </svg>
        </div>
        <div class="ranking-wrapper">
          <div class="ranking-meta">
            <div
              class="ranking-favorite"
              @click.stop="toggleFavorite(ranking[0])"
            >
              {{ isFavorited(ranking[0].boardId) ? "💗" : "🤍" }}
              {{ ranking[0].favoriteCount }}
            </div>
            <div class="ranking-similarity">
              🍀 {{ Math.floor(ranking[0].similarityScore * 100 ?? 0) }}
            </div>
          </div>
          <div class="ranking-title">{{ ranking[0].title }}</div>
        </div>
      </div>

      <div class="grid">
        <div
          v-for="(item, index) in ranking.slice(1, 10)"
          :key="item.boardId"
          class="grid-item"
          @click="openModal(item)"
        >
          <img :src="item.imageUrl" />
          <div class="ranking-wrapper">
            <div class="ranking-meta">
              <div class="ranking-favorite" @click.stop="toggleFavorite(item)">
                {{ isFavorited(item.boardId) ? "💗" : "🤍" }}
                {{ item.favoriteCount }}
              </div>
              <div class="ranking-similarity">
                🍀 {{ Math.floor(item.similarityScore * 100 ?? 0) }}
              </div>
            </div>
            <div class="ranking-title">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="selectedPhoto" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <img
          class="modal-img completed"
          :src="selectedPhoto.imageUrl"
          :alt="selectedPhoto.title"
        />
        <div class="modal-wrapper">
          <div
            class="modal-favorites"
            @click.stop="toggleFavorite(selectedPhoto)"
          >
            {{ isFavorited(selectedPhoto.boardId) ? "💗" : "🤍" }}
            {{ selectedPhoto.favoriteCount }}
          </div>
          <div class="modal-points">
            🍀 {{ Math.floor((selectedPhoto.similarityScore || 0) * 100) }}
          </div>
        </div>
        <div class="modal-title">{{ selectedPhoto.title }}</div>
        <div class="modal-description">
          <img :src="selectedPhoto.profileUrl" class="modal-avatar" />
          <div class="modal-info-wrapper">
            <div class="modal-nickname">{{ selectedPhoto.nickname }}</div>
            <div class="modal-info">
              <div class="modal-member">
                {{ formattedDate(selectedPhoto.createdAt) }}
              </div>
              <div class="modal-place">{{ selectedPhoto.placeName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRankingBoards } from "@/api/board";
import { getMyInfo } from "@/api/auth";
import {
  getAllFavorites,
  createFavorite,
  deleteFavorite,
} from "@/api/favorite";

export default {
  name: "Ranking",
  data() {
    return {
      period: 7,
      ranking: [],
      selectedPhoto: null,
      savedScrollY: 0,
      memberId: null,
      myFavorites: [],
    };
  },
  async mounted() {
    try {
      const [userRes, favRes, boardRes] = await Promise.all([
        getMyInfo(),
        getAllFavorites(),
        getRankingBoards(this.period),
      ]);

      this.memberId = userRes.data?.data?.memberId;

      this.myFavorites =
        favRes.data?.data?.filter((f) => f.memberId === this.memberId) || [];

      this.ranking = boardRes.data?.data || [];
    } catch (e) {
      console.error("초기 데이터 로딩 실패:", e);
    }
  },
  methods: {
    async fetchRanking(days) {
      this.period = days;
      try {
        const res = await getRankingBoards(days);
        this.ranking = res.data?.data || [];
      } catch (err) {
        console.error("랭킹 불러오기 실패:", err);
      }
    },
    openModal(photo) {
      this.savedScrollY = window.scrollY;
      this.selectedPhoto = photo;
      document.body.style.position = "fixed";
      document.body.style.top = `-${this.savedScrollY}px`;
      document.body.style.overflowY = "scroll";
      document.body.style.width = "100%";
    },
    closeModal() {
      this.selectedPhoto = null;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflowY = "";
      document.body.style.width = "";
      window.scrollTo(0, this.savedScrollY);
    },
    formattedDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    isFavorited(boardId) {
      return this.myFavorites.some((f) => f.boardId === boardId);
    },
    async toggleFavorite(photo) {
      const target = this.myFavorites.find((f) => f.boardId === photo.boardId);
      try {
        if (target) {
          await deleteFavorite(target.favoriteId);
          this.myFavorites = this.myFavorites.filter(
            (f) => f.favoriteId !== target.favoriteId
          );
          photo.favoriteCount--;
        } else {
          const res = await createFavorite({
            boardId: photo.boardId,
            memberId: this.memberId,
          });
          this.myFavorites.push(res.data.data);
          photo.favoriteCount++;
        }
      } catch (err) {
        console.error("좋아요 처리 실패:", err);
      }
    },
  },
};
</script>

<style scoped>
.ranking-buttons {
  display: flex;
  justify-content: center;
  padding-bottom: var(--spacing-md);
}

.ranking-buttons button {
  width: 100%;
  border-radius: 0;
  background: var(--bg-secondary);
  color: var(--text-dark);
}

.ranking-buttons button.active {
  background: var(--primary);
  color: var(--text-deep-light);
}

.top1 {
  cursor: pointer;
  position: relative;
}

.top-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.top1-svg {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
}

.ranking-wrapper {
  padding: 0 8px 16px 8px;
  box-sizing: border-box;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  min-width: 0;
  cursor: pointer;
}

.grid-item img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.ranking-meta {
  font-size: 12px;
  display: flex;
  gap: 10px;
}

.ranking-favorite {
  color: var(--tertiary);
}

.ranking-similarity {
  color: var(--primary);
}

.ranking-title {
  width: 100%;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
