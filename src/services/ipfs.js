import IPFSNetwork from "@src/services/IPFSNetwork";

/**
 * Upload Blob to NFT Storage
 *
 * @typedef {Object} SafeAsync
 * @property {Boolean|Error} error
 * @property {FileDetail} data
 *
 * @param {File} file
 * @property {String} name
 * @property {String} description
 * @property {String} attributes
 * @returns {Promise<SafeAsync>}
 */
export const uploadBlob = async (file, name, description, attributes) => {
  const client = new IPFSNetwork();

  let detail = getCidDetail({ metaCid: null, fileCid: null, file });

  // Max 50MB Upload
  if (file.size > 52428800) {
    return [new Error(`Maximum file size to be upload is 50 MB`), detail];
  }

  try {
    let ipfsHashes = await client.storeBlob(
      file,
      name,
      description,
      attributes
    );
    let metaHash = ipfsHashes.metaHash,
      fileHash = ipfsHashes.fileHash;
    // const cid = await client.storeBlob(file);
    detail = getCidDetail({ metaCid: metaHash, fileCid: fileHash, file });
    return { error: false, data: detail };
  } catch (error) {
    console.log(error);
    return { error, data: detail };
  }
};

/**
 * Get CID Detail with File
 *
 * @typedef {Object} FileDetail
 * @property {String} metaCid
 * @property {String} fileCid
 * @property {Object} file
 * @property {String} file.name
 * @property {String} file.type
 * @property {Number} file.size
 * @property {Number} file.created_at
 *
 * @param {Object} params
 * @param {String} params.metaCid
 * @param {String} params.fileCid
 * @param {File} params.file
 * @returns {FileDetail}
 */
export const getCidDetail = ({ metaCid, fileCid, file }) => {
  const base = {
    name: file.name,
    type: file.type,
    size: file.size,
    created_at: Date.now(),
  };

  if (!metaCid) return { metaCid: null, fileCid: null, file: base };

  return {
    metaCid: metaCid,
    fileCid: fileCid,
    file: base,
  };
};
