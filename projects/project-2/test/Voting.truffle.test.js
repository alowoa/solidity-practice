const Voting = artifacts.require("Voting");
const TestVoting = artifacts.require("TestVoting");
const WorkflowStatusTestUtil = artifacts.require("WorkflowStatusTestUtil");

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

  let ownerAddr, userAddr1, userAddr2, userAddr3;
  let voting;
  let workflowStatusTestUtil;

  before(async () => {
    const accounts = await web3.eth.getAccounts();
    ownerAddr = accounts[0];
    userAddr1 = accounts[1];
    userAddr2 = accounts[2];
    userAddr3 = accounts[3];
    voting = await TestVoting.new();
    workflowStatusTestUtil = await WorkflowStatusTestUtil.new();
    console.log("-- fixtures for Voting contract loaded --")
  });
   
  describe("Deployed contract validation", () => {
    it("should get proper initial values", async () => {
      expect(await voting.owner()).equal(ownerAddr);
      expect((await voting.isRegisteringVotersStatus())).true;
    }); 
  });

  describe("Registering voters phase", () => {
    describe("As owner", () => {
      it("should register a new voter", async () => {
        // WHEN  
        const tx = await voting.addVoter(userAddr1);
        // THEN
        expect((await voting.voter(userAddr1)).isRegistered).true;
        expectEvent(tx, 'VoterRegistered', {voterAddress: userAddr1});
      });
      it("should start proposal", async () => {
        // WHEN  
        const tx = await voting.startProposalsRegistering(); 
        // THEN
        const proposals = await voting.proposalArray();
        expect(proposals.length).equal(1);
        expect(proposals[0].description).equal("GENESIS");
        expect(+proposals[0].voteCount).equal(0);
        expectEvent(tx, 'WorkflowStatusChange', {
          previousStatus: await workflowStatusTestUtil.valueOfRegisteringVoters(),
          newStatus: await workflowStatusTestUtil.valueOfProposalsRegistrationStarted()
        });
      });
    });
  });

  describe("ProposalsRegistrationStarted phase", () => {

    before(async () => { 
      voting = await TestVoting.new(); 
      await voting.addVoter(userAddr1);
      await voting.startProposalsRegistering(); 
      console.log("-- fixture for ProposalsRegistrationStarted loaded --")
    });

    describe("As voter", () => {
      it("add proposal", async () => {
        const initialProposalCount = (await voting.proposalArray()).length;
        // WHEN  
        const addProposalTx = await voting.addProposal("Test proposal", {from: userAddr1});
        // THEN
        const proposals = await voting.proposalArray();
        expect(proposals.length).equal(initialProposalCount+1);
        const newProposal = proposals[proposals.length-1];
        expect(newProposal.description).equal("Test proposal");
        expect(+newProposal.voteCount).equal(0);
        expectEvent(addProposalTx, 'ProposalRegistered', {
          proposalId: new BN(proposals.length-1)
        });
      });
    });
    
    describe("As owner", () => {
      it("should end proposal phase", async () => {
        // WHEN  
        const tx = await voting.endProposalsRegistering(); 
        // THEN
        expectEvent(tx, 'WorkflowStatusChange', {
          previousStatus: await workflowStatusTestUtil.valueOfProposalsRegistrationStarted(),
          newStatus: await workflowStatusTestUtil.valueOfProposalsRegistrationEnded()
        });
      });
    });

  });

  describe("ProposalsRegistrationEnded phase", () => {

    before(async () => { 
      voting = await TestVoting.new();  
      await voting.startProposalsRegistering(); 
      await voting.endProposalsRegistering(); 
      console.log("-- fixture for ProposalsRegistrationEnded loaded --")
    });

    describe("As owner", () => {
      it("should start voting session", async () => {
        // WHEN  
        const tx = await voting.startVotingSession(); 
        // THEN
        expectEvent(tx, 'WorkflowStatusChange', {
          previousStatus: await workflowStatusTestUtil.valueOfProposalsRegistrationEnded(),
          newStatus: await workflowStatusTestUtil.valueOfVotingSessionStarted()
        });
      });
    });
  });

  describe("VotingSessionStarted phase", () => {

    before(async () => { 
      voting = await TestVoting.new();  
      await voting.startProposalsRegistering(); 
      await voting.endProposalsRegistering(); 
      await voting.startVotingSession(); 
      console.log("-- fixture for ProposalsRegistrationEnded loaded --")
    });

    describe("As owner", () => {
      it("should end voting session", async () => {
        // WHEN  
        const tx = await voting.endVotingSession(); 
        // THEN
        expectEvent(tx, 'WorkflowStatusChange', {
          previousStatus: await workflowStatusTestUtil.valueOfVotingSessionStarted(),
          newStatus: await workflowStatusTestUtil.valueOfVotingSessionEnded()
        });
      });
    });

  });

  describe("VotingSessionEnded phase", () => {

    before(async () => { 
      voting = await TestVoting.new();  
      await voting.startProposalsRegistering(); 
      await voting.endProposalsRegistering(); 
      await voting.startVotingSession(); 
      await voting.endVotingSession(); 
      console.log("-- fixture for ProposalsRegistrationEnded loaded --")
    });

    describe("As owner", () => {
      it("should tally votes session", async () => {
        // WHEN  
        const tx = await voting.tallyVotes(); 
        // THEN
        expectEvent(tx, 'WorkflowStatusChange', {
          previousStatus: await workflowStatusTestUtil.valueOfVotingSessionEnded(),
          newStatus: await workflowStatusTestUtil.valueOfVotesTallied()
        });
      });
    });


  });

  describe("VotesTallied phase", () => {

    before(async () => { 
      voting = await TestVoting.new();  
      await voting.startProposalsRegistering(); 
      await voting.endProposalsRegistering(); 
      await voting.startVotingSession(); 
      await voting.endVotingSession(); 
      await voting.tallyVotes(); 
      console.log("-- fixture for ProposalsRegistrationEnded loaded --")
    });

    describe("As voters", () => {
     
      
    });
  });

});
