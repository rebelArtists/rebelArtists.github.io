<template>
  <div v-if="!account && $route.name != 'about'" class="testing">
    <AppHeader />
    <div class="divConnect">
      <a v-if="!account" class="testButton" @click="fireConnectWallet">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        connect wallet
      </a>
    </div>
  </div>
  <div v-if="$route.name == 'about' && !this.ready">
    <AppHeader />
    <div></div>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.name" :ready="true" />
      </keep-alive>
    </router-view>
    <ReloadPrompt />
  </div>
  <div v-if="account && this.ready">
    <AppHeader />
    <div></div>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.name" />
      </keep-alive>
    </router-view>
    <ReloadPrompt />
  </div>
</template>

<script>
import AppHeader from "@src/components/AppHeader.vue";
import ReloadPrompt from "@src/components/ReloadPrompt.vue";
import { storeToRefs } from "pinia";
import { useRebelStore } from "@src/store/index";
import { provide } from "vue";
import { Notyf } from "notyf";
import router from "@src/router";

export default {
  name: "App",
  components: {
    AppHeader,
    ReloadPrompt,
  },
  data() {
    return {
      componentKey: 0,
      ready: false,
    };
  },
  methods: {
    async fireConnectWallet() {
      const { connectWallet } = useRebelStore();
      const rebelStore = useRebelStore();
      const { account } = storeToRefs(rebelStore);
      await connectWallet();
      if (this.$route.fullPath == "/") {
        router.push({ path: `/user/${account.value}` });
      }
      this.ready = true;
    },
  },
  setup() {
    const rebelStore = useRebelStore();
    const { connectWallet } = useRebelStore();
    const { account, user } = storeToRefs(rebelStore);

    const NotfyProvider = new Notyf({
      duration: 2000,
      position: {
        x: "center",
        y: "bottom",
      },
      types: [
        {
          type: "loading",
          background: "orange",
          duration: 0,
          dismissible: true,
          icon: {
            className: "icon icon-loading",
            tagName: "i",
          },
        },
      ],
    });

    provide("notyf", NotfyProvider);

    return {
      connectWallet,
      account,
      user,
    };
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: "Rebel";
  src: local("RebelNew"), url(./fonts/Rebel/RebelNew.ttf) format("truetype");
}

.bottomMargin {
  margin-bottom: 50px;
}

div.testing {
  background: var(--landing-gradient);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  height: 100%;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.divConnect {
  position: relative;
  display: flex;
  justify-content: center;
  vertical-align: center;
  margin-top: 125px;
}

.testButton {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  width: 150px;
  text-align: center;
  color: var(--icon-color);
  text-decoration: none;
  text-transform: uppercase;
  transition: 0.5s;
  letter-spacing: 4px;
  overflow: hidden;
}
.testButton:hover {
  background: var(--icon-color);
  color: var(--icon-color-opposite);
  cursor: pointer;
}
.testButton:nth-child(1) {
  filter: hue-rotate(270deg);
}
.testButton:nth-child(2) {
  filter: hue-rotate(110deg);
}
.testButton span {
  position: absolute;
  display: block;
}
.testButton span:nth-child(1) {
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--icon-color);
  animation: animate1 1s linear infinite;
}
@keyframes animate1 {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}
.testButton span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: var(--icon-color);
  animation: animate2 1s linear infinite;
  animation-delay: 0.25s;
}
@keyframes animate2 {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}
.testButton span:nth-child(3) {
  bottom: 0;
  right: 0;
  width: 100%;
  height: 2px;
  background: var(--icon-color);
  animation: animate3 1s linear infinite;
  animation-delay: 0.5s;
}
@keyframes animate3 {
  0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
}

.testButton span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: var(--icon-color);
  animation: animate4 1s linear infinite;
  animation-delay: 0.75s;
}
@keyframes animate4 {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}
</style>
