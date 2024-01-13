require("@nomiclabs/hardhat-waffle");
module.exports = {
  networks: {
    goerli: {
      url: "1", // Replace with your Infura project ID
      accounts: [``] // Replace with your private key
    }
  },
  solidity: "0.8.20",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
