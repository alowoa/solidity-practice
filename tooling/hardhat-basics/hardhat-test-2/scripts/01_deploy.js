const hre = require("hardhat");

const INITIAL_VALUE = 100000;

async function main() {
 
  const Counter = await hre.ethers.getContractFactory("Counter");
  const instance = await Counter.deploy(INITIAL_VALUE);

  await instance.deployed();

  console.log(
    `Count deployed with a base value of ${INITIAL_VALUE} deployed to ${instance.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
