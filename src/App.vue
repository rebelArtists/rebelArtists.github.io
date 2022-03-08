<template>
  <div v-if="!account" class="testing">
    <AppHeader />
    <div class="divConnect">
      <!-- <button v-if="!account" class="buttonConnect" @click="fireConnectWallet">
        connect wallet
      </button> -->
      <a v-if="!account" class="testButton" @click="fireConnectWallet">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          connect wallet
      </a>
    </div>
  </div>
  <AppHeader v-if="account"/>
  <div v-if="this.ready && account && !user">
    <CreateProfile />
  </div>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component v-if="user" :is="Component" :key="$route.name" :ready="true"/>
    </keep-alive>
  </router-view>
  <ReloadPrompt />
</template>

<script>
import AppHeader from "@src/components/AppHeader.vue";
import ReloadPrompt from "@src/components/ReloadPrompt.vue";
import CreateProfile from "@src/components/VUpload/CreateProfile.vue";
import { storeToRefs } from 'pinia'
import { useRebelStore } from '@src/store/index'
import { provide } from "vue";
import { Notyf } from "notyf";

export default {
  name: "App",
  components: {
    AppHeader,
    ReloadPrompt,
    CreateProfile
  },
  data() {
    return {
      componentKey: 0,
      ready: false
    };
  },
  methods: {
    async fireConnectWallet() {
      const { connectWallet } = useRebelStore()
      const rebelStore = useRebelStore()
      const { user } = storeToRefs(rebelStore)
      await connectWallet();
      this.componentKey += 1;
      this.ready = true;
    },
  },
  setup() {
    const rebelStore = useRebelStore()
    const { connectWallet } = useRebelStore()
    const { account, user } = storeToRefs(rebelStore)

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
      connectWallet,
      account,
      user
    }
  }
}
</script>

<style lang="scss">

@font-face {
  font-family: "Rebel";
  src: local("RebelNew"),
   url(./fonts/Rebel/RebelNew.ttf) format("truetype");
}

