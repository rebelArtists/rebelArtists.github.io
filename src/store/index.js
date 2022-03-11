import { defineStore } from "pinia";
import { ref } from "vue";
import Storage from "@src/services/storage";
import { fetchIpfsMeta } from "@src/services/helpers";
import { ethers } from "ethers";
import contractABIrebel from "../artifacts/contracts/SocialHelper.sol/SocialHelper.json";

const db = new Storage("app");
const contractAddressRebel = "0xA2C793f51028897a76AA11908eF8CB7FA9cf39af";

db.read();
db.data || { version: "0.0.1", results: [] };

export const useStore = defineStore({
  id: "store",
  state() {
    return {
      files: [],
      results: db.data.results,
    };
  },
  actions: {
    resetFiles() {
      this.files = [];
    },
    addFiles(...files) {
      this.files.push(...files);
    },
    addResults(...files) {
      this.results.push(...files);
      this.results = this.results.filter(({ metaCid }) => !!metaCid);

      db.data.results = [...this.results];
      db.write();
    },
    /**
     * Update Shorten Link for File
     * @param {String} metaCid
     * @param {String} fileCid
     * @param {String} link
     */
    updateShortenLink(metaCid, link) {
      this.results = this.results.map((result) => {
        if (result.metaCid === metaCid) {
          return { ...result, shorten: link };
        }

        return result;
      });

      db.data.results = [...this.results];
      db.write();
    },
  },
});

