<template>
  <header id="header">
    <div class="header-title">
        <h1>
          <router-link
            class="rebelLogo"
            :to="{ name: 'home' }"
            active-class="active"
            title="Home"
            exact
          >Rebel </router-link></h1>
      <span v-if="account && user || $route.name == 'about'">Own What's Yours</span>
      <div v-else class="rw-sentence rw-words rw-words-1">
           <span>Own What's Yours</span>
           <span>Dead-Simple Minting</span>
           <span>Near-Zero Gas Fees</span>
           <span>Get Paid Per Like</span>
           <span>Instant Payouts</span>
           <span>Top Creator Rewards</span>
       </div>
    </div>
    <div class="header-menu">
      <nav class="header-navbar">
        <router-link
          v-if="account && user"
          :to="`/user/${account}`"
          active-class="active"
          title="Profile"
          exact
        >
          <img :src="url" class="round-image-header" />
        </router-link>
        <router-link
          v-if="account && user"
          :to="{ name: 'feed' }"
          active-class="active"
          title="Discover Feed"
          exact
        >
          <svg
            class="svgNav"
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </router-link>

        <!-- <router-link :to="{ name: 'about' }" active-class="active" exact>About</router-link> -->
        <div>
          <button
            class="mintButton"
            v-if="account && user"
            id="show-modal"
            @click="showModal = true"
            title="Mint New Post"
          >
            <svg
              class="mintContent"
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button>
          <Teleport to="body">
            <!-- use the modal component, pass in the prop -->
            <UploadModal :show="showModal" @close="showModal = false">
              <template #header>
                <h3>custom header</h3>
              </template>
            </UploadModal>
          </Teleport>
        </div>
        <router-link
          :to="{ name: 'about' }"
          active-class="active"
          title="About"
          exact
        >
        <svg class="aboutIcon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="38" height="38"
        viewBox="0 0 30 30">    <path d="M 15 3 C 7.82 3 2 7.925 2 14 C 2 16.676142 3.1322222 19.126093 5.0097656 21.033203 C 5.0476793 21.127522 6.0110131 23.606674 3.1582031 26.134766 A 0.5 0.5 0 0 0 3 26.5 A 0.5 0.5 0 0 0 3.5 27 A 0.5 0.5 0 0 0 3.6074219 26.988281 C 6.4832831 26.817905 8.9434573 25.390739 10.445312 24.291016 C 11.864706 24.741137 13.394827 25 15 25 C 22.18 25 28 20.075 28 14 C 28 7.925 22.18 3 15 3 z M 15 7.5 C 15.828 7.5 16.5 8.172 16.5 9 C 16.5 9.828 15.828 10.5 15 10.5 C 14.172 10.5 13.5 9.828 13.5 9 C 13.5 8.172 14.172 7.5 15 7.5 z M 14 13 L 16 13 L 16 20 L 14 20 L 14 13 z"></path></svg>
        </router-link>

        <!-- <router-link :to="{ name: 'gallery' }" active-class="active" exact>Gallery</router-link> -->
        <i :title="`Switch to ${isDark ? 'Light' : 'Dark'} Theme`">
          <i-mdi-brightness-7
            v-if="isDark"
            class="icon-color"
            @click="toggleTheme"
          />
          <i-mdi-brightness-4 v-else class="icon-color" @click="toggleTheme" />
        </i>
      </nav>
    </div>
  </header>
</template>

<script>
import { ref } from "vue";
import UploadModal from "@src/components/VUpload/Modal.vue";
import { storeToRefs } from "pinia";
import { useRebelStore } from "@src/store/index";
import { getImgUrl } from "@src/services/helpers";
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';

export default {
  name: "AppHeader",
  components: {
    UploadModal,
  },
  data() {
    return {
      showModal: false,
    };
  },
  setup() {
    const rebelStore = useRebelStore();
    const { account, user } = storeToRefs(rebelStore);

    const isDarkClassAvailable = document.body.classList.contains(".dark-theme");

    const isDark = ref(isDarkClassAvailable);
    const toggleTheme = () => {
      document.body.classList.toggle("dark-theme");

      isDark.value = !isDark.value;
    };

    let svgAvatar = createAvatar(style, {
      seed: account.value,
      // background: "#303030",
      scale: 80,
      translateY: -3
    });

    let blob = new Blob([svgAvatar], {type: 'image/svg+xml'});
    let url = URL.createObjectURL(blob);

    return {
      isDark,
      toggleTheme,
      user,
      account,
      getImgUrl,
      url
    };
  },
};
</script>

<style lang="scss">


.rw-words-1 span{
  display: inline-block;
	position: absolute;
	opacity: 0;
	margin-left: 0px;
  margin-top: 10px;
  overflow: hidden;
	-webkit-animation: rotateWord 18s linear 0s infinite;
	-moz-animation: rotateWord 18s linear 0s infinite;
	-o-animation: rotateWord 18s linear 0s infinite;
	-ms-animation: rotateWord 18s linear 0s infinite;
	animation: rotateWord 18s linear 0s infinite;
  // color: #CCC;
}

.rw-words-1 span:nth-child(1) {
  -webkit-animation-delay: 0s;
	-moz-animation-delay: 0s;
	-o-animation-delay: 0s;
	-ms-animation-delay: 0s;
	animation-delay: 0s;
}

