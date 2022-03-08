<template>
  <div class="meta-name">
    <div class="name-span">
      <span>Name:</span>
    </div>
    <input
      type="text"
      id="name"
      class="name-input"
      :value="name"
      placeholder="my single"
      @input="$emit('onChanged', $event)"
    />
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
};
</script>

<style lang="scss">
.meta-name {
  padding-left: 20px;
  padding-top: 15px;
  padding-bottom: 10px;
}

.name-span {
  padding-bottom: 10px;
  font-size: 13px;
}

.name-input {
  width: 90%;
  font-size: 11px;
  outline: none;
  border: none;
  padding: 0.8rem 0.8rem 0.8rem 0.8rem;
  border-radius: 0.8rem;
  color: var(--contrast-color);
  background-color: rgba(0, 0, 0, 0.1);
  transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    background-color: rgba(0, 0, 0, 0.15);
  }
}
</style>
