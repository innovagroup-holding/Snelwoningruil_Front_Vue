<template>
  <nav
    v-if="shouldShowBottomNav"
    class="bottom-nav-bar fixed bottom-0 left-0 w-full bg-white shadow-lg flex justify-around items-center z-40"
  >
    <router-link
      :to="{ path: '/home', query: { tab: 'houses' } }"
      class="nav-item"
      active-class="active"
      @click.native="handleNavItemClick('/home')"
    >
      <div class="icon-text">
        <i class="fas fa-home"></i>
        <span class="font-small">{{ $t("bottomNav.home") }}</span>
      </div>
    </router-link>
    <router-link
      to="/swaps"
      class="nav-item"
      active-class="active"
      @click.native="handleNavItemClick('/swaps')"
    >
      <div class="icon-text">
        <i class="fas fa-exchange-alt"></i>
        <span class="font-small">{{ $t("bottomNav.swaps") }}</span>
      </div>
    </router-link>
    <router-link
      :to="isMobile ? '/chatslist' : '/chatPage'"
      class="nav-item relative"
      active-class="active"
      @click.native="handleNavItemClick(isMobile ? '/chatslist' : '/chatPage')"
    >
      <div class="icon-text">
        <i class="fas fa-comments"></i>
        <span class="font-small">{{ $t("bottomNav.chats") }}</span>
        <!-- Red Dot Indicator for New Messages -->
        <span
          v-if="hasNewMessage"
          class="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 message-dot"
        ></span>
      </div>
    </router-link>
    <button @click="handleMenuClick" class="nav-item sidebar">
      <div class="icon-text">
        <i class="fas fa-bars"></i>
        <span class="font-small">{{ $t("bottomNav.menu") }}</span>
      </div>
    </button>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "BottomNavBar",
  props: {
    isSidebarVisible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const store = useStore(); // Access the Vuex store
    const isMobile = ref(window.innerWidth <= 768);

    // Watch for window resize to update mobile state
    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    const hiddenRoutesOnMobile = ["/login", "/register", "/anotherRoute"];
    const dynamicRoutePattern = /^\/house\/\d+$/;

    const shouldShowBottomNav = computed(() => {
      if (hiddenRoutesOnMobile.includes(route.path)) {
        return false;
      }
      if (dynamicRoutePattern.test(route.path)) {
        return false;
      }
      return true;
    });

    const toggleSidebar = () => {
      emit("toggle-sidebar");
    };

    const handleNavItemClick = (routePath) => {
      if (props.isSidebarVisible) {
        toggleSidebar();
      } else {
        router.push(routePath);
      }

      // Reset the red dot if navigating to the messages page
      if (routePath === "/chatPage" || routePath === "/chatslist") {
        store.commit("resetMessageNotification"); // Correctly commit the mutation
      }
    };

    const handleMenuClick = () => {
      toggleSidebar();
    };

    onMounted(() => {
      window.addEventListener("resize", checkScreenSize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkScreenSize);
    });

    return {
      isMobile,
      shouldShowBottomNav,
      handleNavItemClick,
      handleMenuClick,
      hasNewMessage: computed(() => store.getters.hasNewMessage), // Correctly access the getter
    };
  },
};
</script>

<style scoped>
.bottom-nav-bar {
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 24px;
  position: relative;
  color: gray;
}

.icon-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.icon-text i {
  font-size: 20px;
}

.icon-text span {
  margin-top: 4px;
}

.active {
  color: #1c592f;
  font-weight: bold;
}

.active::before {
  content: "";
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 4px;
  background-color: #1c592f;
  border-radius: 4px;
}

.hover-color:hover {
  color: #1c592f;
}

.message-dot {
  top: 0;
  right: 0;
}
</style>
