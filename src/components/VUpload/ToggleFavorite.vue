<template>
  <button class="toggle-favorite" @click="toggle">
    <FavoriteIcon class="toggle-favorite__icon" :class="iconClasses" />
    <transition name="favorite-particles-transition">
      <div v-if="animating" class="toggle-favorite__particles"></div>
    </transition>
  </button>
</template>

<script>
import FavoriteIcon from "./FavoriteIcon.vue";
import { useRebelStore } from "@src/store/index";

export default {
  name: "ToggleFavorite",
  emits: ["like-event"],
  components: {
    FavoriteIcon,
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    intialFavorited: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      favorited: this.intialFavorited,
      animating: false,
      loading: false,
    };
  },
  computed: {
    iconClasses() {
      return {
        "toggle-favorite__icon--favorited": this.favorited,
        "toggle-favorite__icon--animate": this.animating,
        "toggle-favorite__icon--loading": this.loading,
      };
    },
  },
  methods: {
    async toggle() {
      const { likePost, unlikePost } = useRebelStore();
      // Only animate on favoriting.
      if (!this.favorited) {
        this.animating = true;
        this.loading = true;
        await likePost(this.id);
      }

      if (this.favorited) {
        this.animating = true;
        this.loading = true;
        await unlikePost(this.id);
      }

      this.$emit("like-event", true);
      this.loading = false;
      this.animating = false;
      // this.favorited = !this.favorited;
    },
    onIconAnimationEnds() {
      this.animating = false;
    },
  },
};
</script>

<style lang="scss">
$particles-animation-duration: 0.8s;
$icon-animation-duration: 0.48s;
$icon-color: hsl(1, 89%, 61%);
$icon-border-color: var(--svg-color);

@keyframes favorite-icon-animation {
  0% {
    opacity: 1;
    transform: scale(0.1);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }

  80% {
    opacity: 1;
    transform: scale(0.9);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes favorite-particles-animation {
  0% {
    background-position: left center;
  }
  100% {
    background-position: right center;
  }
}

// Particles animation.
.favorite-particles-transition-enter-active {
  background-image: url("./particles-sprite.png");
  background-size: 2500% auto;
  background-position: left center;
  background-repeat: no-repeat;

  animation-duration: $particles-animation-duration;
  animation-timing-function: steps(24);
  animation-name: favorite-particles-animation;
}

.toggle-favorite {
  font-size: 20px;
  position: relative;
  margin-left: -13px;
  margin-top: -5px;

  &__icon {
    height: 1em;
    width: 1em;

    // Transition mainly for when un-favoriting
    transition: fill-opacity 0.2s, stroke 0.2s;
    fill: $icon-color;
    fill-opacity: 0;
    stroke: $icon-border-color;

    &--favorited {
      fill-opacity: 1;
      stroke: $icon-color;
    }

    &--loading {
      fill-opacity: 0.5;
      stroke: $icon-color;
      transform: rotate(45deg);
      animation-name: animateHeart;
      animation-duration: 10s;
      animation-timing-function: steps(24);
      animation-iteration-count: infinite;
    }

    @keyframes animateHeart {
      // scale down and scale up faster in irregular intervals to get the throbbing effect
      0% {
        transform: rotate(45deg) scale(0.8);
      }
      5% {
        transform: rotate(45deg) scale(0.9);
      }
      10% {
        transform: rotate(45deg) scale(0.8);
      }
      15% {
        transform: rotate(45deg) scale(1);
      }
      50% {
        transform: rotate(45deg) scale(0.8);
      }
      100% {
        transform: rotate(45deg) scale(0.8);
      }
    }

    // Icon animation
    &--animate {
      opacity: 0;
      transform: scale(0);
      animation-duration: $icon-animation-duration;
      animation-delay: $particles-animation-duration - $icon-animation-duration;
      animation-name: favorite-icon-animation;
    }
  }

  &__particles {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3em;
    height: 3em;
  }
}
</style>
