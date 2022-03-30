<template>
  <section id="content">
    <div class="main">
      <section id="about" class="aboutDescription">
        <div class="aboutHeader">About</div>
        <div class="team">
          <ul class="auto-grid" role="list">
            <li class="lineItem">
              <a target="_blank" class="profile">
                <h2 class="profile__name">Dead-Simple Minting</h2>
                <p class="mintingAbout">
                  Minting videos, photos, and music is seamless; Simply upload
                  your content and an NFT will be auto-created on Polygon
                  (Ethereum L2). Gas fees are near zero, transactions are
                  lightning fast.
                </p>
                <img src="../components/NFT_SQUARE.png" />
              </a>
            </li>
            <li>
              <a target="_blank" class="profile">
                <h2 class="profile__name">Get Paid Per Like</h2>
                <p>
                  No more waiting months for social media giants to shell out
                  your earnings, or them taking the lion's share. Rebel Artists
                  take 98% of profits and are paid within seconds to their
                  crypto wallet.
                </p>
                <img src="../components/LIKES_SQUARE.png" />
              </a>
            </li>
            <li>
              <a target="_blank" class="profile">
                <h2 class="profile__name">Instant Payouts</h2>
                <p>
                  For every like receiced, you earn 0.0196 MATIC (98% of
                  transaction value), sent direct to your crypto wallet in
                  seconds. A 2% fee is taken by Rebel, meant entirely to keep
                  our systems alive and thriving.
                </p>
                <img src="../components/FAST_PAYMENT.png" />
              </a>
            </li>
            <li>
              <a target="_blank" class="profile">
                <h2 class="profile__name">Top Creator Rewards</h2>
                <p>
                  Unlock ERC20 REBEL tokens as your cumulative like count grows:
                  <br />
                  100 Likes -> 100 REBEL
                  <br />
                  1K Likes -> 1K REBEL
                  <br />
                  10K Likes -> 10K REBEL
                  <br />
                  100K Likes -> 100K REBEL
                  <br />
                  1MM Likes -> 1MM REBEL
                </p>
                <img src="../components/REWARDS_SQUARE.png" />
              </a>
            </li>
            <li>
              <a target="_blank" class="profile">
                <h2 class="profile__name">Built by COIN Alums</h2>
                <p>
                  Designed for the masses by industry experts, all the
                  blockchain complexities have been stripped away. While Rebel
                  is fully decentralized, artists will find its as easy to use
                  as Instagram or TikTok
                </p>
                <img
                  alt="Profile shot for Marc Dixon"
                  src="../components/ALUM_SQUARE.png"
                />
              </a>
            </li>
            <li>
              <a target="_blank" class="profile">
                <h2 class="profile__name">Join the Rebellion</h2>
                <p>
                  Enough of big business profiting off of your hard work. Gone
                  are the days of them taking billions and you're left with
                  fractions. Take control of your content. Own what's yours as a
                  Rebel Artist!
                </p>
                <img
                  alt="Profile shot for Chad"
                  src="../components/REBELLION_SQUARE.png"
                />
              </a>
            </li>
          </ul>
        </div>
        <div class="howToHeader">How To (Beta)</div>
        <div class="howToSection">
          <div class="numberedList">
            <span class="bulletNumber">1</span>
            Install
            <a
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
              >Metamask plugin</a
            >
            for Chrome and create a wallet
          </div>
          <div class="numberedList">
            <span class="bulletNumber">2</span>
            Add Polygon testnet network (Mumbai) to your MetaMask
            <a
              href="https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/#using-polygonscan"
              >following these steps</a
            >
          </div>
          <div class="numberedList">
            <span class="bulletNumber">3</span>
            Get some test MATIC (use the
            <a href="https://faucet.polygon.technology/">Polygon faucet</a>)
          </div>
          <div class="numberedList">
            <span class="bulletNumber">4</span>
            Connect your wallet to Rebel (home page here) and get posting and
            liking!
          </div>
        </div>
        <div class="pdfWrapper">
          <div class="whitepaperHeader">Whitepaper</div>
          <embed
            src="rebel_whitepaper.pdf"
            type="application/pdf"
            width="100%"
            height="600px"
          />
        </div>
      </section>
    </div>
  </section>
</template>

<script>
export default {
  name: "VAbout",
};
</script>

<style lang="scss">
ul {
  list-style: none;
}

.pdfWrapper {
  margin-bottom: 100px;
}

.howToSection {
  margin-bottom: 70px;
  justify-content: center;
  margin-left: 2%;
}

