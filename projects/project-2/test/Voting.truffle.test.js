// external dependancies
const { web3 } = require("hardhat");
const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
// artifacts
const Voting = artifacts.require("Voting");
const TestVoting = artifacts.require("TestVoting");
const WorkflowStatusTestUtil = artifacts.require("WorkflowStatusTestUtil");
// siblings dependencies
const { WorkflowStatus } = require("./VotingTestUtils");


describe("Voting contract", () => {

  let ownerAddr, userAddr1, userAddr2, userAddr3;
  let workflowStatusTestUtil;
  let voting;

  before(async () => {
    [ownerAddr , userAddr1, userAddr2, userAddr3] = await web3.eth.getAccounts();
    workflowStatusTestUtil = await WorkflowStatusTestUtil.new();
  });
  
  //beforeEach(async () => {
  //  voting = await TestVoting.new();
  //});

  describe("Deployed contract validation", () => {
    before(async () => {
      voting = await TestVoting.new();
    });
    it("Deployer should own the contract and not be a voter by default", async () => {
      expect(await voting.owner()).equal(ownerAddr);
      expect((await voting.tca_voter(ownerAddr)).isRegistered).false;
    }); 
    it("Contextual properties should be at their initial values", async () => {
      expect(await voting.workflowStatus()).equal(WorkflowStatus["RegisteringVoters"]);
      expect((await voting.tca_proposalArray()).length).equal(0);
    }); 
  });

  describe.only("Registering voters phase", () => {
    beforeEach(async () => {
      voting = await TestVoting.new();
    });
    describe("As owner", () => {
      it("should register a new voter", async () => {
        // WHEN  
        const tx = await voting.addVoter(userAddr1);
        // THEN
        expect((await voting.tca_voter(userAddr1)).isRegistered).true;
        expectEvent(tx, 'VoterRegistered', {voterAddress: userAddr1});
      });
      it("should start proposal", async () => {
        // WHEN  
        const tx = await voting.startProposalsRegistering(); 
        // THEN
        const proposals = await voting.tca_proposalArray();
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
    });

    describe("As voter", () => {
      it("add proposal", async () => {
        const initialProposalCount = (await voting.tca_proposalArray()).length;
        // WHEN  
        const addProposalTx = await voting.addProposal("Test proposal", {from: userAddr1});
        // THEN
        const proposals = await voting.tca_proposalArray();
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
          previousStatus: WorkflowStatus["ProposalsRegistrationStarted"],
          newStatus: WorkflowStatus["ProposalsRegistrationEnded"]
        });
      });
    });

  });

  describe("ProposalsRegistrationEnded phase", () => {

    before(async () => { 
      voting = await TestVoting.new();  
      await voting.startProposalsRegistering(); 
      await voting.endProposalsRegistering(); 
    });

    describe("As owner", () => {
      it("should start voting session", async () => {
        // WHEN  
        const tx = await voting.startVotingSession(); 
        // THEN
        expectEvent(tx, 'WorkflowStatusChange', {
          previousStatus: WorkflowStatus["ProposalsRegistrationEnded"],
          newStatus: WorkflowStatus["VotingSessionStarted"]
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
          previousStatus: WorkflowStatus["VotingSessionStarted"],
          newStatus: WorkflowStatus["VotingSessionEnded"]
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
          previousStatus: WorkflowStatus["VotingSessionEnded"],
          newStatus: WorkflowStatus["VotesTallied"]
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
