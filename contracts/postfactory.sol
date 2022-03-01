// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ownable.sol";
import "./safemaths.sol";

contract PostFactory is Ownable {

  using SafeMath for uint256;
  using SafeMath32 for uint32;
  using SafeMath16 for uint16;

  event NewPost(uint postId, string name, string mediaHash, string metaHash);

  struct Post {
    string name;
    string mediaHash;
    string metaHash;
    uint likes;
    bool blacklisted;
    mapping (uint => bool) likesMap;
  }

  uint postCounter;
  mapping (uint => Post) postsMap;

  mapping (uint => address) public postToOwner;
  mapping (address => uint) ownerPostCount;
  mapping (address => uint[]) public ownerToPostIds;

  function createPost(string memory _name, string memory _mediaHash, string memory _metaHash) public {
    postCounter = postCounter.add(1);
    Post storage newPost = postsMap[postCounter];
    newPost.name = _name;
    newPost.mediaHash = _mediaHash;
    newPost.metaHash = _metaHash;
    newPost.likes = 0;
    newPost.blacklisted = false;

    postToOwner[postCounter] = msg.sender;
    ownerPostCount[msg.sender] = ownerPostCount[msg.sender].add(1);
    ownerToPostIds[msg.sender].push(postCounter);
    emit NewPost(postCounter, _name, _mediaHash, _metaHash);

  }

}