div.testing {
    background: var(--landing-gradient);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    height: 100%;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

  .divConnect {
    position: relative;
    display: flex;
    justify-content: center;
    vertical-align: center;
    margin-top: 125px;
  }

  // .buttonConnect {
  //   transition-duration: 0.6s;
  //   border-radius: 8px;
  //   cursor: pointer;
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   padding-top: 20px;
  //   padding-bottom: 20px;
  //   padding-right: 175px;
  //   padding-left: 70px;
  //   margin-top: 100px;
  //   background-image: var(--liniear-gradient-color-1);
  // }
  //
  // .buttonConnect:hover {
  //   background-color: #4CAF50; /* Green */
  //   color: white;
  // }
//
//   .buttonConnect {
//   position: relative;
//   display: inline-block;
//   padding: 15px;
//   border-radius: 10px;
//   color: var(--icon-color);
//   text-decoration: none;
//   text-transform: uppercase;
//   overflow: hidden;
//   margin: 15px;
//   height: 150px;
//   width: 150px;
//   margin-top:20vh;
//   font-family: "Roboto", sans-serif;
//   filter: hue-rotate(0deg);
//   border: 2px solid var(--icon-color);
//   transition: all 0.1s linear;
//
//   .buttonConnect:hover {
//     border: 1px solid transparent;
//     span {
//       position: absolute;
//       display: block;
//
//       .buttonConnect:nth-child(1) {
//         filter: hue-rotate(0deg);
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 3px;
//         background: linear-gradient(90deg, transparent, #3a86ff);
//         animation: animate1 1s linear infinite;
//       }
//       @keyframes animate1 {
//         0% {
//           left: -100%;
//         }
//         50%,
//         100% {
//           left: 100%;
//         }
//       }
//
//       .buttonConnect:nth-child(2) {
//         filter: hue-rotate(60deg);
//         top: -100%;
//         right: 0;
//         width: 3px;
//         height: 100%;
//         background: linear-gradient(180deg, transparent, #3a86ff);
//         animation: animate2 1s linear infinite;
//         animation-delay: 0.25s;
//       }
//
//       @keyframes animate2 {
//         0% {
//           top: -100%;
//         }
//         50%,
//         100% {
//           top: 100%;
//         }
//       }
//       .buttonConnect:nth-child(3) {
//         filter: hue-rotate(120deg);
//         bottom: 0;
//         right: 0;
//         width: 100%;
//
//         background: linear-gradient(270deg, transparent, #3a86ff);
//         animation: animate3 1s linear infinite;
//         animation-delay: 0.5s;
//       }
//       @keyframes animate3 {
//         0% {
//           right: -100%;
//           height: 3px;
//         }
//         50%,
//         100% {
//           height: 2px;
//           right: 100%;
//         }
//       }
//
//       .buttonConnect:nth-child(4) {
//         filter: hue-rotate(300deg);
//         bottom: -100%;
//         left: 0;
//         width: 3px;
//         height: 100%;
//         background: linear-gradient(360deg, transparent, #3a86ff);
//         animation: animate4 1s linear infinite;
//         animation-delay: 0.75s;
//       }
//       @keyframes animate4 {
//         0% {
//           bottom: -100%;
//         }
//         50%,
//         100% {
//           bottom: 100%;
//         }
//       }
//     }
//   }
// }

  // body{
  //   margin: 0;
  //   padding: 0;
  //   background-color: #000;
  // }
  // .arrow{
  //     position: relative;
  //     padding-top: 15px;
  // }
  // .arrow span{
  //     display: block;
  //     width: 20px;
  //     height: 20px;
  //     border-bottom: 5px solid #06A8FF;
  //     border-right: 5px solid #06A8FF;
  //     transform: rotate(45deg);
  //     margin: -24.3px;
  //     border-color: var(--liniear-gradient-color-2);
  //     animation: animate 2.6s infinite;
  // }
  // .arrow span:nth-child(2){
  //     animation-delay: -0.2s;
  // }
  // .arrow span:nth-child(3){
  //     animation-delay: -0.4s;
  // }
  // @keyframes animate {
  //     0%{
  //         opacity: 0;
  //         transform: rotate(-45deg) translate(-200px,-20px);
  //     }
  //     50%{
  //         opacity: 1;
  //     }
  //     100%{
  //         opacity: 0;
  //         transform: rotate(-45deg) translate(-100px,75px);
  //     }
  // }

  .testButton{
      position: relative;
      // display: inline-block;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 150px;
      width: 150px;
      text-align: center;
      color: var(--icon-color);
      text-decoration: none;
      text-transform: uppercase;
      transition: 0.5s;
      letter-spacing: 4px;
      overflow: hidden;
      // margin-right: 50px;

  }
  .testButton:hover{
      background: var(--icon-color);
      color: var(--icon-color-opposite);
      cursor: pointer;
      // box-shadow: 0 0 5px #03e9f4,
      //             0 0 25px #03e9f4,
      //             0 0 50px #03e9f4,
      //             0 0 200px #03e9f4;
       // -webkit-box-reflect:below 1px linear-gradient(transparent, #0005);
  }
  .testButton:nth-child(1){
      filter: hue-rotate(270deg);
  }
  .testButton:nth-child(2){
      filter: hue-rotate(110deg);
  }
  .testButton span{
      position: absolute;
      display: block;
  }
  .testButton span:nth-child(1){
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--icon-color);
      animation: animate1 1s linear infinite;
  }
  @keyframes animate1{
      0%{
          left: -100%;
      }
      50%,100%{
          left: 100%;
      }
  }
  .testButton span:nth-child(2){
      top: -100%;
      right: 0;
      width: 2px;
      height: 100%;
      background: var(--icon-color);
      animation: animate2 1s linear infinite;
      animation-delay: 0.25s;
  }
  @keyframes animate2{
      0%{
          top: -100%;
      }
      50%,100%{
          top: 100%;
      }
  }
  .testButton span:nth-child(3){
      bottom: 0;
      right: 0;
      width: 100%;
      height: 2px;
      background: var(--icon-color);
      animation: animate3 1s linear infinite;
      animation-delay: 0.50s;
  }
  @keyframes animate3{
      0%{
          right: -100%;
      }
      50%,100%{
          right: 100%;
      }
  }


  .testButton span:nth-child(4){
      bottom: -100%;
      left: 0;
      width: 2px;
      height: 100%;
      background: var(--icon-color);
      animation: animate4 1s linear infinite;
      animation-delay: 0.75s;
  }
  @keyframes animate4{
      0%{
          bottom: -100%;
      }
      50%,100%{
          bottom: 100%;
      }
  }

</style>
