<template>
  <div class="wrapper">
    <div class="gallery-panel" v-for="(item, index) in files" :key="index">
      <div class="media-wrap">
      <video v-if="isVideo(item.file.type)" class="vid-fit" controls :src="getImgUrl(item.fileCid)" />
      <img
         v-if="!isVideo(item.file.type)"
         :src="getImgUrl(item.fileCid)"
         class="image-fit"
      />
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
import { fileSize, copyToClipboard, generateLink, generateShortLink, getImgUrl, isVideo } from "@src/services/helpers";

import SearchResult from "@src/components/VUpload/SearchResult.vue";

export default {
  name: "Gallery",
  components: {
    SearchResult
  },
  setup() {
    const notyf = inject("notyf");
    const store = useStore();

    const search = ref("");

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
      isVideo
    }
  }
}
</script>

<style lang="scss">

.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: repeat(3, 1fr);
  width: 100vw;
  grid-gap: 1rem;
  max-width: 80rem;
}

.media-wrap {
  overflow: hidden;
  position: relative;
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
}

.vid-fit{
  height: 100%;
  width: 100%;
  object-fit: cover;
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
