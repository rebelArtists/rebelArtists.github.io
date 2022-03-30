<template>
  <div class="meta-description">
    <div class="description-span">
      <span>Description</span>
      <span v-if="!this.valid" class="warningText">
        (alphanumeric between 3-90 characters)
      </span>
      <span v-if="this.valid" class="successfulText"> ✓ </span>
    </div>
    <input
      type="text"
      id="description"
      class="description-input"
      :value="description"
      placeholder="gift from the gods"
      @input="$emit('on-changed', $event)"
    />
  </div>
</template>

<script>
export default {
  name: "MetaDescription",
  emits: ["on-changed"],
  props: {
    description: {
      type: String,
      default: "banger bout crypto...",
    },
    valid: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.meta-description {
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 10px;
}

.description-span {
  padding-bottom: 10px;
  font-size: 13px;
  font-weight: 900;
}

.warningText {
  font-size: 9px;
  color: red;
  font-style: italic;
}

.successfulText {
  font-size: 12px;
  color: green;
}

.description-input {
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
