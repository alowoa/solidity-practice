// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;
 
import "./token.sol";
 
contract Crowdsale {

   uint public rate = 200; // le taux à utiliser

   Token public token;

   constructor(uint256 _initialSupply) {
      token = new Token(_initialSupply);
   }

   receive() external payable {
      require(msg.value >= 0.1 ether, "you can't send less than 0.1 ether");
      
   }

   function distribute(uint256 amount) internal {
      uint256 tokensToSent = amount * rate;
      token.transfer(msg.sender, tokensToSent);
   }

}
