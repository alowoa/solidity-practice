const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = function (deployer, network, accounts) {

  deployer.deploy(SimpleStorage, { from: `${accounts[0]}` });

};