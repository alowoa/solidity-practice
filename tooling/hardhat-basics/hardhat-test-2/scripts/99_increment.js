const hre = require("hardhat");

const CONTRACT_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
 
  const Counter = await hre.ethers.getContractFactory("Counter");
  const instance = await Counter.attach(CONTRACT_ADDR);

  let value = await instance.value();
  
  console.log(
    `Contract ${CONTRACT_ADDR} attached! value is ${value}.`
  );

  await instance.increment();
  value = await instance.value();

  console.log(
    `Contract ${CONTRACT_ADDR} incremented to ${value}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
