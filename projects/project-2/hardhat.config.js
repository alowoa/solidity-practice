require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-truffle5");
require('hardhat-docgen');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
    ],
  }, 
};
