pragma solidity ^0.8.0;

import "./postfactory.sol";
import "./userfactory.sol";
import "./safemath.sol";

contract SocialHelper is PostFactory, UserFactory {

  using SafeMath for uint256;
  using SafeMath32 for uint32;
  using SafeMath16 for uint16;

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
    payable(_owner).transfer(address(this).balance);
  }

  function setTxFee(uint _fee) external onlyOwner {
    txFee = _fee;
  }

  function likePost(uint _postId) external payable {
    require(msg.value >= txFee);
    posts[_postId].likes = posts[_postId].likes.add(1);
    address postOwner = postToOwner[_postId];
    uint fundsForOwner = msg.value.div(50);
    payable(postOwner).transfer(fundsForOwner);
  }

  function unlikePost(uint _postId) external {
    posts[_postId].likes = posts[_postId].likes.sub(1);
  }

  function followUser(uint _userId) external payable {
    require(msg.value >= txFee);
    users[_userId].followers = users[_userId].followers.add(1);
    ownerToUser[msg.sender].following = ownerToUser[msg.sender].following.add(1);
    address userOwner = userToOwner[_userId];
    uint fundsForOwner = msg.value.div(50);
    payable(userOwner).transfer(fundsForOwner);
  }

  function unfollowUser(uint _userId) external {
    users[_userId].followers = users[_userId].followers.sub(1);
    ownerToUser[msg.sender].following = ownerToUser[msg.sender].following.sub(1);
  }

  function changeName(uint _userId, string memory _newName) external onlyOwner() {
    users[_userId].name = _newName;
  }

  function changeBio(uint _userId, string memory _newBio) external onlyOwner() {
    users[_userId].bio = _newBio;
  }

  function getPostIdsByOwner(address _owner) external view returns(uint[] memory postIds) {
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

  function getPostsByOwner(address _owner) external view returns(Post[] memory posts) {
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

  function getPostsByIds(uint[] memory _postIds) external view returns(Post[] memory posts) {
    Post[] memory result = new Post[](_postIds.length);
    uint counter = 0;
    for (uint i = 0; i < _postIds.length; i++) {
      result[counter] = posts[_postIds[i]];
      counter++;
    }
    return result;
  }

  function getUserByOwner(address _owner) external view returns(User memory user) {
    for (uint i = 0; i < users.length; i++) {
      if (userToOwner[i] == _owner) {
        return users[i];
      }
    }
  }

}
