<template>
  <div v-if="this.stateLoaded">
    <div class="noPostsDiv" v-if="!randomPosts[0]">no posts yet.</div>
    <div class="wrapperFeed">
      <div
        class="gallery-panel"
        v-for="(item, index) in randomPosts"
        :key="index"
      >
        <div class="media-wrap">
          <MDBCard class="card-style hover-overlay">
            <router-link :to="`/post/${item.id}`" active-class="active" exact>
              <figure class="figureClassFeed">
                <video
                  v-if="item.mediaType == 'video'"
                  class="card-img-style"
                  controls
                  controlsList="nodownload"
                >
                  <source :src="getCloudinaryUrlVideo(item.mediaHash)" />
                </video>
                <div class="audioCardFeed" v-if="item.mediaType == 'audio'">
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
                  class="card-img-style"
                />
              </figure>
            </router-link>
            <MDBCardBody class="card-body">
              <MDBCardText class="cardName">{{ item.name }} </MDBCardText>
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
import { MDBCard, MDBCardBody, MDBCardText, MDBCardImg } from "mdb-vue-ui-kit";
import { useRebelStore } from "@src/store/index";
import { storeToRefs } from "pinia";
import LikersModal from "@src/components/VUpload/LikersModal.vue";
import ToggleFavorite from "@src/components/VUpload/ToggleFavorite.vue";
import {
  getCloudinaryUrlImage,
  getCloudinaryUrlVideo,
} from "@src/services/helpers";

export default {
  name: "RandomFeed",
  emits: ["like-event"],
  components: {
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardImg,
    LikersModal,
    ToggleFavorite,
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
      const { isLiked, getRandomPosts } = useRebelStore();
      const rebelStore = useRebelStore();
      const { randomPostsArray } = storeToRefs(rebelStore);
      await getRandomPosts();
      await isLiked(randomPostsArray._rawValue);
      this.stateLoaded = true;
    },
    async updateparent() {
      this.checkIsLiked();
      this.componentKey += 1;
      this.$emit("like-event", true);
    },
  },
  setup() {
    const rebelStore = useRebelStore();
    const { randomPosts, likedArray } = storeToRefs(rebelStore);

    return {
      randomPosts,
      getCloudinaryUrlImage,
      getCloudinaryUrlVideo,
      likedArray,
    };
  },
};
</script>

<style lang="scss">
.noPostsDiv {
  align-content: center;
  text-align: center;
  margin-top: 20%;
  font-size: 15px;
}

wave {
  z-index: 0;
  display: flex;
  cursor: pointer !important;
}

.audioCardFeed audio::-webkit-media-controls-panel {
  background-color: lightgrey;
}

.audioCardFeed audio::-webkit-media-controls-current-time-display {
  font-size: 10px;
}

.audioCardFeed audio::-webkit-media-controls-time-remaining-display {
  font-size: 10px;
}

.audioCardFeed audio::-webkit-media-controls-play-button {
  color: var(--icon-color-opposite);
  border-radius: 50%;
}

.audioCardFeed audio::-webkit-media-controls-enclosure {
  position: absolute;
  height: 40px;
  border-radius: 0%;
  border-bottom-left-radius: 0.6rem;
  border-bottom-right-radius: 0.6rem;
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

.figureClassFeed {
  width: 100%;
  height: 100%;
  align-content: center;
  margin-left: auto;
  object-fit: cover;
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

.cardName {
  font-size: 11px;
  font-weight: 900;
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

.card-img-style {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.wrapperFeed {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: repeat(3, 1fr);
  width: 100%;
  grid-gap: 1rem;
  max-width: 80rem;
  margin-bottom: 100px;
}

.media-wrap {
  overflow: hidden;
  position: relative;
  max-width: 80rem;
}

.gallery {
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-gap: 1rem;
  max-width: 80rem;
  margin: 5rem auto;
  padding: 0.8rem;
}

.gallery-panel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.75rem;
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
