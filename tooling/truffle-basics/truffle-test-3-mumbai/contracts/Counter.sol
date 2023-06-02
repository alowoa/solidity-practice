// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Counter is Ownable {
 
    uint value;

    constructor(uint _intialValue) {
        value = _intialValue;
    }

    function increment() external onlyOwner {
        value++;
    }

    function getValue() external view returns(uint) {
        return value;
    }

}