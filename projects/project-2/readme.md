# Testing the Voting project
 
## About voting

This `Voting.sol` contract correction has been imported. The only changes are:
* the import definition 
* solidity version update from 0.8.13 to 0.8.20

## Goal

The goal is to implement testing with some attention to the returns (revert, event).

## Tooling

The project uses of hardhat to manage the project. Testing is done with web3js and Truffle.
 
## Running the tests

Start a node from a secondary terminal:

    npm run start:node

To deploy the contract:

    npm run migrate

Run the tests from your main terminal:

    npm run test

## About the tests

All tests are written into `test/Voting.truffle.test.js`.

The "users" in our use cases are the owner, voters and unregistered voters.

The test cases represent check on the initial contract state and the main use cases grouped by state. 

- Deployment
- RegisteringVoters phase:
- ProposalsRegistrationStarted status
- ProposalsRegistrationEnded status
- VotingSessionStarted status
- VotingSessionEnded
- VotesTallied