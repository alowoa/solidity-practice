// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;
 
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Storage.sol";
 
contract TestStorage {
  
  // function contractBalanceEnsureHasMinimumValue()) public {
  //   // GIVEN
  //   Storage instance = Storage(DeployedAddresses.Storage());
  //   // WHEN
  //   intance.
  //   instance.set(89);
  //   // THEN
  //   Assert.equal(instance.get(), 89, "It should store the value 89.");
  // }
  // 
  
  function testItStoresAValue() public {
    //GIVEN
    Storage instance = Storage(DeployedAddresses.Storage());
    // WHEN
    instance.set(89);
    //THEN
    Assert.equal(instance.get(), 89, "It should store the value 89.");
  }

}
