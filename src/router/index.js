import { createRouter, createWebHistory } from "vue-router";
import VUpload from "@src/views/VUpload.vue";

// Async Component
const VAbout = () => import("@src/views/VAbout.vue");

// Async Component
const VMint = () => import("@src/views/VMint.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: VUpload
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
