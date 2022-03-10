// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ownable.sol";
import "./safemaths.sol";

contract UserFactory is Ownable {

  using SafeMath for uint256;
  using SafeMath32 for uint32;

  event NewUser(address userAddress);

  struct User {
    uint amtEarned;
    uint32 postCount;
    uint32 totalLikes;
  }

  mapping (address => User) usersMap;

  function createUser(address memory _address) internal {

    User storage newUser = usersMap[_address];
    newUser.amtEarned = 0;
    newUser.postCount = 0;
    newUser.totalLikes = 0;

    emit NewUser(_address);
  }

}