.rw-words-1 span:nth-child(2) {
    -webkit-animation-delay: 3s;
	-moz-animation-delay: 3s;
	-o-animation-delay: 3s;
	-ms-animation-delay: 3s;
	animation-delay: 3s;
}
.rw-words-1 span:nth-child(3) {
    -webkit-animation-delay: 6s;
	-moz-animation-delay: 6s;
	-o-animation-delay: 6s;
	-ms-animation-delay: 6s;
	animation-delay: 6s;
}
.rw-words-1 span:nth-child(4) {
    -webkit-animation-delay: 9s;
	-moz-animation-delay: 9s;
	-o-animation-delay: 9s;
	-ms-animation-delay: 9s;
	animation-delay: 9s;
}
.rw-words-1 span:nth-child(5) {
    -webkit-animation-delay: 12s;
	-moz-animation-delay: 12s;
	-o-animation-delay: 12s;
	-ms-animation-delay: 12s;
	animation-delay: 12s;
}
.rw-words-1 span:nth-child(6) {
    -webkit-animation-delay: 15s;
	-moz-animation-delay: 15s;
	-o-animation-delay: 15s;
	-ms-animation-delay: 15s;
	animation-delay: 15s;
}

@-webkit-keyframes rotateWord {
    0% { opacity: 0; }
    2% { opacity: 0; -webkit-transform: translateY(-30px); }
	5% { opacity: 1; -webkit-transform: translateY(0px);}
    17% { opacity: 1; -webkit-transform: translateY(0px); }
	20% { opacity: 0; -webkit-transform: translateY(30px); }
	80% { opacity: 0; }
    100% { opacity: 0; }
}
@-moz-keyframes rotateWord {
    0% { opacity: 0; }
    2% { opacity: 0; -moz-transform: translateY(-30px); }
	5% { opacity: 1; -moz-transform: translateY(0px);}
    17% { opacity: 1; -moz-transform: translateY(0px); }
	20% { opacity: 0; -moz-transform: translateY(30px); }
	80% { opacity: 0; }
    100% { opacity: 0; }
}
@-o-keyframes rotateWord {
    0% { opacity: 0; }
    2% { opacity: 0; -o-transform: translateY(-30px); }
	5% { opacity: 1; -o-transform: translateY(0px);}
    17% { opacity: 1; -o-transform: translateY(0px); }
	20% { opacity: 0; -o-transform: translateY(30px); }
	80% { opacity: 0; }
    100% { opacity: 0; }
}
@-ms-keyframes rotateWord {
    0% { opacity: 0; }
    2% { opacity: 0; -ms-transform: translateY(-30px); }
	5% { opacity: 1; -ms-transform: translateY(0px);}
    17% { opacity: 1; -ms-transform: translateY(0px); }
	20% { opacity: 0; -ms-transform: translateY(30px); }
	80% { opacity: 0; }
    100% { opacity: 0; }
}
@keyframes rotateWord {
    0% { opacity: 0; }
    2% { opacity: 0; transform: translateY(-30px); }
	5% { opacity: 1; transform: translateY(0px);}
    17% { opacity: 1; transform: translateY(0px); }
	20% { opacity: 0; transform: translateY(30px); }
	80% { opacity: 0; }
    100% { opacity: 0; }
}


.mintContent {
  padding-top: 7px;
  margin-right: 15px;
}

.rebelLogo{
     text-decoration: none;
     font-family: "Rebel";
     font-size: 60px;
     font-weight: 1;
     color: var(--icon-color);
 }

.aboutIcon {
  fill: var(--icon-color);
}

.mintButton {
  background: transparent;
  border: 0px;
}

#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;

  transition: border-bottom 0.5s ease;

  padding: 1.3em 64px;

  .header-title {
    h1 {
      font-size: 1.7rem;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: #333;
      font-family: "Rebel";
      font-size: 40px;
      font-weight: 5;

      span.emoji {
        font-size: 1.6rem;
      }
    }
    span {
      font-size: 0.9rem;
    }
  }

  .header-menu {
    display: flex;
    align-items: center;

    nav {
      display: flex;
      align-items: center;
      text-align: right;
      padding: 0.3em;
      margin-left: 80px;

      a {
        color: var(--contrast-color);
        text-decoration: none;
        padding-top: 3px;

        cursor: pointer;

        &.active {
          font-weight: bold;
        }
      }

      svg {
        cursor: pointer;
        font-size: 2em;
      }
    }
  }
}

body.dark-theme {
  #header {
    border-bottom: 1px solid #1c2435;

    .header-title h1 {
      color: #ffffff;
    }
  }
}

.svgNav {
  stroke: var(--icon-color);
  padding-top: 1px;
  margin-right: 2px;
  fill: transparent;
}

.mintContent {
  stroke: var(--icon-color);
  padding-top: 7px;
  margin-right: 15px;
  fill: transparent;
}

.round-image-header {
  object-fit: cover;
  width: 35px;
  height: 35px;
  margin-top: 3px;
  margin-right: 5px;
  border-radius: 50%;
  background: var(--icon-color);
}
</style>
