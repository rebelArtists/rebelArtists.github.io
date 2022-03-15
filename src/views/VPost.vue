<template>
  <div v-if="this.postReady">
    <div class="wrapper3">
      <div class="box2 itemMedia">
        <div class="media-wrap">
          <MDBCard class="card-style hover-overlay">
            <video v-if="individualPost.mediaType == 'video' || individualPost.mediaType == 'audio'" class="card-img-style" controls controlsList="nodownload">
              <source :src="getCloudinaryUrlVideo(individualPost.mediaHash)">
            </video>
            <MDBCardImg
              v-if="individualPost.mediaType == 'image'"
              :src="getCloudinaryUrlImage(individualPost.mediaHash)"
              top
              hover
              alt="..."
              class="card-img-style"
            />
          </MDBCard>
        </div>
      </div>
      <div class="box2 userName">
        <router-link :to="`/user/${individualPost.address}`" exact>
          <img :src="getAvatar(individualPost.address.toLowerCase())" class="round-image-post" />
        </router-link>
        <div class="userName">
            {{ individualPost.address.substring(0, 4) }}...{{ individualPost.address.slice(-4) }}
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
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in individualPost.attributes"
                    :key="index">
              <td>{{ item.trait_type }}</td>
              <td>{{ item.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="box2 itemLikes">

        <a class="likesHover" @click="showLikersModal = true, idToCheck = individualPost.id">
          {{ individualPost.likes }} likes
        </a>

        <Teleport v-if="showLikersModal && idToCheck == individualPost.id" to="body">
          <LikersModal :show="showLikersModal" :postId="individualPost.id" @close="showLikersModal = false">
          </LikersModal>
        </Teleport>

        <div v-if="!likedArray[0]" id="favoriting" class="likeHeart">
          <ToggleFavorite :id="individualPost.id" @like-event="updateparent" />
        </div>
        <div v-if="likedArray[0]" id="favoriting" class="likeHeart">
          <ToggleFavorite
            :id="individualPost.id"
            :intialFavorited="true"
            @like-event="updateparent"
          />
        </div>
      </div>
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
</template>

<script>
import { provide } from "vue";
import { Notyf } from "notyf";

import { getImgUrl } from "@src/services/helpers";
import {
  MDBCard,
  MDBCardImg
} from "mdb-vue-ui-kit";
import { storeToRefs } from "pinia";
import { useRebelStore } from "@src/store/index";
import ToggleFavorite from "@src/components/VUpload/ToggleFavorite.vue";
import LikersModal from "@src/components/VUpload/LikersModal.vue";
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';
import { getCloudinaryUrlImage, getCloudinaryUrlVideo } from "@src/services/helpers";

export default {
  name: "VPost",
  components: {
    MDBCard,
    MDBCardImg,
    LikersModal,
    ToggleFavorite,
  },
  data() {
    return {
      componentKey: 0,
      postReady: false,
      showLikersModal: false,
      idToCheck: null
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
        translateY: -3
      });

      let blob = new Blob([svgAvatar], {type: 'image/svg+xml'});
      let url = URL.createObjectURL(blob);
      return url
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
      getCloudinaryUrlVideo
    };
  },
};
</script>

<style lang="scss">

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
  grid-template-columns: 20% 15% 25%;
  grid-template-rows: 15% 10% 15% 43% 12%;
  justify-content: center;
}

.card-img-style {
  max-width: 100%;
  max-height: 100%;
}

.box2 {
  background-image: var(--liniear-gradient-color-2);
  border-radius: 10px;
  max-width: 80rem;
  display: flex;
}

.itemMedia {
  grid-column: 1 / 3;
  grid-row: 1 / 6;
  justify-content: center;
  align-content: end;
  background-color: transparent;
}

.userName {
  font-size: 13px;
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
  font-size: 12px;
  font-weight: 999;
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
}

.itemLikes {
  grid-column: 3 / 3;
  grid-row: 5 / 5;
  padding: 15px;
  font-size: 12px;
}

.itemIpfs {
  padding: 5px;
  width: 40px;
  height: 20px;
}

.card-style {
  background-image: var(--liniear-gradient-color-2);
  border-radius: 0.8rem;
}

.card-body {
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  font-size: 13px;
}

.media-wrap {
  overflow: hidden;
  position: relative;
  max-width: 80rem;
  height: 100%;
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

.round-image-post {
  object-fit: cover;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--icon-color)
}

#favoriting.likeHeart {
  position: relative;
  margin-top: -3px;
  margin-left: 15px;
}

.card-img-style {
  // position: absolute;
  // top: 0;
  // left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.svgIpfs {
  stroke: var(--svg-color);
}
</style>
