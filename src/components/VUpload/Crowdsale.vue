<template>
  <a class="withdrawHover" @click="withdrawFunds">
    Withdraw
  </a>
  <div class="login-box">
  <h2>Crowdsale</h2>
  <span class="crowdsaleStats">
    <h4>Available: <br>{{ 500000000 - amtRaised }} REBEL</h4>
    <h4>Your Stake: <br>{{ userContribution }} MATIC</h4>
    <h4>Raised: <br>{{ amtRaised }} MATIC</h4>
  </span>
  <form>
    <div class="user-box">
      <input type="text" name="" required="">
      <label># Tokens to Buy</label>
    </div>
    <div class="purchaseButton">
      <a class="purchaseHover" @click="sendTokens('1')">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Purchase
      </a>
  </div>
  </form>
</div>
</template>

<script>
import { ref, inject } from "vue";
import { useRebelStore } from "@src/store/index";
import { storeToRefs } from "pinia";

export default {
  name: "Crowdsale",
  emits: ["like-event"],
  components: {
  },
  data() {
    return {
      componentKey: 0,
      animating: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getCrowdsaleDetails();
    });
  },
  methods: {
    async sendTokens(amount) {
      this.animating = true;
      const { sendCrowdsaleTokens } = useRebelStore();
      await sendCrowdsaleTokens(amount);
      this.getCrowdsaleDetails();
      this.animating = false;
    },
    async getCrowdsaleDetails() {
      const { getAmtRaised, getUserAmtDonated } = useRebelStore();
      await getAmtRaised();
      await getUserAmtDonated();
      this.componentKey += 1;
    },
    async withdrawFunds() {
      const { withdrawCrowdsaleFunds } = useRebelStore();
      await withdrawCrowdsaleFunds();
      this.componentKey += 1;
    },
  },
  watch: {
  },
  setup() {
    const notyf = inject("notyf");

    const rebelStore = useRebelStore();
    const { amtRaised, userContribution } = storeToRefs(rebelStore);

    return {
      amtRaised,
      userContribution
    };
  },
};
</script>

<style lang="scss">

.crowdsaleStats {
  display: grid;
  grid-template-columns: repeat(3, 130px);
  font-size: 10px;
}

.withdrawHover {
  cursor: pointer;
  font-size: 11px;
  font-weight: 900;
  background: var(--crowdsale-color);
  padding: 10px;
  padding-left: 30px;
  padding-right: 30px;
  margin-left: 20%;
  border-radius: 10px;
}

.purchaseHover {
  cursor: pointer;
}

.purchaseButton {
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  text-align: center;
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  color: var(--icon-color);
  background: var(--crowdsale-color);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0,.6);
  border-radius: 10px;
}

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  text-align: center;
}

.login-box .user-box {
  position: relative;
  margin-top: 20px;
}

.login-box .user-box input {
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
.login-box .user-box label {
  position: absolute;
  top:0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  pointer-events: none;
  transition: .5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: var(--icon-color);
  font-size: 12px;
}

.login-box form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: var(--icon-color);
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 40px;
  letter-spacing: 4px
}

.login-box a:hover {
  background: var(--icon-color);
  color: var(--icon-color-opposite);
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box a span:nth-child(1) {
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
  50%,100% {
    left: 100%;
  }
}

.login-box a span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, var(--icon-color));
  animation: btn-anim2 1s linear infinite;
  animation-delay: .25s
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,100% {
    top: 100%;
  }
}

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, var(--icon-color));
  animation: btn-anim3 1s linear infinite;
  animation-delay: .5s
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,100% {
    right: 100%;
  }
}

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, var(--icon-color));
  animation: btn-anim4 1s linear infinite;
  animation-delay: .75s
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,100% {
    bottom: 100%;
  }
}

</style>
