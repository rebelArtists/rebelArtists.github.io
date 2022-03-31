<template>
  <section id="content">
    <div class="main animated">
      <div class="main-content">
        <div v-if="!isAddress(this.$route.params.name)">
          <ErrorPage />
        </div>
        <div
          v-if="this.stateLoaded && user && isAddress(this.$route.params.name)"
        >
          <UserProfileHeader />
          <div class="toggleWrapper">
            <a @click="toggleShowLikedItems">
              <div v-if="showLikedPosts" class="createdInactive">created</div>
            </a>
            <div v-if="!showLikedPosts" class="createdActive">created</div>
            <div class="divider">|</div>
            <a @click="toggleShowLikedItems">
              <div v-if="!showLikedPosts" class="likedInactive">liked</div>
            </a>
            <div v-if="showLikedPosts" class="likedActive">liked</div>
          </div>
          <UserGallery v-if="!showLikedPosts" @like-event="updateparent" />
          <UserLikedGallery v-if="showLikedPosts" @like-event="updateparent" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { provide } from "vue";
import { Notyf } from "notyf";

import ErrorPage from "@src/components/VUpload/404.vue";
import UserGallery from "@src/components/VUpload/UserGallery.vue";
import UserLikedGallery from "@src/components/VUpload/UserLikedGallery.vue";
import UserProfileHeader from "@src/components/VUpload/UserProfileHeader.vue";
import { storeToRefs } from "pinia";
import { useRebelStore } from "@src/store/index";
import { isAddress } from "@src/services/helpers";

export default {
  name: "VUser",
  components: {
    ErrorPage,
    UserGallery,
    UserLikedGallery,
    UserProfileHeader,
  },
  props: {
    ready: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      componentKey: 0,
      postReady: false,
      stateLoaded: false,
      showLikedPosts: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getUserContent();
    });
  },
  methods: {
    async getUserContent() {
      const { getUserByOwner } = useRebelStore();
      if (this.$route.params.name && isAddress(this.$route.params.name)) {
        await getUserByOwner(this.$route.params.name);
      }
      this.stateLoaded = true;
    },
    async updateparent() {
      await this.getUserContent();
      this.componentKey += 1;
    },
    toggleShowLikedItems() {
      this.showLikedPosts = !this.showLikedPosts;
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
    const { account, user } = storeToRefs(rebelStore);

    provide("notyf", NotfyProvider);

    return {
      account,
      user,
      isAddress,
    };
  },
};
</script>

<style lang="scss">
[v-cloak] {
  display: none;
}

.toggleWrapper {
  display: flex;
  text-align: center;
  align-content: center;
  justify-content: center;
  margin: auto;
  margin-bottom: 35px;
}
.divider {
  position: absolute;
  color: grey;
  font-weight: 900;
  margin-top: -2px;
}
.createdInactive {
  position: absolute;
  font-size: 11px;
  cursor: pointer;
  padding-top: 1px;
  margin-left: -75px;
}
.createdActive {
  position: absolute;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  margin-left: -100px;
}
.likedInactive {
  position: absolute;
  font-size: 11px;
  cursor: pointer;
  padding-top: 1px;
  margin-left: 25px;
}
.likedActive {
  position: absolute;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  margin-left: 85px;
}

section#content {
  position: relative;
  height: 100%;

  .gallery {
    position: relative;
    justify-content: center;
    z-index: 1;
  }

  .divConnect {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .buttonConnect {
    transition-duration: 0.6s;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 175px;
    padding-left: 70px;
    margin-top: 100px;
    background-image: var(--liniear-gradient-color-1);
  }

  .buttonConnect:hover {
    background-color: #4caf50;
    color: white;
  }
}

.main {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  height: 100%;
  .main-content {
    position: relative;
    z-index: 3;
    display: flex;
    border-radius: 1em;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    section {
      width: 70vw;
      height: 70vh;
      flex-direction: column;
      overflow-y: scroll;
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.4) rgba(36, 18, 18, 0.2);
    }
  }
}
</style>
