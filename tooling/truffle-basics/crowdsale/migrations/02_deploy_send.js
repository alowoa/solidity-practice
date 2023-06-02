const Send = artifacts.require("Send");
 

module.exports = function (deployer, network, accounts) {

  deployer.deploy(Send);

};