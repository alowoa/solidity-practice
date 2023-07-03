// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
 
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract DefiProject {
    
    IERC20 myDai;

    constructor(address myDaiAddress) {
        myDai = IERC20(myDaiAddress);
    }

    function foo(address recipient, uint amount) external {
        myDai.transfer(recipient, amount);
    }

}