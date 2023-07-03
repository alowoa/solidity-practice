// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MyDai is ERC20 {
    
    constructor() ERC20("MyDaiStable", "MDAI") { }

    function faucet(address recipient, uint amount) external {
        _mint(recipient, amount);
    }

}