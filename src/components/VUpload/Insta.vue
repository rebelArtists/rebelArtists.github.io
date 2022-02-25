<template>
  <div class="flex flex-col items-center">
    <button v-if="!account" class="buttonConnect" @click="connectWallet">
      Connect Wallet
    </button>
  </div>
</template>

<script>
import { ref } from "vue";
import { storeToRefs } from 'pinia'
import { useInstaStore } from '@src/store/index'

export default {
  name: "InstaTest",
  setup() {
    const instaStore = useInstaStore()
    const { postContent, connectWallet } = useInstaStore()
    const { account } = storeToRefs(instaStore)

    return {
      postContent,
      connectWallet,
      account,
    }
  },
}
</script>

<style lang="scss">
.buttonConnect {
  transition-duration: 0.6s;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 30px;
  padding-left: 30px;
  margin-right: 16px;
}

.buttonConnect:hover {
  background-color: #4CAF50; /* Green */
  color: white;
}
</style>
