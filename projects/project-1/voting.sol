// SPDX-License-Identifier: MIT 
pragma solidity >=0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";


struct Voter {
    bool isRegistered;
    bool hasVoted;
    uint votedProposalId;
}

struct Proposal {
    string description;
    uint voteCount;
}

enum WorkflowStatus {
    RegisteringVoters,
    ProposalsRegistrationStarted,
    ProposalsRegistrationEnded,
    VotingSessionStarted,
    VotingSessionEnded,
    VotesTallied
}

event VoterRegistered(address voterAddress); 
event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
event ProposalRegistered(uint proposalId);
event Voted(address voter, uint proposalId);


contract Voting is Ownable {

    WorkflowStatus workflowStatus;
    mapping(address => Voter) voters;
    Proposal[] proposals;
    uint winningProposalId;
    uint votersCount;
    uint totalVoteCount;

    modifier isStatus(WorkflowStatus _status) {
        require(workflowStatus == _status, "Workflow error: Wrong status!");
        _;
    }
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "Caller is not a registred voter!");
        _;
    }

    modifier proposalExists() {
        require(proposals.length > 0, "There is no proposal!");
        _;
    }

    // skip already registred voters
    function registerVoters(address[] memory _voters) external onlyOwner() isStatus(WorkflowStatus.RegisteringVoters) {
        for (uint256 i = 0; i < _voters.length; i++) {
            if (!voters[_voters[i]].isRegistered) {
                voters[_voters[i]] = Voter(true, false, 0);
                votersCount++;
            }
        }
    }

    function registerVoter(address _voter) external onlyOwner() isStatus(WorkflowStatus.RegisteringVoters) {
        if (voters[_voter].isRegistered) {
            revert("Already registered!")
        }
        voters[_voter] = Voter(true, false, 0);
        votersCount++;
    }

    function registerProposal(string memory _description) external onlyVoters() isStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        proposals.push(Proposal(_description, 0));
    }

    function vote(uint _proposalId) external onlyVoters() isStatus(WorkflowStatus.VotingSessionStarted) proposalExists() {
        require(_proposalId >= proposals.length, "Proposal id does not exists!");
        require(!voters[msg.sender].hasVoted, "Caller has already voted!");
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;
        totalVoteCount++;
    }

    function tallyVotes() external onlyOwner() isStatus(WorkflowStatus.VotingSessionEnded) proposalExists() {
        if (proposals.length == 1) {
            winningProposalId = 0;
        }
        uint winnerId = 0;
        for (uint256 i = 1; i < proposals.length; i++) {
            if (proposals[i].voteCount > proposals[winnerId].voteCount) {
                winnerId = i; 
            }
        }
        winningProposalId = winnerId;
    }

    function getWinner() external view isStatus(WorkflowStatus.VotesTallied) returns(uint) {
        return winningProposalId;
    }
        
    function changeStatusToProposalsRegistrationStarted() external onlyOwner() isStatus(WorkflowStatus.RegisteringVoters) {
        require(votersCount > 0, "To start proposal registration least one registered voter is required!");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
    }
    function changeStatusToProposalsRegistrationEnded() external onlyOwner() isStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        require(proposals.length > 0, "To end proposal registration at least one proposal is required!");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
    }

    function changeStatusToVotingSessionStarted() external onlyOwner() isStatus(WorkflowStatus.ProposalsRegistrationEnded) {
        workflowStatus = WorkflowStatus.VotingSessionStarted;
    }
    function changeStatusToVotingSessionEnded() external onlyOwner() isStatus(WorkflowStatus.VotingSessionStarted) {
        require(totalVoteCount > 0, "To end voting session one vote must be recorded!");
        workflowStatus = WorkflowStatus.VotingSessionEnded;
    }

    function changeStatusToVotesTallied() external onlyOwner()  isStatus(WorkflowStatus.VotingSessionEnded)  {
        workflowStatus = WorkflowStatus.VotesTallied;
    }
    
}
