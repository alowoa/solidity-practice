const { BN } = require('@openzeppelin/test-helpers');
const Voting = artifacts.require("Voting");

/**
 * Matches with expected values of WorkflowStatus from Voting.sol
 */
const WorkflowStatus = {
    "RegisteringVoters": BN(0),
    "ProposalsRegistrationStarted": BN(1),
    "ProposalsRegistrationEnded": BN(2),
    "VotingSessionStarted": BN(3),
    "VotingSessionEnded": BN(4),
    "VotesTallied": BN(5)
};

/**
 * Deploy a new contract to a particullar WorkflowStatus with voters and proposals
 * @param {WorkflowStatus} workflowStatus 
 * @param {addr, vote} voters 
 * @param {*} proposals strings
 * @returns 
 */
const givenVoting = async (workflowStatus, voters, proposals) => {
    const voting = await Voting.new();  
    if (Array.isArray(voters)) {
        for (const voter of voters) {
            await voting.addVoter(voter.addr);
        }
    }
    if (WorkflowStatus.RegisteringVoters === workflowStatus) return voting;
    await voting.startProposalsRegistering();
    if (Array.isArray(proposals) && Array.isArray(voters) && voters.length > 0) {
        for (const proposal of proposals) {
            await voting.addProposal(proposal, {from: voters[0].addr});
        }
    }
    if (WorkflowStatus.ProposalsRegistrationStarted === workflowStatus) return voting;
    await voting.endProposalsRegistering(); 
    if (WorkflowStatus.ProposalsRegistrationEnded === workflowStatus) return voting;
    await voting.startVotingSession(); 
    if (Array.isArray(voters) && voters.length > 0) {
        for (const voter of voters) {
            if (typeof voter.vote === 'number') {
                await voting.setVote(voter.vote, {from: voter.addr});
            }
        }
    }
    if (WorkflowStatus.VotingSessionStarted === workflowStatus) return voting;
    await voting.endVotingSession(); 
    if (WorkflowStatus.VotingSessionEnded === workflowStatus) return voting;
    await voting.tallyVotes(); 
    return voting;
};

module.exports = {
    WorkflowStatus: WorkflowStatus,
    givenVoting: givenVoting
};