.numberedList {
  margin-bottom: 10px;
  color: var(--icon-color);
  margin-bottom: 20px;
}
.bulletNumber {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: var(--icon-color);
  color: var(--icon-color-opposite);
}

.aboutHeader {
  font-size: 14px;
  font-weight: 900;
  color: var(--icon-color);
}

.howToHeader {
  font-size: 14px;
  font-weight: 900;
  margin-top: 100px;
  margin-bottom: 20px;
  color: var(--icon-color);
}

.whitepaperHeader {
  font-size: 14px;
  font-weight: 900;
  margin-top: 100px;
  margin-bottom: 20px;
  color: var(--icon-color);
}

.aboutDescription {
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  font-size: 12px;
}

section#content .main {
  section#about {
    width: 60vw;
    height: auto;
    margin-top: 150px;
    margin-bottom: 100px;
    color: white;

    h1 {
      img {
        display: inline-block;
      }
    }

    a {
      color: var(--contrast-color);
      font-weight: bold;
      border-bottom: 1px solid var(--contrast-color);
      text-decoration: none;

      &.author {
        padding: 6px 12px;
        border-radius: 8px;
        background-color: var(--gradient-100);
        color: var(--icon-color);
        font-size: 0.85rem;

        border-bottom: none;
      }
    }

    p {
      line-height: 1.7;
    }

    .icon-love {
      color: #e91e63;
      display: inline;
      vertical-align: middle;
    }
  }
}

body.dark-theme {
  section#content .main section#about .author {
    background-color: var(--gradient-800);
  }
}

/* Utilities */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--auto-grid-min-size, 14rem), 1fr)
  );
  grid-gap: var(--auto-grid-gap, 0);
  padding: 0;
}

.flow > * + * {
  margin-top: var(--flow-space, 1em);
}

/* Composition */
.team {
  --flow-space: 2em;
}

/* Blocks */
.profile {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  aspect-ratio: 1/1;
  position: relative;
  padding: 1.5rem;
  color: #ffffff;
  backface-visibility: hidden;
  text-decoration: none;
  overflow: hidden;
}

.profile::before,
.profile::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.profile::before {
  background: linear-gradient(
    to top,
    hsl(0 0% 0% / 0.79) 0%,
    hsl(0 0% 0% / 0.787) 7.8%,
    hsl(0 0% 0% / 0.779) 14.4%,
    hsl(0 0% 0% / 0.765) 20.2%,
    hsl(0 0% 0% / 0.744) 25.3%,
    hsl(0 0% 0% / 0.717) 29.9%,
    hsl(0 0% 0% / 0.683) 34.3%,
    hsl(0 0% 0% / 0.641) 38.7%,
    hsl(0 0% 0% / 0.592) 43.3%,
    hsl(0 0% 0% / 0.534) 48.4%,
    hsl(0 0% 0% / 0.468) 54.1%,
    hsl(0 0% 0% / 0.393) 60.6%,
    hsl(0 0% 0% / 0.31) 68.3%,
    hsl(0 0% 0% / 0.216) 77.3%,
    hsl(0 0% 0% / 0.113) 87.7%,
    hsl(0 0% 0% / 0) 100%
  );
  transition: 300ms opacity linear;
}

.profile::after {
  background: linear-gradient(
    45deg,
    hsl(5 97% 63% / 0.7) 0,
    hsl(5 97% 63% / 0) 100%
  );
  opacity: 0;
  transition: 300ms opacity linear;
}

.profile > * {
  z-index: 1;
}

.profile img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  z-index: -1;
  object-fit: cover;
  filter: grayscale(1);
  transition: filter 200ms ease, transform 250ms linear;
}

.profile h2,
.profile p {
  transform: translateY(10ex);
  color: white;
}

.profile h2 {
  font-size: 15px;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: 0.03ch;
  transition: 300ms transform ease;
}

.profile p {
  font-size: 10px;
  font-weight: 500;
}

.profile p {
  opacity: 0;
  transition: 300ms opacity linear, 300ms transform ease-in-out;
}

.profile:focus {
  outline: 0.5rem solid white;
  outline-offset: -0.5rem;
}

.profile:hover :is(h2, p),
.profile:focus :is(h2, p) {
  transform: none;
}

.profile:hover::after,
.profile:focus::after,
.profile:hover::before,
.profile:focus::before {
  opacity: 0.7;
}

.profile:hover p,
.profile:focus p {
  opacity: 1;
  transition-delay: 200ms;
}

.profile:hover img,
.profile:focus img {
  filter: grayscale(0);
  transform: scale(1.05) rotate(1deg);
}
</style>
