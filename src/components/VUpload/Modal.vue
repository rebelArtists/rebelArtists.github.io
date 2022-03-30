<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <PanelUpload @post-event="updateparent" />
          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="$emit('close')">
                x
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import PanelUpload from "@src/components/VUpload/PanelUpload.vue";
import { provide } from "vue";
import { Notyf } from "notyf";
import { useRebelStore } from "@src/store/index";
import { storeToRefs } from "pinia";

export default {
  name: "UploadModal",
  emits: ["close"],
  props: {
    show: Boolean,
  },
  components: {
    PanelUpload,
  },
  data() {
    return {
      componentKey: 0,
    };
  },
  methods: {
    async updateparent() {
      const { getUserByOwner } = useRebelStore();
      const rebelStore = useRebelStore();
      const { account } = storeToRefs(rebelStore);
      await getUserByOwner(account._rawValue);
      this.$emit("close");
      this.componentKey += 1;
    },
  },
  setup() {
    const NotfyProvider = new Notyf({
      duration: 2000,
      position: {
        x: "center",
        y: "bottom",
      },
      types: [
        {
          type: "loading",
          background: "orange",
          duration: 0,
          dismissible: true,
          icon: {
            className: "icon icon-loading",
            tagName: "i",
          },
        },
      ],
    });

    provide("notyf", NotfyProvider);
  },
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 20000000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 45%;
  height: 70%;
  margin: 0px auto;
  padding: 20px 30px;
  border-radius: 2px;
  transition: all 0.3s ease;
}

@media only screen and (max-width: 815px) {
  .modal-container {
    width: 80%;
    height: 70%;
    margin: 0px auto;
    padding: 20px 30px;
    border-radius: 2px;
    transition: all 0.3s ease;
  }
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  z-index: 9999;
  cursor: pointer;
  display: flex;
  margin-top: 10px;
  padding-bottom: 3px;
  justify-content: center;
  align-items: center;
  background-image: var(--liniear-gradient-color-2);
}

.modal-default-button {
  float: right;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
