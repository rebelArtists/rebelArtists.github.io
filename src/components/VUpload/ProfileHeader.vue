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
      <div class="box item5">
        {{ user.followers }} followers
      </div>
      <div class="box item6">
        {{ user.following }} following
      </div>
      <div class="box item4">
        3 posts
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
  setup() {

    const rebelStore = useRebelStore()
    const { postedItems, user } = storeToRefs(rebelStore)

    return {
      postedItems,
      user,
      getImgUrl
    }
}
}
</script>

<style lang="scss">

.wrapper2 {
  font-size: 10px;
  margin: 15px 0 35px 0;
  width: 90vw;
  height: 20%;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(5, 12vw);
  grid-auto-rows: repeat(3, 1fr);
  justify-content: center;
  align-content: end;
}

.box {
  // background-color: #444;
  // color: #fff;
  border-radius: 5px;
  padding: 10px;
  font-size: 150%;
}

.item2 {
  grid-column: 1 / 3;
  grid-row: 1 / 4;
  justify-content: center;
  align-content: end;
  padding-left: 8vw;
}

.item3 {
  grid-column: 3 / 6;
}

.item7 {
  grid-column: 3 / 6;
}

.round-image {
  object-fit: cover;
  width: 90%;
  max-height: 100%;
 border-radius: 125px;
}

</style>
