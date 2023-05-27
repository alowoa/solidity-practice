// SPDX-License-Identifier: MIT 
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract StudentGradation is Ownable {

    struct Student {
        string name;
        string noteBiology;
        string noteMath;
        string noteFr;
    }


   
}