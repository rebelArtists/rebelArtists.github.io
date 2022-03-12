<template>
  <div v-if="this.stateLoaded && this.$route.params.name" class="wrapper2">
    <div class="box userAvatar">
      <div>
        <img :src="getAvatar(this.$route.params.name.toLowerCase())" class="round-image" />
      </div>
    </div>
    <div class="box addressHash">
      {{ this.$route.params.name.substring(0, 4) }}...{{ this.$route.params.name.slice(-4) }}
    </div>
    <div class="box shareButton" v-if="!loading">
      <ShareNetwork
          network="twitter"
          url="https://news.vuejs.org/issues/180"
          title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
        >
        <svg class="twitter" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="30" height="30"
        viewBox="0 0 48 48"><path d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"></path></svg>
      </ShareNetwork>

      <ShareNetwork
          network="reddit"
          url="https://news.vuejs.org/issues/180"
          title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
        >
        <svg class="reddit" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="30" height="30"
        viewBox="0 0 50 50">
        <path d="M 29 3 C 26.894531 3 24.433594 4.652344 24.0625 12.03125 C 24.375 12.023438 24.683594 12 25 12 C 25.351563 12 25.714844 12.019531 26.0625 12.03125 C 26.300781 7.597656 27.355469 5 29 5 C 29.703125 5 30.101563 5.382813 30.84375 6.1875 C 31.710938 7.128906 32.84375 8.351563 35.0625 8.8125 C 35.027344 8.550781 35 8.269531 35 8 C 35 7.578125 35.042969 7.179688 35.125 6.78125 C 33.75 6.40625 33.023438 5.613281 32.3125 4.84375 C 31.519531 3.984375 30.609375 3 29 3 Z M 41 4 C 38.792969 4 37 5.796875 37 8 C 37 10.203125 38.792969 12 41 12 C 43.207031 12 45 10.203125 45 8 C 45 5.796875 43.207031 4 41 4 Z M 25 14 C 12.867188 14 3 20.179688 3 29 C 3 37.820313 12.867188 45 25 45 C 37.132813 45 47 37.820313 47 29 C 47 20.179688 37.132813 14 25 14 Z M 7.5 14.9375 C 6.039063 14.9375 4.652344 15.535156 3.59375 16.59375 C 1.871094 18.316406 1.515625 20.792969 2.5 22.84375 C 4.011719 19.917969 6.613281 17.421875 9.96875 15.5625 C 9.207031 15.175781 8.363281 14.9375 7.5 14.9375 Z M 42.5 14.9375 C 41.636719 14.9375 40.792969 15.175781 40.03125 15.5625 C 43.386719 17.421875 45.988281 19.917969 47.5 22.84375 C 48.484375 20.792969 48.128906 18.316406 46.40625 16.59375 C 45.347656 15.535156 43.960938 14.9375 42.5 14.9375 Z M 17 23 C 18.65625 23 20 24.34375 20 26 C 20 27.65625 18.65625 29 17 29 C 15.34375 29 14 27.65625 14 26 C 14 24.34375 15.34375 23 17 23 Z M 33 23 C 34.65625 23 36 24.34375 36 26 C 36 27.65625 34.65625 29 33 29 C 31.34375 29 30 27.65625 30 26 C 30 24.34375 31.34375 23 33 23 Z M 16.0625 34 C 16.3125 34.042969 16.558594 34.183594 16.71875 34.40625 C 16.824219 34.554688 19.167969 37.6875 25 37.6875 C 30.910156 37.6875 33.257813 34.46875 33.28125 34.4375 C 33.597656 33.988281 34.234375 33.867188 34.6875 34.1875 C 35.136719 34.503906 35.222656 35.109375 34.90625 35.5625 C 34.789063 35.730469 31.9375 39.6875 25 39.6875 C 18.058594 39.6875 15.210938 35.730469 15.09375 35.5625 C 14.777344 35.109375 14.859375 34.503906 15.3125 34.1875 C 15.539063 34.027344 15.8125 33.957031 16.0625 34 Z"></path></svg>
      </ShareNetwork>

      <ShareNetwork
          network="facebook"
          url="https://news.vuejs.org/issues/180"
          title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
        >
        <svg class="facebook" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="30" height="30"
        viewBox="0 0 48 48"><path d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path></svg>
      </ShareNetwork>

        <ShareNetwork
            network="linkedin"
            url="https://news.vuejs.org/issues/180"
            title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
          >
        <svg class="linkedin" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="30" height="30"
        viewBox="0 0 48 48"><path d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path></svg>
      </ShareNetwork>

    </div>
    <div class="box likeCount">{{ user.totalLikes }} likes</div>
    <div class="box postCount">{{ user.postCount }} posts</div>
    <div class="box amtEarned">{{ user.amtEarned  }} earned</div>
  </div>
