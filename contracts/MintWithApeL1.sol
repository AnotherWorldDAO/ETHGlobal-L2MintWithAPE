// SPDX-License-Identifier: MIT

//
// MintWithAPEL1.sol
//
// users pay 100 MockAPE (or 0.1 ETH) per erc721 NFT on L1 goerli
// receive an NFT erc721 on L2 optimistic-goerli
//
// test deployment
// 1. deploy test erc20 token on goerli and transfer to player1 account
// 2. deploy L1 contract and set erc20 address
// 3. deploy L2 contract and set L1 address
// 4. update L2 address in L1 contract
// 5. mint from player1 account using geth
// 6. mint from player1 account using test erc20 tokens

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// For cross domain messages' origin
import {ICrossDomainMessenger} from "@eth-optimism/contracts/libraries/bridge/ICrossDomainMessenger.sol";

contract MintWithApeL1 is Ownable {

    event MintL2(address, address, uint256, uint256);

    address public NFTL2Address = address(0); // NFTL2Address on L2
    address public erc20TokenAddress = address(0); // $APE (ETH): 0x4d224452801aced8b2f0aebe155379bb5d594381

    uint256 public constant erc20Fee = 100 * 10 ** 18;
    uint256 public constant ethFee = 0.1 ether;
    uint256 public constant maxSupply = 1000;
    uint256 public constant maxAmount = 10;
    uint256 public counter = 0;
    using SafeERC20 for IERC20;


    constructor() {}

    function setErc20TokenAddress(address newErc20TokenAddress) public onlyOwner{
        require(newErc20TokenAddress != address(0), "invalid address");
        //require(erc20TokenAddress == address(0), "can only update once");
        erc20TokenAddress = newErc20TokenAddress;
    }

    function setNFTL2Address(address newNFTL2Address) public onlyOwner{
        require(newNFTL2Address != address(0), "invalid address");
        //require(NFTL2Address == address(0), "can only update once");
        NFTL2Address = newNFTL2Address;
    }

    function mintL2withErc20(uint256 quantity) public {
        require(IERC20(erc20TokenAddress).balanceOf(msg.sender) >= quantity * erc20Fee, "not enough to purchase");

        IERC20(erc20TokenAddress).safeTransferFrom(
            msg.sender,
            address(this),
            quantity * erc20Fee
        );

        _mintL2(quantity);
    }

    function mintL2withEth(uint256 quantity) public payable {
        require(maxAmount >= quantity, "exceed max amount per mint");
        require(
            maxSupply > quantity + counter,
            "cannot exceed maxSupply"
        );
        require(msg.value >= ethFee * quantity, "not enough to buy");
        _mintL2(quantity);
    }

    function _mintL2(uint256 quantity) internal {
        bytes memory message;

        message = abi.encodeWithSignature(
            "mintL2(address,uint256)",
            msg.sender,
            quantity
        );

        address crossDomainMessengerAddress = address(0);

        // Mainnet
        if (block.chainid == 1)
            crossDomainMessengerAddress = 0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1;

        // Goerli
        if (block.chainid == 5)
            crossDomainMessengerAddress = 0x5086d1eEF304eb5284A0f6720f79403b4e9bE294;

        // comment out because hh tests do not work for cross layer simulation
        /*
        ICrossDomainMessenger(crossDomainMessengerAddress).sendMessage(
            NFTL2Address,
            message,
            1000000 // within the free gas limit amount
        );
        */

        unchecked {
            counter = counter + quantity;
        }

        emit MintL2(msg.sender, NFTL2Address, quantity, counter);
    }

    function withdrawErc20() external onlyOwner {
        IERC20(erc20TokenAddress).safeTransfer(
            msg.sender,
            IERC20(erc20TokenAddress).balanceOf(address(this))
        );
    }

    function withdraw() external payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }

}