
  // run this under the repo root
  // npx hardhat run scripts\04_L2Check.js --network [L2:goerliop/apetest]
  //
  // update NFTMintOnL2 address
  //

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

  const NFTMintOnL2 = await NFTMintOnL2Contract.attach("0x34cc61825070D9a1D8E5eD850BeeA7202B0281F2");

  console.log("\ntotalSupply", await NFTMintOnL2.totalSupply());

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
