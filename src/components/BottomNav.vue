<template>
  <div class="bottom-nav">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ active: currentRoute === item.path }"
    >
      <div class="nav-icon">
        <!-- 현재 경로에 따라 Outline / Filled 컴포넌트 토글 -->
        <component
          :is="currentRoute === item.path ? item.activeIcon : item.icon"
          class="svg-icon"
        />
      </div>
      <span>{{ item.label }}</span>
    </router-link>
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
          path: "/",
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
};
</script>
