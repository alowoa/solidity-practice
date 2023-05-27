// SPDX-License-Identifier: MIT 
pragma solidity >=0.8.19;

contract Random {

    uint nonce;

    function genarateNumberBelow100() public returns (uint) {
        nonce++; 
        return uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 100;
    }

}