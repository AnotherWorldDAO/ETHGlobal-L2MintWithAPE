![cmdlogo2](https://github.com/AnotherWorldDAO/ETHGlobal-L2MintWithAPE/assets/182446/d06540aa-1d11-4cb1-b226-2b0d6403b15e)


# L2MintWithApe
What if we can pay in $APE to mint NFTs on L2s such as [Optimism](https://www.optimism.io/), [ApeChain Testnet (OP-Stack)](https://github.com/AnotherWorldDAO/ApeChain-OPStack-SepoliaL2Testnet)? This is using OP-Stack's native crosslayer messenging with minimum dependencies of 3rd party services.

- `MintWithApeL1.sol` - L1 contract to receive $APE and send cross layer message to L2
- `MockAPE.sol` - L1 mock erc20 contract (to be replaced with official [$APE](https://etherscan.io/token/0x4d224452801aced8b2f0aebe155379bb5d594381) address for L1 production deployment)
- `NFTMintOnL2.sol` - L2 NFT mint contract to mint ERC721 tokens

## quick start
check https://hardhat.org/tutorial and set up `.env` for your infura api, test wallet pkeys, and etherscan api keys

- `yarn`
- `npx hardhat test` (local test, not cross-layer test)

## deploy
- [uncomment](https://github.com/AnotherWorldDAO/L2MintWithAPE/blob/3ca25260e1214817fe2fb39bd5773d664145fa10/contracts/MintWithApeL1.sol#L97) for deployment
- after each deployment, make sure you update contract addresses in the next deployment script
- `npx hardhat run scripts\01_L1Deploy.js --network goerli` deploy L1 test contracts
- `npx hardhat run scripts\02_L2Deploy.js --network goerliop` deploy L2 nft contract
- `npx hardhat run scripts\03_L1Mint.js --network goerli` pay test erc20 on L1 to relay-mint on L2
- `npx hardhat run scripts\04_L2Check.js --network goerliop` check L2 for minted tokens

## deployed contracts (Goerli -> OP-Goerli)
- MockAPE L1 Contract https://goerli.etherscan.io/address/0x72CfCf91bB8b19050dFAD21fe76631398d58028A
- MintWithApeL1 Contract https://goerli.etherscan.io/address/0x6779B507Ee71B5aE50f663B1F2E55993449E2eB7
- NFTMintOnL2 Contract https://goerli-optimism.etherscan.io/address/0x34cc61825070D9a1D8E5eD850BeeA7202B0281F2
- OpenSea L2 op-goerli test NFT collection page https://testnets.opensea.io/collection/nftmintonl2-1

## verification
- `npx hardhat verify --network [chain name] [contract address]`