export const useRebelStore = defineStore("rebel", () => {
  const account = ref(null);
  const user = ref(null);
  const postedItems = ref([]);
  const postsArray = ref([]);
  const isFollowingUser = ref(false);
  const likedArray = ref([]);
  const individualPost = ref([]);
  const routedUser = ref(null);
  const latestPosts = ref([]);
  const latestPostsArray = ref([]);
  const usersToFollow = ref([]);
  const followingPosts = ref([]);
  const followingPostsArray = ref([]);

  async function postContent(name, mediaHash, metaHash) {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rebelContract = new ethers.Contract(
          contractAddressRebel,
          contractABIrebel.abi,
          signer
        );
        const posted = await rebelContract.createPost(
          name,
          mediaHash,
          metaHash
        );
        console.log("Mining...", posted.hash);
        await posted.wait();
        console.log("Mined -- ", posted.hash);
      }
    } catch (e) {
      console.log("e", e);
    }
  }

  async function getPostsByOwner(address) {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rebelContract = new ethers.Contract(
          contractAddressRebel,
          contractABIrebel.abi,
          signer
        );
        const userPosts = await rebelContract.getPostsByOwner(address, await rebelContract.getUserPostCount(address));
        postedItems.value = [];
        postsArray.value = [];
        for (let i = 0; i < userPosts.namesArray.length; i++) {
          const postObj = new Object();
          postObj.name = userPosts.namesArray[i];
          postObj.mediaHash = userPosts.mediaHashesArray[i];
          postObj.metaHash = userPosts.metaHashesArray[i];
          postObj.likes = userPosts.likesArray[i].toNumber();
          postObj.id = userPosts.idArray[i].toNumber();
          postsArray.value.push(userPosts.idArray[i].toNumber());
          postedItems.value.push(postObj);
          // reverse so most recent items first in list
          postsArray.value = postsArray.value.reverse();
          postedItems.value = postedItems.value.reverse();
        }
      }
    } catch (e) {
      console.log("e", e);
    }
  }

  async function getPostsLatest() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rebelContract = new ethers.Contract(
          contractAddressRebel,
          contractABIrebel.abi,
          signer
        );
        const latestPostsResp = await rebelContract.getPostsLatest(await rebelContract.getPostCount());
        latestPosts.value = [];
        latestPostsArray.value = [];
        for (let i = 0; i < latestPostsResp.namesArray.length; i++) {
          const postObj = new Object();
          if (latestPostsResp.namesArray[i]) {
            postObj.name = latestPostsResp.namesArray[i];
            postObj.mediaHash = latestPostsResp.mediaHashesArray[i];
            postObj.metaHash = latestPostsResp.metaHashesArray[i];
            postObj.likes = latestPostsResp.likesArray[i].toNumber();
            postObj.id = latestPostsResp.idArray[i].toNumber();
            latestPostsArray.value.push(latestPostsResp.idArray[i].toNumber());
            latestPosts.value.push(postObj);
            // reverse so most recent is first in list
            latestPostsArray.value = latestPostsArray.value.reverse();
            latestPosts.value = latestPosts.value.reverse();
          }
        }
      }
    } catch (e) {
      console.log("e", e);
    }
  }

  async function getPostById(postId) {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rebelContract = new ethers.Contract(
          contractAddressRebel,
          contractABIrebel.abi,
          signer
        );
        const postsList = await rebelContract.getPostById(postId);

        for (let i = 0; i < postsList.namesArray.length; i++) {
          const postObj = new Object();
          postObj.name = postsList.namesArray[i];
          postObj.mediaHash = postsList.mediaHashesArray[i];
          postObj.metaHash = postsList.metaHashesArray[i];
          postObj.likes = postsList.likesArray[i].toNumber();
          postObj.id = postsList.idArray[i].toNumber();
          postObj.address = postsList.addressesArray[i];

          const ipfsMetadata = await fetchIpfsMeta(postObj.metaHash);
          postObj.description = ipfsMetadata.description;
          postObj.attributes = ipfsMetadata.attributes;
          individualPost.value = postObj;
        }
        await getUserByOwnerAddress(individualPost.value.address);
      }
    } catch (e) {
      console.log("e", e);
    }
  }

  async function getUserByOwner(address) {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rebelContract = new ethers.Contract(
          contractAddressRebel,
          contractABIrebel.abi,
          signer
        );
        const userResp = await rebelContract.getUserByOwner(address);
        if (userResp.profPicHash != "") {
          const userObj = new Object();
          userObj.amtEarned = ethers.utils.formatEther(userResp.amtEarned);
          userObj.postCount = userResp.postCount.toNumber();
          userObj.totalLikes = userResp.totalLikes.toNumber();
          user.value = userObj;
        }
      }
    } catch (e) {
      console.log("e", e);
    }
  }

  async function likePost(postId) {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rebelContract = new ethers.Contract(
          contractAddressRebel,
          contractABIrebel.abi,
          signer
        );
        const like = await rebelContract.likePost(postId, {
          value: ethers.utils.parseEther(".02"),
        });
        console.log("Liking post...", like.hash);
        await like.wait();
        console.log("Liked post successfully", like.hash);
      }
    } catch (e) {
      console.log("e", e);
    }
  }

  async function unlikePost(postId) {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rebelContract = new ethers.Contract(
          contractAddressRebel,
          contractABIrebel.abi,
          signer
        );
        const unlike = await rebelContract.unlikePost(postId);
        console.log("Unliking post...", unlike.hash);
        await unlike.wait();
        console.log("Unliked post successfully", unlike.hash);
      }
    } catch (e) {
      console.log("e", e);
    }
  }

  async function isLiked(postIds) {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rebelContract = new ethers.Contract(
          contractAddressRebel,
          contractABIrebel.abi,
          signer
        );
        const liked = await rebelContract.isLiked(postIds);
        likedArray.value = liked;
      }
    } catch (e) {
      console.log("e", e);
    }
  }

  async function connectWallet() {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Must connect to MetaMask!");
        return;
      }
      const myAccounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected: ", myAccounts[0]);
      account.value = myAccounts[0];
      await getUserByOwner();
      if (user.value) {
        await getPostsByUser(account.value);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return {
    connectWallet,
    account,
    postContent,
    getPostsByUser,
    postedItems,
    createUser,
    getUserByOwner,
    user,
    followUser,
    likePost,
    isFollowing,
    isFollowingUser,
    isLiked,
    likedArray,
    postsArray,
    unlikePost,
    unfollowUser,
    getPostById,
    individualPost,
    getUserByName,
    getPostsByUserName,
    routedUser,
    getPostsLatest,
    latestPosts,
    latestPostsArray,
    getUsersToFollow,
    usersToFollow,
    followingPosts,
    followingPostsArray,
    getPostsFollowing,
  };
});
