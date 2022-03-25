// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ownable.sol";
import "./safemaths.sol";

interface RebelTokenInterface {
  function transfer(address to, uint amount) external returns (bool);
}

contract RebelTokenCrowdsale is Ownable {

  using SafeMath for uint256;

  // Track investor contributions
  uint public investorMinCap = 1000000000000000000; // 1 MATIC
  uint public investorHardCap = 1000000000000000000000000; // 1MM MATIC
  uint public rate = 1000000000000000000; // 1 MATIC
  mapping(address => uint) public contributions;
  uint public totalContributionsWei = 0;
  address private _rebelTokenAddress;

  constructor(address rebelTokenAddress_) {
      _rebelTokenAddress = rebelTokenAddress_;
  }

  function withdraw() external onlyOwner {
    address _owner = owner();
    payable(_owner).transfer(address(this).balance);
  }

  function getTotalContributions()
    external view returns (uint)
  {
    return totalContributionsWei;
  }

  function getUserContribution(address _beneficiary)
    external view returns (uint)
  {
    return contributions[_beneficiary];
  }

  function sendTokens() external payable {
    _preValidatePurchase(msg.sender, msg.value);
    RebelTokenInterface(_rebelTokenAddress).transfer(msg.sender, msg.value);
    totalContributionsWei = totalContributionsWei.add(msg.value);
  }

  function _preValidatePurchase(
    address _beneficiary,
    uint _weiAmount
  )
    internal
  {
    uint _existingContribution = contributions[_beneficiary];
    uint _newContribution = _existingContribution.add(_weiAmount);
    require(_newContribution >= investorMinCap && _newContribution <= investorHardCap);
    contributions[_beneficiary] = _newContribution;
  }

}
