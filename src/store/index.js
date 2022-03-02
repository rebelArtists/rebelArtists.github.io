import { defineStore } from "pinia"
import { ref } from "vue"
import Storage from "@src/services/storage";
import { ethers } from 'ethers'
import contractABInsta from '../artifacts/contracts/InstagramPosting.sol/InstagramPosting.json'
import contractABIrebel from '../artifacts/contracts/SocialHelper.sol/SocialHelper.json'

const db = new Storage("app");
const contractAddressInsta = '0x279608E8F8cE4FbE02726B3ef999e0DA92153E43';
// const contractAddressRebel = '0x3F899516c4562Bb74fFeb6246d1848ae9E9e6927';
// const contractAddressRebel = '0x7306BB8b0B6e19D09ddEfD9762Fc587eA8D0E9e5';
// const contractAddressRebel = '0x75099A61816CC30E8249E29f92C9880DB5d37185';
// const contractAddressRebel = '0x1D0Dde0c9b75d401d5B4B33B1c7Cf306da1ca35B';
const contractAddressRebel = '0x8404cC8D5634d9E53eAE5F860F34c8A61F73fA75';

db.read();
db.data ||= { version: "0.0.1", results: [] };

export const useStore = defineStore({
  id: "store",
  state() {
    return {
      files: [],
      results: db.data.results
    }
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

      db.data.results = [ ...this.results ];
      db.write();
    },
    /**
     * Update Shorten Link for File
     * @param {String} metaCid
     * @param {String} fileCid
     * @param {String} link
     */
    updateShortenLink(metaCid, link) {
      this.results = this.results.map(result => {
        if (result.metaCid === metaCid) {
          return { ...result, shorten: link }
        }

        return result;
      });

      db.data.results = [ ...this.results ];
      db.write();
    }
  }
});

export const useInstaStore = defineStore('insta', () => {
  const account = ref(null)
  const indexCount = ref(0)
  const postedItems = ref([])

  async function postContent(imgHash, textHash) {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const instaContract = new ethers.Contract(contractAddressInsta, contractABInsta.abi, signer)
        const posted = (await instaContract.sendHash(imgHash, textHash))
        console.log('Mining...', posted.hash)
        await posted.wait()
        console.log('Mined -- ', posted.hash)
      }
    }
    catch (e) {
      console.log('e', e)
    }
  }

  async function getContent(postIndex) {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const instaContract = new ethers.Contract(contractAddressInsta, contractABInsta.abi, signer)
        const post = (await instaContract.getHash(postIndex));
        postedItems.value.push(post);
        console.log("got post", post.img)
      }
    }
    catch (e) {
      console.log('e', e)
    }
  }

async function getAllPosts() {
  try {
    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const instaContract = new ethers.Contract(contractAddressInsta, contractABInsta.abi, signer)
      console.log("got here")
      for (let i = 0; i < indexCount.value; i++) {
        await getContent(i);
      }
    }
  }
  catch (e) {
    console.log('e', e)
  }
}

  async function getNftIndex() {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const instaContract = new ethers.Contract(contractAddressInsta, contractABInsta.abi, signer)
        indexCount.value = (await instaContract.getCounter()).toNumber()
        console.log("got index count", indexCount.value)
      }
    }
    catch (e) {
      console.log('e', e)
    }
  }

  async function connectWallet() {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('Must connect to MetaMask!')
        return
      }
      const myAccounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Connected: ', myAccounts[0])
      account.value = myAccounts[0]
      await getNftIndex();
      await getAllPosts();
    }
    catch (error) {
      console.log(error)
    }
  }

  return {
    connectWallet,
    account,
    postContent,
    getContent,
    getNftIndex,
    indexCount,
    postedItems
  }
});

export const useRebelStore = defineStore('rebel', () => {
  const account = ref(null)
  const user = ref(null)
  const indexCount = ref(0)
  const postedItems = ref([])
  const postsArray = ref([])
  const isFollowingUser = ref(false)
  const likedArray = ref([])

  async function postContent(name, mediaHash, metaHash) {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const rebelContract = new ethers.Contract(contractAddressRebel, contractABIrebel.abi, signer)
        const posted = (await rebelContract.createPost(name, mediaHash, metaHash))
        console.log('Mining...', posted.hash)
        await posted.wait()
        console.log('Mined -- ', posted.hash)
      }
    }
    catch (e) {
      console.log('e', e)
    }
  }

  async function createUser(name, bio, profPicHash) {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const rebelContract = new ethers.Contract(contractAddressRebel, contractABIrebel.abi, signer)
        const user = (await rebelContract.createUser(name, bio, profPicHash))
        console.log('Creating user...', user.hash)
        await user.wait()
        console.log('Mined user -- ', user.hash)
      }
    }
    catch (e) {
      console.log('e', e)
    }
  }

