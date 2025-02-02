import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Home from "@/pages/Home.vue";
import About from "@/pages/About.vue";
import Login from "@/pages/Login.vue";
import Swaps from "@/pages/Swaps.vue";
import ChatPage from "@/pages/ChatPage.vue";
import Notifications from "@/pages/Notifications.vue";
import ProfileCompletion from "@/pages/ProfileCompletion.vue";
import HouseDetail from "@/pages/HouseDetail.vue";
import store from "@/store";
import Profile from "@/pages/profile.vue";
import WizardForm from "@/components/WizardForm.vue";
import ChatListPage from "@/pages/ChatList.vue";
import MessageInterfacePage from "@/pages/MessageInterface.vue";
import ForgetPassword from "@/pages/ForgetPassword.vue";
import OtpVerification from "@/pages/OtpVerification.vue";
import ResetPassword from "@/pages/ResetPassword.vue";
import LandingPage from "@/views/LandingPage.vue";

const routes = [
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
    meta: { requiresGuest: true },
  },
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "home",
        component: Home,
        meta: { requiresAuth: true },
      },
      {
        path: "wizardForm",
        component: WizardForm,
        meta: { requiresGuest: true },
      },
      {
        path: "about",
        component: About,
      },
      {
        path: "login",
        component: Login,
        meta: { requiresGuest: true },
      },
      {
        path: "register",
        component: WizardForm,
        meta: { requiresGuest: true },
      },
      {
        path: "swaps",
        component: Swaps,
        meta: { requiresAuth: true },
      },
      {
        path: "chatPage",
        component: ChatPage,
        meta: { requiresAuth: true },
      },
      {
        path: "/chatslist",
        name: "ChatListPage",
        component: ChatListPage,
        meta: { requiresAuth: true },
      },
      {
        path: "/chats/:chatId",
        name: "MessageInterfacePage",
        component: MessageInterfacePage,
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        component: Profile,
        meta: { requiresAuth: true },
      },
      {
        path: "notifications",
        component: Notifications,
        meta: { requiresAuth: true },
      },
      {
        path: "profileCompletion",
        name: "ProfileCompletion",
        component: ProfileCompletion,
        meta: { requiresAuth: true },
      },
      {
        path: "/home_ad/:id",
        component: HouseDetail,
        name: "HouseDetail",
        meta: { requiresAuth: false },
      },
      {
        path: "forget-password",
        component: ForgetPassword,
      },
      {
        path: "/otp-verification", // Ensure the path starts with a slash
        name: "OtpVerification",
        component: OtpVerification,
        props: true, // Pass route parameters as props
      },
      {
        path: "reset-password",
        name: "ResetPassword",
        component: ResetPassword,
        props: true,
      },
      {
        path: "/triangle-swap/:house_a/:house_b",
        name: "TriangleSwapPage",
        component: () => import("@/pages/TriangleSwapPage.vue"),
        props: true,
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.token;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ path: "/login" });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next({ path: "/home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
