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
    
    /// @dev Here you set the balance availability on the contract to avoid the reentrency call(s)
    /// @dev Redeem your ETH.
    function redeem() public {
        uint balanceToWithdraw = balances[msg.sender];

        // contract balance update
        balances[msg.sender] = 0;
        
        msg.sender.call{ value: balanceToWithdraw }("");
    
        emit Redeemed(msg.sender, balances[msg.sender]);
    }
}
