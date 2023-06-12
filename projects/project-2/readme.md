# Testing the Voting project
 
## About the project

This `Voting.sol` contract correction has been imported. The only changes are:
* the import definition 
* solidity version update from 0.8.13 to 0.8.20

This project implements testing using Hardhat as project setup, with Web3js, Truffle and test-helpers from openzeppelin.

## Quickstart

### Requirements

You should first initialize the project:

    npm install

### Running the tests

Start a node from a secondary terminal:

    npm run node

Run the tests from your main terminal:

    npm run test

You can run test coverage with:

    npm run coverage

## Some details about the tests

## About `test/Voting.truffle.test.js`

This is the Voting contract test file. 

Within the test descriptions "users" in our use cases are the owner, voters and unregistered voters.

The test cases validates the initial contract states. They are grouped by WorkflowStatus and follow the logical order.

Inner tests are mainly grouped by access (voter, owner, others).

Methods linked to specific status are tested on each status (see usage of Voting.truffle.test.js: expectRevertOnBadWorkflowStatusChanges) 


## About `test/VotingTestUtils.js`

As named, it contains some utilities:

* a "mirror" object matching with the WorkflowStatus enum from the Voting contract to ease the tests
* a `givenVoting(...)` to ease the testing context on most of the beforeEach function calls