export default class IPFSNetwork {
  constructor() {
    this.endpoint = new URL('https://ipfs.infura.io:5001');
  }

  /**
   * @param {Blob|File} blob
   * @property {String} name
   * @property {String} description
   * @property {String} attributes
   * @returns {Promise<String|Error>, Promise<String|Error>}
   */
  async storeBlob(blob, name, description, attributes) {
    const url = new URL('/api/v0/add?stream-channels=true', this.endpoint)

    if (blob.size === 0) {
      throw new Error('Content size is 0, make sure to provide some content')
    }

    // first add media itself to ipfs and get hash
    const formData = new FormData();
    formData.append('file', blob);
    const request = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
    })
    const resultFile = await request.json()
    if (!request.ok) {
      throw new Error(`Error while upload into IPFS Network`)
    }

    // next, add media hash along with all metadata to ipfs
    // conforms to erc721 key/value standards
    const metadata = {
        "name": name,
        "description": description,
        "image": `https://ipfs.io/ipfs/${resultFile.Hash}`,
        "external_url": `https://ipfs.io/ipfs/${resultFile.Hash}`,
        "attributes": JSON.parse(attributes),
    }

    // alter to blob format and send metadata to ipfs
    const bytes = new TextEncoder().encode(JSON.stringify(metadata));
    const blobMeta = new Blob([bytes], {
        type: "application/json;charset=utf-8"
    });
    const formDataMeta = new FormData();
    formDataMeta.append('file', blobMeta);
    const requestMeta = await fetch(url.toString(), {
      method: 'POST',
      body: formDataMeta,
    })
    const resultMeta = await requestMeta.json()

    if (requestMeta.ok) {
      return {
        'metaHash': resultMeta.Hash,
        'fileHash': resultFile.Hash
      };
    } else {
      throw new Error(`Error while uploading metadata into IPFS Network`)
    }
  }
}
