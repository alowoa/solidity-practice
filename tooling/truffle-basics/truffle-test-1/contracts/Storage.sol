// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

error InsufficientBalance(uint required, uint value);

error SatanError();

contract Storage {
    event BalanceGoesUp(uint _amount);
    event DataStored(uint _data);

    uint storedData;

    constructor(uint _minDepositAmount, uint _storedData) payable {
        if (msg.value < _minDepositAmount) {
            // revert InsufficientBalance(_depositAmount, msg.value);
        }
        // nothing to handle to deposit with payable ?
        storedData = _storedData;
        emit DataStored(storedData);
        if (msg.value > 0) {
            emit BalanceGoesUp(msg.value);
        }
    }

    function set(uint x) public {
        if (x == 0) {
            revert("Setting 0 is not allowed!");
        }
        storedData = x;
        emit DataStored(storedData);
    }

    function get() public view returns (uint) {
        return storedData;
    }
}