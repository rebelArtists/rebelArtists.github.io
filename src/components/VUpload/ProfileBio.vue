<template>
  <div class="meta-profbio">
    <div class="profbio-span">
      <span>Bio:</span>
    </div>
    <input
      type="text"
      id="profbio"
      class="profbio-input"
      :value="profbio"
      placeholder="proud creator of the blockchain"
      @input="$emit('onChanged', $event)"
    />
  </div>
</template>

<script>
export default {
  name: "ProfileBio",
  props: {
    profbio: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss">
.meta-profbio {
  padding-left: 20px;
  padding-top: 15px;
  padding-bottom: 10px;
}

.profbio-span {
  padding-bottom: 10px;
  font-size: 13px;
}

.profbio-input {
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
