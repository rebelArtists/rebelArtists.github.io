<template>
<div v-if="this.postReady">
  <div class="wrapper3">
      <div class="box2 itemMedia">
        <div class="media-wrap">
        <MDBCard class="card-style hover-overlay">
          <MDBCardImg
            :src="getImgUrl(individualPost.mediaHash)"
            top
            alt="..."
            class="card-img-style"
          />
        </MDBCard>
      </div>
      </div>
      <div class="box2 userName">
        <img
           :src="getImgUrl(user.profPicHash)"
           class="round-image-post"
        />
        <div class="userName">
          {{ user.name }}
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
        {{ individualPost.attributes }}
      </div>
      <div class="box2 itemLikes">
        {{ individualPost.likes }} likes
      </div>
  </div>
</div>
</template>

<script>
import { provide } from "vue";
import { Notyf } from "notyf";
import { ref } from "vue";

import { getImgUrl } from "@src/services/helpers";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImg, MDBBtn, MDBCardVideo } from "mdb-vue-ui-kit";
import PanelUpload from "@src/components/VUpload/PanelUpload.vue";
import PanelResult from "@src/components/VUpload/PanelResult.vue";
import { storeToRefs } from 'pinia'
import { useRebelStore } from '@src/store/index'
import ToggleFavorite from "@src/components/VUpload/ToggleFavorite.vue";


export default {
  name: "VPost",
  components: {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardImg,
    MDBBtn,
    MDBCardVideo
  },
  data() {
    return {
      componentKey: 0,
      postReady: false
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
      const rebelStore = useRebelStore()
      const { individualPost } = storeToRefs(rebelStore)
      const { getPostById } = useRebelStore()
      console.log(this.$route.params.id)
      await getPostById([this.$route.params.id])
      this.postReady = true;
    }
  },
  watch: {
    '$route' (to, from) {
      if(to !== from ) {
        this.getContent();
      }
    }
  },
  setup() {

    const rebelStore = useRebelStore()
    const { individualPost, user, account } = storeToRefs(rebelStore)

    const NotfyProvider = new Notyf({
      duration: 2000,
      position: {
        x: 'center',
        y: 'bottom'
      },
      types: [
        {
          type: 'loading',
          background: 'orange',
          duration: 0,
          dismissible: true,
          icon: {
            className: 'icon icon-loading',
            tagName: 'i'
          }
        },
      ]
    })

    provide("notyf", NotfyProvider);

    return {
      individualPost,
      user,
      account,
      getImgUrl
    }
  }
}
</script>

<style lang="scss">

.userName {
  padding-left: 10px;
  padding-top: 10px;
}

.wrapper3 {
  font-size: 13px;
  margin: 15px 0 35px 0;
  width: 100%;
  // background-color: white;
  height: 70vh;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 17vw 17vw 25vw;
  grid-template-rows: 15% 10% 15% 40% 17%;
  justify-content: center;
  // align-content: end;
}

.card-img-style {
  max-width:100%;
  max-height:100%;
}

.box2 {
  background-image: var(--liniear-gradient-color-2);
  // color: #fff;
  border-radius: 10px;
  // padding: 10px;
  max-width: 80rem;
  display: flex;
}

.itemMedia {
  grid-column: 1 / 3;
  grid-row: 1 / 6;
  justify-content: center;
  align-content: end;
  background-color: transparent;
  // padding-left: 4vw;
}

.userName {
  font-size: 15px;
  grid-column: 3 / 3;
  grid-row: 1 / 1;
  font-weight: 900;
  padding: 15px;
}

.itemName {
  grid-column: 3 / 3;
  grid-row: 2 / 2;
  padding: 15px;
}

.itemDescription {
  grid-column: 3 / 3;
  grid-row: 3 / 3;
  padding: 15px;
}

.itemAttributes {
  grid-column: 3 / 3;
  grid-row: 4 / 4;
  padding: 15px;
}

.itemLikes {
  grid-column: 3 / 3;
  grid-row: 5 / 5;
  padding: 15px;
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

.round-image-post {
  object-fit: cover;
  width: 50px;
  height: 50px;
  // max-height: 100%;
 border-radius: 50%;
}

</style>
