// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RebelArtists is ERC20 {
    constructor() ERC20("Rebel Artists", "REBEL") {
        uint initialSupply = 1000000000*10**18; // 1 Billion REBEL tokens
        _mint(msg.sender, initialSupply);
    }
}
