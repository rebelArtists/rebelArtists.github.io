<template>
  <section id="content">
    <div class="divConnect">
      <button v-if="!account" class="buttonConnect" @click="fireConnectWallet">
        connect wallet and enter
      </button>
      <div v-if="!account" class="arrow">
          <span></span>
          <span></span>
          <span></span>
      </div>
    </div>
    <div v-if="this.ready" class="main animated" v-cloak>
      <div class="main-content">
        <div v-if="!user" v-cloak>
          <CreateProfile />
        </div>
        <div v-if="user" v-cloak>
          <ProfileHeader />
          <Gallery />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { provide } from "vue";
import { Notyf } from "notyf";

import Gallery from "@src/components/VUpload/Gallery.vue";
import ProfileHeader from "@src/components/VUpload/ProfileHeader.vue";
import CreateProfile from "@src/components/VUpload/CreateProfile.vue";
import { storeToRefs } from 'pinia'
import { useRebelStore } from '@src/store/index'


export default {
  name: "VProfile",
  components: {
    Gallery,
    ProfileHeader,
    CreateProfile
  },
  data() {
    return {
      ready: false,
    };
  },
  methods: {
    async fireConnectWallet() {
      const { connectWallet, getUserByOwner } = useRebelStore()
      const rebelStore = useRebelStore()
      const { user } = storeToRefs(rebelStore)
      await connectWallet();
      await getUserByOwner();
      this.ready = true;
    }
  },
  setup() {
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

    const rebelStore = useRebelStore()
    const { account, user } = storeToRefs(rebelStore)

    provide("notyf", NotfyProvider);

    return {
      account,
      user,
    }
  }
}
</script>

<style lang="scss">

[v-cloak] {
    display: none;
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
    background-color: #4CAF50; /* Green */
    color: white;
  }

  body{
    margin: 0;
    padding: 0;
    background-color: #000;
  }
  .arrow{
      position: relative;
      padding-top: 15px;
  }
  .arrow span{
      display: block;
      width: 20px;
      height: 20px;
      border-bottom: 5px solid #06A8FF;
      border-right: 5px solid #06A8FF;
      transform: rotate(45deg);
      margin: -24.3px;
      border-color: var(--liniear-gradient-color-2);
      animation: animate 2.6s infinite;
  }
  .arrow span:nth-child(2){
      animation-delay: -0.2s;
  }
  .arrow span:nth-child(3){
      animation-delay: -0.4s;
  }
  @keyframes animate {
      0%{
          opacity: 0;
          transform: rotate(-45deg) translate(-200px,-20px);
      }
      50%{
          opacity: 1;
      }
      100%{
          opacity: 0;
          transform: rotate(-45deg) translate(-100px,75px);
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
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);

      section {
        width: 70vw;
        height: 70vh;
        flex-direction: column;

        overflow-y: scroll;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, .4) rgba(36, 18, 18, 0.2);
      }
    }

    .main-content--shadow {
      position: absolute;

      width: 878px;
      height: 464px;

      box-shadow: rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px, 0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);
      border-radius: 1em;

      &.s-index-1 {
        z-index: 1;
        background-image: var(--liniear-gradient-color-1);
        transition: transform .3s ease-in-out;

        transform: rotate(2deg);
      }
      &.s-index-2 {
        z-index: 2;
        background-image: var(--liniear-gradient-color-2);
        transition: transform .3s ease-in-out;

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
