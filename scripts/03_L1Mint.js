
  // run this under the repo root
  // npx hardhat run scripts\03_L1Mint.js --network goerli
  //
  // update MintWithApeL1, MockAPE addresses, NFTMintOnL2 addresses
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

  const MintWithApeL1Contract = await ethers.getContractFactory(
    "MintWithApeL1"
  );
  const MockAPEContract = await ethers.getContractFactory(
    "MockAPE"
  );

  const MintWithApeL1 = await MintWithApeL1Contract.attach("0x6779B507Ee71B5aE50f663B1F2E55993449E2eB7");

  const MockAPE = await MockAPEContract.attach("0x72CfCf91bB8b19050dFAD21fe76631398d58028A");
  console.log("player1 MockAPE", await MockAPE.balanceOf(player1.address));

  let tx;
  tx = await MintWithApeL1.setNFTL2Address("0x34cc61825070D9a1D8E5eD850BeeA7202B0281F2");
  await tx.wait();

  tx = await MockAPE.connect(player1).approve(MintWithApeL1.address, ethers.utils.parseEther("400.0"));
  await tx.wait();

  const tx0 = await MintWithApeL1.connect(player1).mintL2withErc20(4);
  const receipt0 = await tx0.wait();
  for (const event of receipt0.events) {
    if (event.event == "MintL2") {
      console.log(
        event.args
      );
    }
  }
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
