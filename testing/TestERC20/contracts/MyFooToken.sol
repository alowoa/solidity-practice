// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MyFooToken is ERC20 {
    
    constructor(uint initialSupply) ERC20("MyFooToken", "MFT") {
        _mint(msg.sender, initialSupply);
    }

}