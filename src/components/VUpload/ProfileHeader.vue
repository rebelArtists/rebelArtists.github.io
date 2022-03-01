<template>
  <div class="wrapper2">
      <!-- <div class="box item1">One</div> -->
      <div class="box item2">
        <div>
          <img
             src="https://cdnwp-s3.benzinga.com/wp-content/uploads/2021/08/09145118/punk.png"
             class="round-image"
          />
        </div>
      </div>
      <div class="box item3">
        NAME
      </div>
      <div class="box item5">
        FOLLOWERS
      </div>
      <div class="box item6">
        FOLLOWING
      </div>
      <div class="box item4">
        POSTS
      </div>
      <div class="box item7">
        BIO
      </div>
  </div>
</template>

<script>

import { useRebelStore } from '@src/store/index';
import { storeToRefs } from 'pinia'

export default {
  name: "ProfileHeader",
  setup() {

    const rebelStore = useRebelStore()
    const { postedItems } = storeToRefs(rebelStore)

    return {
      postedItems
    }
}
}
</script>

<style lang="scss">

.wrapper2 {
  font-size: 1vw;
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
