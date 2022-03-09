<template>
  <div class="meta-profname">
    <div class="profname-span">
      <span>Username:</span>
    </div>
    <input
      type="text"
      id="profname"
      class="profname-input"
      :value="profname"
      placeholder="satoshi dogemoto"
      @input="$emit('on-changed', $event)"
    />
  </div>
</template>

<script>
export default {
  name: "ProfileName",
  emits: ["on-changed"],
  props: {
    profname: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss">
.meta-profname {
  padding-left: 20px;
  padding-top: 15px;
  padding-bottom: 10px;
}

.profname-span {
  padding-bottom: 10px;
  font-size: 13px;
}

.profname-input {
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
