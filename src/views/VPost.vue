<template>
  <div v-if="user">User {{ user.profPicHash }}</div>
</template>

<script>
import { provide } from "vue";
import { Notyf } from "notyf";

import PanelUpload from "@src/components/VUpload/PanelUpload.vue";
import PanelResult from "@src/components/VUpload/PanelResult.vue";
import { storeToRefs } from 'pinia'
import { useRebelStore } from '@src/store/index'


export default {
  name: "VPost",
  components: {
  },
  data() {
    return {
      componentKey: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getContent();
    });
  },
  methods: {
    async getContent() {
      const { getPostById } = useRebelStore()
      await getPostById([this.$route.params.id])
    }
  },
  setup() {

    const rebelStore = useRebelStore()
    const { individualPost, user, account } = storeToRefs(rebelStore)

    const NotfyProvider = new Notyf({
      duration: 2000,
      position: {
        x: 'center',
        y: 'bottom'
      },
      types: [
        {
          type: 'loading',
          background: 'orange',
          duration: 0,
          dismissible: true,
          icon: {
            className: 'icon icon-loading',
            tagName: 'i'
          }
        },
      ]
    })

    provide("notyf", NotfyProvider);

    return {
      individualPost,
      user,
      account
    }
  }
}
</script>

<style lang="scss">

</style>
