// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    constructor(uint256 _initialSupply) ERC20("Alyra", "Aly") {
        _mint(msg.sender, _initialSupply);
    }

}
