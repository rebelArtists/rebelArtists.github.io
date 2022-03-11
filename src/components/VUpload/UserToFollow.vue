<template>
  <div class="wrapperHeader">
    <div class="box-follow headerBar">users to follow:</div>
  </div>
  <div
    class="gallery-panel-follow"
    v-for="(user, index) in usersToFollow"
    :key="index"
  >
    <div class="wrapper4">
      <div class="box-follow itemProfFollow">
        <router-link :to="`/user/${user.name}`" exact>
          <img :src="getImgUrl(user.profPicHash)" class="round-image-follow" />
        </router-link>
      </div>
      <div class="box-follow itemNameFollow">
        {{ user.name }}
      </div>
      <div class="box-follow itemFollowersFollow">
        {{ user.followers }} followers
      </div>
    </div>
  </div>
</template>

<script>
import { useRebelStore } from "@src/store/index";
import { storeToRefs } from "pinia";
import { getImgUrl } from "@src/services/helpers";

export default {
  name: "UserToFollow",
  data() {
    return {
      componentKey: 0,
      loading: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.checkIsFollowing();
    });
  },
  methods: {
    async checkIsFollowing() {
      const { getUsersToFollow } = useRebelStore();
      await getUsersToFollow();
    },
  },
  // watch: {
  //   $route(to, from) {
  //     if (to !== from) {
  //       this.checkIsFollowing();
  //     }
  //   },
  // },
  setup() {
    const rebelStore = useRebelStore();
    const { usersToFollow } = storeToRefs(rebelStore);

    return {
      usersToFollow,
      getImgUrl,
    };
  },
};
</script>

<style lang="scss">
.wrapper4 {
  font-size: 13px;
  margin: 0 0 -5px 0;
  width: 100%;
  height: 20%;
  display: grid;
  grid-gap: 0px;
  grid-template-columns: 100px 100px 100px;
  justify-content: center;
  align-content: end;
}

.wrapperHeader {
  font-size: 13px;
  margin: 0 0 0px 0;
  width: 100%;
  height: 5%;
  display: grid;
  grid-gap: 0px;
  grid-template-columns: 100px 100px 100px;
  justify-content: center;
  align-content: end;
}

.box-follow {
  border-radius: 5px;
  padding: 10px;
}

.headerBar {
  grid-column: 1 / 3;
  grid-row: 1 / 1;
  justify-content: center;
  align-content: end;
  margin-left: auto;
  display: flex;
  font-weight: 950;
  font-size: 13px;
}

.itemProfFollow {
  grid-column: 1 / 1;
  grid-row: 1 / 1;
  justify-content: center;
  align-content: end;
  margin-left: auto;
  display: flex;
}

.itemNameFollow {
  font-size: 12px;
  grid-column: 2 / 2;
  grid-row: 1 / 1;
  font-weight: 900;
  padding-top: 15px;
}

.itemFollowersFollow {
  font-size: 11px;
  grid-column: 3 / 3;
  grid-row: 1 / 1;
  font-weight: 900;
  padding-top: 17px;
}

.round-image-follow {
  object-fit: cover;
  width: 30px;
  height: 30px;
  border-radius: 50%;
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
