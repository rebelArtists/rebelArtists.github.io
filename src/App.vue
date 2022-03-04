<template>
  <AppHeader />
  <div class="divConnect">
    <button v-if="!account" class="buttonConnect" @click="fireConnectWallet">
      connect wallet and enter
    </button>
    <div v-if="!account" class="arrow">
        <span></span>
        <span></span>
        <span></span>
    </div>
  </div>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component v-if="user" :is="Component" :key="$route.name" />
    </keep-alive>
  </router-view>
  <ReloadPrompt />
</template>

<script>
import AppHeader from "@src/components/AppHeader.vue";
import ReloadPrompt from "@src/components/ReloadPrompt.vue";
import { storeToRefs } from 'pinia'
import { useRebelStore } from '@src/store/index'

export default {
  name: "App",
  components: {
    AppHeader,
    ReloadPrompt
  },
  data() {
    return {
      componentKey: 0,
    };
  },
  methods: {
    async fireConnectWallet() {
      const { connectWallet } = useRebelStore()
      const rebelStore = useRebelStore()
      const { user } = storeToRefs(rebelStore)
      await connectWallet();
      this.componentKey += 1;
    },
  },
  setup() {
    const rebelStore = useRebelStore()
    const { connectWallet } = useRebelStore()
    const { account, user } = storeToRefs(rebelStore)

    return {
      connectWallet,
      account,
      user
    }
  }
}
</script>

<style lang="scss">

  .divConnect {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .buttonConnect {
    transition-duration: 0.6s;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 175px;
    padding-left: 70px;
    margin-top: 100px;
    background-image: var(--liniear-gradient-color-1);
  }

  .buttonConnect:hover {
    background-color: #4CAF50; /* Green */
    color: white;
  }

  body{
    margin: 0;
    padding: 0;
    background-color: #000;
  }
  .arrow{
      position: relative;
      padding-top: 15px;
  }
  .arrow span{
      display: block;
      width: 20px;
      height: 20px;
      border-bottom: 5px solid #06A8FF;
      border-right: 5px solid #06A8FF;
      transform: rotate(45deg);
      margin: -24.3px;
      border-color: var(--liniear-gradient-color-2);
      animation: animate 2.6s infinite;
  }
  .arrow span:nth-child(2){
      animation-delay: -0.2s;
  }
  .arrow span:nth-child(3){
      animation-delay: -0.4s;
  }
  @keyframes animate {
      0%{
          opacity: 0;
          transform: rotate(-45deg) translate(-200px,-20px);
      }
      50%{
          opacity: 1;
      }
      100%{
          opacity: 0;
          transform: rotate(-45deg) translate(-100px,75px);
      }
  }

</style>
