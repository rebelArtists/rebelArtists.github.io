// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ownable.sol";
import "./safemaths.sol";

contract UserFactory is Ownable {

  using SafeMath for uint256;
  using SafeMath32 for uint32;
  using SafeMath16 for uint16;

  event NewUser(uint userId, string userName, string bio, string profPicHash);

  struct User {
    string name;
    string bio;
    uint followers;
    uint following;
    string profPicHash;
    uint amtEarned;
    bool blacklisted;
    mapping (uint => bool) followersMap;
    mapping (uint => bool) followingMap;
  }

  uint userCounter;
  mapping (uint => User) usersMap;

  mapping (uint => address) public userToOwner;
  mapping (address => uint) ownerUserCount;
  mapping (address => uint) ownerToUserId;

  function createUser(string memory _name, string memory _bio, string memory _profPicHash) public {
    require(ownerUserCount[msg.sender] == 0);

    User storage newUser = usersMap[userCounter];
    newUser.name = _name;
    newUser.bio = _bio;
    newUser.followers = 0;
    newUser.following = 0;
    newUser.profPicHash = _profPicHash;
    newUser.amtEarned = 0;
    newUser.blacklisted = false;

    userToOwner[userCounter] = msg.sender;
    ownerToUserId[msg.sender] = userCounter;
    ownerUserCount[msg.sender] = ownerUserCount[msg.sender].add(1);
    emit NewUser(userCounter, _name, _bio, _profPicHash);
    userCounter = userCounter.add(1);
  }

}
