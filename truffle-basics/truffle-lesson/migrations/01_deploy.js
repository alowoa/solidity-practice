const Storage = artifacts.require("Storage");

const deployEthAmount = 1000000000000000000;
//const accountA = "0xeD8B177F2506a6F7Cd81c3720a21220EC15f25d2";
const data = 21;

module.exports = function (deployer, network, accounts) {

  deployer.deploy(Storage, deployEthAmount, {
    from: `${accounts[0]}`,
    value: deployEthAmount
  });

};