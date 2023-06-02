require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALCHEMY_API_KEY_TEST_SEPOLIA = process.env.ALCHEMY_API_KEY_TEST_SEPOLIA || "";
const SEPOLIA_PRIVATE_KEY = process.env.ALCHEMY_SEPOLIA_PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
    ],
  }, 
  networks: {
    sepolia: {
      //url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY_TEST_SEPOLIA}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  },
  etherscan: { 
    apiKey: ETHERSCAN_API_KEY
  }
};
