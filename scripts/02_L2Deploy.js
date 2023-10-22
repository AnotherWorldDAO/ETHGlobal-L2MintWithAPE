
  // run this under the repo root
  // npx hardhat run scripts\02_L2Deploy.js --network goerliop
  //
  // update MintWithApeL1
  //
  // goerliop
  // NFTMintOnL2 0xc347eCB45801bCb592d5A31f9547b33ea099F35c

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

  const AnotherDeedL1Contract = await ethers.getContractFactory(
    "NFTMintOnL2"
  );

  const NFTMintOnL2 = await AnotherDeedL1Contract.deploy();
  await NFTMintOnL2.deployed();
  console.log(`NFTMintOnL2 Contract deployed to ${NFTMintOnL2.address} on ${network.name}`);
  await NFTMintOnL2.setMintWithApeL1Address("0xD617396D8196523CB037748F64B332553EA46e4D");

  console.log("done!");
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
