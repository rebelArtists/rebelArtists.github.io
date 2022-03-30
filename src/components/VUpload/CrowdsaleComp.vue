<template>
  <div class="adminWrapper">
    ADMIN
    <div class="crowdsaleWrapper">
      <a class="withdrawHover" @click="withdrawCrowdsaleFundsAdmin">
        Withdraw Crowdsale
      </a>
    </div>
    <div>
      <a class="withdrawHoverDapp" @click="withdrawDappFundsAdmin">
        Withdraw DAPP
      </a>
    </div>
  </div>
  <div class="login-box">
    <h2>Crowdsale</h2>
    <span class="crowdsaleStats">
      <h4>Available: <br />{{ 500000000 - amtRaised }} REBEL</h4>
      <h4>Your Stake: <br />{{ userContribution }} MATIC</h4>
      <h4>Raised: <br />{{ amtRaised }} MATIC</h4>
    </span>
    <form>
      <div class="user-box">
        <input
          type="number"
          min="0"
          step=".001"
          @input="validateTokenCount($event)"
        />
        <label
          ># Tokens to Buy
          <span v-if="!this.tokenCountValid" class="warningTextCrowdsale">
            (must be between 1-1MM)
          </span>
          <span v-if="this.tokenCountValid" class="successfulTextCrowdsale">
            ✓
          </span>
        </label>
      </div>
      <div class="purchaseButton">
        <a v-if="!loading" class="purchaseHover" @click="sendTokens()">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Purchase
        </a>
        <a v-if="loading" class="loading-crowdsale animated fadeIn">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Purchasing
          <div class="bgFollow"></div>
        </a>
      </div>
    </form>
  </div>
</template>

<script>
import { useRebelStore } from "@src/store/index";
import { storeToRefs } from "pinia";

export default {
  name: "CrowdsaleComp",
  emits: ["like-event"],
  components: {},
  data() {
    return {
      componentKey: 0,
      animating: false,
      tokenCount: 0,
      tokenCountValid: false,
      loading: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getCrowdsaleDetails();
    });
  },
  methods: {
    async sendTokens() {
      if (this.tokenCountValid) {
        this.loading = true;
        const { sendCrowdsaleTokens } = useRebelStore();
        console.log(this.tokenCount.toString());
        await sendCrowdsaleTokens(this.tokenCount.toString());
        this.getCrowdsaleDetails();
      } else {
        console.log("fix input values and try again");
      }
      this.loading = false;
    },
    async getCrowdsaleDetails() {
      const { getAmtRaised, getUserAmtDonated } = useRebelStore();
      await getAmtRaised();
      await getUserAmtDonated();
      this.componentKey += 1;
    },
    async withdrawCrowdsaleFundsAdmin() {
      const { withdrawCrowdsaleFunds } = useRebelStore();
      await withdrawCrowdsaleFunds();
      this.componentKey += 1;
    },
    async withdrawDappFundsAdmin() {
      const { withdrawDappFunds } = useRebelStore();
      await withdrawDappFunds();
      this.componentKey += 1;
    },
    validateTokenCount($event) {
      this.tokenCount = $event.target.value;
      if (this.tokenCount >= 1 && this.tokenCount <= 1000000) {
        this.tokenCountValid = true;
      } else {
        this.tokenCountValid = false;
      }
    },
  },
  watch: {},
  setup() {
    const rebelStore = useRebelStore();
    const { amtRaised, userContribution } = storeToRefs(rebelStore);

    return {
      amtRaised,
      userContribution,
    };
  },
};
</script>

<style lang="scss">
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
.loading-crowdsale {
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

.warningTextCrowdsale {
  font-size: 9px;
  color: red;
  font-style: italic;
}

.successfulTextCrowdsale {
  font-size: 12px;
  color: green;
}

.crowdsaleStats {
  display: grid;
  grid-template-columns: repeat(3, 150px);
  font-size: 10px;
}

.adminWrapper {
  border-style: solid;
  position: absolute;
  margin-top: 200px;
  width: 225px;
  height: 140px;
  text-align: center;
  font-size: 10px;
  font-weight: 900;
  border-color: var(--icon-color);
  border-width: 1.5px;
  padding-top: 15px;
  margin-left: 10%;
  margin-bottom: 100px;
  border-radius: 10px;
}

@media only screen and (max-width: 1215px) {
  .adminWrapper {
    border-style: solid;
    position: absolute;
    margin-top: 450px;
    width: 225px;
    height: 140px;
    text-align: center;
    font-size: 10px;
    font-weight: 900;
    border-color: var(--icon-color);
    border-width: 1.5px;
    padding-top: 15px;
    margin-left: 100px;
    margin-bottom: 100px;
    border-radius: 10px;
  }
}

.crowdsaleWrapper {
  margin-top: 30px;
  margin-bottom: 40px;
}

.withdrawHover {
  width: 125px;
  text-align: center;
  cursor: pointer;
  font-size: 10px;
  font-weight: 900;
  background: var(--crowdsale-color);
  padding: 10px;
  padding-left: 30px;
  padding-right: 30px;
  border-radius: 10px;
}

.withdrawHoverDapp {
  text-align: center;
  width: 125px;
  cursor: pointer;
  font-size: 10px;
  font-weight: 900;
  background: var(--crowdsale-color);
  padding: 10px;
  padding-left: 45px;
  padding-right: 45px;
  border-radius: 10px;
  margin-top: 90px;
}

.purchaseHover {
  cursor: pointer;
}

.purchaseButton {
  margin-left: auto;
  margin-right: auto;
  margin-top: -15px;
  justify-content: center;
  text-align: center;
}

.login-box {
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

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  text-align: center;
}

.login-box .user-box {
  position: relative;
  margin-top: 35px;
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
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  pointer-events: none;
  transition: 0.5s;
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
  transition: 0.5s;
  margin-top: 40px;
  letter-spacing: 4px;
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
  50%,
  100% {
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

.login-box a span:nth-child(3) {
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

.login-box a span:nth-child(4) {
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
