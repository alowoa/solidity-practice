// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * The fixed contract: PULL OVER PUSH principle
 * - use a pull mecanism to refund user
 * => avoid the unacessibility from the previous implem due to broken push pipeline ops mecanism
 */
contract Auction {
    mapping (address => uint) bidFunds;
    address highestBidder;
    uint highestBid;

    function bid() payable public {
        require(msg.value >= highestBid);
        
        highestBidder = msg.sender;
        highestBid = msg.value;
        bidFunds[highestBidder] = highestBid;
    }
 

    function getRefund() external () {
        uint callerFunds = bidFunds[msg.sender];
        if (callerFunds == 0) {
            revert "no fund to get back!";
        }

        // don't fall for the reentrancy issue => update the balance before the call
        bidFunds[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value:callerFunds}("");
        if (!success) {
            revert;
        }
    }
}
