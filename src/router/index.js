import { createRouter, createWebHistory } from "vue-router";
import VProfile from "@src/views/VProfile.vue";

// Async Component
const VAbout = () => import("@src/views/VAbout.vue");

// Async Component
const VMint = () => import("@src/views/VMint.vue");

// Async Component
const VGallery = () => import("@src/views/VGallery.vue");

// Async Component
const VPost = () => import("@src/views/VPost.vue");

// Async Component
const VUser = () => import("@src/views/VUser.vue");

// Async Component
const VFeed = () => import("@src/views/VFeed.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: VProfile
  },
  {
    path: "/about",
    name: "about",
    component: VAbout
  },
  {
    path: "/mint",
    name: "mint",
    component: VMint
  },
  {
    path: "/gallery",
    name: "gallery",
    component: VGallery
  },
  {
    path: "/feed",
    name: "feed",
    component: VFeed
  },
  {
      path: '/post/:id',
      name: 'Post',
      component: VPost,
  },
  {
      path: '/user/:name',
      name: 'User',
      component: VUser,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
