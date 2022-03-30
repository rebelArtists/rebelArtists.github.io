<template>
  <Transition name="modal">
    <div v-if="show" class="modal-donation-mask">
      <div class="login-box-donation">
        <h2>Artist Donation</h2>
        <form>
          <div class="user-box-donation">
            <input
              type="number"
              min="0"
              step=".001"
              @input="validateDonation($event)"
            />
            <label
              >Amount to Send (MATIC)
              <span v-if="!this.donationValid" class="warningTextDonation">
                (must be greater than 0)
              </span>
              <span v-if="this.donationValid" class="successfulTextDonation">
                ✓
              </span>
            </label>
          </div>
          <div class="donateButton">
            <a
              v-if="!loading"
              class="donateHover"
              @click="fireDonate(this.userAddress)"
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Donate
            </a>
            <a v-if="loading" class="loading-donations animated fadeIn">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Donating
              <div class="bgFollow"></div>
            </a>
          </div>
        </form>
      </div>
      <div class="modal-donations-footer">
        <button class="modal-donations-button" @click="$emit('close')">
          x
        </button>
      </div>
    </div>
  </Transition>
</template>

<script>
import { provide } from "vue";
import { Notyf } from "notyf";
import { useRebelStore } from "@src/store/index";
import { storeToRefs } from "pinia";

export default {
  name: "DonationModal",
  emits: ["close"],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    userAddress: {
      type: String,
      default: "",
    },
  },
  components: {},
  data() {
    return {
      componentKey: 0,
      stateLoaded: false,
      donationAmt: 0,
      donationValid: false,
      loading: false,
    };
  },
  mounted() {},
  methods: {
    async fireDonate(userId) {
      this.loading = true;
      const { donationToUser } = useRebelStore();
      const rebelStore = useRebelStore();
      const { account } = storeToRefs(rebelStore);
      if (account != userId) {
        await donationToUser(userId, this.donationAmt);
      } else {
        console.log("can't donate to self");
      }
      this.loading = false;
      this.$emit("close");
    },
    validateDonation($event) {
      this.donationAmt = $event.target.value;
      if (this.donationAmt >= 0) {
        this.donationValid = true;
      } else {
        this.donationValid = false;
      }
    },
  },
  setup() {
    const NotfyProvider = new Notyf({
      duration: 2000,
      position: {
        x: "center",
        y: "bottom",
      },
      types: [
        {
          type: "loading",
          background: "orange",
          duration: 0,
          dismissible: true,
          icon: {
            className: "icon icon-loading",
            tagName: "i",
          },
        },
      ],
    });

    provide("notyf", NotfyProvider);

    return {};
  },
};
</script>

<style>
.warningTextDonation {
  font-size: 9px;
  color: red;
  font-style: italic;
}

.successfulTextDonation {
  font-size: 12px;
  color: green;
}

.modal-donations-footer {
  display: flex;
}

.modal-donations-button {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  z-index: 9999;
  cursor: pointer;
  position: absolute;
  top: 140px;
  right: 30%;
  padding-bottom: 3px;
  background-image: var(--liniear-gradient-color-2);
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
.loading-donations {
  height: auto;
  text-align: center;
  color: black;
  position: relative;
  overflow: hidden;
  border-radius: 0px;
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

.modal-donation-mask {
  position: fixed;
  z-index: 99999999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-donation-container {
  width: 200px;
  height: 60%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: var(--gradient-800);
  border-radius: 7%;
  transition: all 0.3s ease;
}

.modal-donation-enter-from {
  opacity: 0;
}

.modal-donation-leave-to {
  opacity: 0;
}

.modal-donation-enter-from .modal-donation-container,
.modal-donation-leave-to .modal-donation-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.round-image-likers {
  object-fit: cover;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--liniear-gradient-color-2);
}

.donateHover {
  cursor: pointer;
}

.donateButton {
  margin-left: auto;
  margin-right: auto;
  margin-top: -15px;
  justify-content: center;
  text-align: center;
}

.login-box-donation {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 450px;
  padding: 40px;
  transform: translate(-50%, -50%);
  color: var(--icon-color);
  background: var(--crowdsale-color);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}

.login-box-donation h2 {
  margin: 0 0 30px;
  padding: 0;
  text-align: center;
}

.login-box-donation .user-box-donation {
  position: relative;
  margin-top: 55px;
}

.login-box-donation .user-box-donation input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  margin-bottom: 30px;
  border: none;
  color: var(--icon-color);
  border-bottom: 1px solid var(--icon-color);
  outline: none;
  background: transparent;
}
.login-box-donation .user-box-donation label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  pointer-events: none;
  transition: 0.5s;
}

.login-box-donation .user-box-donation input:focus ~ label,
.login-box-donation .user-box-donation input:valid ~ label {
  top: -20px;
  left: 0;
  color: var(--icon-color);
  font-size: 12px;
}

.login-box-donation form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: var(--icon-color);
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 40px;
  letter-spacing: 4px;
}

.login-box-donation a:hover {
  background: var(--icon-color);
  color: var(--icon-color-opposite);
}

.login-box-donation a span {
  position: absolute;
  display: block;
}

.login-box-donation a span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--icon-color));
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

.login-box-donation a span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, var(--icon-color));
  animation: btn-anim2 1s linear infinite;
  animation-delay: 0.25s;
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}

.login-box-donation a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, var(--icon-color));
  animation: btn-anim3 1s linear infinite;
  animation-delay: 0.5s;
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
}

.login-box-donation a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, var(--icon-color));
  animation: btn-anim4 1s linear infinite;
  animation-delay: 0.75s;
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}
</style>