</template>

<script>
import { useRebelStore } from "@src/store/index";
import { storeToRefs } from "pinia";
import { getImgUrl } from "@src/services/helpers";
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';


export default {
  name: "UserProfileHeader",
  components: {
  },
  data() {
    return {
      componentKey: 0,
      loading: false,
      stateLoaded: false,
      url: "https://github.com/mbj36"
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.checkIsFollowing();
    });
  },
  watch: {
    $route(to, from) {
      if (to !== from) {
        this.checkIsFollowing();
      }
    },
  },
  methods: {
    async checkIsFollowing() {
      const { getUserByOwner } = useRebelStore();
      if (this.$route.params.name) {
        await getUserByOwner(this.$route.params.name);
      }
      this.stateLoaded = true;
    },
    async fireShareUser() {
      this.loading = true;
      this.componentKey += 1;
      this.loading = false;
    },
  },
  setup() {
    const rebelStore = useRebelStore();
    const { postedItems, user, account } =
      storeToRefs(rebelStore);

    const getAvatar = (address) => {
      let svgAvatar = createAvatar(style, {
        seed: address,
        scale: 80,
        translateY: -3
      });

      let blob = new Blob([svgAvatar], {type: 'image/svg+xml'});
      let url = URL.createObjectURL(blob);
      return url
    };

    return {
      account,
      postedItems,
      user,
      getImgUrl,
      getAvatar
    };
  },
};
</script>

<style lang="scss">
.wrapper2 {
  font-size: 13px;
  margin: 15px 0 35px 0;
  width: 100%;
  height: 20%;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(6, minmax(12vw, 100));
  grid-auto-rows: repeat(4, 1fr);
  justify-content: center;
  align-content: end;
}

.twitter {
  fill: var(--icon-color)
}

.reddit {
  fill: var(--icon-color)
}

.facebook {
  fill: var(--icon-color);
  stroke: var(--icon-color-opposite);
}

.linkedin {
  fill: var(--icon-color);
  stroke: var(--icon-color-opposite);
}

.box {
  border-radius: 5px;
  padding: 10px;
}

.buttonConnectProfile {
  transition-duration: 0.6s;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  padding-left: 20px;
  padding-right: 20px;
  background-image: var(--liniear-gradient-color-2);
}

.buttonConnectProfile:hover {
  background-color: #4caf50; /* Green */
  color: white;
}

.userAvatar {
  grid-column: 1 / 3;
  grid-row: 1 / 5;
  justify-content: center;
  align-content: end;
}

.addressHash {
  font-size: 13px;
  grid-row: 1 / 1;
  grid-column: 3 / 3;
  font-weight: 900;
}

.shareButton {
  font-size: 15px;
  grid-row: 1 / 1;
  grid-column: 5 / 5;
  font-weight: 900;
  margin-left: -55px;
}

.likeCount {
  grid-column: 5 / 5;
  grid-row: 2 / 2;
}

.postCount {
  grid-column: 4 / 4;
  grid-row: 2 / 2;
}

.amtEarned {
  grid-column: 3 / 3;
  grid-row: 2 / 2;
}

.round-image {
  object-fit: cover;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: var(--liniear-gradient-color-2);
}

@-webkit-keyframes MOVE-BG {
  from {
    -webkit-transform: translateX(0);
  }
  to {
    -webkit-transform: translateX(46px);
  }
}

@keyframes MOVE-BG {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(46px);
  }
}

.loading {
  height: auto;
  text-align: center;
  color: black;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  padding-left: 20px;
  padding-right: 20px;
}

.bgFollow {
  position: absolute;
  left: -46px;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;

  background: repeating-linear-gradient(
    -55deg,
    var(--loader-color-secondary) 1px,
    var(--loader-color-primary) 12px,
    var(--loader-color-primary) 20px
  );

  -webkit-animation-name: MOVE-BG;
  -webkit-animation-duration: 0.6s;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;

  animation-name: MOVE-BG;
  animation-duration: 0.6s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
