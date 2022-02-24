<template>
  <div class="meta-description">
    <input type="text" id="description" class="description-input" :value="description" placeholder="gift from the gods" @input="$emit('onChanged', $event)" />
  </div>
</template>

<script>
export default {
  name: "MetaDescription",
  props: {
    description: {
      type: String,
      default: "banger bout crypto...",
    },
  },
}
</script>

<style lang="scss">
</style>
