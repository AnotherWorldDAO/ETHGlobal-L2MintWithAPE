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

describe("L2 Contract", function () {
  async function deployTokenFixture() {
    // treasure fragments contract
    const NFTMintOnL2Contract = await ethers.getContractFactory(
      "NFTMintOnL2"
    );

    // signers
    const [owner, player1, player2] = await ethers.getSigners();

    // deployment
    const NFTMintOnL2 =
      await NFTMintOnL2Contract.deploy();
    console.log("\tGas(NFTMintOnL2-721):\t", await getLastTxGas());

    await NFTMintOnL2.deployed();
    
    // fixtures for tests
    return {
      owner,
      player1,
      player2,
      NFTMintOnL2,
    };
  }

  describe("\nDeployment", function () {
    it("Should have the deployer as contract owner", async function () {
      const { NFTMintOnL2, owner } = await loadFixture(
        deployTokenFixture
      );
      expect(await NFTMintOnL2.owner()).to.equal(owner.address);
    });
  });

  describe("\nMinting", function () {
    it("Should player1 receive 100 mockMint", async function () {
      const { NFTMintOnL2, owner, player1 } =
        await loadFixture(deployTokenFixture);
      const tx = await NFTMintOnL2.connect(player1).mockMint(100);
      const receipt = await tx.wait();
      console.log("\tGas(Mint-NFTMintOnL2 x 100):\t", await getLastTxGas());
      for (const event of receipt.events) {
        if (event.event == "Mint") {
          console.log(
            `${event.event} Event: ${event.args[0]}, tokenId: ${event.args[1]}`
          );
        }
      }

      const totalSupply = await NFTMintOnL2.totalSupply();
      expect(await NFTMintOnL2.balanceOf(player1.address)).to.equal(
        totalSupply
      );
    });

    it("Should receive L2 mints", async function () {
      const { NFTMintOnL2, owner, player1, player2} =
        await loadFixture(deployTokenFixture);

      const tx = await NFTMintOnL2.connect(player1).mintL2(player1.address, 10);
      const receipt = await tx.wait();
      for (const event of receipt.events) {
        if (event.event == "MintL2") {
          console.log(event.args)
        }
      }
      console.log("totalSupply", await NFTMintOnL2.totalSupply());
      expect(await NFTMintOnL2.totalSupply()).to.equal(10);
    });
  });
});
