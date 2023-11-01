
  // run this under the repo root
  // npx hardhat run scripts\01_L1Deploy.js --network [L1:goerli/sepolia]
  //
  // goerli -> goerliop
  // MockAPE 0xaa6Eb12927183D41f29bB10fA94488863D530A15
  // MintWithApeL1 0x9e0b2aB27575B95a0660E8C6b7A361f054e3Ca88
  //
  // sepolia -> apetest
  // MockAPE 0x5CfCF97ec9e9ff3D8578DA9f53F5f998F0Da1fE8
  // MintWithApeL1 0x2a0D9F12cE0831b6BF5b224822638d30a89666D6

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

  // deploy MockAPE as erc20
  const MockAPE =
  await MockAPEContract.deploy();
  await MockAPE.deployed();
  console.log(`MockAPE Contract deployed to ${MockAPE.address} on ${network.name}`);

  await MockAPE.connect(deployer).transfer(player1.address, ethers.utils.parseEther("10000.0"));

  const MintWithApeL1 = await MintWithApeL1Contract.deploy();
  await MintWithApeL1.deployed();
  console.log(`MintWithApeL1 Contract deployed to ${MintWithApeL1.address} on ${network.name}`);
  const WAIT_BLOCK_CONFIRMATIONS = 6;
  await MintWithApeL1.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
  await MintWithApeL1.connect(deployer).setErc20TokenAddress(MockAPE.address);

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
