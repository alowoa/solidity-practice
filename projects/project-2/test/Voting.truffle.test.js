// external dependancies
const { web3 } = require("hardhat");
const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
// artifacts
const Voting = artifacts.require("Voting");
// siblings dependencies
const { WorkflowStatus, givenVoting } = require("./VotingTestUtils");


describe("Voting contract", () => {

  let ownerAddr, userAddr1, userAddr2, unregistredUser, user4Utils;
  let voting;
 
  /**
   * Tests non allowed method calls (which differ from the current workflow status)
   */
  const expectRevertOnBadWorkflowStatusChanges = async (workflowStatus) => {
    if (WorkflowStatus.RegisteringVoters !== workflowStatus){
      await expectRevert(voting.addVoter(user4Utils), 'Voters registration is not open yet');
    }
    if (WorkflowStatus.ProposalsRegistrationStarted !== workflowStatus){
      await expectRevert(voting.startProposalsRegistering(), 'Registering proposals cant be started now');
      await expectRevert(voting.addProposal("Foo"), 'Proposals are not allowed yet');
    }
    if (WorkflowStatus.ProposalsRegistrationEnded !== workflowStatus){
      await expectRevert(voting.endProposalsRegistering(), 'Registering proposals havent started yet');
    }
    if (WorkflowStatus.VotingSessionStarted !== workflowStatus){
      await expectRevert(voting.startVotingSession(), 'Registering proposals phase is not finished');
      await expectRevert(voting.setVote(1), 'Voting session havent started yet');
    }
    if (WorkflowStatus.VotingSessionEnded !== workflowStatus){
      await expectRevert(voting.endVotingSession(), "Current status is not voting session ended");
    }
    if (WorkflowStatus.VotesTallied !== workflowStatus){
      await expectRevert(voting.tallyVotes());
    }
  };

  before(async () => {
    [ownerAddr , userAddr1, userAddr2, unregistredUser] = await web3.eth.getAccounts();
  }); 

  describe("On deployed contract", () => {
    beforeEach(async () => {
      voting = await Voting.new();
    });
    it("Deployer should own the contract, but not be a voter by default", async () => {
      expect(await voting.owner()).equal(ownerAddr);
      await expectRevert(voting.getVoter(ownerAddr, {from: ownerAddr}), "You're not a voter");
    }); 
    it("Contextual properties should be at their initial values", async () => {
      expect(await voting.workflowStatus()).equal(WorkflowStatus.RegisteringVoters);
    }); 
    it("Proposal should be empty", async () => {
      // GIVEN
      await voting.addVoter(userAddr1);
      // WHEN out-of-bound access THEN revert panic
      await expectRevert.unspecified(voting.getOneProposal(0, {from: userAddr1}));
    }); 
  });

  describe("Upon RegisteringVoters phase", () => {
    beforeEach(async () => {
      voting = await Voting.new();
    });
    
    it("Non owner users should not be able to register voters", async () => {
      // GIVEN userAddr1 registred, and an anonymous userAddr2
      await voting.addVoter(userAddr1);
      // WHEN-THEN
      for (const addr of [userAddr1, userAddr2]) {
        await expectRevert(voting.addVoter(addr, {from: addr}), 'Ownable: caller is not the owner');
      }
    }); 

    describe("Owner", () => {
      it("should register a new voter", async () => {
        // WHEN  
        const tx = await voting.addVoter(userAddr1);
        // THEN 
        const voter = await voting.getVoter(userAddr1, {from: userAddr1});
        expect(voter.isRegistered).true;
        expect(voter.hasVoted).false;
        expectEvent(tx, 'VoterRegistered', {voterAddress: userAddr1});
      });

      it("should not register twice a voter", async () => {
        //GIVEN 
        await voting.addVoter(userAddr1);
        // WHEN-THEN
        await expectRevert(voting.addVoter(userAddr1), 'Already registered');
      });

      it("should start proposal phase", async () => {
        // WHEN  
        const tx = await voting.startProposalsRegistering(); 
        // THEN
        expect(await voting.workflowStatus()).equal(WorkflowStatus.ProposalsRegistrationStarted);
        expectEvent(tx, 'WorkflowStatusChange', {
          previousStatus: WorkflowStatus.RegisteringVoters,
          newStatus: WorkflowStatus.ProposalsRegistrationStarted
        }); 
      });

      it("On start proposal phase a genesis proposal should be created", async () => {
        // GIVEN a voter to ge the proposal
        await voting.addVoter(userAddr1);
        // WHEN  
        const tx = await voting.startProposalsRegistering(); 
        // THEN genesis proposal has been created
        const proposal = await voting.getOneProposal(0, {from: userAddr1});
        expect(proposal.description).equal("GENESIS");
        expect(proposal.voteCount).equal(BN(0));  
      });

      it("should not skip any workflow status", async () => {
        expectRevertOnBadWorkflowStatusChanges(WorkflowStatus.RegisteringVoters);
      });
    });//! Owner

    describe("getVoters access", () => {
      it("Voter should access to other voters", async () => {
        // GIVEN
        await voting.addVoter(userAddr1);
        await voting.addVoter(userAddr2);
        // WHEN
        const voter1 = await voting.getVoter(userAddr2, {from: userAddr1});
        // THEN
        expect(voter1.isRegistered).true;
        expect(voter1.hasVoted).false;
        expect(voter1.votedProposalId).equals(BN(0));
      });
      it("Owner and unregistered voters should not access to other voters", async () => {
        for (const user of [ownerAddr, unregistredUser]) {
          await expectRevert(voting.getVoter(userAddr1, {from: user}), "You're not a voter");
        }
      });
    });

  }); //! Upon registering voters phase

  describe("ProposalsRegistrationStarted phase", () => {
    beforeEach(async () => { 
      voting = await givenVoting(WorkflowStatus.ProposalsRegistrationStarted, [{addr:userAddr1}, {addr:userAddr2}]); 
    });

    it("should not skip any workflow status", async () => {
      expectRevertOnBadWorkflowStatusChanges(WorkflowStatus.ProposalsRegistrationStarted);
    });

    it("Non voter users should not be able to add proposal", async () => {
      // GIVEN unregistered users: owner and userAddr3
      // WHEN-THEN
      for (const addr of [unregistredUser, ownerAddr]) {
        await expectRevert(voting.addProposal(addr, {from: addr}), "You're not a voter");
      }
    }); 

    describe("As voter", () => {
      it("add proposal", async () => {
        // WHEN  
        const addProposalTx = await voting.addProposal("Test proposal", {from: userAddr1});
        // THEN index 1 comes after genesis
        const newProposal = await voting.getOneProposal(1, {from: userAddr1});
        expect(newProposal.description).equal("Test proposal");
        expect(newProposal.voteCount).equal(BN(0));
        expectEvent(addProposalTx, 'ProposalRegistered', {proposalId: new BN(1)});
      });

      it("can't add an empty proposal", async () => {
        await expectRevert(voting.addProposal("", {from: userAddr1}), 'Vous ne pouvez pas ne rien proposer');
      });
    });
    
    describe("As owner", () => {
      it("should end proposal phase", async () => {
        // WHEN  
        const tx = await voting.endProposalsRegistering(); 
        // THEN
        expect(await voting.workflowStatus()).equal(WorkflowStatus.ProposalsRegistrationEnded);
        expectEvent(tx, 'WorkflowStatusChange', {
          previousStatus: WorkflowStatus.ProposalsRegistrationStarted,
          newStatus: WorkflowStatus.ProposalsRegistrationEnded
        });
      });
    });

    describe("getProposal access", () => {
      it("Voters should have access to proposals", async () => {
        // GIVEN an added proposal from a voter
        await voting.addProposal("Test proposal", {from: userAddr1});
        // WHEN any voter attempt access
        for (const voter of [userAddr1, userAddr2]) {
          const proposal = await voting.getOneProposal(1, {from: voter});
          // THEN
          expect(proposal.description).equals("Test proposal");
        }
      });
      it("Owner and non registered voters should not access to proposals", async () => {
        for (const user of [ownerAddr, unregistredUser]) {
          await expectRevert(voting.getOneProposal(0, {from: user}), "You're not a voter");
        }
      });
    });

  }); //! ProposalsRegistrationStarted

  describe("ProposalsRegistrationEnded phase", () => {
    beforeEach(async () => { 
      voting = await givenVoting(WorkflowStatus.ProposalsRegistrationEnded, [{addr:userAddr1}, {addr:userAddr2}], ["Proposal 1", "Proposal 2"]); 
    });

    it("should not skip any workflow status", async () => {
      expectRevertOnBadWorkflowStatusChanges(WorkflowStatus.ProposalsRegistrationEnded);
    });

    describe("As owner", () => {
      it("should start voting session", async () => {
        // WHEN  
        const tx = await voting.startVotingSession(); 
        // THEN
        expect(await voting.workflowStatus()).equal(WorkflowStatus.VotingSessionStarted);
        expectEvent(tx, 'WorkflowStatusChange', {
          previousStatus: WorkflowStatus["ProposalsRegistrationEnded"],
          newStatus: WorkflowStatus["VotingSessionStarted"]
        });
      });
    });
  }); //! ProposalsRegistrationStarted

  describe("VotingSessionStarted phase", () => {
    beforeEach(async () => { 
      voting = await givenVoting(WorkflowStatus.VotingSessionStarted, [{addr:userAddr1}, {addr:userAddr2}], ["Proposal 1", "Proposal 2"]); 
    });

    it("should not skip any workflow status", async () => {
      expectRevertOnBadWorkflowStatusChanges(WorkflowStatus.VotingSessionStarted);
    });

    it("Non voter users should not be able to vote", async () => {
      // GIVEN unregistered users: owner and userAddr3
      // WHEN-THEN
      for (const addr of [unregistredUser, ownerAddr]) {
        await expectRevert(voting.setVote(addr, {from: addr}), "You're not a voter");
      }
    }); 

    describe("As voter", () => {
      it("should be able to vote", async () => {
        // GIVEN initialized voters & proposals
        // WHEN
        const tx = await voting.setVote(BN(1), {from: userAddr1});
        // THEN
        expectEvent(tx, 'Voted', { voter: userAddr1, proposalId: BN(1) });
        const voter = await voting.getVoter(userAddr1, {from: userAddr1});
        expect(voter.hasVoted).true;
        expect(voter.votedProposalId).equals(BN(1));
      });
      it("should not be able to vote twice", async () => {
        // GIVEN a vote
        await voting.setVote(BN(1), {from: userAddr1});
        // WHEN attempting any THEN
        await expectRevert(voting.setVote(BN(999999), {from: userAddr1}), 'You have already voted');
      });
      it("should fails if proposal not found", async () => {
        await expectRevert(voting.setVote(BN(999999), {from: userAddr1}), 'Proposal not found');
      });
    });

    describe("As owner", () => {
      it("should end voting session", async () => {
        // WHEN  
        const tx = await voting.endVotingSession(); 
        // THEN
        expect(await voting.workflowStatus()).equal(WorkflowStatus.VotingSessionEnded);
        expectEvent(tx, 'WorkflowStatusChange', {
          previousStatus: WorkflowStatus["VotingSessionStarted"],
          newStatus: WorkflowStatus["VotingSessionEnded"]
        });
      });
    });
  }); //! VotingSessionStarted

  describe("VotingSessionEnded phase", () => {
    beforeEach(async () => { 
      voting = await givenVoting(WorkflowStatus.VotingSessionEnded, [{addr:userAddr1}, {addr:userAddr2}], ["Proposal 1", "Proposal 2"]); 
    });

    it("should not skip any workflow status", async () => {
      expectRevertOnBadWorkflowStatusChanges(WorkflowStatus.VotingSessionEnded);
    });

    it("Non owner users should not be able to tally votes", async () => {
      // GIVEN voter: userAddr1 & unregistered users: userAddr3
      // WHEN-THEN
      for (const addr of [userAddr1, unregistredUser]) {
        await expectRevert(voting.tallyVotes({from: addr}), 'Ownable: caller is not the owner');
      }
    }); 

    describe("As owner", () => {
      it("should tally votes session", async () => {
        // WHEN  
        const tx = await voting.tallyVotes(); 
        // THEN
        expect(await voting.workflowStatus()).equal(WorkflowStatus.VotesTallied);
        expectEvent(tx, 'WorkflowStatusChange', {
          previousStatus: WorkflowStatus["VotingSessionEnded"],
          newStatus: WorkflowStatus["VotesTallied"]
        });
      });
    });
  }); //! VotingSessionEnded

  describe("VotesTallied phase", () => {
  
    it("should not skip any workflow status", async () => {
      voting = await givenVoting(WorkflowStatus.VotesTallied); 
      expectRevertOnBadWorkflowStatusChanges(WorkflowStatus.VotesTallied);
    });

    describe("As anybody", () => {
      it("should give favorable winning proposal if ", async() => {
        // GIVEN 
        voting = await givenVoting(WorkflowStatus.VotesTallied, [
          {addr: userAddr1, vote: 2}, 
          {addr: userAddr2, vote: 2}
        ], ["Proposal 1", "Proposal 2"]); 
        // WHEN getting wining proposal as owner, registred voter & unregistered user    
        for (const user of [ownerAddr, userAddr1, unregistredUser]) {
          expect(await voting.winningProposalID(), {from:user}).equal(BN(2));
        }
      });

      it("should give the genesis id if no vote", async() => {
        // GIVEN 
        voting = await givenVoting(WorkflowStatus.VotesTallied, [
          {addr: userAddr1}, {addr: userAddr2}
        ], ["Proposal 1", "Proposal 2"]); 
        // WHEN getting wining proposal as owner, registred voter & unregistered user    
        for (const user of [ownerAddr, userAddr1, unregistredUser]) {
          expect(await voting.winningProposalID(), {from:user}).equal(BN(0));
        } 
      });

      it("should give the genesis id if no voter has been registred ", async() => {
        // GIVEN 
        voting = await givenVoting(WorkflowStatus.VotesTallied); 
        // WHEN getting wining proposal as owner, registred voter & unregistered user    
        for (const user of [ownerAddr, userAddr1, unregistredUser]) {
          expect(await voting.winningProposalID(), {from:user}).equal(BN(0));
        } 
      });
    });

  }); //!VotesTallied

});
