// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Auction {
    address highestBidder;
    uint highestBid;

    function bid() payable public {
        require(msg.value >= highestBid);

        if (highestBidder != address(0)) {
            (bool success, ) = highestBidder.call{value:highestBid}("");
            require(success); // if this call consistently fails, no one else can bid
        }

       highestBidder = msg.sender;
       highestBid = msg.value;
    }
}
