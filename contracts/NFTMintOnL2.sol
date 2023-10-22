// SPDX-License-Identifier: MIT
//
// NFTMintOnL2.sol
//
// supports cross-layer minting - can be purchased with ETH (L1), APE(L1)
//

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "erc721a/contracts/ERC721A.sol";

// For cross domain messages' origin
import {ICrossDomainMessenger} from "@eth-optimism/contracts/libraries/bridge/ICrossDomainMessenger.sol";

contract NFTMintOnL2 is ERC721A, Ownable {
    using Strings for uint256;

    address public MintWithApeL1Address = address(0);

    event Mint(address, uint256);
    event MintL2(address, address, uint256);

    constructor() ERC721A("NFTMintOnL2", "NFTL2") {}

    function setMintWithApeL1Address(
        address newMintWithApeL1Address
    ) public onlyOwner {
        require(newMintWithApeL1Address != address(0), "invalid input");
        MintWithApeL1Address = newMintWithApeL1Address;
    }

    function _mintbatch(address account, uint256 quantity) private {
        uint256 currentTokenId = totalSupply();
        _mint(account, quantity);

        for (uint256 i = 0; i < quantity; i++) {
            emit Mint(
                msg.sender,
                currentTokenId + i
            );
        }
    }

    // To be deleted
    function mockMint(uint256 quantity) external {
        _mintbatch(msg.sender, quantity);
    }

    function mintL2(address account, uint256 quantity) public {
        //require(MintWithApeL1Address != address(0), "invalid L1 contract"); // uncomment for production
        require(MintWithApeL1Address == getXorig(), "unauthorized L1 contract");
        _mintbatch(account, quantity);
        emit MintL2(account, getXorig(), quantity);
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"#',
                                tokenId.toString(),
                                '", ',
                                '"external": "",',
                                '"description":"',
                                "Minted from L1!",
                                '", "image": "',
                                "data:image/svg+xml;base64,",
                                Base64.encode(
                                    bytes(
                                        svgOutput(
                                            tokenId
                                        )
                                    )
                                ),
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function svgOutput(
        uint256 tokenId
    ) internal pure returns (string memory) {
        string[3] memory svgParts;
        svgParts[0] = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" viewBox="0 0 512 512"><g stroke="#000" clip-path="url(#b)"><path fill="0" d="M0 0h512v512H0z"/></g><text y="60" x="28" fill="#fff" font-size="30">L2MintWithAPE</text><text y="100" x="28" fill="#fff" font-size="30">#';
        svgParts[1] = tokenId.toString();
        svgParts[2] = '</text></svg>';
        return
            string(
                abi.encodePacked(
                    svgParts[0],
                    svgParts[1],
                    svgParts[2]
                )
            );
    }

    // Get the cross domain origin, if any
    function getXorig() private view returns (address) {
        // Get the cross domain messenger's address each time.
        // This is less resource intensive than writing to storage.
        address cdmAddr = address(0);

        // Mainnet
        if (block.chainid == 1)
            cdmAddr = 0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1;

        // Goerli
        if (block.chainid == 5)
            cdmAddr = 0x5086d1eEF304eb5284A0f6720f79403b4e9bE294;

        // L2 (same address on every network)
        if (block.chainid == 10 || block.chainid == 420)
            cdmAddr = 0x4200000000000000000000000000000000000007;

        // If this isn't a cross domain message
        if (msg.sender != cdmAddr) return address(0);

        // If it is a cross domain message, find out where it is from
        return ICrossDomainMessenger(cdmAddr).xDomainMessageSender();
    } // getXorig()
}
