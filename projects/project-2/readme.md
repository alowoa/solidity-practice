# Testing the Voting project
 
## About voting

This `Voting.sol` contract correction has been imported. The only changes are:
* the import definition 
* solidity version update from 0.8.13 to 0.8.20

## Goal

The goal is to implement testing with some attention to the returns (revert, event).

## Tooling

The project uses of hardhat in order to try testing implementation with hardhat.
 
## Running the tests

Start a node from a secondary terminal:

    npx hardhat node

Run the tests from your main terminal:

    npx hardhat test

## About the tests

The "users" in our use cases are the owner, voters and unregistered voters.

The test cases represent check on the initial contract state and the main use cases grouped by state. 

- Deployment
- RegisteringVoters phase:
- ProposalsRegistrationStarted status
- ProposalsRegistrationEnded status
- VotingSessionStarted status
- VotingSessionEnded
- VotesTallied