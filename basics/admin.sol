// SPDX-License-Identifier: MIT 
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Admin is Ownable {

    event Whitelisted(address);
    event Blacklisted(address);

    mapping (address => bool) whitelist;
    mapping (address => bool) blacklist;

    function authorize(address _account) public onlyOwner() {
        require(!whitelist[_account], "already whitelisted!");
        require(!blacklist[_account], "already blacklisted!");
        whitelist[_account] = true;
        emit Whitelisted(_account);
    }

    function ban(address _account) public onlyOwner() {
        require(!whitelist[_account], "already whitelisted!");
        require(!blacklist[_account], "already blacklisted!");
        blacklist[_account] = true;
        emit Blacklisted(_account);
    }

    function isWhitelisted(address _account) internal view returns (bool) {
        return whitelist[_account];
    }

    function isBlacklisted(address _account) internal view returns (bool) {
        return blacklist[_account];
    }
    
}