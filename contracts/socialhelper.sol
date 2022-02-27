pragma solidity ^0.4.25;

import "./postfactory.sol";
import "./userfactory.sol";

contract SocialHelper is PostFactory, UserFactory {

  uint txFee = 0.01 ether;

  modifier aboveLikes(uint _likes, uint _postId) {
    require(posts[_postId].likes >= _likes);
    _;
  }

  modifier aboveFollowers(uint _followers, uint _userId) {
    require(users[_userId].followers >= _followers);
    _;
  }

  function withdraw() external onlyOwner {
    address _owner = owner();
    _owner.transfer(address(this).balance);
  }

  function setTxFee(uint _fee) external onlyOwner {
    txFee = _fee;
  }

  function likePost(uint _postId) external payable {
    require(msg.value >= txFee);
    posts[_postId].likes = posts[_postId].likes.add(1);
    address postOwner = postToOwner[_postId];
    uint fundsForOwner = msg.value.div(50) // 2% cut for dao
    (bool sent, bytes memory data) = postOwner.call{value: fundsForOwner}("");
    require(sent, "Failed to send Ether");
  }

  function unlikePost(uint _postId) external {
    posts[_postId].likes = posts[_postId].likes.sub(1);
  }

  function followUser(uint _userId) external payable {
    require(msg.value >= txFee);
    users[_userId].followers = users[_userId].followers.add(1);
    ownerToUser[msg.sender].following = ownerToUser[msg.sender].following.add(1);
    uint fundsForOwner = msg.value.div(50) // 2% cut for dao
    (bool sent, bytes memory data) = postOwner.call{value: fundsForOwner}("");
    require(sent, "Failed to send Ether");
  }

  function unfollowUser(uint _userId) external {
    users[_userId].followers = users[_userId].followers.sub(1);
    ownerToUser[msg.sender].following = ownerToUser[msg.sender].following.sub(1);
  }

  function changeName(uint _userId, string _newName) external onlyOwnerOf(_userId) {
    users[_userId].name = _newName;
  }

  function changeBio(uint _userId, string _newBio) external onlyOwnerOf(_userId) {
    users[_userId].bio = _newBio;
  }

  function getPostIdsByOwner(address _owner) external view returns(uint[]) {
    uint[] memory result = new uint[](ownerPostCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < posts.length; i++) {
      if (postToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  function getPostsByOwner(address _owner) external view returns(Post[]) {
    Post[] memory result = new Post[](ownerPostCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < posts.length; i++) {
      if (postToOwner[i] == _owner) {
        result[counter] = posts[i];
        counter++;
      }
    }
    return result;
  }

  function getPostsByIds(uint[] _postIds) external view returns(Post[]) {
    Post[] memory result = new Post[](_postIds.length);
    uint counter = 0;
    for (uint i = 0; i < _postIds.length; i++) {
      result[counter] = posts[_postIds[i]];
      counter++;
    }
    return result;
  }

  function getUserByOwner(address _owner) external view returns(User) {
    User memory result = new User;
    for (uint i = 0; i < users.length; i++) {
      if (userToOwner[i] == _owner) {
        result = users[i];
        return result;
      }
    }
    return result;
  }

}
