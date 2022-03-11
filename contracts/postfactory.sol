// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ownable.sol";
import "./safemaths.sol";
import "./userfactory.sol";

contract PostFactory is Ownable, UserFactory {

  using SafeMath for uint256;
  using SafeMath32 for uint32;

  event NewPost(uint postId, string name, string mediaHash, string metaHash);

  struct Post {
    string name;
    string mediaHash;
    string metaHash;
    uint32 likes;
    mapping (address => bool) likesMap;
  }

  uint32 postCounter;
  mapping (uint32 => Post) postsMap;
  mapping (uint32 => address) public postToOwner;
  mapping (address => uint32[]) public ownerToPostIds;

  modifier requiresUserExists() {
    if (userExists[msg.sender] != true) {
      createUser(msg.sender);
    }
    _;
  }

  function createPost(string memory _name, string memory _mediaHash, string memory _metaHash) public requiresUserExists() {

    Post storage newPost = postsMap[postCounter];
    newPost.name = _name;
    newPost.mediaHash = _mediaHash;
    newPost.metaHash = _metaHash;
    newPost.likes = 0;

    postToOwner[postCounter] = msg.sender;
    ownerToPostIds[msg.sender].push(postCounter);
    usersMap[msg.sender].postCount = usersMap[msg.sender].postCount.add(1);

    emit NewPost(postCounter, _name, _mediaHash, _metaHash);

    postCounter = postCounter.add(1);
  }

}
