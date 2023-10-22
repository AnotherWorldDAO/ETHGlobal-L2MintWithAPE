// SPDX-License-Identifier: MIT

//
// MockAPE.sol
//
// erc20 mockup token on L1 goerli

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockAPE is ERC20, Ownable {

    uint256 public constant maxSupply = 10 ** 9 * 10 ** 18;

    constructor()  ERC20("MockAPE", "MAPE") {
        _mint(msg.sender, maxSupply);
    }
}
