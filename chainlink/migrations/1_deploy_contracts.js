const Chainlink1 = artifacts.require("Chainlink1");
const Chainlink2 = artifacts.require("Chainlink2");

module.exports = function(deployer) {
  //deployer.deploy(Chainlink1);
  deployer.deploy(Chainlink2, 12867);
};
