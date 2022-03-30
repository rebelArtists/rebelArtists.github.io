<template>
  <div v-if="this.stateLoaded">
    <div
      class="container"
      v-if="!postedItems[0] && account == this.$route.params.name"
    >
      <div class="bg"></div>
      <button class="modalButton" id="show-modal" @click="showModal = true">
        +
      </button>
      <Teleport to="body">
        <UploadModal :show="showModal" @close="showModal = false">
          <template #header>
            <h3>custom header</h3>
          </template>
        </UploadModal>
      </Teleport>
    </div>

    <div
      class="container"
      v-if="!postedItems[0] && account != this.$route.params.name"
    >
      no posts yet.
    </div>

    <div class="wrapperGallery">
      <div
        class="gallery-panel"
        v-for="(item, index) in postedItems"
        :key="index"
      >
        <div class="media-wrap-gallery">
          <MDBCard class="card-style hover-overlay">
            <router-link :to="`/post/${item.id}`" active-class="active" exact>
              <figure class="figureClass">
                <video
                  v-if="item.mediaType == 'video'"
                  class="card-img-style-gallery"
                  controls
                  controlsList="nodownload"
                >
                  <source :src="getCloudinaryUrlVideo(item.mediaHash)" />
                </video>
                <div class="audioCardGallery" v-if="item.mediaType == 'audio'">
                  <wavesurfer
                    :src="getCloudinaryUrlVideo(item.mediaHash)"
                    :options="waveformOptions"
                  ></wavesurfer>
                </div>
                <MDBCardImg
                  v-if="item.mediaType == 'image'"
                  :src="getCloudinaryUrlImage(item.mediaHash)"
                  top
                  hover
                  alt="..."
                  class="card-img-style-gallery"
                />
              </figure>
            </router-link>
            <MDBCardBody class="card-body">
              <MDBCardText class="cardName"> {{ item.name }} </MDBCardText>
              <MDBCardText>
                <a
                  class="likesHover"
                  @click="(showLikersModal = true), (idToCheck = item.id)"
                >
                  {{ item.likes }} likes
                </a>

                <Teleport
                  v-if="showLikersModal && idToCheck == item.id"
                  to="body"
                >
                  <LikersModal
                    :show="showLikersModal"
                    :postId="item.id"
                    @close="showLikersModal = false"
                  >
                  </LikersModal>
                </Teleport>

                <div v-if="!likedArray[index]" id="favoriting">
                  <ToggleFavorite :id="item.id" @like-event="updateparent" />
                </div>
                <div v-if="likedArray[index]" id="favoriting">
                  <ToggleFavorite
                    :id="item.id"
                    :intialFavorited="true"
                    @like-event="updateparent"
                  />
                </div>
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isVideo } from "@src/services/helpers";

import { MDBCard, MDBCardBody, MDBCardText, MDBCardImg } from "mdb-vue-ui-kit";
import { useRebelStore } from "@src/store/index";
import { storeToRefs } from "pinia";
import ToggleFavorite from "@src/components/VUpload/ToggleFavorite.vue";
import UploadModal from "@src/components/VUpload/Modal.vue";
import LikersModal from "@src/components/VUpload/LikersModal.vue";
import {
  getCloudinaryUrlImage,
  getCloudinaryUrlVideo,
} from "@src/services/helpers";

export default {
  name: "UserGallery",
  emits: ["like-event"],
  components: {
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardImg,
    ToggleFavorite,
    LikersModal,
    UploadModal,
  },
  data() {
    return {
      componentKey: 0,
      showModal: false,
      showLikersModal: false,
      stateLoaded: false,
      idToCheck: null,
      waveformOptions: {
        backend: "MediaElement",
        mediaControls: true,
        interact: false,
        barWidth: 2,
        responsive: true,
        height: 195,
        hideScrollbar: true,
        cursorWidth: 0,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.checkIsLiked();
    });
  },
  methods: {
    async checkIsLiked() {
      const { isLiked, getPostsByOwner } = useRebelStore();
      const rebelStore = useRebelStore();
      const { postsArray } = storeToRefs(rebelStore);
      if (this.$route.params.name) {
        await getPostsByOwner(this.$route.params.name);
        await isLiked(postsArray._rawValue);
      }
      this.stateLoaded = true;
    },
    async updateparent() {
      this.checkIsLiked();
      this.componentKey += 1;
      this.$emit("like-event", true);
    },
  },
  watch: {
    $route(to, from) {
      if (to !== from) {
        this.checkIsLiked();
      }
    },
  },
  setup() {
    const rebelStore = useRebelStore();
    const { postedItems, likedArray, account } = storeToRefs(rebelStore);

    return {
      isVideo,
      postedItems,
      likedArray,
      account,
      getCloudinaryUrlImage,
      getCloudinaryUrlVideo,
    };
  },
};
</script>

