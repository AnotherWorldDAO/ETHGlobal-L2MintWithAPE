
// users pay 100 APE (or 0.1 ETH) per deed on ETH
// receive MintWithApe (OP) erc721
// test all payment and withdraw

const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

async function getLastTxGas() {
  // Get latest transaction hash
  const latestBlock = await ethers.provider.getBlock("latest");
  const latestTXHash = latestBlock.transactions.at(-1);
  // Get latest transaction receipt object
  const latestTXReceipt = await ethers.provider.getTransactionReceipt(
    latestTXHash
  );
  // Determine latest transaction gas costs
  const latestTXGasUsage = latestTXReceipt.gasUsed;
  const latestTXGasPrice = latestTXReceipt.effectiveGasPrice;
  const latestTXGasCosts = latestTXGasUsage.mul(latestTXGasPrice);
  return Number(latestTXGasUsage);
}

describe("L1 Contract", function () {
  async function deployTokenFixture() {
    // treasure fragments contract
    const MintWithApeL1Contract = await ethers.getContractFactory(
      "MintWithApeL1"
    );

    const MockAPEL1Contract = await ethers.getContractFactory(
      "MockAPE"
    );

    // signers
    const [deployer, operator, player1, player2] = await ethers.getSigners();

    // deploy MockAPEL1 as erc20
    const MockAPEL1 =
      await MockAPEL1Contract.deploy();
    await MockAPEL1.deployed();
    console.log("\tGas(MintWithApeL1):\t", await getLastTxGas());

    await MockAPEL1.connect(deployer).transfer(player1.address, ethers.utils.parseEther("10000.0"));
    await MockAPEL1.connect(deployer).transfer(player2.address, ethers.utils.parseEther("10000.0"));

    // 
    const MintWithApeL1 =
      await MintWithApeL1Contract.deploy();
    await MintWithApeL1.deployed();
    console.log("\tGas(MintWithApeL1):\t", await getLastTxGas());

    await MintWithApeL1.connect(deployer).setErc20TokenAddress(MockAPEL1.address);
    
    // fixtures for tests
    return {
      deployer,
      operator,
      player1,
      player2,
      MintWithApeL1,
      MockAPEL1,
    };
  }

  describe("\nDeployment", function () {
    it("Should have the deployer as contract owner", async function () {
      const { MintWithApeL1, MockAPEL1, player1,
        player2, deployer } = await loadFixture(
        deployTokenFixture
      );
      expect(await MintWithApeL1.owner()).to.equal(deployer.address);
      expect(await MockAPEL1.owner()).to.equal(deployer.address);
      expect(await MintWithApeL1.erc20TokenAddress()).to.equal(MockAPEL1.address);
      expect(await MockAPEL1.balanceOf(player1.address)).to.equal(ethers.utils.parseEther("10000.0"));
      expect(await MockAPEL1.balanceOf(player2.address)).to.equal(ethers.utils.parseEther("10000.0"));
      console.log("Player2 erc20 balance", await MockAPEL1.balanceOf(player2.address));
    });
  });

  describe("\nMint events and balances", function () {

    it("Should player2 emit MintL2 event", async function () {
      const { MintWithApeL1, deployer, player1, player2, MockAPEL1 } =
        await loadFixture(deployTokenFixture);

      
      await MockAPEL1.connect(player2).approve(MintWithApeL1.address, ethers.utils.parseEther("500.0"));
      const tx0 = await MintWithApeL1.connect(player2).mintL2withErc20(5);
      const receipt0 = await tx0.wait();
      console.log("\tGas(mint-MintWithApeL1 x 5 via APE):\t", await getLastTxGas());
      for (const event of receipt0.events) {
        if (event.event == "MintL2") {
          console.log(
            event.args
          );
        }
      }

      const tx = await MintWithApeL1.connect(player2).mintL2withEth(5, {
        value: ethers.utils.parseEther("0.5"),
      });
      const receipt = await tx.wait();
      console.log("\tGas(mint-MintWithApeL1 x 5 via ETH):\t", await getLastTxGas());
      
      for (const event of receipt.events) {
        if (event.event == "MintL2") {
          console.log(
            event.args
          );
        }
      }

      expect(await MintWithApeL1.counter()).to.equal(
        10
      );
      expect(await MockAPEL1.balanceOf(MintWithApeL1.address)).to.equal(
        ethers.utils.parseEther("500.0")
      );
      expect(await ethers.provider.getBalance(MintWithApeL1.address)).to.equal(
        ethers.utils.parseEther("0.5")
      );

      await MintWithApeL1.connect(deployer).withdrawErc20();
      await MintWithApeL1.connect(deployer).withdraw();

      expect(await MockAPEL1.balanceOf(MintWithApeL1.address)).to.equal(
        0
      );
      expect(await ethers.provider.getBalance(MintWithApeL1.address)).to.equal(
        0
      );


    });
  });
});
