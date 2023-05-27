// SPDX-License-Identifier: MIT 
pragma solidity >=0.8.19;

contract Bank {

    mapping (address => uint256) balances; 
 
    modifier amountRequired(uint256 _amount) {
        require(balances[msg.sender] >= _amount, "Unsufficient balance!");
        _;
    }

    function deposit(uint256 _amount) public payable {
        balances[msg.sender] += _amount;
    }

   function withdraw(uint256 _amount) public payable amountRequired(_amount) {
        balances[msg.sender] -= _amount;
    }

    function transfer(address _to, uint256 _amount) public amountRequired(_amount) {
        require(_to != address(0), "Token burn not allowed!"); 
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    function balanceOf(address _addr) public view returns (uint)  {
        return balances[_addr];
    }

}