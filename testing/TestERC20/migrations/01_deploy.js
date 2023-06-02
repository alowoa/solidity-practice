var MyFooToken = artifacts.require("MyFooToken");


module.exports = function (deployer) {

  deployer.deploy(MyFooToken, 10_000);

};
