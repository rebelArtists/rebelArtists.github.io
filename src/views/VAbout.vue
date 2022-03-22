<template>
  <section id="content">
    <div class="main">
      <section id="about" class="aboutDescription">
        <div class="team">
          <ul class="auto-grid" role="list">
            <li>
              <a href="https://swop.link/cool" target="_blank" class="profile">
                <h2 class="profile__name">
                  Simple Minting</h2>
                <p class="mintingAbout">Dead-simple minting of videos, photos, and music,
                          seamlessly turning each upload into an NFT on Polygon (scaling solution for Ethereum).
                          Gas fees are near zero, transactions lightning fast, and storage on IPFS.</p>
                <img src="../components/NFT_SQUARE.png" />
              </a>
            </li>
            <li>
              <a href="https://swop.link/cool" target="_blank" class="profile">
                <h2 class="profile__name">Paid Per Like</h2>
                <p> No more waiting months for companies to shell out your earnings, or social media giants making billions and leaving you with fractions.
                          Creators on Rebel take 98% of all earnings and are paid within seconds to their crypto wallet!</p>
                <img src="../components/LIKES_SQUARE.png" />
              </a>
            </li>
            <li>
              <a href="https://swop.link/cool" target="_blank" class="profile">
                <h2 class="profile__name">Instant Payments</h2>
                <p>For every like you receive on your posts you earn 0.0196 MATIC (98% of the "Like" value), sent direct
                    to your crypto wallet (MetaMask). A 2% fee is taken by Rebel meant entirely to keep our systems alive and thriving.
                </p>
                <img src="../components/FAST_PAYMENT.png" />
              </a>
            </li>
            <li>
              <a href="https://swop.link/cool" target="_blank" class="profile">
                <h2 class="profile__name">Unlock Rewards</h2>
                <p> Receive ERC20 token incentives as your like count grows:
                          <br>
                          100 Likes -> 100 REBEL
                          <br>
                          1,000 Likes -> 1,000 REBEL
                          <br>
                          10,000 Likes -> 10,000 REBEL
                          <br>
                          100,000 Likes -> 100,000 REBEL
                          <br>
                          1,000,000 Likes -> 1,000,000 REBEL</p>
                <img src="../components/REWARDS_SQUARE.png" />
              </a>
            </li>
            <li>
              <a href="https://swop.link/cool" target="_blank" class="profile">
                <h2 class="profile__name">Coinbase Alums</h2>
                <p> Built for maximum user friendliness and scale by industry experts. Your art can never be deleted, or hacked as Rebel is fully
                          decentralized and uploads all media to IPFS. Moreover, being built
                          on Polygon, artists can mint for pennies, unlike with the prohibitive
                          gas costs on Ethereum.</p>
                <img alt="Profile shot for Marc Dixon" src="../components/ALUM_SQUARE.png" />
              </a>
            </li>
            <li>
              <a href="https://swop.link/cool" target="_blank" class="profile">
                <h2 class="profile__name">Join the Rebellion!</h2>
                <p>Enough of big business profiting off your hard work. Take control of your content. Own what's yours and be a Rebel Artist</p>
                <img alt="Profile shot for Chad" src="../components/REBELLION_SQUARE.png" />
              </a>
            </li>
          </ul>
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

.aboutDescription {
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  font-size: 12px;
}

section#content .main {
  section#about {
    width: 70vw;
    height: auto;

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
  /*inset: 0;*/
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
  transform: translateY(2ex);
}

.profile h2 {
  font-size: 20px;
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
