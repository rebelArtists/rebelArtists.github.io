<template>
  <div class="wrapper2">
      <div class="box item2">
        <div>
          <img
             :src="getImgUrl(user.profPicHash)"
             class="round-image"
          />
        </div>
      </div>
      <div class="box item3">
        {{ user.name }}
      </div>
      <div class="box item8" v-if="!loading">
        <button v-if="!isFollowingUser" class="buttonConnectProfile" @click="fireFollowUser(user.id)">
          Follow
        </button>
        <button v-if="isFollowingUser" class="buttonConnectProfile" @click="fireUnfollowUser(user.id)">
          Unfollow
        </button>
      </div>
      <div class="box item8" v-if="loading">
        <button v-if="!isFollowingUser" class="loading animated fadeIn">
          Follow
          <div class="bgFollow"></div>
        </button>
        <button v-if="isFollowingUser" class="loading animated fadeIn">
          Unfollow
          <div class="bgFollow"></div>
        </button>
      </div>
      <div class="box item5">
        {{ user.followers }} followers
      </div>
      <div class="box item6">
        {{ user.following }} following
      </div>
      <div class="box item4">
        {{ user.postCount }} posts
      </div>
      <div class="box item7">
        {{ user.bio }}
      </div>
      <div class="box item9">
        {{ user.amtEarned }} MATIC earned
      </div>
  </div>
</template>

<script>

import { useRebelStore } from '@src/store/index';
import { storeToRefs } from 'pinia'
import { getImgUrl } from "@src/services/helpers";

export default {
  name: "ProfileHeader",
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
      const { isFollowing } = useRebelStore()
      const rebelStore = useRebelStore()
      const { user, isFollowingUser } = storeToRefs(rebelStore)
      await isFollowing(user.value.id);
    },
    async fireFollowUser(userId) {
      this.loading = true;
      const { followUser } = useRebelStore()
      await followUser(userId);
      await this.checkIsFollowing();
      const { getUserByOwner } = useRebelStore()
      await getUserByOwner();
      this.componentKey += 1;
      this.loading = false;
    },
    async fireUnfollowUser(userId) {
      this.loading = true;
      const { unfollowUser } = useRebelStore()
      await unfollowUser(userId);
      await this.checkIsFollowing();
      const { getUserByOwner } = useRebelStore()
      await getUserByOwner();
      this.componentKey += 1;
      this.loading = false;
    }
  },
  setup() {

    const rebelStore = useRebelStore()
    const { postedItems, user, isFollowingUser } = storeToRefs(rebelStore)

    return {
      postedItems,
      user,
      getImgUrl,
      isFollowingUser
    }
}
}
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
  background-color: #4CAF50; /* Green */
  color: white;
}

.item2 {
  grid-column: 1 / 3;
  grid-row: 1 / 5;
  justify-content: center;
  align-content: end;
}

.item3 {
  font-size: 15px;
  grid-column: 3 / 5;
  font-weight: 900;
}

.item7 {
  grid-column: 3 / 5;
  grid-row: 3 / 5;
  font-size: 11px;
}

.item9 {
  grid-column: 5 / 6;
  grid-row: 3 / 5;
}

.round-image {
  object-fit: cover;
  width: 150px;
  height: 150px;
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

.bgFollow{
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
    var(--loader-color-primary) 20px,
	);

    -webkit-animation-name: MOVE-BG;
	-webkit-animation-duration: .6s;
	-webkit-animation-timing-function: linear;
	-webkit-animation-iteration-count: infinite;

    animation-name: MOVE-BG;
	animation-duration: .6s;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
}

</style>
