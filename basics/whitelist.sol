// SPDX-License-Identifier: MIT 
pragma solidity >=0.8.19;

contract whitelist {

    event Authorized(address);
    event EthReceived(address, uint);

    modifier checkRights() {
        require(values[msg.sender], "Access denied!");
        _;
    }

    mapping(address => bool) values;

    constructor() {
        values[msg.sender] = true;
    }

    function authorize(address _address) external checkRights {
        values[_address] = true;
        emit Authorized(_address);
    }

    function isAuthorized(address _address) external view returns (bool) {
        return values[_address];
    }


    receive() external payable {
        emit EthReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit EthReceived(msg.sender, msg.value);
    }

}