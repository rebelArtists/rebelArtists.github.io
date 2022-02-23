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

<template>
  <div class="flex flex-col items-center">
    <button v-if="!account" class="bg-green-300 rounded p-4" @click="connectWallet">
      Connect Wallet
    </button>
  </div>
</template>
