<template>
  <Transition name="modal">
    <div v-if="show" class="modal-likers-mask">
      <div class="modal-likers-wrapper">
        <div class="modal-likers-container">
          <div class="noLikesDiv" v-if="!likedAddressesArray[0]">
            no likes yet.
          </div>
          <div
            class="likers-list"
            v-for="(item, index) in likedAddressesArray"
            :key="index"
          >
            <tr>
              <span class="singleLine">
                <router-link
                  :to="`/user/${item}`"
                  @click="$emit('close')"
                  exact
                >
                  <div>
                    <img
                      :src="getAvatar(item.toLowerCase())"
                      class="round-image-likers"
                    />
                  </div>
                </router-link>
                <div class="likerItem">
                  {{ item.substring(0, 4) }}...{{ item.slice(-4) }}
                </div>
              </span>
            </tr>
          </div>
          <span class="closeOut">
            <div class="modal-likers-footer">
              <button
                class="modal-likers-default-button"
                @click="$emit('close')"
              >
                x
              </button>
            </div>
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { provide } from "vue";
import { Notyf } from "notyf";
import { useRebelStore } from "@src/store/index";
import { storeToRefs } from "pinia";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";

export default {
  name: "LikersModal",
  emits: ["close"],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: Number,
      default: 0,
    },
  },
  components: {},
  data() {
    return {
      componentKey: 0,
      stateLoaded: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getAddressesWhoLiked();
    });
  },
  methods: {
    async getAddressesWhoLiked() {
      const { likersOfPost } = useRebelStore();
      await likersOfPost(this.postId);
      this.stateLoaded = true;
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

    const rebelStore = useRebelStore();
    const { likedAddressesArray } = storeToRefs(rebelStore);

    const getAvatar = (address) => {
      let svgAvatar = createAvatar(style, {
        seed: address,
        scale: 80,
        translateY: -3,
      });

      let blob = new Blob([svgAvatar], { type: "image/svg+xml" });
      let url = URL.createObjectURL(blob);
      return url;
    };

    provide("notyf", NotfyProvider);

    return {
      likedAddressesArray,
      getAvatar,
    };
  },
};
</script>

<style>
.addressLineItem {
  display: flex;
  align-items: center;
  justify-content: center;
}

.noLikesDiv {
  margin-top: 80%;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.likers-list {
  display: grid;
  overflow-y: auto;
}

.closeOut {
  display: flex;
}

.singleLine {
  display: flex;
  margin-top: 5%;
  margin-left: 5%;
}

.likerItem {
  padding-top: 10px;
  padding-left: 20px;
  width: 120px;
  display: flex;
  color: white;
  font-size: 12px;
  text-decoration: none;
}

.modal-likers-mask {
  position: fixed;
  z-index: 9999998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-likers-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-likers-container {
  width: 200px;
  height: 60%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: var(--gradient-800);
  border-radius: 7%;
  transition: all 0.3s ease;
}

.modal-likers-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-likers-body {
  margin: 20px 0;
}

.modal-likers-footer {
  display: flex;
}

.modal-likers-default-button {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  z-index: 9999;
  cursor: pointer;
  position: absolute;
  top: 70px;
  right: 37%;
  padding-bottom: 3px;
  background-image: var(--liniear-gradient-color-2);
}

@media only screen and (max-width: 1150px) {
  .modal-likers-default-button {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    z-index: 9999;
    cursor: pointer;
    position: absolute;
    top: 70px;
    right: 33%;
    padding-bottom: 3px;
    background-image: var(--liniear-gradient-color-2);
  }
}

@media only screen and (max-width: 815px) {
  .modal-likers-default-button {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    z-index: 9999;
    cursor: pointer;
    position: absolute;
    top: 70px;
    right: 30%;
    padding-bottom: 3px;
    background-image: var(--liniear-gradient-color-2);
  }
}

@media only screen and (max-width: 650px) {
  .modal-likers-default-button {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    z-index: 9999;
    cursor: pointer;
    position: absolute;
    top: 70px;
    right: 25%;
    padding-bottom: 3px;
    background-image: var(--liniear-gradient-color-2);
  }
}

@media only screen and (max-width: 430px) {
  .modal-likers-default-button {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    z-index: 9999;
    cursor: pointer;
    position: absolute;
    top: 70px;
    right: 10%;
    padding-bottom: 3px;
    background-image: var(--liniear-gradient-color-2);
  }
}

.modal-likers-enter-from {
  opacity: 0;
}

.modal-likers-leave-to {
  opacity: 0;
}

.modal-likers-enter-from .modal-likers-container,
.modal-likers-leave-to .modal-likers-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.round-image-likers {
  object-fit: cover;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--liniear-gradient-color-2);
}
</style>
