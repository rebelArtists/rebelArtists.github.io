<template>
  <div class="meta-attributes">
    <div class="attributes-span">
      <span>Attributes</span>
      <span v-if="!this.valid" class="warningText">
        (given object keys req for each element in array)
      </span>
      <span v-if="this.valid" class="successfulText"> ✓ </span>
    </div>
    <input
      type="text"
      id="attributes"
      class="attributes-input"
      :value="attributes"
      placeholder='[{"trait_type": "Type","value": "Single"}]'
      @input="$emit('on-changed', $event)"
    />
  </div>
</template>

<script>
export default {
  name: "MetaAttributes",
  emits: ["on-changed"],
  props: {
    attributes: {
      type: String,
      default: '[{"trait_type": "Type","value": "Single"}]',
    },
    valid: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.meta-attributes {
  padding-left: 20px;
  padding-top: 5px;
}

.attributes-span {
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

.attributes-input {
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
