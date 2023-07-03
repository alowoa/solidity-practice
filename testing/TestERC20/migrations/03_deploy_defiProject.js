const DefiProject = artifacts.require("DefiProject")

module.exports = async (deployer) => {

  // goerli address verified at https://docs.makerdao.com/deployment-addresses/multi-collateral-dai-public-releases#find-all-maker-protocol-contract-addresses-and-abis-at-chainlog.makerdao.com
  const MCD_DAI_address = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844";
 
  // deployed based on MCD_DAI address
  await deployer.deploy(DefiProject, MCD_DAI_address);
  const defiProject = await DefiProject.deployed();

};
