# ETHGlobal-L2MintWithApe
What if we can pay in $APE to mint NFTs on L2 (such as Optimism)?

- `MintWithApeL1.sol` - L1 contract to receive $APE and send cross layer message to L2
- `MockAPE.sol` - mock erc20 contract
- `NFTMintOnL2.sol` - L2 NFT mint contract to mint ERC721 tokens

## quick start
https://hardhat.org/tutorial

- `yarn`
- `npx hardhat test`

## deploy
- `npx hardhat run scripts\01_L1Deploy.js --network goerli`
- make notes about `MockAPE` and `MintWithApeL1` contract addresses
- `npx hardhat run scripts\02_L2Deploy.js --network goerliop`

## test tokens
- MockAPE Contract https://goerli.etherscan.io/address/0x34cc61825070D9a1D8E5eD850BeeA7202B0281F2
- MintWithApeL1 Contract https://goerli.etherscan.io/address/0xD617396D8196523CB037748F64B332553EA46e4D
- NFTMintOnL2 Contract https://goerli-optimism.etherscan.io/address/0xc347eCB45801bCb592d5A31f9547b33ea099F35c