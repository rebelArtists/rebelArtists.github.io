<template>
  <div class="meta-description">
    <div class="description-span">
      <span>Description:</span>
    </div>
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

.meta-description {
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.description-span {
  padding-bottom: 5px;
  font-size: 13px;
}

.description-input {
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
