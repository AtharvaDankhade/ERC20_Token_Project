//const { fetchLatestBlockNumber } = require("../api");

async function main() {
  // Get the contract factory
  const RamMint = await hre.ethers.getContractFactory("WhitelistedToken");

  // Get the signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the contract
  const ramMint = await RamMint.deploy("Atharva", "ATH");
  await ramMint.deployed();

//  const blockNumber = await fetchLatestBlockNumber();
 // console.log(`Latest block number: ${blockNumber}`);

  console.log("RamMint deployed to:", ramMint.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
