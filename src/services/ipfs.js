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

  let detail = getCidDetail({
    metaCid: null,
    fileCid: null,
    fileType: null,
    file,
  });

  let fileType = "";
  if (file.type.includes("image")) {
    fileType = "image";
  } else if (file.type.includes("video")) {
    fileType = "video";
  } else if (file.type.includes("audio")) {
    fileType = "audio";
  } else {
    return { error: new Error(`Unsupported file type`), data: detail };
  }

  // Max 25MB Upload... 100MB fully possible with larger Cloudinary tier
  if (file.size > 26214400) {
    return { error: new Error(`Maximum file size is 25 MB`), data: detail };
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
    detail = getCidDetail({
      metaCid: metaHash,
      fileCid: fileHash,
      fileType: fileType,
      file,
    });
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
 * @property {String} fileType
 * @property {Object} file
 * @property {String} file.name
 * @property {String} file.type
 * @property {Number} file.size
 * @property {Number} file.created_at
 *
 * @param {Object} params
 * @param {String} params.metaCid
 * @param {String} params.fileCid
 * @param {String} params.fileType
 * @param {File} params.file
 * @returns {FileDetail}
 */
export const getCidDetail = ({ metaCid, fileCid, fileType, file }) => {
  const base = {
    name: file.name,
    type: file.type,
    size: file.size,
    created_at: Date.now(),
  };

  if (!metaCid)
    return { metaCid: null, fileCid: null, fileType: null, file: base };

  return {
    metaCid: metaCid,
    fileCid: fileCid,
    fileType: fileType,
    file: base,
  };
};
