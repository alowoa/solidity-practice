// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract SimpleStorage {
    event ValueStored(uint value);

    uint private number;

    constructor(uint _number) {
        number = _number;
    }

    function setNumber(uint _number) external {
        if (_number == 42) {
            revert("42 not accepted!");
        }
        number = _number;
        emit ValueStored(_number);
    }

    function getNumber() external view returns(uint) {
        return number;
    }

}