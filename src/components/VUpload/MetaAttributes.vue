<template>
  <div class="meta-attributes">
    <div class="attributes-span">
      <span>Attributes:</span>
    </div>
    <input type="text" id="attributes" class="attributes-input" :value="attributes" placeholder='[{"trait_type": "Type","value": "Single"},...]' @input="$emit('onChanged', $event)" />
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

.meta-attributes{
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.attributes-span {
  padding-bottom: 5px;
  font-size: 13px;
}

.attributes-input {
  width: 90%;
  outline: none;
  border: none;
  padding: 0.8rem 0.8rem 0.8rem 0.8rem;
  border-radius: 0.8rem;
  color: var(--contrast-color);
  background-color: rgba(0, 0, 0, .1);
  transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    background-color: rgba(0, 0, 0, .15);
  }
}
</style>
