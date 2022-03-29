<template>
  <div class="testing">
  </div>
</template>

<script>
import AppHeader from "@src/components/AppHeader.vue";
import { storeToRefs } from "pinia";
import { useRebelStore } from "@src/store/index";
import router from "@src/router";

export default {
  name: "ConnectWallet",
  components: {
    AppHeader
  },
  data() {
    return {
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
    },
  },
  setup() {

    return {
    };
  },
};
</script>

<style lang="scss">

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
