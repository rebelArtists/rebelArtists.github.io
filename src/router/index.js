import { createRouter, createWebHistory } from "vue-router";

// Async Component
const VAbout = () => import("@src/views/VAbout.vue");

// Async Component
const VConnectWallet = () =>
  import("@src/components/VUpload/ConnectWallet.vue");

// Async Component
const VCrowdsale = () => import("@src/components/VUpload/CrowdsaleComp.vue");

// Async Component
const VPost = () => import("@src/views/VPost.vue");

// Async Component
const VUser = () => import("@src/views/VUser.vue");

// Async Component
const VFeed = () => import("@src/views/VFeed.vue");

const routes = [
  {
    path: "/about",
    name: "about",
    component: VAbout,
  },
  {
    path: "/connect",
    name: "connect",
    component: VConnectWallet,
  },
  {
    path: "/crowdsale",
    name: "crowdsale",
    component: VCrowdsale,
  },
  {
    path: "/",
    name: "home",
    component: VFeed,
  },
  {
    path: "/feed",
    name: "feed",
    component: VFeed,
  },
  {
    path: "/post/:id",
    name: "Post",
    component: VPost,
  },
  {
    path: "/user/:name",
    name: "User",
    component: VUser,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
