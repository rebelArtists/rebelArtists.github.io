import { createApp } from "vue";
import { createPinia } from "pinia";
import { isRunningOnPWA } from "@src/services/helpers";

import App from "@src/App.vue";
import router from "@src/router";
import VueSocialSharing from 'vue-social-sharing'
import WaveSurferVue from "wavesurfer.js-vue";

import "@src/styles/styles.scss";
import "notyf/notyf.min.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia).use(router).use(VueSocialSharing).use(WaveSurferVue);

if (isRunningOnPWA()) window.resizeTo(985, 677);

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  document.body.classList.add("dark-theme");
}

app.mount("#app");
