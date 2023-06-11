// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./Voting.sol";

library WorkflowStatusTestUtil {
    
    function valueOfRegisteringVoters() public pure returns(uint) {
        return uint(Voting.WorkflowStatus.RegisteringVoters);
    }
    function valueOfProposalsRegistrationStarted() public pure returns(uint) {
        return uint(Voting.WorkflowStatus.ProposalsRegistrationStarted);
    }
    function valueOfProposalsRegistrationEnded() public pure returns(uint) {
        return uint(Voting.WorkflowStatus.ProposalsRegistrationEnded);
    }
    function valueOfVotingSessionStarted() public pure returns(uint) {
        return uint(Voting.WorkflowStatus.VotingSessionStarted);
    }
    function valueOfVotingSessionEnded() public pure returns(uint) {
        return uint(Voting.WorkflowStatus.VotingSessionEnded);
    }
    function valueOfVotesTallied() public pure returns(uint) {
        return uint(Voting.WorkflowStatus.VotesTallied);
    }

}

/**
 * The only purpose of this contract is to be used for testing with accessors 
 * to internal values in order to ease the tests.
 * 
 * 'tca_' for test contract access 
 */
contract TestVoting is Voting {
  
    function tca_voter(address _addr) public view returns(Voter memory) {
        return Voting.voters[_addr];
    }

    function tca_proposalArray() public view returns(Proposal[] memory) {
        return proposalsArray;
    }
    

    // function isRegisteringVotersStatus() public view returns(bool) {
    //     return workflowStatus == WorkflowStatus.RegisteringVoters;
    // }
    // function isProposalsRegistrationStartedStatus() public view returns(bool) {
    //     return workflowStatus == WorkflowStatus.ProposalsRegistrationStarted;
    // }
    // function isProposalsRegistrationEndedStatus() public view returns(bool) {
    //     return workflowStatus == WorkflowStatus.ProposalsRegistrationEnded;
    // }
    // function isVotingSessionStartedStatus() public view returns(bool) {
    //     return workflowStatus == WorkflowStatus.VotingSessionStarted;
    // }
    // function isVotingSessionEndedStatus() public view returns(bool) {
    //     return workflowStatus == WorkflowStatus.VotingSessionEnded;
    // }
    // function isVotesTalliedStatus() public view returns(bool) {
    //     return workflowStatus == WorkflowStatus.VotesTallied;
    // } 
}