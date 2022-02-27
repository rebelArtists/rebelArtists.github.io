pragma solidity ^0.4.25;

import "./ownable.sol";
import "./safemath.sol";

contract UserFactory is Ownable {

  using SafeMath for uint256;
  using SafeMath32 for uint32;
  using SafeMath16 for uint16;

  event NewUser(uint userId, string userName);

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

  function _createUser(string _name, string _bio, string _profPicHash) public {
    require(ownerUserCount[msg.sender] == 0);
    uint id = users.push(User(_name, _bio, 0, 0, _profPicHash, false)) - 1;
    userToOwner[id] = msg.sender;
    ownerUserCount[msg.sender] = ownerUserCount[msg.sender].add(1);
    emit NewUser(id, _name, _bio, _profPicHash);
  }

}
