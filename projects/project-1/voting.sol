// SPDX-License-Identifier: MIT 

//TODO check that solidity version is the last one (remix compiler)
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {

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

    WorkflowStatus workflowStatus = WorkflowStatus.RegisteringVoters;
    mapping(address => Voter) voters;
    Proposal[] proposals;
    uint winningProposalId;
    uint votersCount;
    uint totalVoteCount;

    modifier isStatus(WorkflowStatus _status) {
        require(workflowStatus == _status, "Wrong status!");
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

    function registerVoters(address[] memory _voters) public onlyOwner() isStatus(WorkflowStatus.RegisteringVoters) {
        for (uint256 i = 0; i < _voters.length; i++) {
            voters[_voters[i]] = Voter(true, false, 0);
            votersCount++;
        }
    }

    function registerProposal(string memory _description) public onlyVoters() isStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        proposals.push(Proposal(_description, 0));
    }

    function vote(uint _proposalId) public onlyVoters() isStatus(WorkflowStatus.VotingSessionStarted) proposalExists() {
        require(_proposalId >= proposals.length, "Proposal id does not exists!");
        require(!voters[msg.sender].hasVoted, "Caller has already voted!");
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;
        totalVoteCount++;
    }

    function tallyVotes() public onlyOwner() isStatus(WorkflowStatus.VotingSessionEnded) proposalExists() {
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

    function getWinner() public view isStatus(WorkflowStatus.VotesTallied) returns(uint) {
        return winningProposalId;
    }
        
    function changeWorkflowStatusToProposalsRegistrationStarted() public onlyOwner() isStatus(WorkflowStatus.RegisteringVoters) {
        require(votersCount > 0, "To start proposal registration least one registered voter is required!");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
    }
    function changeWorkflowStatusToProposalsRegistrationEnded() public onlyOwner() isStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        require(proposals.length > 0, "To end proposal registration at least one proposal is required!");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
    }

    function changeWorkflowStatusToVotingSessionStarted() public onlyOwner() isStatus(WorkflowStatus.ProposalsRegistrationEnded) {
        workflowStatus = WorkflowStatus.VotingSessionStarted;
    }
    function changeWorkflowStatusToVotingSessionEnded() public onlyOwner() isStatus(WorkflowStatus.VotingSessionStarted) {
        require(totalVoteCount > 0, "To end voting session one vote must be recorded!");
        workflowStatus = WorkflowStatus.VotingSessionEnded;
    }

    function changeWorkflowStatusToVotesTallied() public onlyOwner()  isStatus(WorkflowStatus.VotingSessionEnded)  {
        workflowStatus = WorkflowStatus.VotesTallied;
    }
    
}
