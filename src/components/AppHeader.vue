<template>
  <header id="header">
    <div class="header-title">
      <h1>Rebel<span class="emoji">💣</span></h1>
      <span>Own What's Yours</span>
    </div>
    <div class="header-menu">
      <nav class="header-navbar">
        <router-link :to="{ name: 'home' }" active-class="active" exact>
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </router-link>

        <!-- <router-link :to="{ name: 'about' }" active-class="active" exact>About</router-link> -->
        <div>
          <button id="show-modal" @click="showModal = true">
            <svg class="mintContent" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          </button>
          <Teleport to="body">
            <!-- use the modal component, pass in the prop -->
            <modal :show="showModal" @close="showModal = false">
              <template #header>
                <h3>custom header</h3>
              </template>
            </modal>
          </Teleport>
        </div>

        <!-- <router-link :to="{ name: 'gallery' }" active-class="active" exact>Gallery</router-link> -->
        <i :title="`Switch to ${isDark ? 'Light' : 'Dark'} Theme`">
          <i-mdi-brightness-7 v-if="isDark" class="icon-color" @click="toggleTheme" />
          <i-mdi-brightness-4 v-else class="icon-color" @click="toggleTheme" />
        </i>
      </nav>
    </div>
  </header>
</template>

<script>
import { ref } from "vue";
import Modal from '@src/components/VUpload/Modal.vue'

export default {
  name: "AppHeader",
  components: {
    Modal
  },
  data() {
    return {
      showModal: false
    };
  },
  setup() {
    const isDarkClassAvailable = document.body.classList.contains("dark-theme");

    const isDark = ref(isDarkClassAvailable);
    const toggleTheme = () => {
      document.body.classList.toggle("dark-theme");

      requestAnimationFrame(toggleAnimation);

      isDark.value = !isDark.value;
    }
    const toggleAnimation = () => {
      const element = document.querySelector("section#content .main");
      try {
        element.classList.remove("animated");
        void element.offsetWidth;
        element.classList.add("animated");
      } catch (error) {
      }
    }

    return {
      isDark,
      toggleTheme
    }
  }
}
</script>

<style lang="scss">

.mintContent {
  padding-top: 7px;
  margin-right: 15px;
}

#header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  transition: border-bottom 0.5s ease;

  padding: 1.3em 64px;
  // border-bottom: 1px solid rgb(243,244,246);

  // .mintContent {
  //   fill: var(--loader-color-primary);
  // }

  .header-title {
    h1 {
      font-size: 1.7rem;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: #333;

      span.emoji {
        font-size: 1.6rem;
      }
    }
    span {
      font-size: .9rem;
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
        // padding-bottom: 8px;
        text-decoration: none;
        padding-top: 3px;

        // border-bottom: 1px solid;
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
</style>
