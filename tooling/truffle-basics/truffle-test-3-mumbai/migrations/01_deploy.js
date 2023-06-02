var Counter = artifacts.require("Counter");

const DEFAULT_COUNTER_VALUE = 100;

module.exports = function(deployer) {
  deployer.deploy(Counter, DEFAULT_COUNTER_VALUE);
};
