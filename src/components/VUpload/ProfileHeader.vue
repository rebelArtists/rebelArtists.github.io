<template>
  <div class="wrapper2">
      <!-- <div class="box item1">One</div> -->
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
      <div class="box item8">
        <button v-if="!isFollowingUser" class="buttonConnectProfile" @click="followUser(user.id)">
          Follow
        </button>
        <button v-if="isFollowingUser" class="buttonConnectProfile" @click="followUser(user.id)">
          Unfollow
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
  </div>
</template>

<script>

import { useRebelStore } from '@src/store/index';
import { storeToRefs } from 'pinia'
import { getImgUrl } from "@src/services/helpers";

export default {
  name: "ProfileHeader",
  mounted() {
    this.$nextTick(() => {
      this.checkIsFollowing();
    });
  },
  methods: {
    async checkIsFollowing() {
      const { isFollowing, getUserByOwner } = useRebelStore()
      const rebelStore = useRebelStore()
      const { user, isFollowingUser } = storeToRefs(rebelStore)
      await getUserByOwner();
      await isFollowing(user.value.id);
    }
  },
  setup() {

    const rebelStore = useRebelStore()
    const { followUser } = useRebelStore()
    const { postedItems, user, isFollowingUser } = storeToRefs(rebelStore)

    return {
      postedItems,
      user,
      getImgUrl,
      followUser,
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
  grid-auto-rows: repeat(3, 1fr);
  justify-content: center;
  align-content: end;
}

.box {
  // background-color: #444;
  // color: #fff;
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
  grid-row: 1 / 4;
  justify-content: center;
  align-content: end;
  // padding-left: 4vw;
}

.item3 {
  font-size: 15px;
  grid-column: 3 / 5;
  font-weight: 900;
}

.item7 {
  grid-column: 3 / 6;
}

.round-image {
  object-fit: cover;
  width: 150px;
  height: 150px;
  // max-height: 100%;
 border-radius: 50%;
}

</style>
