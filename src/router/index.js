import { createRouter, createWebHistory } from "vue-router";
import VProfile from "@src/views/VProfile.vue";

// Async Component
const VAbout = () => import("@src/views/VAbout.vue");

// Async Component
const VMint = () => import("@src/views/VMint.vue");

// Async Component
const VGallery = () => import("@src/views/VGallery.vue");

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
}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