<style lang="scss">
wave {
  z-index: 0;
  display: flex;
  cursor: pointer !important;
}

.audioCardGallery audio::-webkit-media-controls-panel {
  background-color: lightgrey;
}

.audioCardGallery audio::-webkit-media-controls-current-time-display {
  font-size: 10px;
}

.audioCardGallery audio::-webkit-media-controls-time-remaining-display {
  font-size: 10px;
}

.audioCardGallery audio::-webkit-media-controls-play-button {
  color: var(--icon-color-opposite);
  border-radius: 50%;
}

.audioCardGallery audio::-webkit-media-controls-enclosure {
  position: absolute;
  height: 40px;
  border-radius: 0%;
  border-bottom-left-radius: 0.6rem;
  border-bottom-right-radius: 0.6rem;
}

.likesHover {
  cursor: pointer;
  font-size: 11px;
  text-decoration: underline;
}

.card-style figure img {
  opacity: 1;
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
}
.card-style figure:hover img {
  opacity: 0.5;
  cursor: pointer;
}

.card-style figure video {
  opacity: 1;
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
}
.card-style figure:hover video {
  opacity: 0.5;
  cursor: pointer;
}

.card-style figure {
  opacity: 1;
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
  cursor: pointer;
}
.card-style figure:hover {
  opacity: 0.5;
  cursor: pointer;
}

.bg,
.modalButton {
  position: relative;
  width: 75px;
  height: 75px;
  border-radius: 100%;
}

.container {
  height: 30vh;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
}

.bg {
  animation: pulse 1.2s ease infinite;
  background: var(--loader-color-primary);
}

.modalButton {
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 99;
  border: none;
  background: var(--loader-color-secondary);
  background-size: 18px;
  cursor: pointer;
  outline: none;
}

@keyframes pulse {
  0% {
    transform: scale(1, 1);
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.card-style {
  background-image: var(--liniear-gradient-color-2);
  border-radius: 0.8rem;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
}

.card-body {
  padding-right: 10px;
  padding-left: 20px;
  padding-bottom: 10px;
  font-size: 13px;
  margin-left: 7px;
  height: 60px;
  margin-top: -2px;
}

.wrapperGallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: repeat(3, 1fr);
  width: 100%;
  grid-gap: 1rem;
  max-width: 80rem;
  margin-bottom: 100px;
}

.card-img-style-gallery {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.figureClass {
  width: 100%;
  height: 100%;
  align-content: center;
  margin-left: auto;
  object-fit: cover;
}

.media-wrap-gallery {
  overflow: hidden;
  position: relative;
  max-width: 80rem;
}

.gallery-panel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.75rem;
  order: inherit;
}

.gallery-panel video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.75rem;
}

.image-fit {
  height: 100%;
  width: 100%;
  object-fit: cover;
  width: 300px; /*set the width or max-width*/
  height: auto; /*this makes sure to maintain the aspect ratio*/
  text-align: center; /*for centering images inside*/
}

.vid-fit {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 0.8rem;
}

.cardName {
  font-size: 11px;
  font-weight: 900;
}

#favoriting {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: -15px;
  margin-left: 85%;
}

button {
  background: none;
  border: none;
  padding: 0;
  outline: inherit;
  cursor: pointer;
}

body.dark-theme {
  section#panel-result {
    background-color: var(--gradient-900);

    .content-file--items .content-file--item {
      background-color: rgba(255, 255, 255, 0.05);

      .item-detail--subtitle {
        color: rgba(255, 255, 255, 0.5);
      }
      .item-cid .input-cid {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}
</style>
