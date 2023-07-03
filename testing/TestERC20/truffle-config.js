require('dotenv').config();
const { MNEMONIC, INFURA_ID_TEST_APP, ALCHEMY_ID_TEST_APP_SEPOLIA } = process.env;

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  networks: {

    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    sepolia: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, `https://sepolia.infura.io/v3/${INFURA_ID_TEST_APP}`)
        //return new HDWalletProvider(MNEMONIC, `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_ID_TEST_APP_SEPOLIA}`)
      },
      network_id: 11155111
    },
    goerli: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${INFURA_ID_TEST_APP}`)
      },
      network_id: 5
    }
     
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
  },

  compilers: {
    solc: {
      version: "0.8.20",      // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200
        }
      }
    }
  },

};
