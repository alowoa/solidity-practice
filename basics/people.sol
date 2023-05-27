// SPDX-License-Identifier: UNLICENSED 
pragma solidity >=0.8.19;

contract People {
    
    struct Person {
        string name;
        uint age;
    }

    Person public moi;
    Person[] public persons;

    function modifyPerson(string calldata _name, uint _age) public {
        moi = Person(_name, _age);
        //moi.name = _name;
        //moi.age = _age;
    }

    function add(string calldata _name, uint _age) public {
        persons.push(Person(_name, _age));
    }

    function remove() public {
        persons.pop();
    }
    
}