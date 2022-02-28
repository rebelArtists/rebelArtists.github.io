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
    bool blacklisted;
  }

  User[] public users;

  mapping (uint => address) public userToOwner;
  mapping (address => uint) ownerUserCount;
  mapping (address => User) ownerToUser;

  function createUser(string memory _name, string memory _bio, string memory _profPicHash) public {
    require(ownerUserCount[msg.sender] == 0);
    users.push(User(_name, _bio, 0, 0, _profPicHash, false));
    uint id = users.length - 1;
    userToOwner[id] = msg.sender;
    ownerToUser[msg.sender] = users[id];
    ownerUserCount[msg.sender] = ownerUserCount[msg.sender].add(1);
    emit NewUser(id, _name, _bio, _profPicHash);
  }

}
