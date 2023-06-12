const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BN } = require('@openzeppelin/test-helpers');

describe("Bank", function () {

  let owner, addr1, addr2;
  let Bank, bank;

  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    Bank = await ethers.getContractFactory("Bank");
  });

  beforeEach(async () => {
    bank = await Bank.deploy();
  });

  it("should deploy the smart contract", async () => {
    expect(await bank.owner()).equal(owner.address);
  })
  it("test ", async () => {
    expect(new BN(1)).equal(new BN(1));
  })
  
});
