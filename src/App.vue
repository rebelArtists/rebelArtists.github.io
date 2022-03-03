<template>
  <AppHeader @postEvent="updateparent" />
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.name"/>
    </keep-alive>
  </router-view>
  <ReloadPrompt />
</template>

<script>
import AppHeader from "@src/components/AppHeader.vue";
import ReloadPrompt from "@src/components/ReloadPrompt.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    ReloadPrompt
  },
  data() {
    return {
      componentKey: 0
    };
  },
  methods: {
    async updateparent(variable) {
      const { getUserByOwner } = useRebelStore()
      console.log("gotEventAtTopLevel")
      this.componentKey += 1;
    }
  },
}
</script>
