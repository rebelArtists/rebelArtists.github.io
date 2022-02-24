<template>
  <div class="meta-name">
    <input type="text" id="name" class="name-input" :value="name" placeholder="my single" @input="$emit('onChanged', $event)" />
  </div>
</template>

<script>
export default {
  name: "MetaName",
  props: {
    name: {
      type: String,
      default: "new dope single",
    },
  },
}
</script>

<style lang="scss">
</style>
