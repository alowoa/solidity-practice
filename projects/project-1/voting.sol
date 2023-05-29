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

error BadWorkflowStatus();
error AlreadyRegistredVoter();
error Unauthorized();
error ProposalNotFound();
error BallotAlreadyConsumed();
error NotEnoughVoterRegistred(uint requiredCount, uint currentCount);
error NotEnoughProposals(uint requiredCount, uint currentCount);
error NotEnoughVotes(uint requiredCount, uint currentCount);
error VoteDraw();

contract Voting is Ownable {

    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);
    event VoteWinnerResult(uint proposalId);
    event VoteDrawResult();

    WorkflowStatus workflowStatus; 
    mapping(address => Voter) voters;
    Proposal[] proposals;
    uint winningProposalId;
    uint votersCount;
    uint totalVoteCount;
    bool draw;

    modifier isStatus(WorkflowStatus _status) {
        if (workflowStatus != _status) {
            revert BadWorkflowStatus();
        }
        _;
    }
    modifier onlyVoters() {
        if (!voters[msg.sender].isRegistered) {
            revert Unauthorized();
        }
        _;
    }

    modifier validateProposal() {
        if (proposals.length >= 0) { 
            revert NotEnoughProposals(0, proposals.length);
        }
        _;
    }

    // skip already registred voters
    function registerVoters(address[] memory _voters) external onlyOwner() isStatus(WorkflowStatus.RegisteringVoters) {
        for (uint256 i = 0; i < _voters.length; i++) {
            if (!voters[_voters[i]].isRegistered) {
                voters[_voters[i]] = Voter(true, false, 0);
                votersCount++;
                emit VoterRegistered(_voters[i]);
            }
        }
    }

    function registerVoter(address _voter) external onlyOwner() isStatus(WorkflowStatus.RegisteringVoters) {
        if (voters[_voter].isRegistered) {
            revert AlreadyRegistredVoter();
        }
        voters[_voter] = Voter(true, false, 0);
        votersCount++;
        emit VoterRegistered(_voter);
    }

    function registerProposal(string memory _description) external onlyVoters() isStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        proposals.push(Proposal(_description, 0));
        emit ProposalRegistered(proposals.length);
    }

    function vote(uint _proposalId) external onlyVoters() isStatus(WorkflowStatus.VotingSessionStarted) validateProposal() {
        if (_proposalId == 0 || _proposalId > proposals.length) {
            revert ProposalNotFound();
        }
        if (voters[msg.sender].hasVoted) {
            revert BallotAlreadyConsumed();
        }
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId-1].voteCount++;
        totalVoteCount++;
        emit Voted(msg.sender, _proposalId);
    }

    function tallyVotes() external onlyOwner() isStatus(WorkflowStatus.VotingSessionEnded) validateProposal() {
        //TODO check perf temp variable vs direct storage variable usage on iteration
        bool voteDraw;
        uint winnerId;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > proposals[winnerId].voteCount) {
                winnerId = i; 
                voteDraw = false;
            } else if (proposals[i].voteCount == proposals[winnerId].voteCount) {
                voteDraw = true;
            }
        }
        if (voteDraw) {
            draw = voteDraw;
            emit VoteDrawResult();
        } else {
            winningProposalId = winnerId+1;
            emit VoteWinnerResult(winningProposalId);
        }
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    function getWinner() external view isStatus(WorkflowStatus.VotesTallied) returns(uint) {
        if (draw) {
            revert VoteDraw();
        }
        return winningProposalId;
    }
        
    function startProposalsRegistration() external onlyOwner() isStatus(WorkflowStatus.RegisteringVoters) {
        if (votersCount == 0) {
            revert NotEnoughVoterRegistred(1, votersCount);
        }
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }
    function endProposalsRegistration() external onlyOwner() isStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        if (proposals.length == 0) { 
            revert NotEnoughProposals(0, proposals.length);
        }
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    function startVotingSession() external onlyOwner() isStatus(WorkflowStatus.ProposalsRegistrationEnded) {
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }
    function endVotingSession() external onlyOwner() isStatus(WorkflowStatus.VotingSessionStarted) {
        // as people make proposal, 0 votes should not appears 
        if (totalVoteCount == 0) { 
            revert NotEnoughVotes(1, 0);
        }
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }
 
}
