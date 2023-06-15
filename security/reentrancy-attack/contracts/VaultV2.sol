// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

// You can store ETH in this contract and redeem them.
contract VaultV2 {
    event Stored(address account, uint amount);
    event Redeemed(address account, uint amount);

    mapping(address => uint) public balances;

    /// @dev Store ETH in the contract.
    function store() public payable {
        balances[msg.sender]+=msg.value;

        emit Stored(msg.sender, msg.value);
    }
    
<<<<<<< HEAD
    /// @dev Here you set the balance availability on the contract to avoid the reentrency call(s)
    /// @dev Redeem your ETH.
    function redeem() public {
        uint balanceToWithdraw = balances[msg.sender];

        // contract balance update
        balances[msg.sender] = 0;
        
        msg.sender.call{ value: balanceToWithdraw }("");
=======
    /// @dev Redeem your ETH.
    function redeem() public {
        // Set the balance availability first to avoid the global balance extraction
        balances[msg.sender]=0;
        msg.sender.call{ value: balances[msg.sender] }("");
>>>>>>> ba9c184 (reentrancy exercice with unit testing & tested on remix)
    
        emit Redeemed(msg.sender, balances[msg.sender]);
    }
}
