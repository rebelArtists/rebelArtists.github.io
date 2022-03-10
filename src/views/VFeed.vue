<template>
  <section id="content">
    <div v-if="account" class="main animated">
      <div class="main-content">
        <span class="feedToggle">
          <a
            @click="toggleFeedOn"
            v-if="followFeedToggle"
            class="activeDiscover"
          >
            discover
          </a>
          <a
            @click="toggleFeedOn"
            v-if="!followFeedToggle"
            class="inactiveDiscover"
          >
            discover
          </a>
          <div class="dividerLine">|</div>
          <a
            @click="toggleFeedOff"
            v-if="!followFeedToggle"
            class="activeFollowing"
          >
            following
          </a>
          <a
            @click="toggleFeedOff"
            v-if="followFeedToggle"
            class="inactiveFollowing"
          >
            following
          </a>
        </span>
        <div class="feedGrid">
          <div v-if="followFeedToggle" class="feedBox">
            <DiscoverFeed />
          </div>
          <div v-if="!followFeedToggle" class="feedBox">
            <FollowFeed />
          </div>
          <div class="usersToFollowBox">
            <UserToFollow />
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
import FollowFeed from "@src/components/VUpload/FollowFeed.vue";
import UserToFollow from "@src/components/VUpload/UserToFollow.vue";
import { storeToRefs } from "pinia";
import { useRebelStore } from "@src/store/index";

export default {
  name: "VFeed",
  components: {
    UserToFollow,
    DiscoverFeed,
    FollowFeed,
  },
  data() {
    return {
      followFeedToggle: false,
    };
  },
  methods: {
    toggleFeedOn() {
      this.followFeedToggle = true;
    },
    toggleFeedOff() {
      this.followFeedToggle = false;
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
    grid-template-columns: 75% 25%;
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
