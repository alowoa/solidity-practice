const Crowdsale = artifacts.require("Crowdsale");

const INITIAL_SUPPLY = 100_000_000_000_000_000;  

module.exports = function (deployer, network, accounts) {

  deployer.deploy(Crowdsale, INITIAL_SUPPLY, {
    from: `${accounts[0]}`,
    value: INITIAL_SUPPLY
  });

};