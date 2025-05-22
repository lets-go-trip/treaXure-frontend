<template>
  <div class="bottom-nav">
    <div
      v-for="item in navItems"
      :key="item.path"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
      @click="handleNavClick(item)"
    >
      <div class="nav-icon">
        <component
          :is="isActive(item.path) ? item.activeIcon : item.icon"
          class="svg-icon"
        />
      </div>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
import IconExploreOutline from "@/components/icons/IconExploreOutline.vue";
import IconExploreFilled from "@/components/icons/IconExploreFilled.vue";
import IconProgressOutline from "@/components/icons/IconProgressOutline.vue";
import IconProgressFilled from "@/components/icons/IconProgressFilled.vue";
import IconRecordsOutline from "@/components/icons/IconRecordsOutline.vue";
import IconRecordsFilled from "@/components/icons/IconRecordsFilled.vue";
import IconRankingOutline from "@/components/icons/IconRankingOutline.vue";
import IconRankingFilled from "@/components/icons/IconRankingFilled.vue";
import IconProfileOutline from "@/components/icons/IconProfileOutline.vue";
import IconProfileFilled from "@/components/icons/IconProfileFilled.vue";

export default {
  name: "BottomNav",
  components: {
    IconExploreOutline,
    IconExploreFilled,
    IconProgressOutline,
    IconProgressFilled,
    IconRecordsOutline,
    IconRecordsFilled,
    IconRankingOutline,
    IconRankingFilled,
    IconProfileOutline,
    IconProfileFilled,
  },
  computed: {
    currentRoute() {
      return this.$route.path;
    },
  },
  data() {
    return {
      navItems: [
        {
          path: "/treasure",
          label: "탐험",
          icon: "IconExploreOutline",
          activeIcon: "IconExploreFilled",
        },
        {
          path: "/mission-list",
          label: "진행",
          icon: "IconProgressOutline",
          activeIcon: "IconProgressFilled",
        },
        {
          path: "/all-missions",
          label: "기록",
          icon: "IconRecordsOutline",
          activeIcon: "IconRecordsFilled",
        },
        {
          path: "/weekly-best",
          label: "랭킹",
          icon: "IconRankingOutline",
          activeIcon: "IconRankingFilled",
        },
        {
          path: "/mypage",
          label: "마이",
          icon: "IconProfileOutline",
          activeIcon: "IconProfileFilled",
        },
      ],
    };
  },
  methods: {
    isActive(path) {
      const route = this.$route.path;

      if (path === "/mission-list") {
        return (
          route.startsWith("/mission-list") ||
          route.startsWith("/mission-detail")
        );
      }

      return route === path || route.startsWith(path + "/");
    },

    handleNavClick(item) {
      if (item.path === "/mission-list") {
        const recentPlaceId = this.getCookie("recentPlaceId");

        if (recentPlaceId) {
          this.$router.push(`/mission-list/${recentPlaceId}`);
        } else {
          alert("현재 미션을 진행 중인 장소가 없습니다.");
          this.$router.back();
        }
      } else {
        this.$router.push(item.path);
      }
    },

    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    },
  },
};
</script>
