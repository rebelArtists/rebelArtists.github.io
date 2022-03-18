<template>
  <section id="content">
    <div class="main animated">
      <div class="main-content">
        <div v-if="!isAddress(this.$route.params.name)">
          <ErrorPage />
        </div>
        <div v-if="this.stateLoaded && user && isAddress(this.$route.params.name)">
          <UserProfileHeader />
          <div class="toggleWrapper">
            <a @click="toggleShowLikedItems">
              <div v-if="showLikedPosts" class="createdInactive">
                created
              </div>
            </a>
              <div v-if="!showLikedPosts"  class="createdActive">
                created
              </div>
            <div class="divider">
              |
            </div>
            <a @click="toggleShowLikedItems">
              <div v-if="!showLikedPosts"  class="likedInactive">
                liked
              </div>
            </a>
            <div v-if="showLikedPosts" class="likedActive">
              liked
            </div>
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
    UserProfileHeader
  },
  props: {
    'ready': {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      componentKey: 0,
      postReady: false,
      stateLoaded: false,
      showLikedPosts: false
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
  // watch: {
  //   $route(to, from) {
  //     if (to !== from) {
  //       this.getUserContent();
  //     }
  //   },
  // },
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
      isAddress
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
  // background-color: grey;
  align-content: center;
  justify-content: center;
  margin: auto;
  margin-bottom: 35px;
  // margin-left: 50%;
  // margin-right: 50%;
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
  margin-left: -75px
}
.createdActive {
  position: absolute;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  margin-left: -100px
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
    background-color: #4caf50; /* Green */
    color: white;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: #000;
  }
  .arrow {
    position: relative;
    padding-top: 15px;
  }
  .arrow span {
    display: block;
    width: 20px;
    height: 20px;
    border-bottom: 5px solid #06a8ff;
    border-right: 5px solid #06a8ff;
    transform: rotate(45deg);
    margin: -24.3px;
    border-color: var(--liniear-gradient-color-2);
    animation: animate 2.6s infinite;
  }
  .arrow span:nth-child(2) {
    animation-delay: -0.2s;
  }
  .arrow span:nth-child(3) {
    animation-delay: -0.4s;
  }
  @keyframes animate {
    0% {
      opacity: 0;
      transform: rotate(-45deg) translate(-200px, -20px);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: rotate(-45deg) translate(-100px, 75px);
    }
  }

  .main {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;

    height: 100vh;

    .main-content {
      position: absolute;
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

    .main-content--shadow {
      position: absolute;

      width: 878px;
      height: 464px;

      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border-radius: 1em;

      &.s-index-1 {
        z-index: 1;
        background-image: var(--liniear-gradient-color-1);
        transition: transform 0.3s ease-in-out;

        transform: rotate(2deg);
      }
      &.s-index-2 {
        z-index: 2;
        background-image: var(--liniear-gradient-color-2);
        transition: transform 0.3s ease-in-out;

        transform: rotate(-2deg);

        &.animate {
          animation-name: shadow-index--2;
          animation-duration: 1s;
        }
      }
    }

    &.animated {
      .main-content--shadow {
        &.s-index-1 {
          animation-name: shadow-index--1;
          animation-duration: 1s;
        }
        &.s-index-2 {
          animation-name: shadow-index--2;
          animation-duration: 1s;
        }
      }
    }
  }
}

@keyframes shadow-index--1 {
  from {
    transform: rotate(-2deg);
  }
  to {
    transform: rotate(2deg);
  }
}
@keyframes shadow-index--2 {
  from {
    transform: rotate(2deg);
  }
  to {
    transform: rotate(-2deg);
  }
}
</style>
