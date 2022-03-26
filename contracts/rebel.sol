// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./postfactory.sol";
import "./safemaths.sol";

interface RebelTokenInterface {
  function transfer(address to, uint amount) external returns (bool);
}

contract Rebel is PostFactory {

  using SafeMath for uint256;
  using SafeMath32 for uint32;

  mapping (address => uint) userIncentives;
  address private _rebelTokenAddress;
  uint txFee = 0.02 ether;
  uint incentiveLevelOne = 100;
  uint incentiveLevelTwo = 1000;
  uint incentiveLevelThree = 10000;
  uint incentiveLevelFour = 100000;
  uint incentiveLevelFive = 1000000;

  constructor(address rebelTokenAddress_) {
      _rebelTokenAddress = rebelTokenAddress_;
  }

  function aboveLikes(address _user) internal {
    uint currentUserIncentives = userIncentives[_user];
    // LEVEL 1 REWARD
    if (usersMap[_user].totalLikes >= uint32(incentiveLevelOne) && currentUserIncentives < incentiveLevelOne) {
      RebelTokenInterface(_rebelTokenAddress).transfer(_user, incentiveLevelOne*10**18);
      userIncentives[_user] = userIncentives[_user].add(incentiveLevelOne);
    }
    // LEVEL 2 REWARD
    if (usersMap[_user].totalLikes >= uint32(incentiveLevelTwo) && currentUserIncentives < (incentiveLevelOne+incentiveLevelTwo)) {
      RebelTokenInterface(_rebelTokenAddress).transfer(_user, incentiveLevelTwo*10**18);
      userIncentives[_user] = userIncentives[_user].add(incentiveLevelTwo);
    }
    // LEVEL 3 REWARD
    if (usersMap[_user].totalLikes >= uint32(incentiveLevelThree) && currentUserIncentives < (incentiveLevelOne+incentiveLevelTwo+incentiveLevelThree)) {
      RebelTokenInterface(_rebelTokenAddress).transfer(_user, incentiveLevelThree*10**18);
      userIncentives[_user] = userIncentives[_user].add(incentiveLevelThree);
    }
    // LEVEL 4 REWARD
    if (usersMap[_user].totalLikes >= uint32(incentiveLevelFour) && currentUserIncentives < (incentiveLevelOne+incentiveLevelTwo+incentiveLevelThree+incentiveLevelFour)) {
      RebelTokenInterface(_rebelTokenAddress).transfer(_user, incentiveLevelFour*10**18);
      userIncentives[_user] = userIncentives[_user].add(incentiveLevelFour);
    }
    // LEVEL 5 REWARD
    if (usersMap[_user].totalLikes >= uint32(incentiveLevelFive) && currentUserIncentives < (incentiveLevelOne+incentiveLevelTwo+incentiveLevelThree+incentiveLevelFour+incentiveLevelFive)) {
      RebelTokenInterface(_rebelTokenAddress).transfer(_user, incentiveLevelFive*10**18);
      userIncentives[_user] = userIncentives[_user].add(incentiveLevelFive);
    }
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

  function donateToUser(address _user) external payable requiresDoneeExists(_user) requiresUserExists() {
    require(msg.value >= 0);
    if (userExists[_user] != true) {
      createUser(_user);
    }
    uint fundsForOwner = msg.value.div(100).mul(98); // 2% cut for rebel
    payable(_user).transfer(fundsForOwner);
    usersMap[_user].amtEarned = usersMap[_user].amtEarned.add(fundsForOwner);
  }

  function likePost(uint32 _postId) external payable requiresUserExists() canOnlyLikeOnce(_postId) {
    require(msg.value >= txFee);
    postsMap[_postId].likes = postsMap[_postId].likes.add(1);
    address postOwner = postToOwner[_postId];
    postsMap[_postId].likesMap[msg.sender] = true;
    userLikedPosts[msg.sender].push(_postId);
    postToLikingUsers[_postId].push(msg.sender);

    uint fundsForOwner = msg.value.div(100).mul(98); // 2% cut for rebel
    payable(postOwner).transfer(fundsForOwner);
    usersMap[postOwner].amtEarned = usersMap[postOwner].amtEarned.add(fundsForOwner);
    usersMap[postOwner].totalLikes = usersMap[postOwner].totalLikes.add(1);
    // check whether to release incentive
    aboveLikes(postOwner);
  }

  function unlikePost(uint32 _postId) external requiresUserExists() {
    postsMap[_postId].likes = postsMap[_postId].likes.sub(1);
    postsMap[_postId].likesMap[msg.sender] = false;
    address postOwner = postToOwner[_postId];
    usersMap[postOwner].totalLikes = usersMap[postOwner].totalLikes.sub(1);
  }

  function getRandomPosts() external view returns(
    string[] memory namesArray,
    string[] memory mediaHashesArray,
    string[] memory mediaTypeArray,
    uint32[] memory likesArray,
    uint32[] memory idArray
  ) {

  uint32 assetsToFetch = 20;
  uint32 randNonce = 0;

  string[] memory names = new string[](assetsToFetch);
  string[] memory mediaHashes = new string[](assetsToFetch);
  string[] memory mediaTypes = new string[](assetsToFetch);
  uint32[] memory likes = new uint32[](assetsToFetch);
  uint32[] memory postIds = new uint32[](assetsToFetch);

  if (postCounter == 0) {
    return (names, mediaHashes, mediaTypes, likes, postIds);
  }

  for (uint32 i = 0; i < assetsToFetch; i++) {
    postIds[i] = uint32(uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % postCounter);
    randNonce++;
  }

  for (uint32 i = 0; i < assetsToFetch; i++) {
      Post storage post = postsMap[postIds[i]];
      names[i] = post.name;
      mediaHashes[i] = post.mediaHash;
      mediaTypes[i] = post.mediaType;
      likes[i] = post.likes;
  }

  return (names, mediaHashes, mediaTypes, likes, postIds);
}

  function getPostsLikedByOwnerList(address _owner) public view returns(
    uint32[] memory postIdArray,
    uint likesCount
  ) {
    uint32[] memory ownerLikedPostIds = userLikedPosts[_owner];
    uint32 counter = 0;

    for (uint i = 0; i < ownerLikedPostIds.length; i++) {
      bool isLikedPost = postsMap[ownerLikedPostIds[i]].likesMap[_owner];
      if (isLikedPost = true) {
        counter = counter.add(1);
      }
    }
    uint32[] memory trueLikes = new uint32[](counter);
    for (uint i = 0; i < ownerLikedPostIds.length; i++) {
      bool isLikedPost = postsMap[ownerLikedPostIds[i]].likesMap[_owner];
      if (isLikedPost = true) {
        trueLikes[i] = ownerLikedPostIds[i];
      }
    }

    return (trueLikes, counter);
  }

  function getPostsLikedByOwner(address _owner, uint endingIndex) external view returns(
    string[] memory namesArray,
    string[] memory mediaHashesArray,
    string[] memory mediaTypeArray,
    uint32[] memory likesArray,
    uint32[] memory idArray
    ) {

    (uint32[] memory ownerLikedPostIds,) = getPostsLikedByOwnerList(_owner);
    uint assetsToFetch = 20;
    if (endingIndex > ownerLikedPostIds.length) {
      endingIndex = ownerLikedPostIds.length;
    }
    if (assetsToFetch > endingIndex) {
      assetsToFetch = endingIndex;
    }

    string[] memory names = new string[](assetsToFetch);
    string[] memory mediaHashes = new string[](assetsToFetch);
    string[] memory mediaTypes = new string[](assetsToFetch);
    uint32[] memory likes = new uint32[](assetsToFetch);
    uint32[] memory postIds = new uint32[](assetsToFetch);

    if (ownerLikedPostIds.length == 0) {
      return (names, mediaHashes, mediaTypes, likes, postIds);
    }

    uint startingIndex = endingIndex.sub(assetsToFetch);
    uint32 loopCounter = 0;

    for (uint i = startingIndex; i < endingIndex; i++) {
        Post storage post = postsMap[ownerLikedPostIds[i]];
        names[loopCounter] = post.name;
        mediaHashes[loopCounter] = post.mediaHash;
        mediaTypes[loopCounter] = post.mediaType;
        likes[loopCounter] = post.likes;
        postIds[loopCounter] = ownerLikedPostIds[i];
        loopCounter = loopCounter.add(1);
    }

    return (names, mediaHashes, mediaTypes, likes, postIds);
  }

  // remove this fake comment
  function getPostsByOwner(address _owner, uint endingIndex) external view returns(
    string[] memory namesArray,
    string[] memory mediaHashesArray,
    string[] memory mediaTypeArray,
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
    string[] memory mediaTypes = new string[](assetsToFetch);
    uint32[] memory likes = new uint32[](assetsToFetch);
    uint32[] memory postIds = new uint32[](assetsToFetch);

    if (ownerPostIds.length == 0) {
      return (names, mediaHashes, mediaTypes, likes, postIds);
    }

    uint startingIndex = endingIndex.sub(assetsToFetch);
    uint32 loopCounter = 0;

    for (uint i = startingIndex; i < endingIndex; i++) {
        Post storage post = postsMap[ownerPostIds[i]];
        names[loopCounter] = post.name;
        mediaHashes[loopCounter] = post.mediaHash;
        mediaTypes[loopCounter] = post.mediaType;
        likes[loopCounter] = post.likes;
        postIds[loopCounter] = ownerPostIds[i];
        loopCounter = loopCounter.add(1);
    }

    return (names, mediaHashes, mediaTypes, likes, postIds);
  }

  function getAddressesWhoLiked(uint32 _postId) external view returns(
    address[] memory addressArray
    ) {

      address[] memory likingUserAddresses = postToLikingUsers[_postId];
      uint32 counter = 0;

      for (uint i = 0; i < likingUserAddresses.length; i++) {
        bool isLikedPost = postsMap[_postId].likesMap[likingUserAddresses[i]];
        if (isLikedPost = true) {
          counter = counter.add(1);
        }
      }
      address[] memory trueLikeAddresses = new address[](counter);
      for (uint i = 0; i < likingUserAddresses.length; i++) {
        bool isLikedPost = postsMap[_postId].likesMap[likingUserAddresses[i]];
        if (isLikedPost = true) {
          trueLikeAddresses[i] = likingUserAddresses[i];
        }
      }

      return (trueLikeAddresses);
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
    string[] memory mediaTypeArray,
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
    string[] memory mediaTypes = new string[](assetsToFetch);
    uint32[] memory likes = new uint32[](assetsToFetch);
    uint32[] memory postIds = new uint32[](assetsToFetch);

    if (postCounter == 0) {
      return (names, mediaHashes, mediaTypes, likes, postIds);
    }

    uint32 startingIndex = endingIndex.sub(assetsToFetch);
    uint32 loopCounter = 0;

    for (uint32 i = startingIndex; i < endingIndex; i++) {
        Post storage post = postsMap[i];
        names[loopCounter] = post.name;
        mediaHashes[loopCounter] = post.mediaHash;
        mediaTypes[loopCounter] = post.mediaType;
        likes[loopCounter] = post.likes;
        postIds[loopCounter] = i;
        loopCounter = loopCounter.add(1);
    }

    return (names, mediaHashes, mediaTypes, likes, postIds);
  }

  function getPostById(uint32 _postId) external view returns(
    string memory name,
    string memory mediaHash,
    string memory metaHash,
    string memory mediaType,
    uint32 likes,
    uint32 id,
    address addressOwner
  ) {
    Post storage post = postsMap[_postId];
    address owner = postToOwner[_postId];
    return (post.name, post.mediaHash, post.metaHash, post.mediaType, post.likes, _postId, owner);
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
