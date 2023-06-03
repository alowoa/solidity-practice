const Voting = artifacts.require("Voting");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
const { web3 } = require("hardhat");

describe("Voting contract", () => {

  let accounts;

  before(async () => {
    accounts = await web3.eth.getAccounts();
  });
 

  async function deployContractFixture() {
    const await Voting.deplyed();
    const Voting = await ethers.getContractFactory("Voting");
    const [owner, addr1, addr2] = await ethers.getSigners();
    const votingContract = await Voting.deploy();
    await votingContract.deployed();
    return { Voting, votingContract, owner, addr1, addr2 };
  }

  describe("Deployed contract validation", () => {
    it("should set owner", async () => {
      // GIVEN signers context WHEN contract deployed
      const { votingContract, owner } = await loadFixture(deployContractFixture);
      // THEN
      expect(await votingContract.owner()).to.be.equal(owner.address);
    });
    it("should have initial value of 0 for workflow status", async () => {
      // GIVEN signers context WHEN contract deployed
      const { votingContract, owner } = await loadFixture(deployContractFixture);
      // THEN
      expect(await votingContract.workflowStatus()).to.be.equal(0);
    });
  });
 

  describe("RegisteringVoters phase", () => {

    // describe("As owner", () => {
    //   it("should register a new voter", async () => {
    //     const { votingContract, owner, addr1 } = await loadFixture(deployContractFixture);
        
    //     const addVoterTx = await votingContract.addVoter(addr1.address);
    //     console.log(addVoterTx);
    //     expectEvent(addVoterTx, 'VoterRegistered', {voterAddress: addr1.address})
        
    //     // let result = await votingContract.voters;
    //     // console.log(result);

    //     // expect(voters[addr1].address).to.be.equal(addr1.address);
    //     // expect(voters[addr1].address).to.be.equal(addr1.address);
    //   });
    //   // it("should fails to register already registerd voter", async () => {
    //   //   const { votingContract, owner, addr1 } = await loadFixture(deployContractFixture);
    //   //   votingContract.addVoter()
    //   // });
    // });

    //TODO unintended cases

  });

  describe("ProposalsRegistrationStarted phase", () => {

    describe("Owner use case", () => {
  
    });

  });

  describe("ProposalsRegistrationEnded phase", () => {

    describe("Owner use case", () => {
 
    });

  });

  describe("VotingSessionStarted phase", () => {

    describe("Owner use case", () => {

    });

  });

  describe("VotingSessionEnded phase", () => {

    describe("Owner use case", () => {

    });

  });

  describe("VotesTallied phase", () => {

    describe("Owner use case", () => {

    });

  });

});