async function getPostsByUser() {
  try {
    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const rebelContract = new ethers.Contract(contractAddressRebel, contractABIrebel.abi, signer)
      const userPosts = (await rebelContract.getPostsByOwner(account.value))
      postedItems.value = [];
      postsArray.value = [];
      for (let i = 0; i < userPosts.namesArray.length; i++) {
        const postObj = new Object();
        postObj.name = userPosts.namesArray[i];
        postObj.mediaHash = userPosts.mediaHashesArray[i];
        postObj.metaHash = userPosts.metaHashesArray[i];
        postObj.likes = userPosts.likesArray[i].toNumber();
        postObj.blacklisted = userPosts.blacklistedArray[i];
        postObj.id = userPosts.idArray[i].toNumber();
        postsArray.value.push(userPosts.idArray[i].toNumber());
        postedItems.value.push(postObj);
      }
    }
  }
  catch (e) {
    console.log('e', e)
  }
}

async function getUserByOwner() {
  try {
    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const rebelContract = new ethers.Contract(contractAddressRebel, contractABIrebel.abi, signer)
      const userResp = (await rebelContract.getUserByOwner(account.value))
      if (userResp.profPicHash != "") {
        const userObj = new Object();
        userObj.name = userResp.name;
        userObj.bio = userResp.bio;
        userObj.followers = userResp.followers.toNumber();
        userObj.following = userResp.following.toNumber();
        userObj.profPicHash = userResp.profPicHash;
        userObj.blacklisted = userResp.blacklisted;
        userObj.postCount = userResp.postCount.toNumber();
        userObj.id = userResp.id.toNumber();
        user.value = userObj;
      }
      isFollowing
    }
  }
  catch (e) {
    console.log('e', e)
  }
}


  async function followUser(userId) {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const rebelContract = new ethers.Contract(contractAddressRebel, contractABIrebel.abi, signer)
        const follow = (await rebelContract.followUser(userId, {value: ethers.utils.parseEther(".02")}))
        console.log('Following user...')
        await follow.wait()
        console.log('Followed user successfully ')
      }
    }
    catch (e) {
      console.log('e', e)
    }
  }

  async function unfollowUser(userId) {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const rebelContract = new ethers.Contract(contractAddressRebel, contractABIrebel.abi, signer)
        const unfollow = (await rebelContract.unfollowUser(userId))
        console.log('Unfollowing user...')
        await unfollow.wait()
        console.log('Unfollowed user successfully ')
      }
    }
    catch (e) {
      console.log('e', e)
    }
  }

  async function likePost(postId) {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const rebelContract = new ethers.Contract(contractAddressRebel, contractABIrebel.abi, signer)
        const like = (await rebelContract.likePost(postId, {value: ethers.utils.parseEther(".02")}))
        console.log('Liking post...', like.hash)
        await like.wait()
        console.log('Liked post successfully', like.hash)
      }
    }
    catch (e) {
      console.log('e', e)
    }
  }

  async function unlikePost(postId) {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const rebelContract = new ethers.Contract(contractAddressRebel, contractABIrebel.abi, signer)
        const unlike = (await rebelContract.unlikePost(postId))
        console.log('Unliking post...', unlike.hash)
        await unlike.wait()
        console.log('Unliked post successfully', unlike.hash)
      }
    }
    catch (e) {
      console.log('e', e)
    }
  }

  async function isFollowing(userId) {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const rebelContract = new ethers.Contract(contractAddressRebel, contractABIrebel.abi, signer)
        const following = (await rebelContract.isFollowing(userId))
        isFollowingUser.value = following;
      }
    }
    catch (e) {
      console.log('e', e)
    }
  }


  async function isLiked(postIds) {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const rebelContract = new ethers.Contract(contractAddressRebel, contractABIrebel.abi, signer)
        const liked = (await rebelContract.isLiked(postIds))
        likedArray.value = liked;
      }
    }
    catch (e) {
      console.log('e', e)
    }
  }

  async function connectWallet() {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('Must connect to MetaMask!')
        return
      }
      const myAccounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Connected: ', myAccounts[0])
      account.value = myAccounts[0]
      await getUserByOwner();
      if (user.value) {
        await getPostsByUser(account.value);
      }
    }
    catch (error) {
      console.log(error)
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
    unfollowUser
  }
});
