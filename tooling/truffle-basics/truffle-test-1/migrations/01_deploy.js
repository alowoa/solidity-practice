const Storage = artifacts.require("Storage");
 
const MIN_DEPOSIT_AMOUNT = 1_000_000_000; // 1 gwei 
const data = 21;

module.exports = function (deployer, network, accounts) {

  deployer.deploy(Storage, MIN_DEPOSIT_AMOUNT, 777, {
    from: `${accounts[0]}`,
    value: MIN_DEPOSIT_AMOUNT
  });

};