import { defineStore } from "pinia";
import { ref } from "vue";
import Storage from "@src/services/storage";
import { fetchIpfsMeta } from "@src/services/helpers";
import { ethers } from "ethers";
import contractABIrebel from "../artifacts/contracts/rebel.sol/Rebel.json";

const db = new Storage("app");
const contractAddressRebel = "0xB7AEaDb58a8adb1e133145995a0B80a1f4C36602";

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
  const likedArray = ref([]);
  const individualPost = ref([]);
  const routedUser = ref(null);
  const latestPosts = ref([]);
  const latestPostsArray = ref([]);

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
        const userPostCount = await rebelContract.getUserPostCount(address);
        const userPosts = await rebelContract.getPostsByOwner(address, userPostCount.toNumber());
        postedItems.value = [];
        postsArray.value = [];
        for (let i = 0; i < userPosts.namesArray.length; i++) {
          const postObj = new Object();
          postObj.name = userPosts.namesArray[i];
          postObj.mediaHash = userPosts.mediaHashesArray[i];
          postObj.metaHash = userPosts.metaHashesArray[i];
          postObj.likes = userPosts.likesArray[i];
          postObj.id = userPosts.idArray[i];
          postsArray.value.push(userPosts.idArray[i]);
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
        const totalPostCount = await rebelContract.getPostCount()
        const latestPostsResp = await rebelContract.getPosts(totalPostCount);
        latestPosts.value = [];
        latestPostsArray.value = [];
        for (let i = 0; i < latestPostsResp.namesArray.length; i++) {
          const postObj = new Object();
          if (latestPostsResp.namesArray[i]) {
            postObj.name = latestPostsResp.namesArray[i];
            postObj.mediaHash = latestPostsResp.mediaHashesArray[i];
            postObj.metaHash = latestPostsResp.metaHashesArray[i];
            postObj.likes = latestPostsResp.likesArray[i];
            postObj.id = latestPostsResp.idArray[i];
            latestPostsArray.value.push(latestPostsResp.idArray[i]);
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
        const post = await rebelContract.getPostById(postId);

        const postObj = new Object();
        postObj.name = post.name;
        postObj.mediaHash = post.mediaHash;
        postObj.metaHash = post.metaHash;
        postObj.likes = post.likes.toNumber();
        postObj.id = post.id.toNumber();
        postObj.address = post.addressOwner;

        const ipfsMetadata = await fetchIpfsMeta(postObj.metaHash);
        postObj.description = ipfsMetadata.description;
        postObj.attributes = ipfsMetadata.attributes;
        individualPost.value = postObj;

        await getUserByOwner(individualPost.value.address);
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
        const userObj = new Object();
        userObj.amtEarned = ethers.utils.formatEther(userResp.amtEarned);
        userObj.postCount = userResp.postCount;
        userObj.totalLikes = userResp.totalLikes;
        user.value = userObj;
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
      await getUserByOwner(account.value);
      if (user.value) {
        await getPostsByOwner(account.value);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return {
    connectWallet,
    account,
    postContent,
    getPostsByOwner,
    postedItems,
    getUserByOwner,
    user,
    likePost,
    isLiked,
    likedArray,
    postsArray,
    unlikePost,
    getPostById,
    individualPost,
    routedUser,
    getPostsLatest,
    latestPosts,
    latestPostsArray
  };
});
