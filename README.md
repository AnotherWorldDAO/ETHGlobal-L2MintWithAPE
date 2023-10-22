![cmdlogo2](https://github.com/AnotherWorldDAO/ETHGlobal-L2MintWithAPE/assets/182446/d06540aa-1d11-4cb1-b226-2b0d6403b15e)


# L2MintWithApe
What if we can pay in $APE to mint NFTs on L2 (such as Optimism)?

- `MintWithApeL1.sol` - L1 contract to receive $APE and send cross layer message to L2
- `MockAPE.sol` - mock erc20 contract
- `NFTMintOnL2.sol` - L2 NFT mint contract to mint ERC721 tokens

## quick start
check https://hardhat.org/tutorial and set up `.env` for your infura api, test wallet pkeys, and etherscan api keys

- `yarn`
- `npx hardhat test`

## deploy
- after each deployment, make sure you update contract addresses in the next deployment script
- `npx hardhat run scripts\01_L1Deploy.js --network goerli`
- `npx hardhat run scripts\02_L2Deploy.js --network goerliop`

## test tokens
- MockAPE L1 Contract https://goerli.etherscan.io/address/0x72CfCf91bB8b19050dFAD21fe76631398d58028A
- MintWithApeL1 Contract https://goerli.etherscan.io/address/0x6779B507Ee71B5aE50f663B1F2E55993449E2eB7
- NFTMintOnL2 Contract https://goerli-optimism.etherscan.io/address/0x34cc61825070D9a1D8E5eD850BeeA7202B0281F2
- OpenSea (L2 op-goerli) https://testnets.opensea.io/collection/nftmintonl2-1

## verification
- `npx hardhat verify --network [chain name] [contract address]`
