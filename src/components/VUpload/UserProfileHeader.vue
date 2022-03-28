<template>
  <div v-if="this.stateLoaded && this.$route.params.name" class="wrapper2">
    <div class="box userAvatar">
      <div>
        <img
          :src="getAvatar(this.$route.params.name.toLowerCase())"
          class="round-image"
        />
      </div>
    </div>
    <div class="box addressHash">
      {{ this.$route.params.name.substring(0, 4) }}...{{
        this.$route.params.name.slice(-4)
      }}
    </div>
    <div class="box shareButton">
      <button
        v-if="!loading"
        class="buttonConnectProfile"
        @click="showDonationModal = true"
      >
        Donate
      </button>
      <Teleport v-if="showDonationModal" to="body">
        <DonationModal
          :show="showDonationModal"
          :userAddress="this.$route.params.name.toLowerCase()"
          @close="updateParent"
        >
        </DonationModal>
      </Teleport>
    </div>
    <div class="box likeCount">{{ user.totalLikes }} likes</div>
    <div class="box postCount">{{ user.postCount }} posts</div>
    <div class="box amtEarned">{{ user.amtEarned }} earned</div>
  </div>
</template>

<script>
import { useRebelStore } from "@src/store/index";
import { storeToRefs } from "pinia";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";

export default {
  name: "UserProfileHeader",
  components: {},
  data() {
    return {
      componentKey: 0,
      loading: false,
      stateLoaded: false,
      showDonationModal: false,
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
        await getUserByOwner(this.$route.params.name.toLowerCase());
      }
      this.stateLoaded = true;
    },
    async updateParent() {
      const { getUserByOwner } = useRebelStore();
      if (this.$route.params.name) {
        await getUserByOwner(this.$route.params.name.toLowerCase());
      }
      this.showDonationModal = false;
    },
    async fireDonate(userId) {
      this.loading = true;
      const { donationToUser } = useRebelStore();
      const rebelStore = useRebelStore();
      const { account } = storeToRefs(rebelStore);
      if (account != userId) {
        await donationToUser(userId, 1);
        await this.checkIsFollowing();
      } else {
        console.log("can't donate to self");
      }
      this.componentKey += 1;
      this.loading = false;
    },
  },
  setup() {
    const rebelStore = useRebelStore();
    const { postedItems, user, account } = storeToRefs(rebelStore);

    const getAvatar = (address) => {
      let svgAvatar = createAvatar(style, {
        seed: address,
        scale: 80,
        translateY: -3,
      });

      let blob = new Blob([svgAvatar], { type: "image/svg+xml" });
      let url = URL.createObjectURL(blob);
      return url;
    };

    const createUserLink = (address) => {
      let baseUrl = "https://rebelartists.github.io/user/";
      return baseUrl.concat(address);
    };

    return {
      account,
      postedItems,
      user,
      getAvatar,
      createUserLink,
    };
  },
};
</script>

<style lang="scss">
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
  background-color: #4caf50;
  color: white;
}

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
  fill: var(--icon-color);
}

.reddit {
  fill: var(--icon-color);
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
  background-color: #4caf50;
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
