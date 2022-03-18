const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Rebel Contract", function () {
  let Rebel;
  let rebel;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  const postName = "rebel_one";
  const postMediaHash = "azv5dbk.XEQ8nmr0nah";
  const postMetaHash = "vkg-rap.tej6nvt0ZFC";
  const postMediaType = "image";

  beforeEach(async function () {
    const TOTAL_SUPPLY = 1000000000;
    RebelToken = await ethers.getContractFactory("RebelArtists");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    rebelToken = await RebelToken.deploy(TOTAL_SUPPLY);
    await rebelToken.deployed();

    Rebel = await ethers.getContractFactory("Rebel");
    rebel = await Rebel.deploy(rebelToken.address);
    await rebel.deployed();
  });

  describe("Post Creation", function () {

    it("Should create post at proper first index", async function () {
      const newPost = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost.wait();

      // expect new post to be at first index
      const postResp = await rebel.getPostById(0);
      expect(postResp.name).to.equal("rebel_one");
      expect(postResp.mediaHash).to.equal("azv5dbk.XEQ8nmr0nah");
      expect(postResp.metaHash).to.equal("vkg-rap.tej6nvt0ZFC");
      expect(postResp.likes).to.equal(0);
      expect(postResp.id).to.equal(0)
      expect(postResp.addressOwner).to.equal(addr1.address)
    });
    it("Should create user if first time posting", async function () {
      const newPost = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost.wait();

      const userResp = await rebel.getUserByOwner(addr1.address);
      expect(ethers.utils.formatEther(userResp.amtEarned)).to.equal('0.0');
      expect(userResp.totalLikes).to.equal(0);
      expect(userResp.postCount).to.equal(1);

      const postResp = await rebel.getPostsByOwner(addr1.address, await rebel.getUserPostCount(addr1.address));
      expect(postResp.namesArray.length).to.equal(1);
      expect(postResp.namesArray[0]).to.equal("rebel_one");
      expect(postResp.mediaHashesArray[0]).to.equal("azv5dbk.XEQ8nmr0nah");
      expect(postResp.mediaTypeArray[0]).to.equal("image");
      expect(postResp.likesArray[0]).to.equal(0);
      expect(postResp.idArray[0]).to.equal(0)
    });
    it("Should properly increment data on like", async function () {
      const newPost = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost.wait();

      const likePost = await rebel.connect(addr2).likePost(
        0,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost.wait();

      const postResp = await rebel.getPostById(0);
      const userResp = await rebel.getUserByOwner(addr1.address);
      expect(postResp.likes).to.equal(1);
      expect(ethers.utils.formatEther(userResp.amtEarned)).to.equal('0.0196');
      expect(userResp.totalLikes).to.equal(1);

      // ensure user who liked is registered in post's like map
      const likeBoolArray = await rebel.connect(addr2).isLiked([postResp.id])
      expect(likeBoolArray[0]).to.equal(true)
    });
    it("Should properly decrement data on unlike", async function () {
      const newPost = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost.wait();

      // first another user likes
      const likePost = await rebel.connect(addr2).likePost(
        0,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost.wait();

      const postResp = await rebel.getPostById(0);
      const userResp = await rebel.getUserByOwner(addr1.address);
      expect(postResp.likes).to.equal(1);
      expect(ethers.utils.formatEther(userResp.amtEarned)).to.equal('0.0196');
      expect(userResp.totalLikes).to.equal(1);

      // then that user unlikes as test
      const unlikePost = await rebel.connect(addr2).unlikePost(0);
      await unlikePost.wait();

      const postRespUnlike = await rebel.getPostById(0);
      const userRespUnlike = await rebel.getUserByOwner(addr1.address);
      expect(postRespUnlike.likes).to.equal(0);
      expect(userRespUnlike.totalLikes).to.equal(0);
      // post owner doesn't lose any money when item unliked
      expect(ethers.utils.formatEther(userRespUnlike.amtEarned)).to.equal('0.0196');
    });
    it("Should properly udpate acct balances on like event", async function () {
      const newPost = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost.wait();

      // get initial balances so we can compare money changes later
      const userThatsLikedInitialBalance = await ethers.provider.getBalance(addr1.address);
      const userThatsLikingInitialBalance = await ethers.provider.getBalance(addr2.address);

      const likePost = await rebel.connect(addr2).likePost(
        0,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost.wait();

      const userThatsLikedFinalBalance = await ethers.provider.getBalance(addr1.address);
      const userThatsLikingFinalBalance = await ethers.provider.getBalance(addr2.address);
      const userThatsLikedDiff = ethers.utils.formatEther(userThatsLikedFinalBalance) - ethers.utils.formatEther(userThatsLikedInitialBalance);
      const userThatsLikingDiff = ethers.utils.formatEther(userThatsLikingInitialBalance) - ethers.utils.formatEther(userThatsLikingFinalBalance);
      // .at.least to account for small buffer from gas fees earlier
      // user who's post was liked earns .0196 MATIC per like
      expect(userThatsLikedDiff).to.be.at.least(0.0195);
      // user who's liking post spends.02 MATIC per like
      expect(userThatsLikingDiff).to.be.at.least(0.02);
      // rebel contract takes 2% tx fee per like
      const contractBalance = await ethers.provider.getBalance(rebel.address);
      expect(ethers.utils.formatEther(contractBalance)).to.equal('0.0004');
    });
    it("Should error if user tries to like same NFT more than once", async function () {
      const newPost = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost.wait();

      const likePost = await rebel.connect(addr2).likePost(
        0,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost.wait();

      const sameAcctLikesSameItemTwice = async function () {
        let err = null;
        try {
          const likePost = await rebel.connect(addr2).likePost(
            0,
            {value: ethers.utils.parseEther(".02")}
          );
          await likePost.wait();
        } catch (error) {
          err = error
        }
          expect(err).to.be.an('error');
      };

      await sameAcctLikesSameItemTwice()

    });
    it("Should increment overall post counter correctly", async function () {
      const maxPosts = 3;
      for (i = 0; i < maxPosts; i++) {
        const newPost = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
        await newPost.wait();
      }

      expect(await rebel.getPostCount()).to.equal(3);
    });
    it("Should increment user post count correctly", async function () {
      const maxPosts = 3;
      for (i = 0; i < maxPosts; i++) {
        const newPost = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
        await newPost.wait();
      }

      expect(await rebel.getUserPostCount(addr1.address)).to.equal(3);
    });
    it("Should error if non-owner tries withdrawing contract balance", async function () {
      const newPost = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost.wait();

      // after like event 2% tx fee kept in Rebel contract address
      const likePost = await rebel.connect(addr2).likePost(
        0,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost.wait();

      const nonOwnerTriesWithdrawal = async function () {
        let err = null;
        try {
          await rebel.connect(addr2).withdraw();
        } catch (error) {
          err = error
        }
          expect(err).to.be.an('error');
      };

      await nonOwnerTriesWithdrawal()
    });
    it("Should update owner balance correctly after withdrawal", async function () {
      const newPost = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost.wait();

      // get initial balances so we can compare money changes later
      const ownerInitialBalance = await ethers.provider.getBalance(owner.address);

      // after like event 2% tx fee kept in Rebel contract address
      const likePost = await rebel.connect(addr2).likePost(
        0,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost.wait();

      await rebel.connect(owner).withdraw();
      const ownerFinalBalance = await ethers.provider.getBalance(owner.address);
      const ownerDiff = ethers.utils.formatEther(ownerFinalBalance) - ethers.utils.formatEther(ownerInitialBalance);
      // .at.least to account for small gas fees earlier
      expect(ownerDiff).to.be.at.least(0.0003);
    });
    it("Should only allow owner to set new tx fee", async function () {
      const nonOwnerTriesSettingFee = async function () {
        let err = null;
        try {
          await rebel.connect(addr2).setTxFee(ethers.utils.parseEther('.05'));
        } catch (error) {
          err = error
        }
          expect(err).to.be.an('error');
      };

      await nonOwnerTriesSettingFee()

      const ownerTriesSettingFee = async function () {
        let err = null;
        try {
          await rebel.connect(owner).setTxFee(ethers.utils.parseEther('.05'));
        } catch (error) {
          err = error
        }
          expect(err).to.not.be.an('error');
      };

      await ownerTriesSettingFee()

      // ensure new fee set correctly
      const newFee = await rebel.connect(owner).getTxFee()
      expect(ethers.utils.formatEther(newFee)).to.equal('0.05');
    });
    it("Should get owner liked posts", async function () {
      const newPost1 = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost1.wait();

      const newPost2 = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost2.wait();

      // after like event 2% tx fee kept in Rebel contract address
      const likePost1 = await rebel.connect(addr1).likePost(
        0,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost1.wait();

      // after like event 2% tx fee kept in Rebel contract address
      const likePost2 = await rebel.connect(addr1).likePost(
        1,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost2.wait();

      const likedPostsCount = await rebel.getPostsLikedByOwnerList(addr1.address)
      const totalCount = likedPostsCount.likesCount;
      const getLikedPostsResp = await rebel.getPostsLikedByOwner(addr1.address, totalCount)

      expect(getLikedPostsResp.idArray.length).to.equal(2)
      expect(getLikedPostsResp.idArray[0]).to.equal(0)
      expect(getLikedPostsResp.idArray[1]).to.equal(1)
    });
    it("Should get list of owners who like post", async function () {
      const newPost1 = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost1.wait();

      // after like event 2% tx fee kept in Rebel contract address
      const likePost1 = await rebel.connect(addr1).likePost(
        0,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost1.wait();

      // after like event 2% tx fee kept in Rebel contract address
      const likePost2 = await rebel.connect(addr2).likePost(
        0,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost2.wait();

      // check post id 0
      const getLikedPostAddresses = await rebel.getAddressesWhoLiked(0)

      expect(getLikedPostAddresses.length).to.equal(2)
      expect(getLikedPostAddresses[0]).to.equal(addr1.address)
      expect(getLikedPostAddresses[1]).to.equal(addr2.address)
    });
    it("Get random posts", async function () {
      const newPost1 = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost1.wait();

      const newPost2 = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost2.wait();

      const getAllRandomPosts = await rebel.connect(addr1).getRandomPosts();

      expect(getAllRandomPosts.namesArray.length).to.equal(20);
    });
    it("Deploy Rebel Artist token and give owner initial supply", async function () {
      const TOTAL_SUPPLY = 1000000000;
      const NAME = "Rebel Artists";
      const SYMBOL = "REBEL";

      // check initial token stats and ownership are correct
      const totalSupply = await rebelToken.totalSupply()
      const ownerBalance = await rebelToken.balanceOf(owner.address)
      expect(totalSupply.toNumber()).to.equal(TOTAL_SUPPLY);
      expect(await rebelToken.name()).to.be.equal(NAME);
      expect(await rebelToken.symbol()).to.be.equal(SYMBOL);
      expect(ownerBalance.toNumber()).to.equal(TOTAL_SUPPLY);

      // check token transfers routing correctly
      await rebelToken.connect(owner).transfer(addr1.address, 300000000);
      const recipientBalance = await rebelToken.balanceOf(addr1.address);
      const updatedOwnerBalance = await rebelToken.balanceOf(owner.address);
      expect(recipientBalance.toNumber()).to.equal(300000000);
      expect(updatedOwnerBalance.toNumber()).to.equal(TOTAL_SUPPLY - 300000000);
    });
    it("Should interface with RebelToken contract from main logic", async function () {
      // send main rebel contract Rebel Tokens to transfer to users
      await rebelToken.connect(owner).transfer(rebel.address, 300000000);
      const recipientBalance = await rebelToken.balanceOf(rebel.address);
      expect(recipientBalance.toNumber()).to.equal(300000000);

      // should release reward to user who gets more than 3 likes
      const newPost1 = await rebel.connect(addr1).createPost(postName, postMediaHash, postMetaHash, postMediaType);
      await newPost1.wait();

      const likePost1 = await rebel.connect(addr1).likePost(
        0,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost1.wait();

      const likePost2 = await rebel.connect(addr2).likePost(
        0,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost2.wait();

      // after like event 2% tx fee kept in Rebel contract address
      const likePost3 = await rebel.connect(owner).likePost(
        0,
        {value: ethers.utils.parseEther(".02")}
      );
      await likePost3.wait();

      const userResp = await rebel.getUserByOwner(addr1.address);

      const creatorRebelTokenBalance = await rebelToken.balanceOf(addr1.address);
      expect(creatorRebelTokenBalance.toNumber()).to.equal(1000000);
    });
  });
});
