<template>
  <section id="content" :key="componentKey">
    <div v-if="account" class="main animated">
      <div class="main-content">
        <div class="feedHeader">
          <div class="toggleWrapper">
            <a @click="toggleShowRandomItems">
              <div v-if="showRandomPosts" class="latestInactive">latest</div>
            </a>
            <div v-if="!showRandomPosts" class="latestActive">latest</div>
            <div class="divider">|</div>
            <a @click="toggleShowRandomItems">
              <div v-if="!showRandomPosts" class="randomInactive">random</div>
            </a>
            <div v-if="showRandomPosts" class="randomActive">random</div>
          </div>
        </div>
        <div class="feedGrid">
          <div v-if="!showRandomPosts" class="feedBox">
            <DiscoverFeed />
          </div>
          <div v-if="showRandomPosts" class="feedBox">
            <RandomFeed />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { provide } from "vue";
import { Notyf } from "notyf";

import DiscoverFeed from "@src/components/VUpload/Feed.vue";
import RandomFeed from "@src/components/VUpload/RandomFeed.vue";
import { storeToRefs } from "pinia";
import { useRebelStore } from "@src/store/index";

export default {
  name: "VFeed",
  components: {
    DiscoverFeed,
    RandomFeed,
  },
  data() {
    return {
      componentKey: 0,
      showRandomPosts: false,
    };
  },
  methods: {
    toggleShowRandomItems() {
      this.showRandomPosts = !this.showRandomPosts;
    },
  },
  watch: {
    $route(to, from) {
      if (to !== from && (to.name == "feed" || to.name == "home")) {
        this.componentKey += 1;
      }
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
    const { account } = storeToRefs(rebelStore);

    provide("notyf", NotfyProvider);

    return {
      account,
    };
  },
};
</script>

<style lang="scss">
section#content {
  position: relative;
  height: 100%;

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
  .latestInactive {
    position: absolute;
    font-size: 11px;
    cursor: pointer;
    padding-top: 1px;
    margin-left: -75px;
  }
  .latestActive {
    position: absolute;
    font-size: 13px;
    font-weight: 900;
    cursor: pointer;
    margin-left: -100px;
  }
  .randomInactive {
    position: absolute;
    font-size: 11px;
    cursor: pointer;
    padding-top: 1px;
    margin-left: 35px;
  }
  .randomActive {
    position: absolute; //
    font-size: 13px;
    font-weight: 900;
    cursor: pointer;
    margin-left: 105px;
  }

  .feedHeader {
    display: flex;
    margin-top: 5px;
    font-size: 14px;
    font-weight: 999;
  }
  //
  // @media only screen and (max-width: 815px) {
  //   .feedHeader {
  //     display: flex;
  //     margin-top: 50px;
  //     font-size: 14px;
  //     font-weight: 999;
  //   }
  // }

  .feedToggle {
    cursor: pointer;
    display: flex;
    font-size: 14px;
    justify-content: center;
    margin-right: 35%;
  }

  .activeDiscover {
    font-weight: 999;
    font-size: 15px;
  }

  .activeFollowing {
    font-weight: bold;
    font-size: 15px;
  }

  .dividerLine {
    margin-left: 15px;
    margin-right: 15px;
  }

  .feedGrid {
    font-size: 13px;
    margin: 15px 0 -5px 0;
    width: 100%;
    height: 20%;
    display: grid;
    grid-gap: 75px;
    grid-template-columns: 100%;
    justify-content: center;
    align-content: end;
  }

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
