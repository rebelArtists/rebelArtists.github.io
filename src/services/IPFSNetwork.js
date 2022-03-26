import { sha256 } from "js-sha256";

export default class IPFSNetwork {
  constructor() {
    this.endpoint = new URL("https://ipfs.infura.io:5001");
  }

  async uploadIpfs(blob) {
    const url = new URL("/api/v0/add?stream-channels=true", this.endpoint);
    // first add media itself to ipfs and get hash
    const formData = new FormData();
    formData.append("file", blob);
    const request = await fetch(url.toString(), {
      method: "POST",
      body: formData,
    });
    const resultResp = await request.json();
    if (!request.ok) {
      throw new Error(`Error while upload into IPFS Network`);
    }
    return [resultResp, formData];
  }

  async uploadCloudinary(ipfsHash, formData) {
    const public_id = ipfsHash;
    const timestamp = new Date().getTime();
    const upload_preset = "ipfs_signed";
    const signatureStr = `public_id=${public_id}&timestamp=${timestamp}&upload_preset=${upload_preset}${
      import.meta.env.VITE_CLOUDINARY_SECRET_KEY
    }`;

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/auto/upload`;
    formData.append("upload_preset", upload_preset);
    formData.append("public_id", public_id);
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", sha256(signatureStr));
    const respCloudinary = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });
    if (!respCloudinary.ok) {
      throw new Error(`Error while upload to cloudinary`);
    }
  }

  /**
   * @param {Blob|File} blob
   * @property {String} name
   * @property {String} description
   * @property {String} attributes
   * @returns {Promise<String|Error>, Promise<String|Error>}
   */
  async storeBlob(blob, name, description, attributes) {
    if (blob.size === 0) {
      throw new Error("Content size is 0, make sure to provide some content");
    }

    const [resultFile, formData] = await this.uploadIpfs(blob);

    await this.uploadCloudinary(resultFile.Hash, formData);

    // next, add media hash along with all metadata to ipfs
    // conforms to erc721 key/value standards
    const metadata = {
      name: name,
      description: description,
      image: `https://ipfs.io/ipfs/${resultFile.Hash}`,
      external_url: `https://ipfs.io/ipfs/${resultFile.Hash}`,
      attributes: JSON.parse(attributes),
    };

    // alter to blob format and send metadata to ipfs
    const bytes = new TextEncoder().encode(JSON.stringify(metadata));
    const blobMeta = new Blob([bytes], {
      type: "application/json;charset=utf-8",
    });

    const [resultMeta] = await this.uploadIpfs(blobMeta);

    return {
      metaHash: resultMeta.Hash,
      fileHash: resultFile.Hash,
    };
  }
}
