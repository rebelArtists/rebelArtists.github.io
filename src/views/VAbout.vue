<template>
  <section id="content">
    <div class="main">
      <section id="about" class="aboutDescription">
        <p>
          Rebel offers dead-simple "minting" of videos, photos, and music,
          seamlessly turning each upload into an NFT on the Polygon blockchain.
          The concept is simple, every time users like your content, you get paid
          immediately via crypto.
        </p>
        <p>
          No more waiting months for companies to shell out your earnings.
          Gone are social media giants making billions and leaving you with fractions.
          Creators on Rebel take 98% of all earnings and are paid within seconds!
        </p>
        <p>
          Your art can never be deleted, hacked, or edited as Rebel is fully
          decentralized and uploads all media to IPFS. Moreover, being built
          on Polygon, artists can mint content for pennies, unlike the prohibitive
          gas costs on Ethereum.
        </p>
        <p>
          Finally, unlock monetary incentives as your like count grows:
          <br>
          100 Total Likes: 100 REBEL Tokens
          <br>
          1,000 Total Likes: 1,000 REBEL Tokens
          <br>
          10,000 Total Likes: 10,000 REBEL Tokens
          <br>
          100,000 Total Likes: 100,000 REBEL Tokens
          <br>
          1,000,000 Total Likes: 1,000,000 REBEL Tokens
        </p>
        <p>
          Come join the rebellion!!
        </p>

        <p>
          Built by Coinbase alums with <i-ri-heart-2-fill class="icon-love" />
        </p>
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
</style>
