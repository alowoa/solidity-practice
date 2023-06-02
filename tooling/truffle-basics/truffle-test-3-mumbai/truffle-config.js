
require('dotenv').config();
const { MNEMONIC, ALCHEMY_ID_TEST_APP_MUMBAI } = process.env;

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  networks: {
    
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    mumbai: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID_TEST_APP_MUMBAI}`),
      network_id: 80001
    }, 
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: { 
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.19",      // Fetch exact version from solc-bin (default: truffle's version) 
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       }, 
      }
    }
  },

};
