<template>
  <section id="contentPost">
    <div v-if="!this.postReady" class="loaderWrapper">
      <div class="lds-dual-ring"></div>
      <div class="loaderText">loading IPFS metadata...</div>
    </div>
    <div v-if="this.postReady">
      <div v-if="!individualPost">
        <ErrorPage />
      </div>
      <div v-if="individualPost" class="wrapper3">
        <div class="box2 itemMedia">
          <MDBCard class="card-style-post hover-overlay">
            <figure class="figureClassPost">
              <video
                v-if="individualPost.mediaType == 'video'"
                class="card-img-style-post"
                controls
                controlsList="nodownload"
              >
                <source
                  :src="getCloudinaryUrlVideo(individualPost.mediaHash)"
                />
              </video>
              <div
                class="card-img-style-post-audio"
                v-if="individualPost.mediaType == 'audio'"
              >
                <wavesurfer
                  :src="getCloudinaryUrlVideo(individualPost.mediaHash)"
                  :options="waveformOptions"
                ></wavesurfer>
              </div>
              <MDBCardImg
                v-if="individualPost.mediaType == 'image'"
                :src="getCloudinaryUrlImage(individualPost.mediaHash)"
                top
                hover
                alt="..."
                class="card-img-style-post"
              />
            </figure>
          </MDBCard>
        </div>
        <div class="box2 userName">
          <router-link :to="`/user/${individualPost.address}`" exact>
            <img
              :src="getAvatar(individualPost.address.toLowerCase())"
              class="round-image-post"
            />
          </router-link>
          <div class="userName">
            {{ individualPost.address.substring(0, 4) }}...{{
              individualPost.address.slice(-4)
            }}
          </div>
        </div>
        <div class="box2 itemName">
          <div class="bolded">
            {{ individualPost.name }}
          </div>
        </div>
        <div class="box2 itemDescription">
          <div>
            {{ individualPost.description }}
          </div>
        </div>
        <div class="box2 itemAttributes">
          <table class="styled-table">
            <thead class="roundedHeader">
              <tr>
                <th>Trait</th>
                <th class="valueStyle">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in individualPost.attributes"
                :key="index"
              >
                <td>{{ item.trait_type }}</td>
                <td class="valueStyle">{{ item.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="box2 itemLikes">
          <a
            class="likesHover"
            @click="(showLikersModal = true), (idToCheck = individualPost.id)"
          >
            {{ individualPost.likes }} likes
          </a>

          <Teleport
            v-if="showLikersModal && idToCheck == individualPost.id"
            to="body"
          >
            <LikersModal
              :show="showLikersModal"
              :postId="individualPost.id"
              @close="showLikersModal = false"
            >
            </LikersModal>
          </Teleport>

          <div v-if="!likedArray[0]" id="favoriting" class="likeHeart">
            <ToggleFavorite
              class="faveButton"
              :id="individualPost.id"
              @like-event="updateparent"
            />
          </div>
          <div v-if="likedArray[0]" id="favoriting" class="likeHeart">
            <ToggleFavorite
              class="faveButton"
              :id="individualPost.id"
              :intialFavorited="true"
              @like-event="updateparent"
            />
          </div>
        </div>
        <div class="itemBackground"></div>
        <div class="box2 itemIpfs">
          <a :href="getImgUrl(individualPost.mediaHash)" title="IPFS Media">
            <svg
              class="svgIpfs"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M20.4 14.5L16 10 4 20" />
            </svg>
          </a>
          <a :href="getImgUrl(individualPost.metaHash)" title="IPFS Metadata">
            <svg
              class="svgIpfs"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
              />
              <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { provide } from "vue";
import { Notyf } from "notyf";

import ErrorPage from "@src/components/VUpload/404.vue";
import { getImgUrl } from "@src/services/helpers";
import { MDBCard, MDBCardImg } from "mdb-vue-ui-kit";
import { storeToRefs } from "pinia";
import { useRebelStore } from "@src/store/index";
import ToggleFavorite from "@src/components/VUpload/ToggleFavorite.vue";
import LikersModal from "@src/components/VUpload/LikersModal.vue";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";
import {
  getCloudinaryUrlImage,
  getCloudinaryUrlVideo,
} from "@src/services/helpers";

export default {
  name: "VPost",
  components: {
    MDBCard,
    MDBCardImg,
    LikersModal,
    ToggleFavorite,
    ErrorPage,
  },
  data() {
    return {
      componentKey: 0,
      postReady: false,
      showLikersModal: false,
      idToCheck: null,
      waveformOptions: {
        backend: "MediaElement",
        mediaControls: true,
        barWidth: 2,
        responsive: true,
        height: 240,
        hideScrollbar: true,
        cursorWidth: 1,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getContent();
    });
  },
  methods: {
    async getContent() {
      this.postReady = false;
      const { getPostById, isLiked } = useRebelStore();
      if (this.$route.params.id) {
        await getPostById(this.$route.params.id);
        await isLiked([this.$route.params.id]);
      }
      this.postReady = true;
    },
    async updateparent() {
      const { getPostById, isLiked } = useRebelStore();
      await getPostById(this.$route.params.id);
      await isLiked([this.$route.params.id]);
      this.componentKey += 1;
    },
  },
  watch: {
    $route(to, from) {
      if (to !== from) {
        this.getContent();
      }
    },
  },
  setup() {
    const rebelStore = useRebelStore();
    const { individualPost, user, account, likedArray } =
      storeToRefs(rebelStore);

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

    const getAvatar = (address) => {
      let svgAvatar = createAvatar(style, {
        seed: address,
        scale: 80,
        translateY: -3,
      });
      /// TESTING ///
      let blob = new Blob([svgAvatar], { type: "image/svg+xml" });
      let url = URL.createObjectURL(blob);
      return url;
    };

    provide("notyf", NotfyProvider);

    return {
      individualPost,
      user,
      account,
      getImgUrl,
      likedArray,
      getAvatar,
      getCloudinaryUrlImage,
      getCloudinaryUrlVideo,
    };
  },
};
</script>

<style lang="scss">
#contentPost {
  margin-top: 150px;
}

.loaderText {
  font-size: 10px;
  margin-top: 30px;
  margin-left: 15px;
}

.loaderWrapper {
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  text-align: center;
  margin-top: 270px;
}

.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid var(--icon-color);
  border-color: var(--icon-color) transparent var(--icon-color) transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.valueStyle {
  color: grey;
}

wave {
  z-index: 0;
  display: flex;
  cursor: pointer !important;
}

.card-img-style-post-audio audio::-webkit-media-controls-panel {
  background-color: lightgrey;
}

.card-img-style-post-audio audio::-webkit-media-controls-current-time-display {
  font-size: 10px;
}

.card-img-style-post-audio
  audio::-webkit-media-controls-time-remaining-display {
  font-size: 10px;
}

.card-img-style-post-audio audio::-webkit-media-controls-play-button {
  color: var(--icon-color-opposite);
  border-radius: 50%;
}

.card-img-style-post-audio audio::-webkit-media-controls-timeline {
  width: 150px;
}

.card-img-style-post-audio audio::-webkit-media-controls-enclosure {
  position: absolute;
  height: 40px;
  margin-top: 150px;
  border-radius: 0%;
  overflow: hidden;
  border-bottom-left-radius: 0.6rem;
  border-bottom-right-radius: 0.6rem;
}

.card-img-style-post-audio audio {
  margin-top: 57px;
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

.faveButton {
  margin-left: 2px;
  margin-top: -2px;
  background: transparent;
  border: 0px;
  cursor: pointer;
}

.figureClassPost {
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

.styled-table {
  border-collapse: collapse;
  margin: 0 0;
  width: 100%;
}

.styled-table tr {
  line-height: 10px;
  border-bottom: 2px solid #dddddd;
}

.styled-table thead tr {
  text-align: left;
  font-size: 12px;
  font-weight: 900;
}

.styled-table th,
.styled-table td {
  padding: 12px 0px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
  line-height: 5px;
}

.styled-table tbody tr:last-of-type {
  border-bottom: transparent;
}

.wrapper3 {
  font-size: 13px;
  margin: 15px 0 35px 0;
  width: 100%;
  height: 60vh;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 250px 120px 250px;
  grid-template-rows: 15% 10% 15% 38% 12%;
  justify-content: center;
}

.card-img-style-post {
  width: 100%;
  height: 100%;
  display: flex;
  object-fit: cover;
  border-radius: 0.6rem;
  margin-top: -13px;
}

.card-img-style-post-audio {
  width: 380px;
  position: relative;
  object-fit: cover;
  border-radius: 0.6rem;
  margin-top: 15%;
  margin-left: 40px;
}

.box2 {
  border-radius: 10px;
  display: flex;
}

.itemMedia {
  grid-column: 1 / 3;
  grid-row: 1 / 6;
  justify-content: center;
  z-index: 1;
  background-image: var(--liniear-gradient-color-2);
  pointer-events: auto;
}

.userName {
  font-size: 11px;
  grid-column: 3 / 3;
  grid-row: 1 / 1;
  font-weight: 999;
  padding-left: 15px;
  padding-top: 10px;
}

.itemName {
  grid-column: 3 / 3;
  grid-row: 2 / 2;
  padding: 10px;
  padding-left: 15px;
  font-size: 13px;
  font-weight: 900;
}

.itemDescription {
  grid-column: 3 / 3;
  grid-row: 3 / 3;
  padding: 15px;
  font-size: 11px;
}

.itemAttributes {
  grid-column: 3 / 3;
  grid-row: 4 / 4;
  padding: 15px;
  font-size: 11px;
  margin-top: -10px;
}

.itemLikes {
  grid-column: 3 / 3;
  grid-row: 5 / 5;
  padding: 15px;
  font-size: 12px;
  margin-top: 10px;
  z-index: 1000;
}

.itemIpfs {
  padding: 5px;
  width: 40px;
  height: 20px;
  margin-top: -5px;
  z-index: 1000;
}

.itemBackground {
  grid-column: 3 / 3;
  grid-row: 1 / 6;
  z-index: -1;
  border-radius: 10px;
}

.card-style-post {
  border-radius: 0.8rem;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
}

.round-image-post {
  object-fit: cover;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--icon-color);
}

#favoriting.likeHeart {
  position: relative;
  margin-top: -3px;
  margin-left: 15px;
  z-index: 1000;
  cursor: pointer;
}

.svgIpfs {
  stroke: var(--svg-color);
}
</style>
