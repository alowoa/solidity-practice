// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Parent {
    
    uint internal value;

    function setValue(uint _value) public {
        value = _value;
    }

}

contract Child is Parent {

    function returnParentValue() public view returns(uint) {
        return value;
    }

}

contract Caller {
  
    Child child = new Child();

    function callParentFunction(uint _value) public returns(uint) {
        child.setValue(_value);
        return child.returnParentValue();
    } 
    
}