import { defineStore } from "pinia"
import { ref } from "vue"
import Storage from "@src/services/storage";
import { ethers } from 'ethers'
import contractABInsta from '../artifacts/contracts/InstagramPosting.sol/InstagramPosting.json'

const db = new Storage("app");
const contractAddressInsta = '0x279608E8F8cE4FbE02726B3ef999e0DA92153E43';

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
      console.log(...files)
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
