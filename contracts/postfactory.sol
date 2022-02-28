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
  }

  Post[] public posts;

  mapping (uint => address) public postToOwner;
  mapping (address => uint) ownerPostCount;
  mapping (address => uint[]) public ownerToPostIds;

  function createPost(string memory _name, string memory _mediaHash, string memory _metaHash) public {
    posts.push(Post(_name, _mediaHash, _metaHash, 0, false));
    uint id = posts.length - 1;
    postToOwner[id] = msg.sender;
    ownerPostCount[msg.sender] = ownerPostCount[msg.sender].add(1);
    ownerToPostIds[msg.sender].push(id);
    emit NewPost(id, _name, _mediaHash, _metaHash);
  }

}
