const MyDai = artifacts.require("MyDai");
const DefiProject = artifacts.require("DefiProject")

module.exports = async (deployer) => {

  await deployer.deploy(MyDai);
  const myDai = await MyDai.deployed();
  // deployed based on MyDai address
  await deployer.deploy(DefiProject, myDai.address);
  const defiProject = await DefiProject.deployed();

  const accounts = await web3.eth.getAccounts();

  console.log("initial defiProject balance: "+ await myDai.balanceOf(defiProject.address))
  console.log("initial account0 balance: "+ await myDai.balanceOf(accounts[0]))

  // // should mint & send 100 MyDai to defiProject
  await myDai.faucet(defiProject.address, 100);
  console.log("defiProject balance after using faucet: "+ await myDai.balanceOf(defiProject.address))

  // // then tx to an external accoutn account
  defiProject.foo(accounts[1], 100);
  console.log("account0 balance after transfer from defiProject: "+ await myDai.balanceOf(accounts[0]))
 
};
