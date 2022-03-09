<template>
  <div v-if="this.stateLoaded">
    <div class="wrapper">
      <div class="gallery-panel" v-for="(item, index) in latestPosts" :key="index">
        <div class="media-wrap">
          <MDBCard class="card-style hover-overlay">
            <router-link :to="`/post/${item.id}`" active-class="active" exact>
              <figure>
                <MDBCardImg
                  :src="getImgUrl(item.mediaHash)"
                  top
                  hover
                  alt="..."
                  class="card-img-style"
                />
              </figure>
            </router-link>
            <MDBCardBody class="card-body">
              <MDBCardText>Name: {{ item.name }} </MDBCardText>
              <MDBCardText>
                Likes: {{ item.likes }}
                <div v-if="!likedArray[index]" id="favoriting">
                  <ToggleFavorite  :id="item.id" @like-event="updateparent" />
                </div>
                <div v-if="likedArray[index]" id="favoriting">
                  <ToggleFavorite  :id="item.id" :intialFavorited="true"  @like-event="updateparent" />
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
import { ref, computed, inject } from "vue";

import { useStore } from "@src/store";
import { fileSize, copyToClipboard, generateLink, generateShortLink, getImgUrl, isVideo} from "@src/services/helpers";

import { MDBCard, MDBCardBody, MDBCardText, MDBCardImg } from "mdb-vue-ui-kit";
import { useRebelStore } from '@src/store/index';
import { storeToRefs } from 'pinia';
import ToggleFavorite from "@src/components/VUpload/ToggleFavorite.vue";

export default {
  name: "DiscoverFeed",
  emits: ["like-event"],
  components: {
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardImg,
    ToggleFavorite,
  },
  data() {
    return {
      componentKey: 0,
      showModal: false,
      stateLoaded: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.checkIsLiked();
    });
  },
  methods: {
    async checkIsLiked() {
      const { isLiked, getPostsLatest } = useRebelStore()
      const rebelStore = useRebelStore()
      const { latestPostsArray } = storeToRefs(rebelStore)
      await getPostsLatest();
      await isLiked(latestPostsArray._rawValue);
      this.stateLoaded = true;
    },
    async updateparent() {
      const { isLiked, getPostsLatest } = useRebelStore()
      const rebelStore = useRebelStore()
      const { latestPostsArray } = storeToRefs(rebelStore)
      await getPostsLatest();
      await isLiked(latestPostsArray._rawValue);
      this.componentKey += 1;
      this.$emit('like-event', true);
    }
  },
  setup() {
    const notyf = inject("notyf");
    const store = useStore();

    const search = ref("");
    const rebelStore = useRebelStore()
    const { latestPosts, likedArray } = storeToRefs(rebelStore)

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
      latestPosts,
      likedArray
    }
  }
}
</script>

<style lang="scss">

.card-style figure img {
	opacity: 1;
	-webkit-transition: .3s ease-in-out;
	transition: .3s ease-in-out;
}
.card-style figure:hover img {
	opacity: .5;
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
}

.card-body {
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  font-size: 13px;
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(1, minmax(250px, 1fr));
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
