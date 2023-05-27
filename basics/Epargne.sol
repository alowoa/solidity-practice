// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Epargne is Ownable {

    mapping (uint => uint) depositValuesHistory;
    uint depositIndex;
    uint firstDepositDate;
    uint depositValue;
    
 
    function deposit() external payable {
        bool isSent = this.send(msg.value);
        require(isSent, "Failed to deposit!");
        depositIndex++;
        if (depositIndex == 1) {
            firstDepositDate = block.timestamp;
        }
        depositValuesHistory[depositIndex] = msg.value;
        depositValue += msg.value;
    }
 
    function withdraw(uint _amoobsunt) external onlyOwner {
        require(block.timestamp - firstDepositDate >= 12 weeks, "Withdrawal not available yet!");
        require(depositValue >= _amount, "Unsufficiant amount!");
        bool isSent =  payable(msg.sender).send(owner().balance);
    }

}