require("@nomiclabs/hardhat-waffle");
module.exports = {
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/fc53e1fe9181421188a85a7df27f9431", // Replace with your Infura project ID
      accounts: [`b3944af79e8dc188eae5223908f4c3c9594a77b3cbe0b9c8130aa6bda879f11f`] // Replace with your private key
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
