
  // run this under the repo root
  // npx hardhat run scripts\02_L2Deploy.js --network [L2:goerliop/apetest]
  //
  // update MintWithApeL1
  //
  // goerliop
  // NFTMintOnL2 0xD617396D8196523CB037748F64B332553EA46e4D
  //
  // apetest
  // NFTMintOnL2 0x51b8365505c95D17D40D5BE6936eaF26571455c9

const { ethers, network } = require("hardhat");

async function main() {
  const [deployer, player1] = await ethers.getSigners();

  console.log("deployer:", deployer.address);
  // check account balance
  console.log(
    "deployer balance:",
    ethers.utils.formatEther(await deployer.getBalance())
  );
  console.log("");
  console.log("player1:", player1.address);
  console.log(
    "player1 balance:",
    ethers.utils.formatEther(await player1.getBalance())
  );

  const NFTMintOnL2Contract = await ethers.getContractFactory(
    "NFTMintOnL2"
  );

  const NFTMintOnL2 = await NFTMintOnL2Contract.deploy();
  await NFTMintOnL2.deployed();
  console.log(`NFTMintOnL2 Contract deployed to ${NFTMintOnL2.address} on ${network.name}`);
  await NFTMintOnL2.setMintWithApeL1Address("0x6779B507Ee71B5aE50f663B1F2E55993449E2eB7");

  console.log("deployer:", deployer.address);
  // check account balance
  console.log(
    "deployer balance:",
    ethers.utils.formatEther(await deployer.getBalance())
  );
  console.log("");
  console.log("player1:", player1.address);
  console.log(
    "player1 balance:",
    ethers.utils.formatEther(await player1.getBalance())
  );

  console.log("\ndone!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
