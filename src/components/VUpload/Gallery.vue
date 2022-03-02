<template>
  <div class="container">
    <div class="bg"></div>
    <button class="modalButton" id="show-modal" @click="showModal = true">+</button>
    <Teleport to="body">
      <!-- use the modal component, pass in the prop -->
      <modal :show="showModal" @close="showModal = false">
        <template #header>
          <h3>custom header</h3>
        </template>
      </modal>
    </Teleport>
  </div>

  <div class="wrapper">

    <div class="gallery-panel" v-for="(item, index) in postedItems" :key="index">
      <div class="media-wrap">
        <MDBCard class="card-style hover-overlay">
          <MDBCardImg
            :src="getImgUrl(item.mediaHash)"
            top
            alt="..."
            class="card-img-style"
          />
          <!-- <video v-if="isVideo(item.file.type)" class="vid-fit" controls :src="getImgUrl(item.fileCid)" /> -->
          <MDBCardBody class="card-body">
            <MDBCardText>Name: {{ item.name }} </MDBCardText>
            <MDBCardText>
              Likes: {{ item.likes }}
              <div v-if="!likedArray[index]" id="favoriting">
                <ToggleFavorite  :id="item.id" />
              </div>
              <div v-if="likedArray[index]" id="favoriting">
                <ToggleFavorite  :id="item.id" :intialFavorited="true" @likeEvent="updateparent"/>
              </div>
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
    </div>
    </div>
  </div>
  <!-- <div class="container">
  <div class="gallery">
    <div class="gallery-panel" v-for="(item, index) in files" :key="index">
      <video v-if="isVideo(item.file.type)" class="vid-fit" controls :src="getImgUrl(item.fileCid)" />
      <img
         v-if="!isVideo(item.file.type)"
         :src="getImgUrl(item.fileCid)"
         class="image-fit"
      />
    </div>
  </div>
</div> -->
</template>

<script>
import { ref, computed, inject } from "vue";

import { useStore } from "@src/store";
import { fileSize, copyToClipboard, generateLink, generateShortLink, getImgUrl, isVideo} from "@src/services/helpers";

import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImg, MDBBtn, MDBCardVideo } from "mdb-vue-ui-kit";
import { useRebelStore } from '@src/store/index';
import { storeToRefs } from 'pinia';
import ToggleFavorite from "@src/components/VUpload/ToggleFavorite.vue";
import Modal from '@src/components/VUpload/Modal.vue'

export default {
  name: "Gallery",
  components: {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardImg,
    MDBBtn,
    MDBCardVideo,
    ToggleFavorite,
    Modal
  },
  data() {
    return {
      componentKey: 0,
      showModal: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.checkIsLiked();
    });
  },
  methods: {
    async checkIsLiked() {
      const { isLiked, getPostsByUser } = useRebelStore()
      const rebelStore = useRebelStore()
      const { postsArray } = storeToRefs(rebelStore)
      await getPostsByUser();
      await isLiked(postsArray._rawValue);
    },
    async updateparent(variable) {
      const { getPostsByUser } = useRebelStore()
      await getPostsByUser();
      await isLiked(postsArray._rawValue);
      this.componentKey += 1;
    }
  },
  setup() {
    const notyf = inject("notyf");
    const store = useStore();

    const search = ref("");
    const rebelStore = useRebelStore()
    const { postedItems, likedArray } = storeToRefs(rebelStore)

    const shortenLink = async (item) => {
      const url = generateLink(item);

      const loadingIndicator = notyf.open({
        type: "loading",
        message: "Please wait, we generate shorten link for you."
      });

      const [ error, data ] = await generateShortLink(url);

      notyf.dismiss(loadingIndicator);

      if (error) {
        notyf.error(error.message);
      } else {
        const shortenLink = `https://s.id/${data.short}`;
        store.updateShortenLink(item.metaCid, shortenLink);

        notyf.success(`Shorten Link has successfully generated.`);
      }
    }
    const copyFileLink = (item) => {
      const url = generateLink(item);
      copyToClipboard(url);

      notyf.success("Copied to clipboard!");
    }
    const onSearchChanged = ($event) => {
      search.value = $event.target.value;
    }

    const files = computed(() => store
        .results.slice()
        .reverse()
        .filter(item => !!item.metaCid)
        .filter(item => {
          if (search.value === "") return true;

          return item.file.name.indexOf(search.value) >= 0;
        }));

    return {
      search,
      files,
      fileSize,
      shortenLink,
      copyFileLink,
      generateLink,
      onSearchChanged,
      getImgUrl,
      isVideo,
      postedItems,
      likedArray
    }
  }
}
</script>

<style lang="scss">

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
  margin-left: 92px;
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

//
// .test {
//   height: 30vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }
//
// .modalButton {
//   transition-duration: 0.6s;
//   border-radius: 8px;
//   width: 40%;
//   height: 50%;
//   cursor: pointer;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 5px;
//   padding-left: 20px;
//   padding-right: 20px;
//   background-image: var(--liniear-gradient-color-2);
// }
//
// .modalButton:hover {
//   background-color: #4CAF50; /* Green */
//   color: white;
// }

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

.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: repeat(3, 1fr);
  width: 100%;
  grid-gap: 1rem;
  max-width: 80rem;
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

.image-fit{
  height: 100%;
  width: 100%;
  object-fit: cover;
  width: 300px; /*set the width or max-width*/
  height: auto; /*this makes sure to maintain the aspect ratio*/
  text-align: center; /*for centering images inside*/
}

.vid-fit{
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
      background-color: rgba(255, 255, 255, .05);

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
