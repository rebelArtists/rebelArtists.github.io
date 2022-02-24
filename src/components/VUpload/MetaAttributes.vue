<template>
  <div class="meta-attributes">
    <textarea v-model="attributes" placeholder='[{"trait_type": "Type","value": "Single"},{"trait_type": "FanClubAccess","value": "True"}]' @input="$emit('onChanged', $event)"></textarea>
  </div>
</template>

<script>
export default {
  name: "MetaAttributes",
  props: {
    attributes: {
      type: Array,
      default: []
    },
  },
}
</script>

<style lang="scss">
</style>
