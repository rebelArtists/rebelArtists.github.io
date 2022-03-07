<template>
  <div class="wrapper4">
    <div class="gallery-panel-follow" v-for="(user, index) in usersToFollow" :key="index">
      <div class="box-follow item2">
        <div>
          <img
             :src="getImgUrl(user.profPicHash)"
             class="round-image"
          />
          {{ user.name }}
          {{ user.followers }} followers
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { useRebelStore } from '@src/store/index';
import { storeToRefs } from 'pinia'
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
      const { getUsersToFollow } = useRebelStore()
      await getUsersToFollow();
    },
  },
  setup() {

    const rebelStore = useRebelStore()
    const { usersToFollow } = storeToRefs(rebelStore)

    return {
      usersToFollow,
      getImgUrl
    }
}
}
</script>

<style lang="scss">

.wrapper4 {
  font-size: 13px;
  margin: 15px 0 35px 0;
  width: 100%;
  height: 20%;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(1, minmax(12vw, 100));
  grid-auto-rows: repeat(1, 1fr);
  justify-content: center;
  align-content: end;
}

.box-follow {
  background-color: #444;
  color: #fff;
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
  grid-row: 1 / 1;
  justify-content: center;
  align-content: end;
  // padding-left: 4vw;
}

.item3 {
  font-size: 15px;
  grid-column: 2 / 2;
  grid-row: 1 / 1;
  font-weight: 900;
}

// .item3 {
//   font-size: 15px;
//   grid-column: 2 / 5;
//   grid-row: 2 / 5;
//   font-weight: 900;
//   margin-top: 65px;
//   margin-left: 75px;
// }

.item5 {
  grid-column: 3 / 3;
  grid-row: 1 / 1;
}

// .item7 {
//   grid-column: 3 / 5;
//   grid-row: 3 / 5;
//   opacity: 0;
// }

.item9 {
  grid-column: 5 / 6;
  grid-row: 3 / 5;
}

.round-image {
  object-fit: cover;
  width: 30px;
  height: 30px;
  // max-height: 100%;
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
