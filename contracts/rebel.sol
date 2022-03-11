// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./postfactory.sol";
import "./safemaths.sol";

contract Rebel is PostFactory {

  using SafeMath for uint256;
  using SafeMath32 for uint32;

  uint txFee = 0.02 ether;

  modifier aboveLikes(uint32 _likes) {
    require(usersMap[msg.sender].totalLikes >= _likes);
    _;
  }

  modifier canOnlyLikeOnce(uint32 _postId) {
    require(postsMap[_postId].likesMap[msg.sender] != true);
    _;
  }

  function withdraw() external onlyOwner {
    address _owner = owner();
    payable(_owner).transfer(address(this).balance);
  }

  function setTxFee(uint _fee) external onlyOwner {
    txFee = _fee;
  }

  function getTxFee() external view returns (
    uint currentTxFee
    ) {
    return (txFee);
  }

  function likePost(uint32 _postId) external payable requiresUserExists() canOnlyLikeOnce(_postId) {
    require(msg.value >= txFee);
    postsMap[_postId].likes = postsMap[_postId].likes.add(1);
    address postOwner = postToOwner[_postId];
    postsMap[_postId].likesMap[msg.sender] = true;

    uint fundsForOwner = msg.value.div(100).mul(98); // 2% cut for rebel
    payable(postOwner).transfer(fundsForOwner);
    usersMap[postOwner].amtEarned = usersMap[postOwner].amtEarned.add(fundsForOwner);
    usersMap[postOwner].totalLikes = usersMap[postOwner].totalLikes.add(1);
  }

  function unlikePost(uint32 _postId) external requiresUserExists() {
    postsMap[_postId].likes = postsMap[_postId].likes.sub(1);
    postsMap[_postId].likesMap[msg.sender] = false;
    address postOwner = postToOwner[_postId];
    usersMap[postOwner].totalLikes = usersMap[postOwner].totalLikes.sub(1);
  }

  function getPostsByOwner(address _owner, uint endingIndex) external view returns(
    string[] memory namesArray,
    string[] memory mediaHashesArray,
    string[] memory metaHashesArray,
    uint32[] memory likesArray,
    uint32[] memory idArray
    ) {

    uint32[] memory ownerPostIds = ownerToPostIds[_owner];
    uint assetsToFetch = 20;
    if (endingIndex > ownerPostIds.length) {
      endingIndex = ownerPostIds.length;
    }
    if (assetsToFetch > endingIndex) {
      assetsToFetch = endingIndex;
    }

    string[] memory names = new string[](assetsToFetch);
    string[] memory mediaHashes = new string[](assetsToFetch);
    string[] memory metaHashes = new string[](assetsToFetch);
    uint32[] memory likes = new uint32[](assetsToFetch);
    uint32[] memory postIds = new uint32[](assetsToFetch);

    if (ownerPostIds.length == 0) {
      return (names, mediaHashes, metaHashes, likes, postIds);
    }

    uint startingIndex = endingIndex.sub(assetsToFetch);
    uint32 loopCounter = 0;

    for (uint i = startingIndex; i < endingIndex; i++) {
        Post storage post = postsMap[ownerPostIds[i]];
        names[loopCounter] = post.name;
        mediaHashes[loopCounter] = post.mediaHash;
        metaHashes[loopCounter] = post.metaHash;
        likes[loopCounter] = post.likes;
        postIds[loopCounter] = ownerPostIds[i];
    }

    return (names, mediaHashes, metaHashes, likes, postIds);
  }

function getPostCount() external view returns (
  uint32 postCount
  ) {
    return postCounter;
  }

function getUserPostCount(address _address) external view returns (
  uint postCount
  ) {
    return ownerToPostIds[_address].length;
  }

function getPosts(uint32 endingIndex) external view returns(
  string[] memory namesArray,
  string[] memory mediaHashesArray,
  string[] memory metaHashesArray,
  uint32[] memory likesArray,
  uint32[] memory idArray
  ) {

  uint32 assetsToFetch = 20;
  if (endingIndex > postCounter) {
    endingIndex = postCounter;
  }
  if (assetsToFetch > endingIndex) {
    assetsToFetch = endingIndex;
  }

  string[] memory names = new string[](assetsToFetch);
  string[] memory mediaHashes = new string[](assetsToFetch);
  string[] memory metaHashes = new string[](assetsToFetch);
  uint32[] memory likes = new uint32[](assetsToFetch);
  uint32[] memory postIds = new uint32[](assetsToFetch);

  if (postCounter == 0) {
    return (names, mediaHashes, metaHashes, likes, postIds);
  }

  uint32 startingIndex = endingIndex.sub(assetsToFetch);
  uint32 loopCounter = 0;

  for (uint32 i = startingIndex; i < endingIndex; i++) {
      Post storage post = postsMap[i];
      names[loopCounter] = post.name;
      mediaHashes[loopCounter] = post.mediaHash;
      metaHashes[loopCounter] = post.metaHash;
      likes[loopCounter] = post.likes;
      postIds[loopCounter] = i;
      loopCounter = loopCounter.add(1);
  }

  return (names, mediaHashes, metaHashes, likes, postIds);
}

  function getPostById(uint32 _postId) external view returns(
    string memory name,
    string memory mediaHash,
    string memory metaHash,
    uint32 likes,
    uint32 id,
    address addressOwner
  ) {
    Post storage post = postsMap[_postId];
    return (post.name, post.mediaHash, post.metaHash, post.likes, _postId, postToOwner[_postId]);
  }

  function getUserByOwner(address _owner) external view returns(
    uint amtEarned,
    uint32 postCount,
    uint32 totalLikes
  ) {

    if (userExists[_owner] != true) {
      return (0, 0, 0);
    }

    User storage user = usersMap[_owner];
    return (user.amtEarned, user.postCount, user.totalLikes);
  }

  function isLiked(uint32[] memory postIds) external view returns(
    bool[] memory likedArray
  ) {
    bool[] memory likesList = new bool[](postIds.length);

    for (uint i = 0; i < postIds.length; i++) {
      Post storage post = postsMap[postIds[i]];
      likesList[i] = post.likesMap[msg.sender];
    }
    return (likesList);
  }
}
